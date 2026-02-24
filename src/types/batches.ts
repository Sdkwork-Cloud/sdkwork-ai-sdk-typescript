import type { ListQueryParams } from './core';

export type BatchStatus = 'validating' | 'failed' | 'in_progress' | 'finalizing' | 'completed' | 'expired' | 'cancelling' | 'cancelled';
export type BatchEndpoint = '/v1/chat/completions' | '/v1/embeddings' | '/v1/completions';

export interface BatchCreateRequest {
  inputFileId: string;
  endpoint: BatchEndpoint;
  completionWindow: '24h';
  metadata?: Record<string, string>;
}

export interface Batch {
  id: string;
  object: 'batch';
  endpoint: BatchEndpoint;
  errors?: {
    object: 'list';
    data: Array<{
      code: string;
      message: string;
      param?: string;
      line?: number;
    }>;
  };
  inputFileId: string;
  outputFileId?: string;
  errorFileId?: string;
  createdAt: number;
  inProgressAt?: number;
  expiresAt?: number;
  finalizingAt?: number;
  completedAt?: number;
  failedAt?: number;
  expiredAt?: number;
  cancellingAt?: number;
  cancelledAt?: number;
  requestCounts?: {
    total: number;
    completed: number;
    failed: number;
  };
  metadata?: Record<string, string>;
  status: BatchStatus;
}

export interface BatchListResponse {
  object: 'list';
  data: Batch[];
  hasMore: boolean;
}

export interface BatchesModule {
  create(request: BatchCreateRequest): Promise<Batch>;
  list(params?: ListQueryParams): Promise<BatchListResponse>;
  get(batchId: string): Promise<Batch>;
  cancel(batchId: string): Promise<Batch>;
}
