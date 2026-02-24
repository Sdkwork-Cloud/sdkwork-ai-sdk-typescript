import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  ContextCreateRequest,
  Context,
  ContextModule,
} from '../types/context';

export class ContextApi extends BaseApi implements ContextModule {
  constructor(client: HttpClient) {
    super(client, { basePath: '/ai/v3/context' });
  }

  async create(request: ContextCreateRequest): Promise<Context> {
    return this.postRequest<Context>('/create', request);
  }

  async get(contextId: string): Promise<Context> {
    return this.getRequest<Context>(`/${contextId}`);
  }

  async delete(contextId: string): Promise<void> {
    await this.deleteRequest<void>(`/${contextId}`);
  }
}

export function createContextApi(client: HttpClient): ContextModule {
  return new ContextApi(client);
}
