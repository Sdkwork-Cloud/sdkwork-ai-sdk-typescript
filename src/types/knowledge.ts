import type { ListQueryParams, Page } from './core';

export interface KnowledgeBaseCreateRequest {
  name: string;
  description?: string;
  embeddingModel?: string;
  chunkSize?: number;
  chunkOverlap?: number;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeBaseUpdateRequest {
  name?: string;
  description?: string;
  embeddingModel?: string;
  chunkSize?: number;
  chunkOverlap?: number;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeBase {
  id: string;
  object: 'knowledge_base';
  name: string;
  description?: string;
  embeddingModel: string;
  chunkSize: number;
  chunkOverlap: number;
  documentCount: number;
  totalTokens: number;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, unknown>;
}

export interface DocumentCreateRequest {
  content: string;
  metadata?: Record<string, unknown>;
}

export interface Document {
  id: string;
  object: 'document';
  knowledgeBaseId: string;
  content: string;
  metadata?: Record<string, unknown>;
  tokens: number;
  createdAt: number;
  updatedAt: number;
}

export interface KnowledgeSearchRequest {
  query: string;
  knowledgeBaseIds?: string[];
  topK?: number;
  threshold?: number;
  includeContent?: boolean;
}

export interface KnowledgeSearchResult {
  documentId: string;
  knowledgeBaseId: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeSearchResponse {
  results: KnowledgeSearchResult[];
  query: string;
  total: number;
}

export interface KnowledgeBaseModule {
  create(request: KnowledgeBaseCreateRequest): Promise<KnowledgeBase>;
  list(params?: ListQueryParams): Promise<Page<KnowledgeBase>>;
  get(knowledgeBaseId: string): Promise<KnowledgeBase>;
  update(knowledgeBaseId: string, request: KnowledgeBaseUpdateRequest): Promise<KnowledgeBase>;
  delete(knowledgeBaseId: string): Promise<void>;
  addDocument(knowledgeBaseId: string, request: DocumentCreateRequest): Promise<Document>;
  listDocuments(knowledgeBaseId: string, params?: ListQueryParams): Promise<Page<Document>>;
  getDocument(knowledgeBaseId: string, documentId: string): Promise<Document>;
  deleteDocument(knowledgeBaseId: string, documentId: string): Promise<void>;
  search(request: KnowledgeSearchRequest): Promise<KnowledgeSearchResponse>;
}
