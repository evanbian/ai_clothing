import { NextRequest, NextResponse } from "next/server";
import { openRouterClient, getTryOnModel } from "@/lib/openrouter";
import { buildTryOnPrompt } from "@/lib/prompts";
import { getSelectedTryOnModel } from "@/lib/model-config";
import { performSafetyCheck } from "@/lib/safety-validator";

export async function POST(req: NextRequest) {
  try {
    // Check API key
    if (!process.env.OPEN_ROUTER_API_KEY) {
      return NextResponse.json(
        { success: false, error: "OPEN_ROUTER_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      userPhoto,
      clothingImage,
      background,
      pose,
      mood,
      customPrompt,
      fitStyle
    } = body;

    // Validate required fields
    if (!userPhoto || !clothingImage) {
      return NextResponse.json(
        { success: false, error: "User photo and clothing image are required" },
        { status: 400 }
      );
    }

    // Safety validation
    const safetyCheck = performSafetyCheck({
      userPhoto,
      clothingImage,
      customPrompt,
      background,
      pose,
      mood
    });

    if (!safetyCheck.isSafe) {
      console.warn('Safety violation detected:', safetyCheck);
      return NextResponse.json(
        { 
          success: false, 
          error: safetyCheck.message || "请求包含不适当内容",
          violations: safetyCheck.violations,
          suggestions: safetyCheck.suggestions
        },
        { status: 400 }
      );
    }

    // Build the prompt with safety instructions
    const prompt = buildTryOnPrompt(background, pose, mood, customPrompt, fitStyle);

    try {
      // Get selected model configuration
      const modelConfig = getSelectedTryOnModel();
      const modelId = getTryOnModel();
      
      console.log(`Generating try-on with ${modelConfig.name} (${modelId})...`);
      
      // Call OpenRouter API
      const completion = await openRouterClient.chat.completions.create({
        model: modelId,
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
        max_tokens: modelConfig.maxTokens || 4096,
        temperature: modelConfig.temperature || 0.7
      });

      const response = completion.choices[0].message as any; // Cast to any to handle OpenRouter's extended format
      
      // Log the actual response for debugging
      console.log('API Response:', JSON.stringify(response, null, 2));
      console.log('Full completion object:', JSON.stringify(completion, null, 2));
      
      // Extract image from response
      let generatedImage = null;
      let description = null;

      // Check for content field (text description)
      if (response.content) {
        if (typeof response.content === 'string') {
          description = response.content;
          console.log('Response has text content:', description.substring(0, 200) + '...');
        } else if (Array.isArray(response.content)) {
          // Handle array of content parts
          console.log('Response content has', response.content.length, 'parts');
          for (const part of response.content) {
            console.log('Content part type:', part.type);
            if (part.type === 'text') {
              description = part.text;
            } else if (part.type === 'image_url') {
              generatedImage = part.image_url?.url;
              console.log('Found image URL in content');
            }
          }
        }
      }

      // Check for images field (OpenRouter specific format)
      if (!generatedImage && response.images && Array.isArray(response.images)) {
        console.log('Found images array with', response.images.length, 'images');
        for (const image of response.images) {
          if (image.type === 'image_url' && image.image_url?.url) {
            generatedImage = image.image_url.url;
            console.log('Found image URL in images array');
            break;
          }
        }
      }

      // Note: Gemini 2.5 Flash Image Preview should return an image
      // The actual response format may vary, so we need to handle it properly
      // This is a simplified version - you may need to adjust based on actual API response

      if (!generatedImage) {
        console.log('No image found in response');
        console.log('Description:', description);
        
        // Check if the response contains base64 image data in the text
        if (description && description.includes('data:image')) {
          const base64Match = description.match(/data:image\/[^;]+;base64,[^"]*/g);
          if (base64Match && base64Match.length > 0) {
            console.log('Found base64 image in description');
            generatedImage = base64Match[0];
          }
        }
        
        if (!generatedImage) {
          // If still no image is found
          return NextResponse.json({
            success: false,
            error: "API未返回图像，请重试。模型可能需要更具体的指令。",
            description: description || "请重新尝试生成"
          });
        }
      }

      return NextResponse.json({
        success: true,
        image: generatedImage,
        description: description || "试衣效果已生成"
      });

    } catch (apiError: any) {
      console.error('OpenRouter API error:', apiError);
      
      // Handle specific API errors
      if (apiError.response?.status === 401) {
        return NextResponse.json(
          { success: false, error: "Invalid API key" },
          { status: 401 }
        );
      }
      
      if (apiError.response?.status === 429) {
        return NextResponse.json(
          { success: false, error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to generate try-on", 
          details: apiError.message 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in try-on generation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}