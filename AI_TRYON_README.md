# AI智能试衣网站

一个基于 Gemini 2.5 Flash Image Preview 和 Gemini 2.0 Flash 的 AI 试衣平台，让用户能够虚拟试穿不同的衣服并获得搭配建议。

## 🌟 主要功能

### 1. **双图像上传**
- 上传用户全身照
- 上传或输入衣服图片URL（支持电商平台链接）

### 2. **智能场景设置**
- **预设场景**：海边、办公室、咖啡厅、街头、公园、商场
- **拍摄角度**：正面、侧身45度、背面、坐姿、行走中、休闲倚靠
- **整体氛围**：休闲放松、正式商务、运动活力、优雅时尚、街头潮流
- **版型选择**：修身版、标准版、宽松版
- **自定义提示词**：支持个性化场景描述

### 3. **快速生成模式**
- 日常休闲（咖啡厅场景）
- 商务正装（办公室场景）
- 度假风格（海边场景）
- 街头潮流（街头场景）

### 4. **试衣效果展示**
- 网格视图和轮播视图切换
- 图片下载和分享功能
- 全屏预览模式

### 5. **AI搭配分析**
- **搭配评分**：1-10分评价
- **风格分析**：识别整体风格定位
- **适合场合**：推荐穿着场合
- **季节建议**：适合的季节
- **搭配亮点**：优点分析
- **改进建议**：提供具体改进方案

## 🛠️ 技术架构

### 前端技术
- **Next.js 15.2.4** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI组件库
- **React Dropzone** - 图片上传

### AI模型
- **Gemini 2.5 Flash Image Preview** - 试衣效果生成（通过OpenRouter）
- **Gemini 2.0 Flash** - 搭配效果分析（通过OpenRouter）

### API架构
```
/api/tryon/
├── generate/    # 试衣生成端点
├── analyze/     # 效果分析端点
└── fetch-url/   # URL图片获取端点
```

## 📦 安装与运行

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
在 `.env` 文件中设置：
```
OPEN_ROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 📁 项目结构

```
app/
├── api/tryon/           # API路由
│   ├── generate/        # 试衣生成
│   ├── analyze/         # 效果分析
│   └── fetch-url/       # URL处理
├── page.tsx            # 主页面

components/
├── TryOnUploader.tsx    # 双图像上传组件
├── ScenePresets.tsx     # 场景预设选择
├── TryOnGallery.tsx     # 效果展示画廊
├── AnalysisPanel.tsx    # AI分析面板
└── ui/                  # UI基础组件

lib/
├── openrouter.ts        # OpenRouter客户端配置
├── prompts.ts           # 提示词模板
├── image-utils.ts       # 图像处理工具
└── types.ts             # TypeScript类型定义
```

## 🎯 使用流程

1. **上传照片**
   - 上传您的全身照（建议正面、背景简洁）
   - 上传衣服图片或输入电商网址

2. **选择场景**
   - 使用快速生成按钮一键生成
   - 或自定义选择背景、角度、氛围

3. **生成效果**
   - AI自动生成逼真的试衣效果
   - 支持多角度展示

4. **查看分析**
   - 获得专业的搭配建议
   - 了解适合场合和改进方向

## ⚠️ 注意事项

### API限制
- OpenRouter API 需要有效的API密钥
- Gemini 2.5 Flash Image Preview 模型目前可能仍在预览阶段
- 如果图像生成不可用，会显示相应提示

### 图片要求
- 用户照片：建议400x400像素以上，最大4096x4096
- 衣服图片：建议200x200像素以上，纯色背景效果最佳
- 文件大小：自动压缩至2MB以内

### 性能优化
- 图片自动压缩和优化
- 支持并发请求处理
- 结果缓存机制

## 🔮 未来改进

- [ ] 添加更多预设场景和姿态
- [ ] 支持批量生成多角度效果
- [ ] 增加历史记录功能
- [ ] 优化移动端体验
- [ ] 添加更多AI分析维度
- [ ] 支持保存和分享功能

## 📄 许可证

本项目基于 Apache License 2.0 开源协议。

## 🙏 致谢

- Google DeepMind - Gemini模型
- OpenRouter - API服务
- shadcn/ui - UI组件
- Next.js团队 - 框架支持

---

**注意**：本项目为演示目的创建，实际的AI试衣效果取决于Gemini 2.5 Flash Image Preview模型的能力和可用性。