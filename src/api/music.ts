import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  MusicGenerationRequest,
  Music,
  MusicListResponse,
  MusicModule,
} from '../types/music';
import type { ListQueryParams } from '../types/core';
import { API_PATHS } from './paths';

export class MusicApi extends BaseApi implements MusicModule {
  constructor(client: HttpClient) {
    super(client, { basePath: API_PATHS.music.generations.replace('/generations', '') });
  }

  async generate(request: MusicGenerationRequest): Promise<Music> {
    return this.postRequest<Music>('/generations', request);
  }

  async create(request: MusicGenerationRequest): Promise<Music> {
    return this.generate(request);
  }

  async list(params?: ListQueryParams): Promise<MusicListResponse> {
    return this.getRequest<MusicListResponse>('', params as Record<string, string | number | boolean | undefined>);
  }

  async get(musicId: string): Promise<Music> {
    return this.getRequest<Music>(`/${musicId}`);
  }

  async delete(musicId: string): Promise<void> {
    await this.deleteRequest<void>(`/${musicId}`);
  }
}

export function createMusicApi(client: HttpClient): MusicModule {
  return new MusicApi(client);
}
