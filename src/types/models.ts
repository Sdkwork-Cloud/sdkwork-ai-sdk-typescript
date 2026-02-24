

export interface Model {
  id: string;
  object: 'model';
  created: number;
  ownedBy: string;
  permission?: Array<{
    id: string;
    object: string;
    created: number;
    allowCreateEngine: boolean;
    allowSampling: boolean;
    allowLogprobs: boolean;
    allowSearchIndices: boolean;
    allowView: boolean;
    allowFineTuning: boolean;
    organization: string;
    group: string | null;
    isBlocking: boolean;
  }>;
  root?: string;
  parent?: string | null;
}

export interface ModelListResponse {
  object: 'list';
  data: Model[];
}

export interface ModelsModule {
  list(): Promise<ModelListResponse>;
  get(modelId: string): Promise<Model>;
  delete(modelId: string): Promise<void>;
}
