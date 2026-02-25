import { describe, expect, it } from 'vitest';
import { aiApiPath, API_PATHS, AI_API_PREFIX } from './paths';

describe('api paths', () => {
  it('should build ai api paths', () => {
    expect(aiApiPath('/chat/completions')).toBe('/ai/v3/chat/completions');
    expect(aiApiPath('chat/completions')).toBe('/ai/v3/chat/completions');
  });

  it('should handle empty path', () => {
    expect(aiApiPath('')).toBe('/ai/v3');
    expect(aiApiPath('/')).toBe('/ai/v3/');
  });

  it('should have correct API prefix', () => {
    expect(AI_API_PREFIX).toBe('/ai/v3');
  });

  it('should have correct chat paths', () => {
    expect(API_PATHS.chat.completions).toBe('/ai/v3/chat/completions');
    expect(API_PATHS.chat.completion('chat-123')).toBe('/ai/v3/chat/completions/chat-123');
    expect(API_PATHS.chat.messages('chat-123')).toBe('/ai/v3/chat/completions/chat-123/messages');
  });

  it('should have correct audio paths', () => {
    expect(API_PATHS.audio.speech).toBe('/ai/v3/audio/speech');
    expect(API_PATHS.audio.transcriptions).toBe('/ai/v3/audio/transcriptions');
    expect(API_PATHS.audio.translations).toBe('/ai/v3/audio/translations');
  });

  it('should have correct image paths', () => {
    expect(API_PATHS.images.generations).toBe('/ai/v3/images/generations');
    expect(API_PATHS.images.edits).toBe('/ai/v3/images/edits');
    expect(API_PATHS.images.variations).toBe('/ai/v3/images/variations');
  });

  it('should have correct video paths', () => {
    expect(API_PATHS.videos.base).toBe('/ai/v3/videos');
    expect(API_PATHS.videos.video('video-123')).toBe('/ai/v3/videos/video-123');
  });

  it('should have correct music paths', () => {
    expect(API_PATHS.music.generations).toBe('/ai/v3/music/generations');
    expect(API_PATHS.music.music('music-123')).toBe('/ai/v3/music/music-123');
  });

  it('should have correct embeddings paths', () => {
    expect(API_PATHS.embeddings.base).toBe('/ai/v3/embeddings');
  });

  it('should have correct models paths', () => {
    expect(API_PATHS.models.base).toBe('/ai/v3/models');
    expect(API_PATHS.models.model('gpt-4')).toBe('/ai/v3/models/gpt-4');
  });

  it('should have correct files paths', () => {
    expect(API_PATHS.files.base).toBe('/ai/v3/files');
    expect(API_PATHS.files.file('file-123')).toBe('/ai/v3/files/file-123');
    expect(API_PATHS.files.content('file-123')).toBe('/ai/v3/files/file-123/content');
  });

  it('should have correct threads paths', () => {
    expect(API_PATHS.threads.base).toBe('/ai/v3/threads');
    expect(API_PATHS.threads.thread('thread-123')).toBe('/ai/v3/threads/thread-123');
    expect(API_PATHS.threads.runs('thread-123')).toBe('/ai/v3/threads/thread-123/runs');
    expect(API_PATHS.threads.run('thread-123', 'run-456')).toBe('/ai/v3/threads/thread-123/runs/run-456');
    expect(API_PATHS.threads.messages('thread-123')).toBe('/ai/v3/threads/thread-123/messages');
  });

  it('should have correct knowledge paths', () => {
    expect(API_PATHS.knowledge.base).toBe('/ai/v3/knowledge');
    expect(API_PATHS.knowledge.knowledgeBase('kb-123')).toBe('/ai/v3/knowledge/kb-123');
    expect(API_PATHS.knowledge.documents('kb-123')).toBe('/ai/v3/knowledge/kb-123/documents');
    expect(API_PATHS.knowledge.document('kb-123', 'doc-456')).toBe('/ai/v3/knowledge/kb-123/documents/doc-456');
    expect(API_PATHS.knowledge.search).toBe('/ai/v3/knowledge/search');
  });
});
