"use client";
import { useState } from "react";
import { TryOnUploader } from "@/components/TryOnUploader";
import { ScenePresets } from "@/components/ScenePresets";
import { TryOnGallery } from "@/components/TryOnGallery";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { Shirt, Sparkles, AlertCircle, Shield } from "lucide-react";
import { performSafetyCheck } from "@/lib/safety-validator";

interface TryOnResult {
  id: string;
  image: string;
  background?: string;
  pose?: string;
  mood?: string;
  timestamp: number;
  description?: string;
}

interface PresetOptions {
  background?: string;
  pose?: string;
  mood?: string;
  fitStyle?: "slim" | "regular" | "loose";
  customPrompt?: string;
}

export default function Home() {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [results, setResults] = useState<TryOnResult[]>([]);
  const [currentPreset, setCurrentPreset] = useState<PresetOptions>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysisImage, setCurrentAnalysisImage] = useState<string | null>(null);

  const handleImagesReady = (userImg: string, clothingImg: string) => {
    setUserPhoto(userImg);
    setClothingImage(clothingImg);
    setError(null);
  };

  const handlePresetChange = (preset: PresetOptions) => {
    setCurrentPreset(preset);
  };

  const handleGenerate = async () => {
    if (!userPhoto || !clothingImage) {
      setError("请先上传您的照片和想试穿的衣服");
      return;
    }

    // Frontend safety validation
    const safetyCheck = performSafetyCheck({
      userPhoto,
      clothingImage,
      ...currentPreset,
    });

    if (!safetyCheck.isSafe) {
      setError(safetyCheck.message || "您的请求包含不适当内容，请修改后重试");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/tryon/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPhoto,
          clothingImage,
          ...currentPreset,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "生成失败");
      }

      const data = await response.json();
      
      if (data.image) {
        const newResult: TryOnResult = {
          id: Date.now().toString(),
          image: data.image,
          background: currentPreset.background,
          pose: currentPreset.pose,
          mood: currentPreset.mood,
          timestamp: Date.now(),
          description: data.description,
        };
        
        setResults(prev => [newResult, ...prev]);
        setCurrentAnalysisImage(data.image);
      } else {
        // Handle case where API doesn't return image yet
        setError("当前API暂不支持图像生成，请检查API配置");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
      console.error("Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async (image: string): Promise<{
    analysis: string;
    structuredData?: {
      score?: number;
      style?: string;
      occasions?: string[];
      season?: string;
      pros?: string[];
      suggestions?: string[];
    };
  }> => {
    try {
      const response = await fetch("/api/tryon/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tryOnImage: image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "分析失败");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Analysis error:", err);
      throw err;
    }
  };

  const handleAnalyzeClick = (image: string) => {
    setCurrentAnalysisImage(image);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <Shirt className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">AI智能试衣间</h1>
                <p className="text-xs md:text-sm text-gray-500 hidden md:block">
                  Powered by Gemini 2.5 Flash & 2.0 Flash
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
              <span className="text-xs md:text-sm text-gray-600">AI试衣新体验</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Safety Notice */}
        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900">安全使用提示</h3>
              <p className="text-xs md:text-sm text-blue-700 mt-1">
                本系统仅支持生成健康、得体的服装试穿效果。严禁上传或生成裸露、色情、暴力、违法等不当内容。
                系统会自动检测并拒绝不当请求。
              </p>
            </div>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm md:text-base text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Step 1: Upload Images */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <span className="w-6 h-6 md:w-8 md:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm">
              1
            </span>
            上传图片
          </h2>
          <TryOnUploader
            onImagesReady={handleImagesReady}
            onError={setError}
          />
        </div>

        {/* Step 2: Scene Settings */}
        {userPhoto && clothingImage && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
              <span className="w-6 h-6 md:w-8 md:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm">
                2
              </span>
              场景设置
            </h2>
            <ScenePresets
              onPresetChange={handlePresetChange}
              onGenerateClick={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        )}

        {/* Step 3: Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Gallery - takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            {(results.length > 0 || isGenerating) && (
              <>
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 md:w-8 md:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm">
                    3
                  </span>
                  试衣效果
                </h2>
                <TryOnGallery
                  results={results}
                  onAnalyze={handleAnalyzeClick}
                  isLoading={isGenerating}
                />
              </>
            )}
          </div>

          {/* Analysis Panel - takes 1 column on large screens */}
          {(results.length > 0 || currentAnalysisImage) && (
            <div className="mt-6 lg:mt-0">
              <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                <span className="w-6 h-6 md:w-8 md:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm">
                  4
                </span>
                AI分析
              </h2>
              <AnalysisPanel
                tryOnImage={currentAnalysisImage || undefined}
                onAnalyze={handleAnalyze}
                autoAnalyze={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-8 md:mt-12 py-4 md:py-6 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-3 md:px-4 text-center text-xs md:text-sm text-gray-500">
          <p>AI Try-On Platform - 智能试衣新体验</p>
          <p className="mt-1">使用 OpenRouter + Gemini 2.5 Flash Image Preview + Gemini 2.0 Flash 技术</p>
        </div>
      </footer>
    </main>
  );
}
