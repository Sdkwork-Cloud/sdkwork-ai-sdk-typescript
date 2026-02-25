import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  KnowledgeBaseCreateRequest,
  KnowledgeBaseUpdateRequest,
  KnowledgeBase,
  DocumentCreateRequest,
  Document,
  KnowledgeSearchRequest,
  KnowledgeSearchResponse,
  KnowledgeBaseModule,
} from '../types/knowledge';
import type { ListQueryParams, Page } from '../types/core';
import { API_PATHS } from './paths';

export class KnowledgeBaseApi extends BaseApi implements KnowledgeBaseModule {
  constructor(client: HttpClient) {
    super(client, { basePath: API_PATHS.knowledge.base });
  }

  async create(request: KnowledgeBaseCreateRequest): Promise<KnowledgeBase> {
    return this.postRequest<KnowledgeBase>('', request);
  }

  async list(params?: ListQueryParams): Promise<Page<KnowledgeBase>> {
    return this.getRequest<Page<KnowledgeBase>>('', params as Record<string, string | number | boolean | undefined>);
  }

  async get(knowledgeBaseId: string): Promise<KnowledgeBase> {
    return this.getRequest<KnowledgeBase>(`/${knowledgeBaseId}`);
  }

  async update(knowledgeBaseId: string, request: KnowledgeBaseUpdateRequest): Promise<KnowledgeBase> {
    return this.putRequest<KnowledgeBase>(`/${knowledgeBaseId}`, request);
  }

  async delete(knowledgeBaseId: string): Promise<void> {
    await this.deleteRequest<void>(`/${knowledgeBaseId}`);
  }

  async addDocument(knowledgeBaseId: string, request: DocumentCreateRequest): Promise<Document> {
    return this.postRequest<Document>(`/${knowledgeBaseId}/documents`, request);
  }

  async listDocuments(knowledgeBaseId: string, params?: ListQueryParams): Promise<Page<Document>> {
    return this.getRequest<Page<Document>>(`/${knowledgeBaseId}/documents`, params as Record<string, string | number | boolean | undefined>);
  }

  async getDocument(knowledgeBaseId: string, documentId: string): Promise<Document> {
    return this.getRequest<Document>(`/${knowledgeBaseId}/documents/${documentId}`);
  }

  async deleteDocument(knowledgeBaseId: string, documentId: string): Promise<void> {
    await this.deleteRequest<void>(`/${knowledgeBaseId}/documents/${documentId}`);
  }

  async search(request: KnowledgeSearchRequest): Promise<KnowledgeSearchResponse> {
    return this.postRequest<KnowledgeSearchResponse>('/search', request);
  }
}

export function createKnowledgeBaseApi(client: HttpClient): KnowledgeBaseModule {
  return new KnowledgeBaseApi(client);
}
