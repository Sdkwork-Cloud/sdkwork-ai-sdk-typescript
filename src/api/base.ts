import type { HttpClient } from '../http/client';
import type { Page } from '../types/core';

export interface BaseApiConfig {
  basePath: string;
}

export abstract class BaseApi {
  protected client: HttpClient;
  protected basePath: string;

  constructor(client: HttpClient, config?: BaseApiConfig) {
    this.client = client;
    this.basePath = config?.basePath ?? '';
  }

  protected buildPath(...parts: (string | number)[]): string {
    const pathParts = [this.basePath, ...parts.map(String)];
    return pathParts.filter(Boolean).join('/');
  }

  protected async getRequest<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.client.get<T>(this.buildPath(path), params);
  }

  protected async postRequest<T>(path: string, body?: unknown): Promise<T> {
    return this.client.post<T>(this.buildPath(path), body);
  }

  protected async putRequest<T>(path: string, body?: unknown): Promise<T> {
    return this.client.put<T>(this.buildPath(path), body);
  }

  protected async deleteRequest<T>(path: string): Promise<T> {
    return this.client.delete<T>(this.buildPath(path));
  }

  protected async patchRequest<T>(path: string, body?: unknown): Promise<T> {
    return this.client.patch<T>(this.buildPath(path), body);
  }

  protected async postFormData<T>(path: string, formData: FormData): Promise<T> {
    return this.client.postFormData<T>(this.buildPath(path), formData);
  }

  protected async getBlob(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<Blob> {
    return this.client.getBlob(this.buildPath(path), params);
  }

  protected async paginate<T>(
    path: string,
    page: number = 0,
    size: number = 20,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<Page<T>> {
    return this.getRequest<Page<T>>(path, { page, size, ...params });
  }
}

export function createApiConfig(basePath: string): BaseApiConfig {
  return { basePath };
}
