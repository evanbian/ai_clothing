"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { PRESET_SCENES } from "@/lib/prompts";
import { validateCustomPrompt } from "@/lib/safety-validator";
import { 
  MapPin, 
  Camera, 
  Sparkles, 
  Palette,
  RefreshCw,
  Wand2,
  AlertCircle
} from "lucide-react";

interface ScenePresetsProps {
  onPresetChange: (preset: {
    background?: string;
    pose?: string;
    mood?: string;
    fitStyle?: "slim" | "regular" | "loose";
    customPrompt?: string;
  }) => void;
  onGenerateClick: () => void;
  isGenerating: boolean;
}

export function ScenePresets({ 
  onPresetChange, 
  onGenerateClick,
  isGenerating 
}: ScenePresetsProps) {
  const [selectedBackground, setSelectedBackground] = useState<string>("");
  const [selectedPose, setSelectedPose] = useState<string>("front");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedFitStyle, setSelectedFitStyle] = useState<"slim" | "regular" | "loose">("regular");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"quick" | "custom">("quick");
  const [promptError, setPromptError] = useState<string>("");

  const handleBackgroundSelect = (backgroundId: string) => {
    setSelectedBackground(backgroundId);
    updatePreset({ background: backgroundId });
  };

  const handlePoseSelect = (poseId: string) => {
    setSelectedPose(poseId);
    updatePreset({ pose: poseId });
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    updatePreset({ mood: moodId });
  };

  const handleFitStyleSelect = (fitStyle: "slim" | "regular" | "loose") => {
    setSelectedFitStyle(fitStyle);
    updatePreset({ fitStyle });
  };

  const handleCustomPromptChange = (value: string) => {
    setCustomPrompt(value);
    
    // Validate prompt for safety
    const safetyCheck = validateCustomPrompt(value);
    if (!safetyCheck.isSafe) {
      setPromptError(safetyCheck.message || "内容包含不当词汇");
    } else {
      setPromptError("");
    }
    
    // Only update preset if safe
    if (safetyCheck.isSafe) {
      updatePreset({ customPrompt: value });
    }
  };

  const updatePreset = (updates: Partial<{
    background: string;
    pose: string;
    mood: string;
    fitStyle: "slim" | "regular" | "loose";
    customPrompt: string;
  }>) => {
    onPresetChange({
      background: selectedBackground,
      pose: selectedPose,
      mood: selectedMood,
      fitStyle: selectedFitStyle,
      customPrompt: customPrompt,
      ...updates
    });
  };

  // Quick generate buttons for common combinations
  const quickGenerateOptions = [
    { 
      label: "日常休闲", 
      background: "cafe", 
      pose: "front", 
      mood: "relaxed",
      icon: "☕"
    },
    { 
      label: "商务正装", 
      background: "office", 
      pose: "front", 
      mood: "formal",
      icon: "💼"
    },
    { 
      label: "度假风格", 
      background: "beach", 
      pose: "casual", 
      mood: "relaxed",
      icon: "🏖️"
    },
    { 
      label: "街头潮流", 
      background: "street", 
      pose: "side45", 
      mood: "trendy",
      icon: "🛹"
    },
  ];

  const handleQuickGenerate = (option: typeof quickGenerateOptions[0]) => {
    setSelectedBackground(option.background);
    setSelectedPose(option.pose);
    setSelectedMood(option.mood);
    updatePreset({
      background: option.background,
      pose: option.pose,
      mood: option.mood,
    });
    onGenerateClick();
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Wand2 className="w-4 h-4 md:w-5 md:h-5" />
          场景设置
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-4 md:space-y-6">
        {/* Tab switcher */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "quick" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("quick")}
            className="flex-1"
          >
            快速生成
          </Button>
          <Button
            variant={activeTab === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("custom")}
            className="flex-1"
          >
            自定义设置
          </Button>
        </div>

        {activeTab === "quick" ? (
          /* Quick generate options */
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {quickGenerateOptions.map((option) => (
              <Button
                key={option.label}
                variant="outline"
                className="h-auto py-3 md:py-4 flex flex-col gap-1 md:gap-2"
                onClick={() => handleQuickGenerate(option)}
                disabled={isGenerating}
              >
                <span className="text-xl md:text-2xl">{option.icon}</span>
                <span className="text-xs md:text-sm">{option.label}</span>
              </Button>
            ))}
          </div>
        ) : (
          /* Custom settings */
          <div className="space-y-4">
            {/* Background Selection */}
            <div>
              <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                背景场景
              </label>
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                {PRESET_SCENES.backgrounds.map((bg) => (
                  <Button
                    key={bg.id}
                    variant={selectedBackground === bg.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleBackgroundSelect(bg.id)}
                  >
                    {bg.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pose Selection */}
            <div>
              <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                <Camera className="w-3 h-3 md:w-4 md:h-4" />
                拍摄角度
              </label>
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                {PRESET_SCENES.poses.map((pose) => (
                  <Button
                    key={pose.id}
                    variant={selectedPose === pose.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePoseSelect(pose.id)}
                  >
                    {pose.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mood Selection */}
            <div>
              <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                整体氛围
              </label>
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                {PRESET_SCENES.moods.map((mood) => (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMoodSelect(mood.id)}
                  >
                    {mood.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Fit Style Selection */}
            <div>
              <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                <Palette className="w-3 h-3 md:w-4 md:h-4" />
                版型选择
              </label>
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                <Button
                  variant={selectedFitStyle === "slim" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFitStyleSelect("slim")}
                >
                  修身版
                </Button>
                <Button
                  variant={selectedFitStyle === "regular" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFitStyleSelect("regular")}
                >
                  标准版
                </Button>
                <Button
                  variant={selectedFitStyle === "loose" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFitStyleSelect("loose")}
                >
                  宽松版
                </Button>
              </div>
            </div>

            {/* Custom Prompt */}
            <div>
              <label className="text-xs md:text-sm font-medium mb-2 block">
                自定义要求（可选）
              </label>
              <Textarea
                placeholder="例如：阳光明媚的下午，人物表情自然微笑..."
                value={customPrompt}
                onChange={(e) => handleCustomPromptChange(e.target.value)}
                rows={3}
                className={promptError ? "border-red-500" : ""}
              />
              {promptError && (
                <div className="mt-2 flex items-start gap-1">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-500">{promptError}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate Button */}
        {activeTab === "custom" && (
          <Button
            onClick={onGenerateClick}
            disabled={isGenerating || !!promptError}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                生成试衣效果
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}