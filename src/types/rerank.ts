export interface RerankRequest {
  model: string;
  query: string;
  documents: string[] | Array<{ text: string } | Record<string, unknown>>;
  topN?: number;
  returnDocuments?: boolean;
  maxChunksPerDoc?: number;
  overlapTokens?: number;
}

export interface RerankResult {
  index: number;
  relevanceScore: number;
  document?: string | Record<string, unknown>;
}

export interface RerankResponse {
  id: string;
  model: string;
  results: RerankResult[];
  usage?: {
    totalTokens: number;
    promptTokens?: number;
  };
}

export interface RerankModule {
  create(request: RerankRequest): Promise<RerankResponse>;
}
