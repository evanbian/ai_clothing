"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Upload, User, Shirt, X, Link } from "lucide-react";
import { Input } from "./ui/input";
import { fileToDataUrl, validateImageDimensions, compressImage } from "@/lib/image-utils";

interface TryOnUploaderProps {
  onImagesReady: (userPhoto: string, clothingImage: string) => void;
  onError?: (error: string) => void;
}

export function TryOnUploader({ onImagesReady, onError }: TryOnUploaderProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [clothingUrl, setClothingUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");

  // Handle user photo upload
  const onUserPhotoDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setLoading(true);
      try {
        const dataUrl = await fileToDataUrl(file);
        
        // Validate dimensions
        const validation = await validateImageDimensions(dataUrl, 400, 400, 4096, 4096);
        if (!validation.valid) {
          onError?.(validation.error || "Invalid image dimensions");
          setLoading(false);
          return;
        }

        // Compress if needed
        const compressed = await compressImage(dataUrl, 2);
        setUserPhoto(compressed);
        
        // Call onImagesReady to update parent state
        if (clothingImage) {
          onImagesReady(compressed, clothingImage);
        }
      } catch (error) {
        onError?.("Failed to process user photo");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [clothingImage, onImagesReady, onError]
  );

  // Handle clothing image upload
  const onClothingImageDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setLoading(true);
      try {
        const dataUrl = await fileToDataUrl(file);
        
        // Validate dimensions
        const validation = await validateImageDimensions(dataUrl, 200, 200, 4096, 4096);
        if (!validation.valid) {
          onError?.(validation.error || "Invalid image dimensions");
          setLoading(false);
          return;
        }

        // Compress if needed
        const compressed = await compressImage(dataUrl, 2);
        setClothingImage(compressed);
        
        // Call onImagesReady to update parent state
        if (userPhoto) {
          onImagesReady(userPhoto, compressed);
        }
      } catch (error) {
        onError?.("Failed to process clothing image");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [userPhoto, onImagesReady, onError]
  );

  // Handle clothing URL fetch
  const handleFetchUrl = async () => {
    if (!clothingUrl) {
      onError?.("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tryon/fetch-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: clothingUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch image");
      }

      const data = await response.json();
      setClothingImage(data.image);
      
      // Call onImagesReady to update parent state
      if (userPhoto) {
        onImagesReady(userPhoto, data.image);
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Failed to fetch image from URL");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // User photo dropzone
  const {
    getRootProps: getUserRootProps,
    getInputProps: getUserInputProps,
    isDragActive: isUserDragActive,
  } = useDropzone({
    onDrop: onUserPhotoDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    disabled: loading,
  });

  // Clothing image dropzone
  const {
    getRootProps: getClothingRootProps,
    getInputProps: getClothingInputProps,
    isDragActive: isClothingDragActive,
  } = useDropzone({
    onDrop: onClothingImageDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    disabled: loading || inputMode === "url",
  });

  const clearUserPhoto = () => {
    setUserPhoto(null);
  };

  const clearClothingImage = () => {
    setClothingImage(null);
    setClothingUrl("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* User Photo Upload */}
      <Card className="w-full">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <User className="w-4 h-4 md:w-5 md:h-5" />
            您的全身照
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          {userPhoto ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={userPhoto}
                alt="User photo"
                className="w-full h-48 md:h-64 object-contain rounded-lg border"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 md:h-10 md:w-10"
                onClick={clearUserPhoto}
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          ) : (
            <div
              {...getUserRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer
                transition-colors h-48 md:h-64 flex flex-col items-center justify-center
                ${isUserDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
                ${loading ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}
              `}
            >
              <input {...getUserInputProps()} />
              <Upload className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 text-gray-400" />
              <p className="text-xs md:text-sm text-gray-600">
                {isUserDragActive
                  ? "释放以上传图片"
                  : "点击上传您的全身照"}
              </p>
              <p className="text-xs text-gray-400 mt-2 hidden md:block">
                建议：正面全身照，背景简洁
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clothing Image Upload */}
      <Card className="w-full">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Shirt className="w-4 h-4 md:w-5 md:h-5" />
            想试穿的衣服
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          {/* Input mode toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={inputMode === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputMode("upload")}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              上传图片
            </Button>
            <Button
              variant={inputMode === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputMode("url")}
              className="flex-1"
            >
              <Link className="w-4 h-4 mr-2" />
              输入网址
            </Button>
          </div>

          {clothingImage ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={clothingImage}
                alt="Clothing"
                className="w-full h-48 md:h-64 object-contain rounded-lg border"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 md:h-10 md:w-10"
                onClick={clearClothingImage}
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          ) : (
            <>
              {inputMode === "upload" ? (
                <div
                  {...getClothingRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer
                    transition-colors h-40 md:h-56 flex flex-col items-center justify-center
                    ${isClothingDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
                    ${loading ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}
                  `}
                >
                  <input {...getClothingInputProps()} />
                  <Upload className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 text-gray-400" />
                  <p className="text-xs md:text-sm text-gray-600">
                    {isClothingDragActive
                      ? "释放以上传图片"
                      : "点击上传衣服图片"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 hidden md:block">
                    建议：纯色背景的服装图片
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    type="url"
                    placeholder="输入衣服图片的网址（如淘宝、京东商品图）"
                    value={clothingUrl}
                    onChange={(e) => setClothingUrl(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    onClick={handleFetchUrl}
                    disabled={loading || !clothingUrl}
                    className="w-full"
                  >
                    {loading ? "获取中..." : "获取图片"}
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    支持主流电商平台的商品图片链接
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}