import OpenAI from 'openai';
import { getSelectedTryOnModel, getSelectedAnalysisModel } from './model-config';

// Initialize OpenRouter client
export const openRouterClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "AI Try-On Platform"
  }
});

// Get dynamically selected models
export const getTryOnModel = () => getSelectedTryOnModel().baseModel;
export const getAnalysisModel = () => getSelectedAnalysisModel().baseModel;

// Legacy exports for backward compatibility (will be replaced by dynamic selection)
export const GEMINI_25_FLASH_MODEL = "google/gemini-2.5-flash-image-preview";
export const GEMINI_20_FLASH_MODEL = "google/gemini-2.0-flash-001";

// Helper function to call Gemini 2.5 Flash for try-on generation
export async function generateTryOn(
  userPhoto: string,
  clothingImage: string,
  prompt: string
) {
  try {
    const completion = await openRouterClient.chat.completions.create({
      model: GEMINI_25_FLASH_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: userPhoto
              }
            },
            {
              type: "image_url",
              image_url: {
                url: clothingImage
              }
            }
          ]
        }
      ],
      max_tokens: 4096,
      temperature: 0.7
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error generating try-on:', error);
    throw error;
  }
}

// Helper function to analyze try-on result with Gemini 2.0 Flash
export async function analyzeTryOn(
  tryOnImage: string,
  additionalContext?: string
) {
  try {
    const completion = await openRouterClient.chat.completions.create({
      model: GEMINI_20_FLASH_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `请分析这张AI试衣效果图，从以下几个维度进行评价：
              1. 搭配协调度（颜色、风格是否协调）
              2. 适合场合（这套搭配适合什么场合）
              3. 整体效果评分（1-10分）
              4. 改进建议（如何让搭配更好）
              ${additionalContext ? `额外信息：${additionalContext}` : ''}`
            },
            {
              type: "image_url",
              image_url: {
                url: tryOnImage
              }
            }
          ]
        }
      ],
      max_tokens: 2048,
      temperature: 0.5
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing try-on:', error);
    throw error;
  }
}