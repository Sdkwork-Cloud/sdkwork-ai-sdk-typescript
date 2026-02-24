import { HttpClient, createHttpClient } from './http/client';
import type { AiSdkConfig, RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from './types/core';
import type { ChatModule } from './types/chat';
import type { AudioModule } from './types/audio';
import type { ImageModule } from './types/image';
import type { VideoModule } from './types/video';
import type { MusicModule } from './types/music';
import type { EmbeddingsModule } from './types/embeddings';
import type { ModelsModule } from './types/models';
import type { FilesModule } from './types/files';
import type { AssistantsModule } from './types/assistants';
import type { ThreadsModule } from './types/threads';
import type { BatchesModule } from './types/batches';
import type { ModerationsModule } from './types/moderations';
import type { RerankModule } from './types/rerank';
import type { KnowledgeBaseModule } from './types/knowledge';
import type { ContextModule } from './types/context';
import {
  createChatApi,
  createAudioApi,
  createImageApi,
  createVideoApi,
  createMusicApi,
  createEmbeddingsApi,
  createModelsApi,
  createFilesApi,
  createAssistantsApi,
  createThreadsApi,
  createBatchesApi,
  createModerationsApi,
  createRerankApi,
  createKnowledgeBaseApi,
  createContextApi,
} from './api';

export class AiSdk {
  private httpClient: HttpClient;
  private modules: {
    chat: ChatModule;
    audio: AudioModule;
    images: ImageModule;
    videos: VideoModule;
    music: MusicModule;
    embeddings: EmbeddingsModule;
    models: ModelsModule;
    files: FilesModule;
    assistants: AssistantsModule;
    threads: ThreadsModule;
    batches: BatchesModule;
    moderations: ModerationsModule;
    rerank: RerankModule;
    knowledge: KnowledgeBaseModule;
    context: ContextModule;
  };

  constructor(config: AiSdkConfig) {
    this.httpClient = createHttpClient(config);
    this.modules = {
      chat: createChatApi(this.httpClient),
      audio: createAudioApi(this.httpClient),
      images: createImageApi(this.httpClient),
      videos: createVideoApi(this.httpClient),
      music: createMusicApi(this.httpClient),
      embeddings: createEmbeddingsApi(this.httpClient),
      models: createModelsApi(this.httpClient),
      files: createFilesApi(this.httpClient),
      assistants: createAssistantsApi(this.httpClient),
      threads: createThreadsApi(this.httpClient),
      batches: createBatchesApi(this.httpClient),
      moderations: createModerationsApi(this.httpClient),
      rerank: createRerankApi(this.httpClient),
      knowledge: createKnowledgeBaseApi(this.httpClient),
      context: createContextApi(this.httpClient),
    };
  }

  get chat(): ChatModule {
    return this.modules.chat;
  }

  get audio(): AudioModule {
    return this.modules.audio;
  }

  get images(): ImageModule {
    return this.modules.images;
  }

  get videos(): VideoModule {
    return this.modules.videos;
  }

  get music(): MusicModule {
    return this.modules.music;
  }

  get embeddings(): EmbeddingsModule {
    return this.modules.embeddings;
  }

  get models(): ModelsModule {
    return this.modules.models;
  }

  get files(): FilesModule {
    return this.modules.files;
  }

  get assistants(): AssistantsModule {
    return this.modules.assistants;
  }

  get threads(): ThreadsModule {
    return this.modules.threads;
  }

  get batches(): BatchesModule {
    return this.modules.batches;
  }

  get moderations(): ModerationsModule {
    return this.modules.moderations;
  }

  get rerank(): RerankModule {
    return this.modules.rerank;
  }

  get knowledge(): KnowledgeBaseModule {
    return this.modules.knowledge;
  }

  get context(): ContextModule {
    return this.modules.context;
  }

  setApiKey(apiKey: string): this {
    this.httpClient.setApiKey(apiKey);
    return this;
  }

  setOrganization(organization: string): this {
    this.httpClient.setOrganization(organization);
    return this;
  }

  setProjectId(projectId: string): this {
    this.httpClient.setProjectId(projectId);
    return this;
  }

  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    return this.httpClient.addRequestInterceptor(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    return this.httpClient.addResponseInterceptor(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    return this.httpClient.addErrorInterceptor(interceptor);
  }

  clearCache(): this {
    this.httpClient.clearCache();
    return this;
  }
}

export function createAiSdk(config: AiSdkConfig): AiSdk {
  return new AiSdk(config);
}

export default AiSdk;
