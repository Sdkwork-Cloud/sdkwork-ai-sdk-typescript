import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  BatchCreateRequest,
  Batch,
  BatchListResponse,
  BatchesModule,
} from '../types/batches';
import type { ListQueryParams } from '../types/core';

export class BatchesApi extends BaseApi implements BatchesModule {
  constructor(client: HttpClient) {
    super(client, { basePath: '/ai/v3/batches' });
  }

  async create(request: BatchCreateRequest): Promise<Batch> {
    return this.postRequest<Batch>('', request);
  }

  async list(params?: ListQueryParams): Promise<BatchListResponse> {
    return this.getRequest<BatchListResponse>('', params as Record<string, string | number | boolean | undefined>);
  }

  async get(batchId: string): Promise<Batch> {
    return this.getRequest<Batch>(`/${batchId}`);
  }

  async cancel(batchId: string): Promise<Batch> {
    return this.postRequest<Batch>(`/${batchId}/cancel`);
  }
}

export function createBatchesApi(client: HttpClient): BatchesModule {
  return new BatchesApi(client);
}
