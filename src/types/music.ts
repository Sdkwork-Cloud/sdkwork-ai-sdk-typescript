import type { ListQueryParams } from './core';

export type MusicStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface MusicGenerationRequest {
  model: string;
  prompt: string;
  duration?: number;
  genre?: string;
  tempo?: string;
  key?: string;
  mode?: 'major' | 'minor';
  instrument?: string;
  seed?: number;
  negativePrompt?: string;
  user?: string;
}

export interface Music {
  id: string;
  object: 'music';
  createdAt: number;
  status: MusicStatus;
  model: string;
  prompt: string;
  duration?: number;
  genre?: string;
  tempo?: string;
  key?: string;
  mode?: string;
  url?: string;
  waveformUrl?: string;
  error?: {
    code: string;
    message: string;
  };
  metadata?: Record<string, unknown>;
}

export interface MusicListResponse {
  object: 'list';
  data: Music[];
  hasMore: boolean;
}

export interface MusicModule {
  generate(request: MusicGenerationRequest): Promise<Music>;
  list(params?: ListQueryParams): Promise<MusicListResponse>;
  get(musicId: string): Promise<Music>;
  delete(musicId: string): Promise<void>;
}
