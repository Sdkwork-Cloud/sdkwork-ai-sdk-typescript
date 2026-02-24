export type AudioVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
export type AudioResponseFormat = 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm';
export type AudioTranscriptFormat = 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';

export interface SpeechRequest {
  model: string;
  input: string;
  voice: AudioVoice;
  responseFormat?: AudioResponseFormat;
  speed?: number;
}

export interface TranscriptionRequest {
  file: File | Blob;
  model: string;
  language?: string;
  prompt?: string;
  responseFormat?: AudioTranscriptFormat;
  temperature?: number;
  timestampGranularities?: Array<'word' | 'segment'>;
}

export interface TranscriptionResponse {
  text: string;
  language?: string;
  duration?: number;
  words?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
  segments?: Array<{
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avgLogprob: number;
    compressionRatio: number;
    noSpeechProb: number;
  }>;
}

export interface TranslationRequest {
  file: File | Blob;
  model: string;
  prompt?: string;
  responseFormat?: AudioTranscriptFormat;
  temperature?: number;
}

export interface TranslationResponse {
  text: string;
  language?: string;
  duration?: number;
}

export interface AudioModule {
  createSpeech(request: SpeechRequest): Promise<Blob>;
  createTranscription(request: TranscriptionRequest): Promise<TranscriptionResponse>;
  createTranslation(request: TranslationRequest): Promise<TranslationResponse>;
}
