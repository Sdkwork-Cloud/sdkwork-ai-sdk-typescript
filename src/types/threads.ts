import type { ListQueryParams } from './core';
import type { AssistantTool } from './assistants';

export interface ThreadCreateRequest {
  messages?: Array<{
    role: 'user' | 'assistant';
    content: string;
    fileIds?: string[];
    attachments?: Array<{
      fileId: string;
      tools?: Array<{ type: string }>;
    }>;
    metadata?: Record<string, string>;
  }>;
  toolResources?: {
    codeInterpreter?: {
      fileIds?: string[];
    };
    fileSearch?: {
      vectorStoreIds?: string[];
    };
  };
  metadata?: Record<string, string>;
}

export interface ThreadUpdateRequest {
  metadata?: Record<string, string>;
  toolResources?: {
    codeInterpreter?: {
      fileIds?: string[];
    };
    fileSearch?: {
      vectorStoreIds?: string[];
    };
  };
}

export interface ThreadMessage {
  id: string;
  object: 'thread.message';
  createdAt: number;
  threadId: string;
  role: 'user' | 'assistant';
  content: Array<{
    type: 'text' | 'image_file';
    text?: { value: string; annotations: unknown[] };
    imageFile?: { fileId: string };
  }>;
  assistantId?: string;
  runId?: string;
  fileIds?: string[];
  metadata?: Record<string, string>;
}

export interface Thread {
  id: string;
  object: 'thread';
  createdAt: number;
  toolResources?: {
    codeInterpreter?: {
      fileIds?: string[];
    };
    fileSearch?: {
      vectorStoreIds?: string[];
    };
  };
  metadata?: Record<string, string>;
}

export type RunStatus = 'queued' | 'in_progress' | 'requires_action' | 'cancelling' | 'cancelled' | 'failed' | 'completed' | 'expired';

export interface RunCreateRequest {
  assistantId: string;
  model?: string;
  instructions?: string;
  additionalInstructions?: string;
  additionalMessages?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  tools?: AssistantTool[];
  metadata?: Record<string, string>;
  temperature?: number;
  topP?: number;
  stream?: boolean;
  maxPromptTokens?: number;
  maxCompletionTokens?: number;
  truncationStrategy?: {
    type: 'auto' | 'last_messages';
    lastMessages?: number;
  };
  toolChoice?: 'none' | 'auto' | 'required' | { type: string };
  parallelToolCalls?: boolean;
  responseFormat?: 'auto' | 'text' | 'json_object';
}

export interface Run {
  id: string;
  object: 'thread.run';
  createdAt: number;
  threadId: string;
  assistantId: string;
  status: RunStatus;
  requiredAction?: {
    type: 'submit_tool_outputs';
    submitToolOutputs: {
      toolCalls: Array<{
        id: string;
        type: 'function';
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
  };
  lastError?: {
    code: 'server_error' | 'rate_limit_exceeded' | 'invalid_prompt';
    message: string;
  };
  expiresAt?: number;
  startedAt?: number;
  cancelledAt?: number;
  failedAt?: number;
  completedAt?: number;
  model?: string;
  instructions?: string;
  tools?: AssistantTool[];
  metadata?: Record<string, string>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  temperature?: number;
  topP?: number;
  maxPromptTokens?: number;
  maxCompletionTokens?: number;
  truncationStrategy?: {
    type: 'auto' | 'last_messages';
    lastMessages?: number;
  };
  toolChoice?: string;
  parallelToolCalls?: boolean;
  responseFormat?: string;
}

export interface RunListResponse {
  object: 'list';
  data: Run[];
  hasMore: boolean;
}

export interface ThreadsModule {
  create(request?: ThreadCreateRequest): Promise<Thread>;
  get(threadId: string): Promise<Thread>;
  update(threadId: string, request: ThreadUpdateRequest): Promise<Thread>;
  delete(threadId: string): Promise<void>;
  createRun(threadId: string, request: RunCreateRequest): Promise<Run>;
  listRuns(threadId: string, params?: ListQueryParams): Promise<RunListResponse>;
  getRun(threadId: string, runId: string): Promise<Run>;
  cancelRun(threadId: string, runId: string): Promise<Run>;
  submitToolOutputs(threadId: string, runId: string, outputs: { toolCallId: string; output: string }[]): Promise<Run>;
  getMessages(threadId: string, params?: ListQueryParams): Promise<{ object: 'list'; data: ThreadMessage[]; hasMore: boolean }>;
}
