import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  Model,
  ModelListResponse,
  ModelsModule,
} from '../types/models';

export class ModelsApi extends BaseApi implements ModelsModule {
  constructor(client: HttpClient) {
    super(client, { basePath: '/ai/v3/models' });
  }

  async list(): Promise<ModelListResponse> {
    return this.getRequest<ModelListResponse>('');
  }

  async get(modelId: string): Promise<Model> {
    return this.getRequest<Model>(`/${modelId}`);
  }

  async delete(modelId: string): Promise<void> {
    await this.deleteRequest<void>(`/${modelId}`);
  }
}

export function createModelsApi(client: HttpClient): ModelsModule {
  return new ModelsApi(client);
}
