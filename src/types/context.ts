import type { ChatCompletionMessage } from './chat';

export interface ContextCreateRequest {
  messages: ChatCompletionMessage[];
  model?: string;
  ttl?: number;
  metadata?: Record<string, string>;
}

export interface Context {
  id: string;
  object: 'context';
  messages: ChatCompletionMessage[];
  model: string;
  ttl: number;
  createdAt: number;
  expiresAt: number;
  metadata?: Record<string, string>;
}

export interface ContextModule {
  create(request: ContextCreateRequest): Promise<Context>;
  get(contextId: string): Promise<Context>;
  delete(contextId: string): Promise<void>;
}
