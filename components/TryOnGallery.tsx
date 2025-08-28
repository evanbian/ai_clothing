"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Download, 
  Maximize2, 
  Share2, 
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Grid,
  Image as ImageIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface TryOnResult {
  id: string;
  image: string;
  background?: string;
  pose?: string;
  mood?: string;
  timestamp: number;
  description?: string;
}

interface TryOnGalleryProps {
  results: TryOnResult[];
  onAnalyze?: (image: string) => void;
  onRegenerate?: (settings: any) => void;
  isLoading?: boolean;
}

export function TryOnGallery({ 
  results, 
  onAnalyze, 
  onRegenerate,
  isLoading 
}: TryOnGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<TryOnResult | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDownload = (result: TryOnResult) => {
    const link = document.createElement("a");
    link.href = result.image;
    link.download = `tryon-${result.id}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (result: TryOnResult) => {
    if (navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(result.image);
        const blob = await response.blob();
        const file = new File([blob], `tryon-${result.id}.png`, { type: "image/png" });
        
        await navigator.share({
          title: "AI试衣效果",
          text: "查看我的AI试衣效果！",
          files: [file],
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy image to clipboard or show share options
      alert("您的浏览器不支持分享功能");
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
  };

  if (results.length === 0 && !isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-8 md:py-12">
          <ImageIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mb-3 md:mb-4" />
          <p className="text-sm md:text-base text-gray-500">还没有生成试衣效果</p>
          <p className="text-xs md:text-sm text-gray-400 mt-2">上传照片和衣服，选择场景后生成</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-8 md:py-12">
          <div className="relative w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm md:text-base text-gray-500">正在生成试衣效果...</p>
          <p className="text-xs md:text-sm text-gray-400 mt-2">请稍候，AI正在处理中</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="p-4 md:p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
              试衣效果
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "carousel" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("carousel")}
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          {viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className="relative group cursor-pointer rounded-lg overflow-hidden border"
                  onClick={() => setSelectedImage(result)}
                >
                  <img
                    src={result.image}
                    alt={`Try-on result ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(result);
                          }}
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(result);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {onAnalyze && (
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAnalyze(result.image);
                            }}
                          >
                            <RotateCw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Info Badge */}
                  {result.background && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-white/90 backdrop-blur rounded px-2 py-1">
                        <p className="text-xs truncate">
                          {result.background} · {result.pose}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Carousel View */
            <div className="relative">
              <div className="aspect-[3/4] max-h-[600px] mx-auto">
                <img
                  src={results[currentIndex].image}
                  alt={`Try-on result ${currentIndex + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              
              {/* Navigation */}
              {results.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleNext}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {/* Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {results.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(results[currentIndex])}
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(results[currentIndex])}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
                {onAnalyze && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAnalyze(results[currentIndex].image)}
                  >
                    分析搭配
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full screen dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>试衣效果预览</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div>
              <img
                src={selectedImage.image}
                alt="Full size try-on"
                className="w-full h-auto rounded-lg"
              />
              <div className="flex justify-between items-center mt-4">
                <div>
                  {selectedImage.background && (
                    <p className="text-sm text-gray-500">
                      场景: {selectedImage.background} · 角度: {selectedImage.pose}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedImage)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(selectedImage)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    分享
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}