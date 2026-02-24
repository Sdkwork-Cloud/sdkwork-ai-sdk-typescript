import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  RerankRequest,
  RerankResponse,
  RerankModule,
} from '../types/rerank';

export class RerankApi extends BaseApi implements RerankModule {
  constructor(client: HttpClient) {
    super(client, { basePath: '/ai/v3/rerank' });
  }

  async create(request: RerankRequest): Promise<RerankResponse> {
    return this.postRequest<RerankResponse>('', request);
  }
}

export function createRerankApi(client: HttpClient): RerankModule {
  return new RerankApi(client);
}
