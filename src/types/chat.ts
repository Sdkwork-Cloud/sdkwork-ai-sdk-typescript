import type { ListQueryParams, Page } from './core';

export type ChatMessageRole = 'system' | 'user' | 'assistant' | 'function' | 'tool';

export interface ChatCompletionMessage {
  role: ChatMessageRole;
  content: string | ChatCompletionContentPart[];
  name?: string;
  functionCall?: {
    name: string;
    arguments: string;
  };
  toolCalls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
  toolCallId?: string;
}

export type ChatCompletionContentPart = 
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string; detail?: 'auto' | 'low' | 'high' } }
  | { type: 'input_audio'; input_audio: { data: string; format: 'wav' | 'mp3' } };

export interface ChatCompletionRequest {
  model: string;
  messages: ChatCompletionMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  presencePenalty?: number;
  frequencyPenalty?: number;
  logitBias?: Record<string, number>;
  logprobs?: boolean;
  topLogprobs?: number;
  user?: string;
  responseFormat?: { type: 'text' | 'json_object' | 'json_schema'; json_schema?: unknown };
  seed?: number;
  tools?: Array<{
    type: 'function';
    function: {
      name: string;
      description?: string;
      parameters?: Record<string, unknown>;
    };
  }>;
  toolChoice?: 'none' | 'auto' | 'required' | { type: 'function'; function: { name: string } };
  parallelToolCalls?: boolean;
  streamOptions?: { includeUsage: boolean };
}

export interface ChatCompletionChoice {
  index: number;
  message: ChatCompletionMessage;
  finishReason: string | null;
  logprobs?: {
    content?: Array<{
      token: string;
      logprob: number;
      bytes?: number[];
      topLogprobs?: Array<{ token: string; logprob: number }>;
    }>;
  };
}

export interface ChatCompletionUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  promptTokensDetails?: {
    cachedTokens?: number;
    audioTokens?: number;
  };
  completionTokensDetails?: {
    reasoningTokens?: number;
    audioTokens?: number;
  };
}

export interface ChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: ChatCompletionUsage;
  systemFingerprint?: string;
}

export interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  systemFingerprint?: string;
  choices: Array<{
    index: number;
    delta: Partial<ChatCompletionMessage>;
    finishReason: string | null;
    logprobs?: {
      content?: Array<{
        token: string;
        logprob: number;
        bytes?: number[];
        topLogprobs?: Array<{ token: string; logprob: number }>;
      }>;
    };
  }>;
  usage?: ChatCompletionUsage;
}

export interface ChatCompletionListParams extends ListQueryParams {
  model?: string;
}

export interface ChatCompletionListResponse {
  object: 'list';
  data: ChatCompletion[];
  hasMore: boolean;
}

export interface ChatCompletionUpdateRequest {
  metadata?: Record<string, string>;
}

export interface ChatModule {
  create(request: ChatCompletionRequest): Promise<ChatCompletion>;
  createStream(request: ChatCompletionRequest): AsyncIterable<ChatCompletionChunk>;
  list(params?: ChatCompletionListParams): Promise<ChatCompletionListResponse>;
  get(completionId: string): Promise<ChatCompletion>;
  update(completionId: string, request: ChatCompletionUpdateRequest): Promise<ChatCompletion>;
  delete(completionId: string): Promise<void>;
  getMessages(completionId: string, params?: ListQueryParams): Promise<Page<ChatCompletionMessage>>;
}
