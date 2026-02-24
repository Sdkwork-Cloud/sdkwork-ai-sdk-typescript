import type {
  AiSdkConfig,
  HttpClientConfig,
  RequestConfig,
  RequestOptions,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  ApiResult,
  RetryConfig,
} from '../types/core';
import {
  AiSdkError,
  NetworkError,
  TimeoutError,
  AuthenticationError,
  RateLimitError,
  ServerError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '../types/errors';
import { createLogger, type Logger } from '../utils/logger';
import { createCacheStore, generateCacheKey, type CacheStore } from '../utils/cache';
import { withRetry } from '../utils/retry';

const SUCCESS_CODES = [0, 200, '0', '200'];

const DEFAULT_CONFIG: Required<Omit<HttpClientConfig, 'baseUrl' | 'interceptors'>> & { baseUrl: string } = {
  baseUrl: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    retryBackoff: 'exponential',
    maxRetryDelay: 30000,
  },
  cache: {
    enabled: false,
    ttl: 5 * 60 * 1000,
    maxSize: 100,
  },
  logger: {
    level: 'info',
    prefix: '[AiSdk]',
    timestamp: true,
    colors: true,
  },
};

export class HttpClient {
  private config: Required<Omit<HttpClientConfig, 'interceptors'>> & { baseUrl: string };
  private apiKey?: string;
  private organization?: string;
  private projectId?: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private cache: CacheStore;
  private logger: Logger;

  constructor(config: AiSdkConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      headers: { ...DEFAULT_CONFIG.headers, ...config.headers },
      retry: { ...DEFAULT_CONFIG.retry, ...config.retry },
      cache: { ...DEFAULT_CONFIG.cache, ...config.cache },
      logger: { ...DEFAULT_CONFIG.logger, ...config.logger },
    };
    
    this.apiKey = config.apiKey;
    this.organization = config.organization;
    this.projectId = config.projectId;
    this.cache = createCacheStore(this.config.cache);
    this.logger = createLogger(this.config.logger);
    
    if (config.interceptors) {
      this.requestInterceptors = config.interceptors.request ?? [];
      this.responseInterceptors = config.interceptors.response ?? [];
      this.errorInterceptors = config.interceptors.error ?? [];
    }
  }

  getConfig(): { baseUrl: string; apiKey?: string; organization?: string; projectId?: string } {
    return {
      baseUrl: this.config.baseUrl,
      apiKey: this.apiKey,
      organization: this.organization,
      projectId: this.projectId,
    };
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setOrganization(organization: string): void {
    this.organization = organization;
  }

  setProjectId(projectId: string): void {
    this.projectId = projectId;
  }

  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    this.errorInterceptors.push(interceptor);
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.errorInterceptors.splice(index, 1);
      }
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    let url = `${baseUrl}${normalizedPath}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return url;
  }

  private getHeaders(skipAuth?: boolean): Record<string, string> {
    const headers: Record<string, string> = { ...this.config.headers };
    
    if (!skipAuth && this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    if (this.organization) {
      headers['OpenAI-Organization'] = this.organization;
    }
    
    if (this.projectId) {
      headers['OpenAI-Project'] = this.projectId;
    }
    
    return headers;
  }

  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }

  private async applyResponseInterceptors<T>(response: T, config: RequestConfig): Promise<T> {
    let processedResponse: T = response;
    
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse, config) as T;
    }
    
    return processedResponse;
  }

  private async applyErrorInterceptors(error: Error, config: RequestConfig): Promise<void> {
    for (const interceptor of this.errorInterceptors) {
      await interceptor(error, config);
    }
  }

  private async executeRequest<T>(config: RequestConfig, options: RequestOptions): Promise<T> {
    const controller = new AbortController();
    const timeout = config.timeout ?? this.config.timeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }
    
    try {
      this.logger.debug(`${config.method} ${config.url}`);
      
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        await this.handleErrorResponse(response, config);
      }
      
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const result: ApiResult<T> = await response.json();
        
        if (result.code !== undefined && !SUCCESS_CODES.includes(result.code) && !SUCCESS_CODES.includes(String(result.code))) {
          throw AiSdkError.fromApiResult(result);
        }
        
        return result.data ?? (result as unknown as T);
      }
      
      if (contentType?.includes('text/') || contentType?.includes('application/octet-stream')) {
        return await response.text() as unknown as T;
      }
      
      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof AiSdkError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new TimeoutError(`Request timeout after ${timeout}ms`);
        }
        
        throw new NetworkError(error.message);
      }
      
      throw new NetworkError('Unknown error occurred');
    }
  }

  private async handleErrorResponse(response: Response, config: RequestConfig): Promise<never> {
    let errorMessage = response.statusText;
    let errorCode: number | string = response.status;
    let errorData: unknown;
    
    try {
      const result = await response.json();
      errorMessage = result.msg || result.message || result.error?.message || errorMessage;
      errorCode = result.code ?? response.status;
      errorData = result.data ?? result.error;
    } catch {
      // ignore json parse error
    }
    
    let error: AiSdkError;
    
    switch (response.status) {
      case 400:
        error = new ValidationError(errorMessage);
        break;
      case 401:
        error = new AuthenticationError(errorMessage, errorCode);
        break;
      case 403:
        error = new ForbiddenError(errorMessage);
        break;
      case 404:
        error = new NotFoundError(errorMessage);
        break;
      case 429: {
        const retryAfter = response.headers.get('Retry-After');
        error = new RateLimitError(errorMessage, retryAfter ? parseInt(retryAfter, 10) : undefined);
        break;
      }
      default:
        if (response.status >= 500) {
          error = new ServerError(errorMessage, errorCode);
        } else {
          error = new AiSdkError(errorMessage, errorCode, 'UNKNOWN', errorData);
        }
    }
    
    await this.applyErrorInterceptors(error, config);
    throw error;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    let config: RequestConfig = {
      url: this.buildUrl(path, options.params),
      method: options.method ?? 'GET',
      headers: { ...this.getHeaders(options.skipAuth), ...options.headers },
      body: options.body,
      params: options.params,
      timeout: options.timeout ?? this.config.timeout,
      signal: options.signal,
      skipAuth: options.skipAuth,
    };
    
    config = await this.applyRequestInterceptors(config);
    
    const cacheKey = options.cache ? generateCacheKey(config) : undefined;
    
    if (cacheKey) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached !== null) {
        this.logger.debug('Cache hit:', cacheKey);
        return cached;
      }
    }
    
    const retryConfig: RetryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      ...options.retry,
    };
    
    const result = await withRetry(async () => {
      const res = await this.executeRequest<T>(config, options);
      return this.applyResponseInterceptors(res, config);
    }, retryConfig);
    
    if (cacheKey) {
      const ttl = typeof options.cache === 'number' ? options.cache : undefined;
      this.cache.set(cacheKey, result, ttl);
    }
    
    return result;
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(path, { method: 'GET', params });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body });
  }

  async postFormData<T>(path: string, formData: FormData): Promise<T> {
    const headers = { ...this.getHeaders() };
    delete headers['Content-Type'];
    
    return this.request<T>(path, {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  async getBlob(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<Blob> {
    const config: RequestConfig = {
      url: this.buildUrl(path, params),
      method: 'GET',
      headers: { ...this.getHeaders() },
    };
    
    const processedConfig = await this.applyRequestInterceptors(config);
    
    this.logger.debug(`GET ${processedConfig.url}`);
    
    const response = await fetch(processedConfig.url, {
      method: processedConfig.method,
      headers: processedConfig.headers,
    });
    
    if (!response.ok) {
      await this.handleErrorResponse(response, processedConfig);
    }
    
    return response.blob();
  }
}

export function createHttpClient(config: AiSdkConfig): HttpClient {
  return new HttpClient(config);
}
