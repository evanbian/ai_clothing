/**
 * Safety validation system for AI clothing try-on
 * Prevents generation of inappropriate, illegal, or harmful content
 */

// Keywords that indicate potentially inappropriate requests
const PROHIBITED_KEYWORDS = {
  // Explicit content
  nudity: [
    '裸', '赤裸', '全裸', '脱光', '不穿', '没穿衣服', '无衣', '一丝不挂',
    'nude', 'naked', 'undressed', 'bare', 'unclothed', 'strip', 'topless'
  ],
  sexual: [
    '性感', '诱惑', '挑逗', '色情', '淫', '荡', '性', '胸', '臀', '内衣', '内裤',
    'sexy', 'seductive', 'erotic', 'porn', 'adult', 'lingerie', 'intimate',
    'provocative', 'sensual', 'bdsm', 'fetish'
  ],
  violence: [
    '血', '暴力', '杀', '死', '尸', '伤', '打', '虐', '折磨', '武器', '枪', '刀',
    'blood', 'violence', 'kill', 'death', 'corpse', 'hurt', 'torture', 'weapon',
    'gun', 'knife', 'gore', 'mutilation', 'assault'
  ],
  illegal: [
    '毒品', '违法', '犯罪', '恐怖', '炸弹', '爆炸', 
    'drug', 'illegal', 'crime', 'terror', 'bomb', 'explosion'
  ],
  minors: [
    '儿童', '未成年', '小孩', '学生装', '校服',
    'child', 'minor', 'kid', 'underage', 'school uniform'
  ],
  hate: [
    '歧视', '种族', '仇恨', '纳粹', '法西斯',
    'discriminate', 'racism', 'hate', 'nazi', 'fascist'
  ]
};

// Safe content guidelines
const SAFETY_GUIDELINES = {
  allowed: [
    '日常服装', '正装', '休闲装', '运动装', '传统服饰', 
    '工作服', '晚礼服', '婚纱', '民族服装', '时尚搭配'
  ],
  contexts: [
    '商务场合', '休闲活动', '运动健身', '派对聚会', 
    '旅游度假', '日常生活', '正式场合', '文化活动'
  ]
};

export interface SafetyCheckResult {
  isSafe: boolean;
  violations: string[];
  category?: string;
  message?: string;
  suggestions?: string[];
}

/**
 * Check if text contains prohibited keywords
 */
function containsProhibitedContent(text: string): SafetyCheckResult {
  const lowerText = text.toLowerCase();
  const violations: string[] = [];
  let violatedCategory = '';

  for (const [category, keywords] of Object.entries(PROHIBITED_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        violations.push(keyword);
        violatedCategory = category;
      }
    }
  }

  if (violations.length > 0) {
    return {
      isSafe: false,
      violations,
      category: violatedCategory,
      message: generateSafetyMessage(violatedCategory),
      suggestions: generateSafeSuggestions()
    };
  }

  return { isSafe: true, violations: [] };
}

/**
 * Generate safety violation message
 */
function generateSafetyMessage(category: string): string {
  const messages: Record<string, string> = {
    nudity: '系统不支持生成裸露或不雅内容。请上传正常着装的照片。',
    sexual: '系统不支持生成色情或性暗示内容。请选择日常服装进行试穿。',
    violence: '系统不支持生成暴力或血腥内容。请选择和平友好的场景。',
    illegal: '系统不支持生成违法或危险内容。请选择合法合规的服装。',
    minors: '系统需要确保未成年人保护。请使用成年人照片进行试穿。',
    hate: '系统不支持生成歧视或仇恨内容。请选择积极正面的服装风格。'
  };
  
  return messages[category] || '您的请求包含不适当内容，请修改后重试。';
}

/**
 * Generate safe content suggestions
 */
function generateSafeSuggestions(): string[] {
  return [
    '尝试日常休闲装搭配',
    '选择商务正装风格',
    '体验运动健身服装',
    '探索传统文化服饰',
    '搭配时尚潮流单品'
  ];
}

/**
 * Validate user photo
 */
export function validateUserPhoto(imageData: string): SafetyCheckResult {
  // Check if image data URL contains suspicious patterns
  // This is a basic check - real implementation would use image AI analysis
  
  // For now, we assume uploaded photos are safe if they pass basic checks
  // In production, you'd want to use Google Cloud Vision API or similar
  
  return { isSafe: true, violations: [] };
}

/**
 * Validate clothing image
 */
export function validateClothingImage(imageData: string): SafetyCheckResult {
  // Similar to user photo validation
  // Would check for inappropriate clothing items
  
  return { isSafe: true, violations: [] };
}

/**
 * Validate custom prompt
 */
export function validateCustomPrompt(prompt: string): SafetyCheckResult {
  if (!prompt) return { isSafe: true, violations: [] };
  
  return containsProhibitedContent(prompt);
}

/**
 * Validate scene preset
 */
export function validateScenePreset(
  background?: string,
  pose?: string,
  mood?: string
): SafetyCheckResult {
  const combinedText = `${background || ''} ${pose || ''} ${mood || ''}`;
  
  if (!combinedText.trim()) return { isSafe: true, violations: [] };
  
  return containsProhibitedContent(combinedText);
}

/**
 * Comprehensive safety check for try-on generation
 */
export function performSafetyCheck(params: {
  userPhoto?: string;
  clothingImage?: string;
  customPrompt?: string;
  background?: string;
  pose?: string;
  mood?: string;
}): SafetyCheckResult {
  // Check custom prompt
  if (params.customPrompt) {
    const promptCheck = validateCustomPrompt(params.customPrompt);
    if (!promptCheck.isSafe) return promptCheck;
  }
  
  // Check scene preset
  const presetCheck = validateScenePreset(
    params.background,
    params.pose,
    params.mood
  );
  if (!presetCheck.isSafe) return presetCheck;
  
  // In production, also check images using AI vision API
  
  return { isSafe: true, violations: [] };
}

/**
 * Build safety instructions for AI prompt
 */
export function buildSafetyInstructions(): string {
  return `
【重要安全指引】
本系统严格遵守以下安全规范：

1. 禁止生成内容：
   - 禁止任何形式的裸露、色情或性暗示内容
   - 禁止血腥、暴力或令人不适的画面
   - 禁止涉及未成年人的不当内容
   - 禁止违法、危险或有害的内容
   - 禁止歧视、仇恨或攻击性内容
   - 禁止生成真实政治人物或名人的图像

2. 仅允许生成：
   - 正常、得体的日常服装试穿效果
   - 适合公共场合的着装搭配
   - 积极、健康、正面的形象展示
   - 符合社会道德规范的内容

3. 图像要求：
   - 人物必须穿着完整、得体的服装
   - 不得展示过度暴露的身体部位
   - 保持专业的试衣展示标准
   - 确保内容适合所有年龄段观看

如果请求包含任何不当内容，必须拒绝生成并返回错误信息。
请始终优先考虑用户安全和内容健康。
`;
}

/**
 * Safety reminder for API responses
 */
export function buildSafetyReminder(): string {
  return '请注意：生成内容必须符合法律法规和道德规范。';
}