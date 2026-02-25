import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  ChatCompletionRequest,
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionListParams,
  ChatCompletionListResponse,
  ChatCompletionUpdateRequest,
  ChatModule,
} from '../types/chat';
import type { ListQueryParams, Page } from '../types/core';
import type { ChatCompletionMessage } from '../types/chat';
import { API_PATHS } from './paths';

export class ChatApi extends BaseApi implements ChatModule {
  constructor(client: HttpClient) {
    super(client, { basePath: API_PATHS.chat.completions });
  }

  async create(request: ChatCompletionRequest): Promise<ChatCompletion> {
    return this.postRequest<ChatCompletion>('', request);
  }

  async *createStream(request: ChatCompletionRequest): AsyncIterable<ChatCompletionChunk> {
    const config = this.client.getConfig();
    const tokenManager = this.client.getTokenManager();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (config.authMode === 'apikey' && config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    } else if (tokenManager) {
      const accessToken = tokenManager.getAccessToken();
      const authToken = tokenManager.getAuthToken();
      
      if (accessToken) {
        headers['Access-Token'] = accessToken;
      }
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
    }
    
    const response = await fetch(`${config.baseUrl}${this.basePath}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine === '' || trimmedLine === 'data: [DONE]') continue;
          if (trimmedLine.startsWith('data: ')) {
            try {
              const json = trimmedLine.slice(6);
              yield JSON.parse(json) as ChatCompletionChunk;
            } catch {
              // ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async list(params?: ChatCompletionListParams): Promise<ChatCompletionListResponse> {
    return this.getRequest<ChatCompletionListResponse>('', params as Record<string, string | number | boolean | undefined>);
  }

  async get(completionId: string): Promise<ChatCompletion> {
    return this.getRequest<ChatCompletion>(`/${completionId}`);
  }

  async update(completionId: string, request: ChatCompletionUpdateRequest): Promise<ChatCompletion> {
    return this.patchRequest<ChatCompletion>(`/${completionId}`, request);
  }

  async delete(completionId: string): Promise<void> {
    await this.deleteRequest<void>(`/${completionId}`);
  }

  async getMessages(completionId: string, params?: ListQueryParams): Promise<Page<ChatCompletionMessage>> {
    return this.getRequest<Page<ChatCompletionMessage>>(`/${completionId}/messages`, params as Record<string, string | number | boolean | undefined>);
  }
}

export function createChatApi(client: HttpClient): ChatModule {
  return new ChatApi(client);
}
