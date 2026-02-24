import type { ListQueryParams } from './core';

export type FilePurpose = 'assistants' | 'vision' | 'batch' | 'fine-tune';

export interface FileUploadRequest {
  file: File | Blob;
  purpose: FilePurpose;
}

export interface File {
  id: string;
  object: 'file';
  bytes: number;
  createdAt: number;
  filename: string;
  purpose: FilePurpose;
  status?: 'uploaded' | 'processed' | 'error';
  statusDetails?: string;
}

export interface FileListResponse {
  object: 'list';
  data: File[];
  hasMore: boolean;
}

export interface FilesModule {
  upload(request: FileUploadRequest): Promise<File>;
  list(params?: ListQueryParams & { purpose?: FilePurpose }): Promise<FileListResponse>;
  get(fileId: string): Promise<File>;
  delete(fileId: string): Promise<void>;
  getContent(fileId: string): Promise<Blob>;
}
