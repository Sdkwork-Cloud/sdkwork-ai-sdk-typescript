import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient } from '../http/client';

function createApiResponse<T>(data: T): Response {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

describe('HttpClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should make GET request with correct headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse({ id: 'test' }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
      apiKey: 'test-api-key',
    });

    await client.get('/ai/v3/models');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(requestInit.method).toBe('GET');
    expect(requestInit.headers).toMatchObject({
      'Authorization': 'Bearer test-api-key',
      'Content-Type': 'application/json',
    });
  });

  it('should make POST request with body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse({ id: 'chat-1' }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
      apiKey: 'test-api-key',
    });

    await client.post('/ai/v3/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(requestInit.method).toBe('POST');
    expect(requestInit.body).toBe(JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hello' }],
    }));
  });

  it('should handle OpenAI-Organization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
      apiKey: 'test-api-key',
      organization: 'org-123',
    });

    await client.get('/ai/v3/models');

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(requestInit.headers).toMatchObject({
      'OpenAI-Organization': 'org-123',
    });
  });

  it('should handle OpenAI-Project header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
      apiKey: 'test-api-key',
      projectId: 'proj-456',
    });

    await client.get('/ai/v3/models');

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(requestInit.headers).toMatchObject({
      'OpenAI-Project': 'proj-456',
    });
  });

  it('should throw AuthenticationError on 401', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: 'Invalid API key' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
      apiKey: 'invalid-key',
      retry: { maxRetries: 0 },
    });

    await expect(client.get('/ai/v3/models')).rejects.toThrow('Invalid API key');
  });
});
