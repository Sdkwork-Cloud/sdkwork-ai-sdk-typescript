import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  FileUploadRequest,
  File,
  FileListResponse,
  FilesModule,
} from '../types/files';
import type { ListQueryParams } from '../types/core';

export class FilesApi extends BaseApi implements FilesModule {
  constructor(client: HttpClient) {
    super(client, { basePath: '/ai/v3/files' });
  }

  async upload(request: FileUploadRequest): Promise<File> {
    const formData = new FormData();
    formData.append('file', request.file as Blob, request.file instanceof File ? request.file.name : undefined);
    formData.append('purpose', request.purpose);

    return this.postFormData<File>('', formData);
  }

  async list(params?: ListQueryParams & { purpose?: string }): Promise<FileListResponse> {
    return this.getRequest<FileListResponse>('', params as Record<string, string | number | boolean | undefined>);
  }

  async get(fileId: string): Promise<File> {
    return this.getRequest<File>(`/${fileId}`);
  }

  async delete(fileId: string): Promise<void> {
    await this.deleteRequest<void>(`/${fileId}`);
  }

  async getContent(fileId: string): Promise<Blob> {
    return this.getBlob(`/${fileId}/content`);
  }
}

export function createFilesApi(client: HttpClient): FilesModule {
  return new FilesApi(client);
}
