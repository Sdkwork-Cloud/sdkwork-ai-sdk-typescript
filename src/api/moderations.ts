import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  ModerationRequest,
  ModerationResponse,
  ModerationsModule,
} from '../types/moderations';

export class ModerationsApi extends BaseApi implements ModerationsModule {
  constructor(client: HttpClient) {
    super(client, { basePath: '/ai/v3/moderations' });
  }

  async create(request: ModerationRequest): Promise<ModerationResponse> {
    return this.postRequest<ModerationResponse>('', request);
  }
}

export function createModerationsApi(client: HttpClient): ModerationsModule {
  return new ModerationsApi(client);
}
