import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  ImageGenerationRequest,
  ImageEditRequest,
  ImageVariationRequest,
  ImageResponse,
  ImageModule,
} from '../types/image';

export class ImageApi extends BaseApi implements ImageModule {
  constructor(client: HttpClient) {
    super(client, { basePath: '/ai/v3/images' });
  }

  async generate(request: ImageGenerationRequest): Promise<ImageResponse> {
    return this.postRequest<ImageResponse>('/generations', request);
  }

  async edit(request: ImageEditRequest): Promise<ImageResponse> {
    const formData = new FormData();
    formData.append('image', request.image);
    formData.append('model', request.model);
    formData.append('prompt', request.prompt);
    if (request.mask) formData.append('mask', request.mask);
    if (request.n) formData.append('n', String(request.n));
    if (request.size) formData.append('size', request.size);
    if (request.responseFormat) formData.append('response_format', request.responseFormat);
    if (request.user) formData.append('user', request.user);

    return this.postFormData<ImageResponse>('/edits', formData);
  }

  async createVariation(request: ImageVariationRequest): Promise<ImageResponse> {
    const formData = new FormData();
    formData.append('image', request.image);
    formData.append('model', request.model);
    if (request.n) formData.append('n', String(request.n));
    if (request.size) formData.append('size', request.size);
    if (request.responseFormat) formData.append('response_format', request.responseFormat);
    if (request.user) formData.append('user', request.user);

    return this.postFormData<ImageResponse>('/variations', formData);
  }
}

export function createImageApi(client: HttpClient): ImageModule {
  return new ImageApi(client);
}
