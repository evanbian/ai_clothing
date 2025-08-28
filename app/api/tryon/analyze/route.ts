import { NextRequest, NextResponse } from "next/server";
import { openRouterClient, getAnalysisModel } from "@/lib/openrouter";
import { buildAnalysisPrompt } from "@/lib/prompts";
import { getSelectedAnalysisModel } from "@/lib/model-config";
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
      tryOnImage,
      occasion,
      season,
      style
    } = body;

    // Validate required fields
    if (!tryOnImage) {
      return NextResponse.json(
        { success: false, error: "Try-on image is required for analysis" },
        { status: 400 }
      );
    }

    // Safety validation for analysis context
    const safetyCheck = performSafetyCheck({
      customPrompt: `${occasion || ''} ${season || ''} ${style || ''}`
    });

    if (!safetyCheck.isSafe) {
      console.warn('Safety violation in analysis:', safetyCheck);
      return NextResponse.json(
        { 
          success: false, 
          error: "分析请求包含不适当内容",
          message: safetyCheck.message
        },
        { status: 400 }
      );
    }

    // Build the analysis prompt with safety considerations
    const prompt = buildAnalysisPrompt({ occasion, season, style });

    try {
      // Get selected model configuration
      const modelConfig = getSelectedAnalysisModel();
      const modelId = getAnalysisModel();
      
      console.log(`Analyzing try-on result with ${modelConfig.name} (${modelId})...`);
      
      // Call OpenRouter API for analysis
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
                  url: tryOnImage
                }
              }
            ]
          }
        ],
        max_tokens: modelConfig.maxTokens || 2048,
        temperature: modelConfig.temperature || 0.5
      });

      const response = completion.choices[0].message;
      let analysisResult = "";

      if (response.content) {
        if (typeof response.content === 'string') {
          analysisResult = response.content;
        } else if (Array.isArray(response.content)) {
          // Extract text from content parts
          for (const part of response.content) {
            if (part.type === 'text') {
              analysisResult += part.text;
            }
          }
        }
      }

      // Parse the analysis result to extract structured data
      const structuredAnalysis = parseAnalysisResult(analysisResult);

      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        structured: structuredAnalysis
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
          error: "Failed to analyze try-on result", 
          details: apiError.message 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in try-on analysis:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process analysis request",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Helper function to parse analysis result into structured data
function parseAnalysisResult(text: string): {
  score?: number;
  style?: string;
  occasions?: string[];
  season?: string;
  pros?: string[];
  suggestions?: string[];
} {
  const result: any = {};
  
  try {
    // Extract score (looking for patterns like "8/10", "8分", "评分：8")
    const scoreMatch = text.match(/(\d+)\s*[\/分](?:\s*10)?/);
    if (scoreMatch) {
      result.score = parseInt(scoreMatch[1]);
    }
    
    // Extract style (looking for style keywords)
    const stylePatterns = ['休闲', '商务', '运动', '时尚', '优雅', '街头', '正式', '潮流'];
    for (const style of stylePatterns) {
      if (text.includes(style)) {
        result.style = style;
        break;
      }
    }
    
    // Extract occasions
    const occasionSection = text.match(/适合场合[：:](.*?)(?:\n|$)/s);
    if (occasionSection) {
      const occasions = occasionSection[1].match(/[^，,、。\n]+/g);
      if (occasions) {
        result.occasions = occasions.map(o => o.trim()).filter(o => o.length > 0);
      }
    }
    
    // Extract season
    const seasonPatterns = ['春', '夏', '秋', '冬', '四季'];
    for (const season of seasonPatterns) {
      if (text.includes(season)) {
        result.season = season;
        break;
      }
    }
    
    // Extract pros (advantages)
    const prosSection = text.match(/优点[：:](.+?)(?:改进|建议|缺点|\n\n|$)/s);
    if (prosSection) {
      const pros = prosSection[1].split(/[，,。\n]/).filter(p => p.trim().length > 2);
      result.pros = pros.map(p => p.trim());
    }
    
    // Extract suggestions
    const suggestionsSection = text.match(/(?:改进|建议)[：:](.+?)(?:\n\n|$)/s);
    if (suggestionsSection) {
      const suggestions = suggestionsSection[1].split(/[，,。\n]/).filter(s => s.trim().length > 2);
      result.suggestions = suggestions.map(s => s.trim());
    }
    
  } catch (e) {
    console.error('Error parsing analysis result:', e);
  }
  
  return result;
}