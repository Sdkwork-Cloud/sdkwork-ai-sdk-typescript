# @sdkwork/ai-sdk

> SDKwork AI SDK - 专业级TypeScript SDK，支持双Token认证模式，OpenAI兼容API

## 📦 安装

```bash
npm install @sdkwork/ai-sdk
# 或
yarn add @sdkwork/ai-sdk
# 或
pnpm add @sdkwork/ai-sdk
```

## 🚀 快速开始

### APIKEY模式

```typescript
import { createAiSdk } from '@sdkwork/ai-sdk';

const sdk = createAiSdk({
  baseUrl: 'https://api.sdkwork.com',
  apiKey: 'your-api-key',
});

// Chat completion
const completion = await sdk.chat.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello, AI!' }],
});

console.log(completion.choices[0].message.content);
```

### 双Token模式（默认）

```typescript
import { createAiSdk } from '@sdkwork/ai-sdk';

// 创建客户端时设置accessToken
const sdk = createAiSdk({
  baseUrl: 'https://api.sdkwork.com',
  accessToken: 'your-access-token',
});

// 登录后设置authToken
sdk.setAuthToken('auth-token');

// Chat completion
const completion = await sdk.chat.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello, AI!' }],
});
```

## 🔐 认证模式

### 双Token认证流程

```
1. 创建客户端 → 设置accessToken（设备标识/匿名token）
2. 用户登录 → 获取authToken（用户认证token）
3. 设置authToken → 完成认证
4. 请求API → 自动携带双Token
```

### Token说明

| Token | 设置时机 | 用途 | Header |
|-------|---------|------|--------|
| `accessToken` | 创建客户端时 | 设备标识/匿名访问 | `Access-Token` |
| `authToken` | 登录后 | 用户认证 | `Authorization: Bearer` |

### 模式切换

```typescript
// 从双Token切换到APIKEY模式
sdk.setApiKey('new-api-key');  // 自动切换并清除tokens

// 从APIKEY切换到双Token模式
sdk.setAccessToken('access-token');  // 自动切换并清除apiKey
sdk.setAuthToken('auth-token');
```

## ⚙️ 配置选项

```typescript
interface AiSdkConfig {
  baseUrl: string;           // API基础URL（必填）
  apiKey?: string;           // API密钥（APIKEY模式）
  accessToken?: string;      // 访问令牌（创建时设置）
  authToken?: string;        // 认证令牌（登录后设置）
  timeout?: number;          // 超时时间（默认30000ms）
  headers?: Record<string, string>; // 自定义请求头
  retry?: {
    maxRetries: number;      // 最大重试次数（默认3）
    retryDelay: number;      // 重试延迟（默认1000ms）
    retryBackoff: 'linear' | 'exponential'; // 退避策略
    maxRetryDelay: number;   // 最大延迟（默认30000ms）
  };
  cache?: {
    enabled: boolean;        // 启用缓存（默认false）
    ttl: number;             // 缓存TTL（默认300000ms）
    maxSize: number;         // 最大缓存条目（默认100）
  };
  logger?: {
    level: 'debug' | 'info' | 'warn' | 'error'; // 日志级别
    prefix: string;          // 日志前缀
    timestamp: boolean;      // 包含时间戳
  };
}
```

## 📚 模块列表

| 模块 | 描述 |
|------|------|
| `chat` | Chat Completions - 创建、流式、列表、管理 |
| `images` | 图片生成 - 创建、编辑、变体 |
| `videos` | 视频生成 - 创建、列表、获取 |
| `music` | 音乐生成 - 创建、列表、获取 |
| `audio` | 音频 - TTS、转录、翻译 |
| `embeddings` | 向量嵌入 - 创建、批量 |
| `models` | 模型 - 列表、获取 |
| `files` | 文件 - 上传、列表、删除 |
| `assistants` | 助手 - 创建、管理、运行 |
| `threads` | 线程 - 创建、管理、消息 |
| `batches` | 批处理 - 创建、管理 |
| `moderations` | 内容审核 - 创建 |
| `rerank` | 重排序 - 创建 |
| `knowledge` | 知识库 - 创建、搜索、文档 |
| `context` | 上下文 - 创建、管理 |

## 📖 API参考

### Chat Completions

```typescript
// 创建补全
const completion = await sdk.chat.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' },
  ],
  temperature: 0.7,
  maxTokens: 1000,
});

// 流式补全
for await (const chunk of sdk.chat.createStream({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Tell me a story' }],
})) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}

// 列出补全
const completions = await sdk.chat.list({ limit: 20 });

// 获取补全
const completion = await sdk.chat.get('chat-123');

// 更新补全
const updated = await sdk.chat.update('chat-123', {
  metadata: { key: 'value' },
});

// 删除补全
await sdk.chat.delete('chat-123');

// 获取消息
const messages = await sdk.chat.getMessages('chat-123', { page: 1, size: 20 });
```

### 图片生成

```typescript
// 生成图片
const image = await sdk.images.generate({
  model: 'dall-e-3',
  prompt: 'A beautiful sunset over mountains',
  n: 1,
  size: '1024x1024',
  quality: 'standard',
  style: 'vivid',
});

// 编辑图片
const edited = await sdk.images.edit({
  model: 'dall-e-2',
  image: imageFile,
  prompt: 'Add a rainbow',
  mask: maskFile,
});

// 创建变体
const variation = await sdk.images.createVariation({
  model: 'dall-e-2',
  image: imageFile,
  n: 1,
});
```

### 视频生成

```typescript
// 创建视频
const video = await sdk.videos.create({
  model: 'sora',
  prompt: 'A cat playing piano',
  duration: 10,
  aspectRatio: '16:9',
});

// 列出视频
const videos = await sdk.videos.list({ status: 'completed', limit: 20 });

// 获取视频
const video = await sdk.videos.get('video-123');

// 删除视频
await sdk.videos.delete('video-123');
```

### 音乐生成

```typescript
// 创建音乐
const music = await sdk.music.create({
  model: 'music-gen',
  prompt: 'Upbeat electronic music',
  duration: 60,
  genre: 'electronic',
});

// 列出音乐
const musicList = await sdk.music.list({ limit: 20 });

// 获取音乐
const music = await sdk.music.get('music-123');
```

### 音频（TTS、转录、翻译）

```typescript
// 文本转语音
const audioBuffer = await sdk.audio.speech({
  model: 'tts-1',
  input: 'Hello, world!',
  voice: 'alloy',
  responseFormat: 'mp3',
});

// 转录
const transcription = await sdk.audio.transcribe({
  file: audioFile,
  model: 'whisper-1',
  language: 'en',
});

// 翻译
const translation = await sdk.audio.translate({
  file: audioFile,
  model: 'whisper-1',
});
```

### 向量嵌入

```typescript
const embedding = await sdk.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'Hello, world!',
  encodingFormat: 'float',
});
```

### 模型

```typescript
// 列出模型
const models = await sdk.models.list();

// 获取模型
const model = await sdk.models.get('gpt-4');
```

### 文件

```typescript
// 上传文件
const file = await sdk.files.upload({
  file: fileBlob,
  purpose: 'assistants',
});

// 列出文件
const files = await sdk.files.list({ purpose: 'assistants' });

// 获取文件
const file = await sdk.files.get('file-123');

// 删除文件
await sdk.files.delete('file-123');

// 获取文件内容
const content = await sdk.files.getContent('file-123');
```

### 助手

```typescript
// 创建助手
const assistant = await sdk.assistants.create({
  model: 'gpt-4',
  name: 'My Assistant',
  instructions: 'You are a helpful assistant.',
  tools: [{ type: 'code_interpreter' }],
});

// 列出助手
const assistants = await sdk.assistants.list({ limit: 20 });

// 更新助手
const updated = await sdk.assistants.update('assistant-123', {
  name: 'Updated Name',
});

// 删除助手
await sdk.assistants.delete('assistant-123');
```

### 线程

```typescript
// 创建线程
const thread = await sdk.threads.create({
  messages: [{ role: 'user', content: 'Hello!' }],
});

// 获取线程
const thread = await sdk.threads.get('thread-123');

// 更新线程
const updated = await sdk.threads.update('thread-123', {
  metadata: { key: 'value' },
});

// 删除线程
await sdk.threads.delete('thread-123');

// 创建运行
const run = await sdk.threads.createRun('thread-123', {
  assistantId: 'assistant-123',
});

// 列出运行
const runs = await sdk.threads.listRuns('thread-123');

// 获取运行
const run = await sdk.threads.getRun('thread-123', 'run-123');

// 取消运行
await sdk.threads.cancelRun('thread-123', 'run-123');
```

### 知识库

```typescript
// 创建知识库
const kb = await sdk.knowledge.create({
  name: 'My Knowledge Base',
  description: 'A knowledge base for documents',
});

// 添加文档
const doc = await sdk.knowledge.addDocument('kb-123', {
  file: fileBlob,
  filename: 'document.pdf',
});

// 搜索
const results = await sdk.knowledge.search({
  knowledgeBaseId: 'kb-123',
  query: 'search query',
  topK: 10,
});
```

### 重排序

```typescript
const rerankResult = await sdk.rerank.create({
  model: 'rerank-1',
  query: 'search query',
  documents: ['doc1', 'doc2', 'doc3'],
  topN: 3,
});
```

### 内容审核

```typescript
const moderation = await sdk.moderations.create({
  model: 'text-moderation-latest',
  input: 'Content to moderate',
});
```

### 批处理

```typescript
// 创建批处理
const batch = await sdk.batches.create({
  inputFileId: 'file-123',
  endpoint: '/v1/chat/completions',
  completionWindow: '24h',
});

// 列出批处理
const batches = await sdk.batches.list({ limit: 20 });

// 获取批处理
const batch = await sdk.batches.get('batch-123');

// 取消批处理
await sdk.batches.cancel('batch-123');
```

## ⚠️ 错误处理

```typescript
import {
  AiSdkError,
  AuthenticationError,
  InvalidApiKeyError,
  RateLimitError,
  ServerError,
  ValidationError,
  NetworkError,
  TimeoutError,
  ContextLengthExceededError,
  InsufficientQuotaError,
} from '@sdkwork/ai-sdk';

try {
  await sdk.chat.create({ model: 'gpt-4', messages: [] });
} catch (error) {
  if (error instanceof InvalidApiKeyError) {
    console.log('无效的API密钥');
  } else if (error instanceof AuthenticationError) {
    console.log('认证失败');
  } else if (error instanceof RateLimitError) {
    console.log('请求限流，重试等待:', error.retryAfter);
  } else if (error instanceof ContextLengthExceededError) {
    console.log('上下文长度超限');
  } else if (error instanceof InsufficientQuotaError) {
    console.log('配额不足');
  } else if (error instanceof ValidationError) {
    console.log('验证错误:', error.message);
  } else if (error instanceof ServerError) {
    console.log('服务器错误:', error.code);
  } else if (error instanceof NetworkError) {
    console.log('网络错误:', error.message);
  } else if (error instanceof TimeoutError) {
    console.log('请求超时');
  }
}
```

## 🔧 拦截器

```typescript
// 请求拦截器
sdk.addRequestInterceptor((config) => {
  console.log('请求:', config.method, config.url);
  return config;
});

// 响应拦截器
sdk.addResponseInterceptor((response, config) => {
  console.log('响应:', config.url, response);
  return response;
});

// 错误拦截器
sdk.addErrorInterceptor((error, config) => {
  console.error('错误:', config.url, error.message);
});
```

## 📦 客户端方法

| 方法 | 描述 |
|------|------|
| `setAccessToken(token)` | 设置访问令牌 |
| `setAuthToken(token)` | 设置认证令牌（登录后） |
| `setApiKey(key)` | 设置API密钥 |
| `setTokens(tokens)` | 批量设置Token |
| `clearAuthToken()` | 清除Token（登出） |
| `isAuthenticated()` | 检查是否已认证 |
| `hasAccessToken()` | 检查是否有访问令牌 |
| `hasAuthToken()` | 检查是否有认证令牌 |
| `getAuthMode()` | 获取当前认证模式 |
| `setAuthMode(mode)` | 设置认证模式 |
| `clearCache()` | 清除缓存 |

## 🌐 浏览器支持

- Chrome >= 80
- Firefox >= 75
- Safari >= 14
- Edge >= 80

## 📦 Node.js支持

- Node.js >= 18.0.0

## 📄 许可证

MIT
