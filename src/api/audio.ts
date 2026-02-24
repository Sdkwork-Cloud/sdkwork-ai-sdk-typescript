import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  SpeechRequest,
  TranscriptionRequest,
  TranscriptionResponse,
  TranslationRequest,
  TranslationResponse,
  AudioModule,
} from '../types/audio';

export class AudioApi extends BaseApi implements AudioModule {
  constructor(client: HttpClient) {
    super(client, { basePath: '/ai/v3/audio' });
  }

  async createSpeech(request: SpeechRequest): Promise<Blob> {
    return this.postRequest<Blob>('/speech', request);
  }

  async createTranscription(request: TranscriptionRequest): Promise<TranscriptionResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('model', request.model);
    if (request.language) formData.append('language', request.language);
    if (request.prompt) formData.append('prompt', request.prompt);
    if (request.responseFormat) formData.append('response_format', request.responseFormat);
    if (request.temperature !== undefined) formData.append('temperature', String(request.temperature));
    if (request.timestampGranularities) {
      formData.append('timestamp_granularities', JSON.stringify(request.timestampGranularities));
    }

    return this.postFormData<TranscriptionResponse>('/transcriptions', formData);
  }

  async createTranslation(request: TranslationRequest): Promise<TranslationResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('model', request.model);
    if (request.prompt) formData.append('prompt', request.prompt);
    if (request.responseFormat) formData.append('response_format', request.responseFormat);
    if (request.temperature !== undefined) formData.append('temperature', String(request.temperature));

    return this.postFormData<TranslationResponse>('/translations', formData);
  }
}

export function createAudioApi(client: HttpClient): AudioModule {
  return new AudioApi(client);
}
