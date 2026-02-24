export interface ModerationRequest {
  model?: string;
  input: string | string[];
}

export interface ModerationCategory {
  hate: boolean;
  hateThreatening: boolean;
  harassment: boolean;
  harassmentThreatening: boolean;
  selfHarm: boolean;
  selfHarmIntent: boolean;
  selfHarmInstructions: boolean;
  sexual: boolean;
  sexualMinors: boolean;
  violence: boolean;
  violenceGraphic: boolean;
}

export interface ModerationCategoryScores {
  hate: number;
  hateThreatening: number;
  harassment: number;
  harassmentThreatening: number;
  selfHarm: number;
  selfHarmIntent: number;
  selfHarmInstructions: number;
  sexual: number;
  sexualMinors: number;
  violence: number;
  violenceGraphic: number;
}

export interface ModerationResult {
  flagged: boolean;
  categories: ModerationCategory;
  categoryScores: ModerationCategoryScores;
  categoryAppliedInputTypes?: Record<keyof ModerationCategory, string>;
}

export interface ModerationResponse {
  id: string;
  model: string;
  results: ModerationResult[];
}

export interface ModerationsModule {
  create(request: ModerationRequest): Promise<ModerationResponse>;
}
