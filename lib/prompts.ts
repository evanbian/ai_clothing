// Preset scenes for try-on
export const PRESET_SCENES = {
  backgrounds: [
    { id: 'beach', name: '海边度假', prompt: '背景是阳光明媚的海边，蓝天白云，细软的沙滩' },
    { id: 'office', name: '办公室', prompt: '背景是现代简约的办公室环境，专业商务氛围' },
    { id: 'cafe', name: '咖啡厅', prompt: '背景是温馨舒适的咖啡厅，文艺休闲的氛围' },
    { id: 'street', name: '街头', prompt: '背景是时尚繁华的城市街道，都市潮流感' },
    { id: 'park', name: '公园', prompt: '背景是绿意盎然的公园，自然清新的环境' },
    { id: 'mall', name: '商场', prompt: '背景是高端时尚的购物中心，现代都市风格' }
  ],
  poses: [
    { id: 'front', name: '正面站立', prompt: '正面面向镜头站立，自然放松的姿态' },
    { id: 'side45', name: '侧身45度', prompt: '身体侧向45度角，展现服装侧面轮廓' },
    { id: 'back', name: '背面', prompt: '背对镜头，展示服装背面细节' },
    { id: 'sitting', name: '坐姿', prompt: '自然的坐姿，展现服装在坐着时的效果' },
    { id: 'walking', name: '行走中', prompt: '自然行走的动态姿势，展现服装的动感' },
    { id: 'casual', name: '休闲倚靠', prompt: '休闲地倚靠着，放松自然的状态' }
  ],
  moods: [
    { id: 'relaxed', name: '休闲放松', prompt: '整体氛围轻松休闲，自然随意' },
    { id: 'formal', name: '正式商务', prompt: '专业正式的商务氛围，职业精神' },
    { id: 'energetic', name: '运动活力', prompt: '充满活力和运动感，动感十足' },
    { id: 'elegant', name: '优雅时尚', prompt: '优雅精致的时尚感，高级质感' },
    { id: 'trendy', name: '街头潮流', prompt: '街头潮流风格，年轻时尚' }
  ]
};

import { buildSafetyInstructions } from './safety-validator';

// Build complete try-on prompt
export function buildTryOnPrompt(
  background?: string,
  pose?: string,
  mood?: string,
  customPrompt?: string,
  fitStyle?: 'slim' | 'regular' | 'loose'
): string {
  const parts = [];
  
  // Safety instructions FIRST - this is critical
  parts.push(buildSafetyInstructions());
  parts.push('');
  
  // Core instruction
  parts.push('生成一张图片：将第二张图片中的衣服自然地穿在第一张图片中的人物身上。');
  parts.push('保持人物的面部特征、身材比例和肤色完全不变。');
  parts.push('确保衣服的贴合效果真实自然，包括合理的褶皱、阴影和光影效果。');
  parts.push('生成的图像必须是健康、得体、适合公共展示的内容。');
  parts.push('请生成并返回处理后的图像。');
  
  // Background
  if (background) {
    const bg = PRESET_SCENES.backgrounds.find(b => b.id === background);
    if (bg) {
      parts.push(bg.prompt);
    } else {
      parts.push(`背景设置为${background}`);
    }
  }
  
  // Pose
  if (pose) {
    const p = PRESET_SCENES.poses.find(p => p.id === pose);
    if (p) {
      parts.push(p.prompt);
    } else {
      parts.push(`人物姿势：${pose}`);
    }
  }
  
  // Mood
  if (mood) {
    const m = PRESET_SCENES.moods.find(m => m.id === mood);
    if (m) {
      parts.push(m.prompt);
    } else {
      parts.push(`整体氛围：${mood}`);
    }
  }
  
  // Fit style
  if (fitStyle) {
    const fitMap = {
      'slim': '修身版型，贴合身材曲线',
      'regular': '标准版型，日常舒适穿着',
      'loose': '宽松版型，休闲舒适风格'
    };
    parts.push(fitMap[fitStyle]);
  }
  
  // Custom prompt
  if (customPrompt) {
    parts.push(customPrompt);
  }
  
  // Quality requirements
  parts.push('生成高质量、逼真的试衣效果图像。');
  parts.push('确保光照自然，衣服材质真实，整体效果和谐。');
  parts.push('输出一张完整的图片结果。');
  
  return parts.join('\n');
}

// Build analysis prompt
export function buildAnalysisPrompt(context?: {
  occasion?: string;
  season?: string;
  style?: string;
}): string {
  const parts = [
    '请作为专业的服装搭配顾问，分析这张AI试衣效果图。',
    '注意：只分析适合公共展示的、健康得体的服装搭配。',
    '如果图像包含不当内容，请拒绝分析并说明原因。',
    '',
    '请从以下维度进行详细分析：',
    '',
    '## 搭配评分（1-10分）',
    '给出整体搭配的综合评分，并说明理由。',
    '',
    '## 风格分析',
    '- 整体风格定位（如：休闲、商务、运动、时尚等）',
    '- 颜色搭配是否协调',
    '- 版型是否适合身材',
    '',
    '## 适合场合',
    '说明这套搭配适合什么场合穿着。',
    '',
    '## 季节适配',
    '分析这套搭配适合的季节。',
    '',
    '## 优点',
    '列出这套搭配的亮点和优势。',
    '',
    '## 改进建议',
    '提供1-2个具体的改进建议，让搭配更加完美。'
  ];
  
  if (context) {
    parts.push('');
    parts.push('## 额外考虑因素');
    if (context.occasion) {
      parts.push(`- 穿着场合：${context.occasion}`);
    }
    if (context.season) {
      parts.push(`- 当前季节：${context.season}`);
    }
    if (context.style) {
      parts.push(`- 个人风格偏好：${context.style}`);
    }
  }
  
  parts.push('');
  parts.push('请用友好、专业的语气进行分析，给出实用的建议。');
  
  return parts.join('\n');
}