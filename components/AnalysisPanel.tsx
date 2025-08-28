"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, 
  Star, 
  TrendingUp, 
  Calendar,
  MapPin,
  ThumbsUp,
  Lightbulb,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface AnalysisResult {
  analysis: string;
  structured?: {
    score?: number;
    style?: string;
    occasions?: string[];
    season?: string;
    pros?: string[];
    suggestions?: string[];
  };
}

interface AnalysisPanelProps {
  tryOnImage?: string;
  onAnalyze?: (image: string) => Promise<AnalysisResult>;
  autoAnalyze?: boolean;
}

export function AnalysisPanel({ 
  tryOnImage, 
  onAnalyze,
  autoAnalyze = false 
}: AnalysisPanelProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto analyze when image changes
  useEffect(() => {
    if (autoAnalyze && tryOnImage && onAnalyze) {
      handleAnalyze();
    }
  }, [tryOnImage, autoAnalyze]);

  const handleAnalyze = async () => {
    if (!tryOnImage || !onAnalyze) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await onAnalyze(tryOnImage);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析失败");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStars = (score: number) => {
    const fullStars = Math.floor(score / 2);
    const hasHalfStar = score % 2 >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {Array(emptyStars).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-2 text-sm text-gray-600">({score}/10)</span>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader 
        className="cursor-pointer p-4 md:p-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            AI搭配分析
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />
            ) : (
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-4">
          {/* Analysis trigger button */}
          {!autoAnalyze && tryOnImage && !analysisResult && (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !onAnalyze}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  分析搭配效果
                </>
              )}
            </Button>
          )}

          {/* Loading state */}
          {isAnalyzing && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
              <p className="text-sm text-gray-500">AI正在分析您的搭配...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleAnalyze}
              >
                重试
              </Button>
            </div>
          )}

          {/* Analysis results */}
          {analysisResult && !isAnalyzing && (
            <div className="space-y-4">
              {/* Score */}
              {analysisResult.structured?.score && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">搭配评分</span>
                    {renderStars(analysisResult.structured.score)}
                  </div>
                </div>
              )}

              {/* Style */}
              {analysisResult.structured?.style && (
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">风格定位</p>
                    <p className="text-sm text-gray-600">
                      {analysisResult.structured.style}
                    </p>
                  </div>
                </div>
              )}

              {/* Occasions */}
              {analysisResult.structured?.occasions && analysisResult.structured.occasions.length > 0 && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">适合场合</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.structured.occasions.map((occasion, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                        >
                          {occasion}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Season */}
              {analysisResult.structured?.season && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">适合季节</p>
                    <p className="text-sm text-gray-600">
                      {analysisResult.structured.season}
                    </p>
                  </div>
                </div>
              )}

              {/* Pros */}
              {analysisResult.structured?.pros && analysisResult.structured.pros.length > 0 && (
                <div className="flex items-start gap-3">
                  <ThumbsUp className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">搭配亮点</p>
                    <ul className="space-y-1">
                      {analysisResult.structured.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {analysisResult.structured?.suggestions && analysisResult.structured.suggestions.length > 0 && (
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">改进建议</p>
                    <ul className="space-y-2">
                      {analysisResult.structured.suggestions.map((suggestion, index) => (
                        <li 
                          key={index} 
                          className="text-sm text-gray-600 bg-yellow-50 rounded-lg p-2 border-l-2 border-yellow-400"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Full analysis text (collapsed by default) */}
              {analysisResult.analysis && (
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    查看完整分析
                  </summary>
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 prose prose-sm max-w-none">
                      <ReactMarkdown>
                        {analysisResult.analysis}
                      </ReactMarkdown>
                    </div>
                  </div>
                </details>
              )}

              {/* Re-analyze button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重新分析
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!tryOnImage && !analysisResult && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">生成试衣效果后可进行AI分析</p>
              <p className="text-xs text-gray-400 mt-1">
                AI将为您提供专业的搭配建议
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}