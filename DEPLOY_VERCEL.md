# 🚀 Vercel 部署指南

本指南将帮助您安全地将 AI 试衣应用部署到 Vercel 免费版，同时保护您的 API 密钥。

## 📋 部署前准备

### 1. 获取 OpenRouter API Key
1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册/登录账号
3. 进入 [API Keys 页面](https://openrouter.ai/keys)
4. 创建新的 API Key
5. **重要**: 保存好您的 API Key，不要分享给他人

### 2. 准备 GitHub 仓库
```bash
# 1. 初始化 Git（如果还没有）
git init

# 2. 添加所有文件（.env 已被 .gitignore 排除）
git add .

# 3. 提交代码
git commit -m "Initial commit"

# 4. 创建 GitHub 仓库并推送
# 在 GitHub 创建新仓库后，执行：
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

**⚠️ 重要安全提醒**：
- ✅ `.env` 文件已在 `.gitignore` 中，不会被上传到 GitHub
- ❌ 永远不要将 `.env` 文件提交到 Git
- ❌ 不要在代码中硬编码 API Key

## 🔧 Vercel 部署步骤

### 方法一：通过 Vercel 网站部署（推荐）

1. **访问 Vercel**
   - 打开 [Vercel](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 选择您的 GitHub 仓库

3. **配置环境变量**（最重要的步骤！）
   
   在 "Environment Variables" 部分添加以下变量：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `OPEN_ROUTER_API_KEY` | `sk-or-v1-你的密钥` | **必需** - OpenRouter API 密钥 |
   | `NEXT_PUBLIC_TRYON_MODEL_ID` | `gemini-25-flash-free` | 可选 - 试衣生成模型 |
   | `NEXT_PUBLIC_ANALYSIS_MODEL_ID` | `gemini-20-flash` | 可选 - 分析模型 |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` | 可选 - 您的应用域名 |

4. **部署设置**
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **点击 Deploy**
   - 等待部署完成（通常需要 2-5 分钟）
   - 部署成功后会获得一个 URL

### 方法二：通过 Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   # 在项目根目录执行
   vercel
   
   # 按提示操作：
   # - Set up and deploy? Y
   # - Which scope? 选择您的账号
   # - Link to existing project? N
   # - Project name? 输入项目名称
   # - In which directory? ./ (默认)
   # - Override settings? N
   ```

4. **设置环境变量**
   ```bash
   # 设置生产环境变量
   vercel env add OPEN_ROUTER_API_KEY production
   # 输入您的 API Key
   
   # 设置其他可选变量
   vercel env add NEXT_PUBLIC_TRYON_MODEL_ID production
   vercel env add NEXT_PUBLIC_ANALYSIS_MODEL_ID production
   ```

5. **重新部署以应用环境变量**
   ```bash
   vercel --prod
   ```

## 🔑 环境变量管理

### 在 Vercel 控制台管理环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 进入 "Settings" → "Environment Variables"
4. 可以添加、修改或删除环境变量
5. 修改后需要重新部署才能生效

### 环境变量说明

```env
# 必需的变量
OPEN_ROUTER_API_KEY=sk-or-v1-xxxxx  # 您的 OpenRouter API 密钥

# 可选的变量（有默认值）
NEXT_PUBLIC_TRYON_MODEL_ID=gemini-25-flash-free  # 试衣模型选择
  # 可选值：
  # - gemini-25-flash-free (免费版，推荐开始使用)
  # - gemini-25-flash (付费版，效果更好)
  # - gemini-20-flash-exp (实验版)

NEXT_PUBLIC_ANALYSIS_MODEL_ID=gemini-20-flash  # 分析模型选择
  # 可选值：
  # - gemini-20-flash (标准版)
  # - gemini-15-flash (稳定版)
  # - gemini-20-flash-thinking (高级推理版)
```

## 📱 部署后测试

1. **访问您的应用**
   - URL 格式：`https://your-project-name.vercel.app`

2. **测试功能**
   - 上传用户照片
   - 上传衣服图片
   - 选择场景预设
   - 生成试衣效果
   - 查看 AI 分析

3. **检查控制台**
   - 打开浏览器开发者工具（F12）
   - 查看 Console 和 Network 标签
   - 确保没有 API 错误

## 🆓 Vercel 免费版限制

### Hobby Plan（免费版）限制：
- **部署次数**: 100 次/月
- **带宽**: 100GB/月
- **函数执行时间**: 10 秒（我们已配置为 30 秒）
- **并发构建**: 1 个
- **团队成员**: 仅个人使用

### 优化建议：
1. 使用 `gemini-25-flash-free` 模型（免费）
2. 压缩上传的图片以减少带宽
3. 合理使用 API 调用避免超限

## 🔍 故障排查

### 常见问题

1. **API Key 错误**
   - 检查环境变量是否正确设置
   - 确保 API Key 以 `sk-or-v1-` 开头
   - 在 Vercel 控制台重新设置变量

2. **生成失败**
   - 检查 OpenRouter 账户余额
   - 确认选择的模型是否可用
   - 查看 Vercel Functions 日志

3. **部署失败**
   - 检查 build 日志
   - 确保所有依赖正确安装
   - 验证 Node.js 版本兼容性

### 查看日志

1. **Vercel 控制台日志**
   - 项目页面 → Functions 标签
   - 查看实时日志和错误信息

2. **本地测试**
   ```bash
   # 使用本地环境变量测试
   npm run dev
   ```

## 🔒 安全最佳实践

1. **定期轮换 API Key**
   - 每 3-6 个月更换一次
   - 如发现泄露立即更换

2. **监控使用情况**
   - 在 OpenRouter 查看 API 使用统计
   - 设置使用限额告警

3. **访问控制**
   - 考虑添加域名白名单
   - 实施速率限制

4. **不要这样做**
   - ❌ 在客户端代码中暴露 API Key
   - ❌ 将 .env 文件提交到 Git
   - ❌ 在公开场合分享 API Key
   - ❌ 使用硬编码的密钥

## 📞 获取帮助

- **Vercel 文档**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js 文档**: [nextjs.org/docs](https://nextjs.org/docs)
- **OpenRouter 文档**: [openrouter.ai/docs](https://openrouter.ai/docs)
- **项目 Issues**: 在 GitHub 仓库提交 Issue

## ✅ 部署清单

部署前确认：
- [ ] 已获取 OpenRouter API Key
- [ ] 代码已推送到 GitHub
- [ ] .env 文件未提交到 Git
- [ ] 了解 Vercel 免费版限制
- [ ] 准备好测试图片

部署时确认：
- [ ] 正确设置所有环境变量
- [ ] 选择正确的 Framework (Next.js)
- [ ] 部署成功无错误

部署后确认：
- [ ] 应用可正常访问
- [ ] 图片上传功能正常
- [ ] 试衣生成功能正常
- [ ] AI 分析功能正常
- [ ] 无 API 错误

---

祝您部署顺利！🎉