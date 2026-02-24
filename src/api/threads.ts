import { BaseApi } from './base';
import type { HttpClient } from '../http/client';
import type {
  ThreadCreateRequest,
  ThreadUpdateRequest,
  Thread,
  RunCreateRequest,
  Run,
  RunListResponse,
  ThreadMessage,
  ThreadsModule,
} from '../types/threads';
import type { ListQueryParams } from '../types/core';

export class ThreadsApi extends BaseApi implements ThreadsModule {
  constructor(client: HttpClient) {
    super(client, { basePath: '/ai/v3/threads' });
  }

  async create(request?: ThreadCreateRequest): Promise<Thread> {
    return this.postRequest<Thread>('', request);
  }

  async get(threadId: string): Promise<Thread> {
    return this.getRequest<Thread>(`/${threadId}`);
  }

  async update(threadId: string, request: ThreadUpdateRequest): Promise<Thread> {
    return this.postRequest<Thread>(`/${threadId}`, request);
  }

  async delete(threadId: string): Promise<void> {
    await this.deleteRequest<void>(`/${threadId}`);
  }

  async createRun(threadId: string, request: RunCreateRequest): Promise<Run> {
    return this.postRequest<Run>(`/${threadId}/runs`, request);
  }

  async listRuns(threadId: string, params?: ListQueryParams): Promise<RunListResponse> {
    return this.getRequest<RunListResponse>(`/${threadId}/runs`, params as Record<string, string | number | boolean | undefined>);
  }

  async getRun(threadId: string, runId: string): Promise<Run> {
    return this.getRequest<Run>(`/${threadId}/runs/${runId}`);
  }

  async cancelRun(threadId: string, runId: string): Promise<Run> {
    return this.postRequest<Run>(`/${threadId}/runs/${runId}/cancel`);
  }

  async submitToolOutputs(threadId: string, runId: string, outputs: { toolCallId: string; output: string }[]): Promise<Run> {
    return this.postRequest<Run>(`/${threadId}/runs/${runId}/submit_tool_outputs`, {
      tool_outputs: outputs,
    });
  }

  async getMessages(threadId: string, params?: ListQueryParams): Promise<{ object: 'list'; data: ThreadMessage[]; hasMore: boolean }> {
    return this.getRequest<{ object: 'list'; data: ThreadMessage[]; hasMore: boolean }>(`/${threadId}/messages`, params as Record<string, string | number | boolean | undefined>);
  }
}

export function createThreadsApi(client: HttpClient): ThreadsModule {
  return new ThreadsApi(client);
}
