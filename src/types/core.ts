export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

export type ResponseInterceptor<T = unknown> = (response: T, config: RequestConfig) => T | Promise<T>;

export type ErrorInterceptor = (error: Error, config: RequestConfig) => void | Promise<void>;

export interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeout?: number;
  signal?: AbortSignal;
  skipAuth?: boolean;
  retryCount?: number;
  cacheKey?: string;
  cacheTTL?: number;
  metadata?: Record<string, unknown>;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryCondition?: (error: Error, retryCount: number) => boolean;
  retryBackoff?: 'fixed' | 'exponential' | 'linear';
  maxRetryDelay?: number;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  keyGenerator?: (config: RequestConfig) => string;
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colors?: boolean;
}

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export interface Interceptors {
  request: RequestInterceptor[];
  response: ResponseInterceptor[];
  error: ErrorInterceptor[];
}

export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  retry?: Partial<RetryConfig>;
  cache?: Partial<CacheConfig>;
  logger?: Partial<LoggerConfig>;
  interceptors?: Interceptors;
}

export interface AiSdkConfig extends HttpClientConfig {
  apiKey?: string;
  organization?: string;
  projectId?: string;
}

export interface ApiResult<T = unknown> {
  code: number | string;
  msg?: string;
  message?: string;
  data: T;
  requestId?: string;
  ip?: string;
  hostname?: string;
  errorName?: string;
  errorMsg?: string;
  timestamp?: string;
  traceId?: string;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements?: number;
}

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  skipAuth?: boolean;
  timeout?: number;
  retry?: Partial<RetryConfig>;
  cache?: boolean | number;
}

export interface ListQueryParams {
  limit?: number;
  after?: string;
  before?: string;
  order?: 'asc' | 'desc';
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
