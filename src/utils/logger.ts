import type { LoggerConfig, LogLevel } from '../types/core';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const DEFAULT_COLORS = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m',
};

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export function createLogger(config?: Partial<LoggerConfig>): Logger {
  const level = config?.level ?? 'info';
  const prefix = config?.prefix ?? '[AiSdk]';
  const showTimestamp = config?.timestamp ?? true;
  const useColors = config?.colors ?? true;

  const shouldLog = (logLevel: LogLevel): boolean => {
    return LOG_LEVELS[logLevel] >= LOG_LEVELS[level];
  };

  const formatMessage = (logLevel: LogLevel, message: string): string => {
    const timestamp = showTimestamp ? `[${new Date().toISOString()}] ` : '';
    const levelStr = logLevel.toUpperCase().padEnd(5);
    
    if (useColors && typeof process !== 'undefined' && process.stdout?.isTTY) {
      return `${DEFAULT_COLORS[logLevel]}${timestamp}${prefix} ${levelStr}${DEFAULT_COLORS.reset} ${message}`;
    }
    
    return `${timestamp}${prefix} ${levelStr} ${message}`;
  };

  return {
    debug(message: string, ...args: unknown[]): void {
      if (shouldLog('debug')) {
        console.debug(formatMessage('debug', message), ...args);
      }
    },
    info(message: string, ...args: unknown[]): void {
      if (shouldLog('info')) {
        console.info(formatMessage('info', message), ...args);
      }
    },
    warn(message: string, ...args: unknown[]): void {
      if (shouldLog('warn')) {
        console.warn(formatMessage('warn', message), ...args);
      }
    },
    error(message: string, ...args: unknown[]): void {
      if (shouldLog('error')) {
        console.error(formatMessage('error', message), ...args);
      }
    },
  };
}
