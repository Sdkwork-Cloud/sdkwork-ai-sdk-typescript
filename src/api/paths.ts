export const AI_API_PREFIX = '/ai/v3';

function normalizePath(path: string): string {
  if (!path) {
    return '';
  }

  return path.startsWith('/') ? path : `/${path}`;
}

export function aiApiPath(path: string): string {
  return `${AI_API_PREFIX}${normalizePath(path)}`;
}

export const API_PATHS = {
  chat: {
    completions: aiApiPath('/chat/completions'),
    completion: (id: string) => aiApiPath(`/chat/completions/${id}`),
    messages: (id: string) => aiApiPath(`/chat/completions/${id}/messages`),
  },
  audio: {
    speech: aiApiPath('/audio/speech'),
    transcriptions: aiApiPath('/audio/transcriptions'),
    translations: aiApiPath('/audio/translations'),
  },
  images: {
    generations: aiApiPath('/images/generations'),
    edits: aiApiPath('/images/edits'),
    variations: aiApiPath('/images/variations'),
  },
  videos: {
    base: aiApiPath('/videos'),
    video: (id: string) => aiApiPath(`/videos/${id}`),
  },
  music: {
    generations: aiApiPath('/music/generations'),
    music: (id: string) => aiApiPath(`/music/${id}`),
  },
  embeddings: {
    base: aiApiPath('/embeddings'),
  },
  models: {
    base: aiApiPath('/models'),
    model: (id: string) => aiApiPath(`/models/${id}`),
  },
  files: {
    base: aiApiPath('/files'),
    file: (id: string) => aiApiPath(`/files/${id}`),
    content: (id: string) => aiApiPath(`/files/${id}/content`),
  },
  assistants: {
    base: aiApiPath('/assistants'),
    assistant: (id: string) => aiApiPath(`/assistants/${id}`),
  },
  threads: {
    base: aiApiPath('/threads'),
    thread: (id: string) => aiApiPath(`/threads/${id}`),
    runs: (id: string) => aiApiPath(`/threads/${id}/runs`),
    run: (threadId: string, runId: string) => aiApiPath(`/threads/${threadId}/runs/${runId}`),
    messages: (id: string) => aiApiPath(`/threads/${id}/messages`),
  },
  batches: {
    base: aiApiPath('/batches'),
    batch: (id: string) => aiApiPath(`/batches/${id}`),
  },
  moderations: {
    base: aiApiPath('/moderations'),
  },
  rerank: {
    base: aiApiPath('/rerank'),
  },
  knowledge: {
    base: aiApiPath('/knowledge'),
    knowledgeBase: (id: string) => aiApiPath(`/knowledge/${id}`),
    documents: (id: string) => aiApiPath(`/knowledge/${id}/documents`),
    document: (knowledgeBaseId: string, documentId: string) => 
      aiApiPath(`/knowledge/${knowledgeBaseId}/documents/${documentId}`),
    search: aiApiPath('/knowledge/search'),
  },
  context: {
    base: aiApiPath('/context'),
    context: (id: string) => aiApiPath(`/context/${id}`),
  },
} as const;
