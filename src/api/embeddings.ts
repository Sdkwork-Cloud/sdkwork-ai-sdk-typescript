import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  EmbeddingRequest,
  EmbeddingResponse,
  EmbeddingsModule,
} from '../types/embeddings';

export class EmbeddingsApi extends BaseApi implements EmbeddingsModule {
  constructor(client: HttpClient) {
    super(client, { basePath: '/ai/v3/embeddings' });
  }

  async create(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    return this.postRequest<EmbeddingResponse>('', request);
  }
}

export function createEmbeddingsApi(client: HttpClient): EmbeddingsModule {
  return new EmbeddingsApi(client);
}
