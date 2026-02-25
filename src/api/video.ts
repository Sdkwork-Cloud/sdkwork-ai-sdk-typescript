import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  VideoGenerationRequest,
  Video,
  VideoListResponse,
  VideoModule,
} from '../types/video';
import type { ListQueryParams } from '../types/core';
import { API_PATHS } from './paths';

export class VideoApi extends BaseApi implements VideoModule {
  constructor(client: HttpClient) {
    super(client, { basePath: API_PATHS.videos.base });
  }

  async create(request: VideoGenerationRequest): Promise<Video> {
    return this.postRequest<Video>('', request);
  }

  async list(params?: ListQueryParams): Promise<VideoListResponse> {
    return this.getRequest<VideoListResponse>('', params as Record<string, string | number | boolean | undefined>);
  }

  async get(videoId: string): Promise<Video> {
    return this.getRequest<Video>(`/${videoId}`);
  }

  async delete(videoId: string): Promise<void> {
    await this.deleteRequest<void>(`/${videoId}`);
  }
}

export function createVideoApi(client: HttpClient): VideoModule {
  return new VideoApi(client);
}
