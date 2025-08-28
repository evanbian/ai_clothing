// Model configuration for switching between different Gemini models

export type ModelConfig = {
  id: string;
  name: string;
  description: string;
  baseModel: string;
  isImageGeneration: boolean;
  isFree: boolean;
  maxTokens?: number;
  temperature?: number;
};

// Available models for try-on generation
export const TRYON_MODELS: ModelConfig[] = [
  {
    id: 'gemini-25-flash-free',
    name: 'Gemini 2.5 Flash (Free)',
    description: 'Free version of Gemini 2.5 Flash with image preview - good for testing',
    baseModel: 'google/gemini-2.5-flash-image-preview:free',
    isImageGeneration: true,
    isFree: true,
    maxTokens: 4096,
    temperature: 0.7
  },
  {
    id: 'gemini-25-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Full version of Gemini 2.5 Flash with image preview - better quality',
    baseModel: 'google/gemini-2.5-flash-image-preview',
    isImageGeneration: true,
    isFree: false,
    maxTokens: 8192,
    temperature: 0.7
  },
  {
    id: 'gemini-20-flash-exp',
    name: 'Gemini 2.0 Flash Experimental',
    description: 'Experimental version with enhanced capabilities',
    baseModel: 'google/gemini-2.0-flash-exp:free',
    isImageGeneration: true,
    isFree: true,
    maxTokens: 8192,
    temperature: 0.7
  }
];

// Available models for analysis
export const ANALYSIS_MODELS: ModelConfig[] = [
  {
    id: 'gemini-20-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Fast and efficient model for analysis',
    baseModel: 'google/gemini-2.0-flash-001',
    isImageGeneration: false,
    isFree: false,
    maxTokens: 2048,
    temperature: 0.5
  },
  {
    id: 'gemini-15-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Stable version for analysis',
    baseModel: 'google/gemini-flash-1.5',
    isImageGeneration: false,
    isFree: false,
    maxTokens: 2048,
    temperature: 0.5
  },
  {
    id: 'gemini-20-flash-thinking',
    name: 'Gemini 2.0 Flash Thinking',
    description: 'Advanced reasoning model for complex analysis',
    baseModel: 'google/gemini-2.0-flash-thinking-exp:free',
    isImageGeneration: false,
    isFree: true,
    maxTokens: 2048,
    temperature: 0.5
  }
];

// Get the selected model from environment variable or default
export function getSelectedTryOnModel(): ModelConfig {
  const selectedId = process.env.NEXT_PUBLIC_TRYON_MODEL_ID || 'gemini-25-flash-free';
  return TRYON_MODELS.find(m => m.id === selectedId) || TRYON_MODELS[0];
}

export function getSelectedAnalysisModel(): ModelConfig {
  const selectedId = process.env.NEXT_PUBLIC_ANALYSIS_MODEL_ID || 'gemini-20-flash';
  return ANALYSIS_MODELS.find(m => m.id === selectedId) || ANALYSIS_MODELS[0];
}

// Helper to get model by base model string
export function getModelByBaseModel(baseModel: string): ModelConfig | undefined {
  const allModels = [...TRYON_MODELS, ...ANALYSIS_MODELS];
  return allModels.find(m => m.baseModel === baseModel);
}