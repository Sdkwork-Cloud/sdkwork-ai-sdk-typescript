import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  EmbeddingRequest,
  EmbeddingResponse,
  EmbeddingsModule,
} from '../types/embeddings';
import { API_PATHS } from './paths';

export class EmbeddingsApi extends BaseApi implements EmbeddingsModule {
  constructor(client: HttpClient) {
    super(client, { basePath: API_PATHS.embeddings.base });
  }

  async create(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    return this.postRequest<EmbeddingResponse>('', request);
  }
}

export function createEmbeddingsApi(client: HttpClient): EmbeddingsModule {
  return new EmbeddingsApi(client);
}
