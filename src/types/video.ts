import type { ListQueryParams } from './core';

export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type VideoAspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';

export interface VideoGenerationRequest {
  model: string;
  prompt: string;
  duration?: number;
  aspectRatio?: VideoAspectRatio;
  style?: string;
  resolution?: string;
  fps?: number;
  seed?: number;
  negativePrompt?: string;
  user?: string;
}

export interface Video {
  id: string;
  object: 'video';
  createdAt: number;
  status: VideoStatus;
  model: string;
  prompt: string;
  duration?: number;
  aspectRatio?: VideoAspectRatio;
  resolution?: string;
  fps?: number;
  url?: string;
  thumbnailUrl?: string;
  error?: {
    code: string;
    message: string;
  };
  metadata?: Record<string, unknown>;
}

export interface VideoListResponse {
  object: 'list';
  data: Video[];
  hasMore: boolean;
}

export interface VideoModule {
  create(request: VideoGenerationRequest): Promise<Video>;
  list(params?: ListQueryParams): Promise<VideoListResponse>;
  get(videoId: string): Promise<Video>;
  delete(videoId: string): Promise<void>;
}
