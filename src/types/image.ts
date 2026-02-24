export type ImageSize = '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
export type ImageQuality = 'standard' | 'hd';
export type ImageStyle = 'vivid' | 'natural';
export type ImageResponseFormat = 'url' | 'b64_json';

export interface ImageGenerationRequest {
  model: string;
  prompt: string;
  n?: number;
  size?: ImageSize;
  quality?: ImageQuality;
  style?: ImageStyle;
  responseFormat?: ImageResponseFormat;
  user?: string;
}

export interface ImageEditRequest {
  image: File | Blob;
  model: string;
  prompt: string;
  mask?: File | Blob;
  n?: number;
  size?: ImageSize;
  responseFormat?: ImageResponseFormat;
  user?: string;
}

export interface ImageVariationRequest {
  image: File | Blob;
  model: string;
  n?: number;
  size?: ImageSize;
  responseFormat?: ImageResponseFormat;
  user?: string;
}

export interface Image {
  url?: string;
  b64Json?: string;
  revisedPrompt?: string;
}

export interface ImageResponse {
  created: number;
  data: Image[];
}

export interface ImageModule {
  generate(request: ImageGenerationRequest): Promise<ImageResponse>;
  edit(request: ImageEditRequest): Promise<ImageResponse>;
  createVariation(request: ImageVariationRequest): Promise<ImageResponse>;
}
