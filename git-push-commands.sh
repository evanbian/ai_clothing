#!/bin/bash

# AI 试衣间项目 - Git 提交命令
# 请按顺序执行以下命令

echo "🚀 开始初始化 Git 仓库..."

# 步骤 1: 初始化 Git（如果还没有初始化）
git init

# 步骤 2: 添加所有文件（.env 会被 .gitignore 自动排除）
echo "📦 添加项目文件..."
git add .

# 步骤 3: 创建首次提交
echo "💾 创建首次提交..."
git commit -m "feat: Initial commit - AI Virtual Try-On Application

- 基于 Gemini 2.5 Flash 的智能试衣功能
- 支持场景定制和 AI 搭配分析
- 多层安全防护系统
- 响应式设计，支持移动端
- 使用 OpenRouter API 网关
- Next.js 15 + TypeScript + Tailwind CSS"

# 步骤 4: 重命名主分支（如果需要）
git branch -M main

echo "
✅ 本地 Git 仓库已准备就绪！

📋 接下来请按照以下步骤操作：

1️⃣  在 GitHub 创建新仓库：
    - 打开 https://github.com/new
    - Repository name: ai-clothing-tryon (或您喜欢的名字)
    - Description: AI 智能试衣间 - 基于 Gemini AI 的虚拟试穿应用
    - 选择 Public 或 Private
    - ⚠️ 不要勾选 'Add a README file'
    - ⚠️ 不要勾选 'Add .gitignore'
    - ⚠️ 不要勾选 'Choose a license'
    - 点击 'Create repository'

2️⃣  创建完成后，复制下面的命令（替换 YOUR_USERNAME 和 YOUR_REPO_NAME）：

    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main

    或者使用 SSH（如果您配置了 SSH）：
    
    git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main

3️⃣  如果您想使用不同的仓库名，请修改上面的 URL

📌 示例命令（请替换为您的信息）：
    git remote add origin https://github.com/evanbian/ai-clothing-tryon.git
    git push -u origin main

⚠️ 安全提醒：
- ✅ .env 文件不会被上传（已在 .gitignore 中）
- ✅ 您的 API Key 是安全的
- ❌ 永远不要手动添加 .env 文件到 Git
"