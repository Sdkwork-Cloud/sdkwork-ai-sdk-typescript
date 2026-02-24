import type { ListQueryParams } from './core';

export type AssistantToolType = 'code_interpreter' | 'file_search' | 'function';

export interface AssistantTool {
  type: AssistantToolType;
  function?: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
    strict?: boolean;
  };
}

export interface AssistantCreateRequest {
  model: string;
  name?: string;
  description?: string;
  instructions?: string;
  tools?: AssistantTool[];
  toolResources?: {
    codeInterpreter?: {
      fileIds?: string[];
    };
    fileSearch?: {
      vectorStoreIds?: string[];
      vectorStores?: Array<{
        fileIds?: string[];
        expiresAfter?: {
          anchor: 'last_active_at';
          days: number;
        };
      }>;
    };
  };
  metadata?: Record<string, string>;
  temperature?: number;
  topP?: number;
  responseFormat?: 'auto' | 'text' | 'json_object';
}

export interface AssistantUpdateRequest {
  model?: string;
  name?: string | null;
  description?: string | null;
  instructions?: string | null;
  tools?: AssistantTool[] | null;
  toolResources?: {
    codeInterpreter?: {
      fileIds?: string[];
    };
    fileSearch?: {
      vectorStoreIds?: string[];
    };
  } | null;
  metadata?: Record<string, string> | null;
  temperature?: number;
  topP?: number;
  responseFormat?: 'auto' | 'text' | 'json_object';
}

export interface Assistant {
  id: string;
  object: 'assistant';
  createdAt: number;
  name?: string;
  description?: string;
  model: string;
  instructions?: string;
  tools: AssistantTool[];
  toolResources?: {
    codeInterpreter?: {
      fileIds?: string[];
    };
    fileSearch?: {
      vectorStoreIds?: string[];
    };
  };
  metadata?: Record<string, string>;
  temperature?: number;
  topP?: number;
  responseFormat?: string;
}

export interface AssistantListResponse {
  object: 'list';
  data: Assistant[];
  hasMore: boolean;
}

export interface AssistantsModule {
  create(request: AssistantCreateRequest): Promise<Assistant>;
  list(params?: ListQueryParams): Promise<AssistantListResponse>;
  get(assistantId: string): Promise<Assistant>;
  update(assistantId: string, request: AssistantUpdateRequest): Promise<Assistant>;
  delete(assistantId: string): Promise<void>;
}
