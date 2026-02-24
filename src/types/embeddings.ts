export type EmbeddingEncodingFormat = 'float' | 'base64';

export interface EmbeddingRequest {
  model: string;
  input: string | string[] | number[] | number[][];
  encodingFormat?: EmbeddingEncodingFormat;
  dimensions?: number;
  user?: string;
}

export interface Embedding {
  object: 'embedding';
  index: number;
  embedding: number[] | string;
}

export interface EmbeddingUsage {
  promptTokens: number;
  totalTokens: number;
}

export interface EmbeddingResponse {
  object: 'list';
  data: Embedding[];
  model: string;
  usage: EmbeddingUsage;
}

export interface EmbeddingsModule {
  create(request: EmbeddingRequest): Promise<EmbeddingResponse>;
}
