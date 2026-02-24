import type { RetryConfig } from '../types/core';
import { NetworkError, TimeoutError, RateLimitError, isAiSdkError } from '../types/errors';

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryBackoff: 'exponential',
  maxRetryDelay: 30000,
};

export function calculateDelay(attempt: number, config: RetryConfig): number {
  const { retryDelay, retryBackoff, maxRetryDelay } = config;
  
  let delay: number;
  
  switch (retryBackoff) {
    case 'exponential':
      delay = retryDelay * Math.pow(2, attempt);
      break;
    case 'linear':
      delay = retryDelay * (attempt + 1);
      break;
    case 'fixed':
    default:
      delay = retryDelay;
      break;
  }
  
  return Math.min(delay, maxRetryDelay ?? delay);
}

export function shouldRetry(error: Error, attempt: number, config: RetryConfig): boolean {
  if (attempt >= config.maxRetries) {
    return false;
  }
  
  if (config.retryCondition) {
    return config.retryCondition(error, attempt);
  }
  
  if (isAiSdkError(error)) {
    return error.isRetryable();
  }
  
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return true;
  }
  
  if (error instanceof RateLimitError && error.retryAfter) {
    return true;
  }
  
  return false;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config?: Partial<RetryConfig>
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (!shouldRetry(lastError, attempt, retryConfig)) {
        throw lastError;
      }
      
      const delay = calculateDelay(attempt, retryConfig);
      await sleep(delay);
    }
  }
  
  throw lastError;
}
