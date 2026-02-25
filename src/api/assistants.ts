import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  AssistantCreateRequest,
  AssistantUpdateRequest,
  Assistant,
  AssistantListResponse,
  AssistantsModule,
} from '../types/assistants';
import type { ListQueryParams } from '../types/core';
import { API_PATHS } from './paths';

export class AssistantsApi extends BaseApi implements AssistantsModule {
  constructor(client: HttpClient) {
    super(client, { basePath: API_PATHS.assistants.base });
  }

  async create(request: AssistantCreateRequest): Promise<Assistant> {
    return this.postRequest<Assistant>('', request);
  }

  async list(params?: ListQueryParams): Promise<AssistantListResponse> {
    return this.getRequest<AssistantListResponse>('', params as Record<string, string | number | boolean | undefined>);
  }

  async get(assistantId: string): Promise<Assistant> {
    return this.getRequest<Assistant>(`/${assistantId}`);
  }

  async update(assistantId: string, request: AssistantUpdateRequest): Promise<Assistant> {
    return this.postRequest<Assistant>(`/${assistantId}`, request);
  }

  async delete(assistantId: string): Promise<void> {
    await this.deleteRequest<void>(`/${assistantId}`);
  }
}

export function createAssistantsApi(client: HttpClient): AssistantsModule {
  return new AssistantsApi(client);
}
