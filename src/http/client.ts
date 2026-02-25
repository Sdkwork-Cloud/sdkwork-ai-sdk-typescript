import type {
  AiSdkConfig,
  RequestConfig,
  RequestOptions,
} from '../types/core';
import { BaseHttpClient, type HttpClientOptions } from '@sdkwork/sdk-common/http';
import { withRetry, generateCacheKey, type CacheStore, createCacheStore, type Logger } from '@sdkwork/sdk-common/utils';

export class HttpClient extends BaseHttpClient {
  declare protected logger: Logger;
  declare protected cache: CacheStore;

  constructor(config: AiSdkConfig) {
    super(config as HttpClientOptions);
    this.cache = createCacheStore();
  }

  override getConfig() {
    const tokenManager = this.getTokenManager();
    return {
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      authMode: this.getAuthMode(),
      apiKey: this.authConfig.apiKey,
      accessToken: tokenManager?.getAccessToken(),
      authToken: tokenManager?.getAuthToken(),
    };
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const requestConfig: RequestConfig = {
      url: path,
      method: options.method ?? 'GET',
      headers: options.headers,
      params: options.params,
      body: options.body,
      timeout: options.timeout,
      signal: options.signal,
      skipAuth: options.skipAuth,
      retryCount: 0,
    };

    return this.executeRequest<T>(requestConfig, options);
  }

  private async executeRequest<T>(config: RequestConfig, options: RequestOptions): Promise<T> {
    const processedConfig = await this.applyRequestInterceptors(config);

    const cacheKey = options.cache
      ? generateCacheKey(processedConfig)
      : undefined;

    if (cacheKey) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    const url = this.buildApiUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);

    const result = await withRetry(
      async () => {
        const response = await this.executeFetch(url, {
          method: processedConfig.method,
          headers,
          body: processedConfig.body ? JSON.stringify(processedConfig.body) : undefined,
          timeout: processedConfig.timeout ?? 30000,
          signal: processedConfig.signal,
        });

        return this.processResponse<T>(response, processedConfig);
      },
      { maxRetries: 3, retryDelay: 1000, retryBackoff: 'exponential', maxRetryDelay: 30000 }
    );

    if (cacheKey) {
      const ttl = typeof options.cache === 'number' ? options.cache : undefined;
      this.cache.set(cacheKey, result, ttl);
    }

    return this.applyResponseInterceptors(result, processedConfig);
  }

  private buildApiUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    if (this.isAbsoluteUrl(path)) {
      const url = new URL(path);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.set(key, String(value));
          }
        });
      }
      return url.toString();
    }

    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
    let url = `${baseUrl}${pathWithLeadingSlash}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  private isAbsoluteUrl(path: string): boolean {
    return /^[a-z][a-z\d+\-.]*:\/\//i.test(path);
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
    const config: RequestConfig = {
      url: path,
      method: 'POST',
      skipAuth: false,
      retryCount: 0,
    };

    const processedConfig = await this.applyRequestInterceptors(config);
    const url = this.buildApiUrl(processedConfig.url);
    const headers = this.buildHeaders(processedConfig, true);

    const response = await this.executeFetch(url, {
      method: 'POST',
      headers,
      body: formData,
      timeout: processedConfig.timeout ?? 30000,
    });

    return this.processResponse<T>(response, processedConfig);
  }

  async getBlob(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<Blob> {
    const config: RequestConfig = {
      url: path,
      method: 'GET',
      params,
      skipAuth: false,
      retryCount: 0,
    };

    const processedConfig = await this.applyRequestInterceptors(config);
    const url = this.buildApiUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);

    const response = await this.executeFetch(url, {
      method: 'GET',
      headers,
      timeout: processedConfig.timeout ?? 30000,
    });

    return response.blob();
  }
}

export function createHttpClient(config: AiSdkConfig): HttpClient {
  return new HttpClient(config);
}
