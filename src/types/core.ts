import type { AuthTokenManager, AuthMode, RetryConfig, CacheConfig, LoggerConfig, Interceptors } from '@sdkwork/sdk-common';

export type {
  HttpMethod,
  LogLevel,
  QueryParams,
  HttpHeaders,
  ApiResult,
  PageResult,
  Pageable,
  Page,
  DeepPartial,
  PickByType,
  RequiredByKeys,
  OptionalByKeys,
  RequestConfig,
  RequestOptions,
  RetryConfig,
  CacheConfig,
  LoggerConfig,
  Interceptors,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from '@sdkwork/sdk-common';

export { DEFAULT_RETRY_CONFIG, DEFAULT_CACHE_CONFIG, DEFAULT_LOGGER_CONFIG, DEFAULT_TIMEOUT, SUCCESS_CODES } from '@sdkwork/sdk-common';

export interface AiSdkConfig {
  baseUrl: string;
  apiKey?: string;
  authToken?: string;
  accessToken?: string;
  tokenManager?: AuthTokenManager;
  timeout?: number;
  authMode?: AuthMode;
  headers?: Record<string, string>;
  retry?: Partial<RetryConfig>;
  cache?: Partial<CacheConfig>;
  logger?: Partial<LoggerConfig>;
  interceptors?: Interceptors;
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

export interface ListQueryParams {
  limit?: number;
  after?: string;
  before?: string;
  order?: 'asc' | 'desc';
}
