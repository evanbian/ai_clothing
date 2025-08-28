# AI 智能试衣间 - Virtual Try-On with Gemini AI

🎯 基于 Google Gemini AI 的智能虚拟试衣应用，让您轻松体验不同服装的试穿效果。

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-green)

本项目通过 [OpenRouter](https://openrouter.ai/) 使用 Google Gemini 2.5 Flash 和 2.0 Flash 模型，无需直接访问 Google API。

## ✨ 核心功能

1. **🖼️ 智能试衣生成**: 上传您的照片和想试穿的服装，AI 自动生成逼真的试衣效果
2. **🎨 场景定制**: 选择不同的背景、姿势、氛围，打造个性化的试穿体验
3. **📊 AI 搭配分析**: 获取专业的服装搭配建议和评分
4. **🛡️ 安全防护**: 内置多层安全系统，确保内容健康合规
5. **📱 全平台支持**: 完美适配手机、平板和电脑

## 🚀 快速开始

### 获取 API Key

1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册账号并登录
3. 进入 [API Keys 页面](https://openrouter.ai/keys)
4. 创建新的 API Key（格式：`sk-or-v1-xxxxx`）

### 本地开发

```bash
# 1. 克隆项目
git clone <repository-url>
cd gemini-image-editing-nextjs-quickstart

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加您的 OpenRouter API Key

# 4. 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用

## 🛡️ 安全部署到 Vercel

**⚠️ 重要安全提醒**：
- ✅ `.env` 文件已在 `.gitignore` 中，不会上传到 GitHub
- ❌ 永远不要将 API Key 提交到代码仓库
- ✅ 在 Vercel 控制台设置环境变量

### 部署步骤

1. **推送代码到 GitHub**（不包含 .env 文件）
2. **访问 [Vercel](https://vercel.com)** 并用 GitHub 登录
3. **导入项目** 并选择您的仓库
4. **设置环境变量**（最重要！）：
   - `OPEN_ROUTER_API_KEY`: 您的 OpenRouter API 密钥
   - `NEXT_PUBLIC_TRYON_MODEL_ID`: gemini-25-flash-free（可选）
   - `NEXT_PUBLIC_ANALYSIS_MODEL_ID`: gemini-20-flash（可选）
5. **点击 Deploy** 开始部署

👉 **[查看完整部署指南](./DEPLOY_VERCEL.md)** - 包含详细的安全部署步骤和故障排查

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPOSITORY_URL)

## 🔧 环境变量说明

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `OPEN_ROUTER_API_KEY` | ✅ | - | OpenRouter API 密钥 |
| `NEXT_PUBLIC_TRYON_MODEL_ID` | ❌ | gemini-25-flash-free | 试衣生成模型 |
| `NEXT_PUBLIC_ANALYSIS_MODEL_ID` | ❌ | gemini-20-flash | 分析模型 |

### 可用模型选项

**试衣生成模型**：
- `gemini-25-flash-free` - 免费版（推荐初始使用）
- `gemini-25-flash` - 付费版（效果更好）
- `gemini-20-flash-exp` - 实验版

**分析模型**：
- `gemini-20-flash` - 标准分析
- `gemini-15-flash` - 稳定版本
- `gemini-20-flash-thinking` - 高级推理

## 🏗️ 技术栈

- **[Next.js 15](https://nextjs.org/)** - React 全栈框架
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[shadcn/ui](https://ui.shadcn.com/)** - 现代化 UI 组件库
- **[Google Gemini](https://ai.google.dev/)** - AI 模型（通过 OpenRouter）
- **[OpenRouter](https://openrouter.ai/)** - 统一的 AI API 网关

## 🛡️ 安全特性

本应用内置多层安全防护：

1. **内容过滤** - 自动检测并拒绝不当请求
2. **AI 安全指令** - 在提示词中嵌入安全规则
3. **前端验证** - 实时检查用户输入
4. **后端校验** - API 层面的安全检查
5. **环境变量保护** - API Key 不会暴露在代码中

## 🆓 Vercel 免费版限制

- **部署次数**: 100 次/月
- **带宽**: 100GB/月
- **函数执行时间**: 10 秒（已配置为 30 秒）
- **并发构建**: 1 个

💡 **提示**: 使用免费的 `gemini-25-flash-free` 模型可以降低成本。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

⭐ 如果这个项目对您有帮助，请给个星标支持！

📚 **详细文档**：
- [部署指南](./DEPLOY_VERCEL.md) - Vercel 安全部署步骤
- [环境变量模板](./.env.example) - 配置参考
