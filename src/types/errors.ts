export type ErrorCode = 
  | 'UNKNOWN'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'CANCELLED'
  | 'NOT_LOGIN'
  | 'FAIL'
  | 'BUSINESS_ERROR'
  | 'INVALID_API_KEY'
  | 'INSUFFICIENT_QUOTA'
  | 'MODEL_NOT_FOUND'
  | 'CONTEXT_LENGTH_EXCEEDED';

export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
  value?: unknown;
}

export class AiSdkError extends Error {
  public readonly code: number | string;
  public readonly errorCode: ErrorCode;
  public readonly data?: unknown;
  public readonly details?: ErrorDetail[];
  public readonly timestamp: Date;
  public readonly requestId?: string;

  constructor(
    message: string,
    code: number | string = 0,
    errorCode: ErrorCode = 'UNKNOWN',
    data?: unknown,
    details?: ErrorDetail[],
    requestId?: string
  ) {
    super(message);
    this.name = 'AiSdkError';
    this.code = code;
    this.errorCode = errorCode;
    this.data = data;
    this.details = details;
    this.timestamp = new Date();
    this.requestId = requestId;
    
    Object.setPrototypeOf(this, AiSdkError.prototype);
  }

  static fromApiResult(result: { code: number | string; msg?: string; message?: string; data?: unknown; traceId?: string; requestId?: string; errorName?: string }): AiSdkError {
    const errorCode = mapCodeToErrorCode(result.code, result.errorName);
    return new AiSdkError(
      result.msg || result.message || 'Request failed',
      result.code,
      errorCode,
      result.data,
      undefined,
      result.traceId || result.requestId
    );
  }

  isNetworkError(): boolean {
    return this.errorCode === 'NETWORK_ERROR' || this.errorCode === 'TIMEOUT';
  }

  isAuthError(): boolean {
    return this.errorCode === 'UNAUTHORIZED' || this.errorCode === 'TOKEN_EXPIRED' || this.errorCode === 'TOKEN_INVALID' || this.errorCode === 'NOT_LOGIN' || this.errorCode === 'INVALID_API_KEY';
  }

  isClientError(): boolean {
    const numCode = typeof this.code === 'string' ? parseInt(this.code, 10) : this.code;
    return numCode >= 400 && numCode < 500;
  }

  isServerError(): boolean {
    const numCode = typeof this.code === 'string' ? parseInt(this.code, 10) : this.code;
    return numCode >= 500;
  }

  isRetryable(): boolean {
    return this.errorCode === 'NETWORK_ERROR' || 
           this.errorCode === 'TIMEOUT' || 
           this.errorCode === 'RATE_LIMITED' ||
           this.isServerError();
  }

  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      errorCode: this.errorCode,
      data: this.data,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      requestId: this.requestId,
    };
  }
}

export class NetworkError extends AiSdkError {
  constructor(message: string = 'Network request failed') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class TimeoutError extends AiSdkError {
  constructor(message: string = 'Request timeout') {
    super(message, 0, 'TIMEOUT');
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export class AuthenticationError extends AiSdkError {
  constructor(message: string = 'Authentication failed', code: number | string = 401) {
    super(message, code, 'UNAUTHORIZED');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class InvalidApiKeyError extends AiSdkError {
  constructor(message: string = 'Invalid API key') {
    super(message, 'invalid_api_key', 'INVALID_API_KEY');
    this.name = 'InvalidApiKeyError';
    Object.setPrototypeOf(this, InvalidApiKeyError.prototype);
  }
}

export class InsufficientQuotaError extends AiSdkError {
  constructor(message: string = 'Insufficient quota') {
    super(message, 'insufficient_quota', 'INSUFFICIENT_QUOTA');
    this.name = 'InsufficientQuotaError';
    Object.setPrototypeOf(this, InsufficientQuotaError.prototype);
  }
}

export class RateLimitError extends AiSdkError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMITED');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class ServerError extends AiSdkError {
  constructor(message: string = 'Internal server error', code: number | string = 500) {
    super(message, code, 'SERVER_ERROR');
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class CancelledError extends AiSdkError {
  constructor(message: string = 'Request was cancelled') {
    super(message, 0, 'CANCELLED');
    this.name = 'CancelledError';
    Object.setPrototypeOf(this, CancelledError.prototype);
  }
}

export class ContextLengthExceededError extends AiSdkError {
  constructor(message: string = 'Context length exceeded') {
    super(message, 'context_length_exceeded', 'CONTEXT_LENGTH_EXCEEDED');
    this.name = 'ContextLengthExceededError';
    Object.setPrototypeOf(this, ContextLengthExceededError.prototype);
  }
}

export class ValidationError extends AiSdkError {
  constructor(message: string = 'Validation error') {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends AiSdkError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ForbiddenError extends AiSdkError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

function mapCodeToErrorCode(code: number | string, errorName?: string): ErrorCode {
  if (errorName) {
    switch (errorName) {
      case 'NOT_LOGIN':
        return 'NOT_LOGIN';
      case 'TOKEN_EXPIRED':
        return 'TOKEN_EXPIRED';
      case 'TOKEN_INVALID':
        return 'TOKEN_INVALID';
      case 'FAIL':
        return 'FAIL';
      case 'invalid_api_key':
        return 'INVALID_API_KEY';
      case 'insufficient_quota':
        return 'INSUFFICIENT_QUOTA';
      case 'context_length_exceeded':
        return 'CONTEXT_LENGTH_EXCEEDED';
      case 'model_not_found':
        return 'MODEL_NOT_FOUND';
    }
  }
  
  const numCode = typeof code === 'string' ? parseInt(code, 10) : code;
  
  if (numCode === 401 || numCode === 4001) return 'UNAUTHORIZED';
  if (numCode === 403 || numCode === 4003) return 'FORBIDDEN';
  if (numCode === 404 || numCode === 4004) return 'NOT_FOUND';
  if (numCode === 400 || numCode === 4007) return 'VALIDATION_ERROR';
  if (numCode === 429) return 'RATE_LIMITED';
  if (numCode >= 500 || numCode === 5000) return 'SERVER_ERROR';
  
  return 'UNKNOWN';
}

export function isAiSdkError(error: unknown): error is AiSdkError {
  return error instanceof AiSdkError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isAuthError(error: unknown): error is AuthenticationError | InvalidApiKeyError {
  return error instanceof AuthenticationError || error instanceof InvalidApiKeyError;
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof AiSdkError) {
    return error.isRetryable();
  }
  return false;
}
