# 🚀 将项目推送到新的 GitHub 仓库

## 方法一：快速执行脚本（推荐）

```bash
# 运行自动化脚本
./git-push-commands.sh
```

## 方法二：手动执行命令

### 步骤 1️⃣：初始化本地 Git 仓库

```bash
# 初始化 Git
git init

# 添加所有文件（.env 会被自动忽略）
git add .

# 创建首次提交
git commit -m "feat: Initial commit - AI Virtual Try-On Application"

# 重命名分支为 main
git branch -M main
```

### 步骤 2️⃣：在 GitHub 创建新仓库

1. 打开 [GitHub New Repository](https://github.com/new)
2. 填写信息：
   - **Repository name**: `ai-clothing-tryon`（或您喜欢的名字）
   - **Description**: `AI 智能试衣间 - 基于 Gemini AI 的虚拟试穿应用`
   - **Public/Private**: 根据需要选择
3. ⚠️ **重要**：不要勾选以下选项
   - ❌ Add a README file
   - ❌ Add .gitignore  
   - ❌ Choose a license
4. 点击 **Create repository**

### 步骤 3️⃣：连接远程仓库并推送

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-clothing-tryon.git

# 推送代码到 GitHub
git push -u origin main
```

#### 如果使用 SSH：
```bash
git remote add origin git@github.com:YOUR_USERNAME/ai-clothing-tryon.git
git push -u origin main
```

## 完整示例命令（一次性复制）

```bash
# 本地初始化
git init
git add .
git commit -m "feat: Initial commit - AI Virtual Try-On Application"
git branch -M main

# 连接远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/ai-clothing-tryon.git

# 推送
git push -u origin main
```

## 🔍 常见问题

### 1. 如果远程仓库已存在内容

```bash
# 强制推送（谨慎使用）
git push -u origin main --force
```

### 2. 如果要更改远程仓库地址

```bash
# 查看当前远程仓库
git remote -v

# 移除旧的远程仓库
git remote remove origin

# 添加新的远程仓库
git remote add origin https://github.com/YOUR_USERNAME/NEW_REPO_NAME.git
```

### 3. 如果忘记添加 .gitignore

```bash
# 从缓存中删除 .env 文件（如果不小心添加了）
git rm --cached .env

# 重新提交
git commit -m "fix: Remove .env from tracking"
```

### 4. 查看提交历史

```bash
# 查看提交日志
git log --oneline

# 查看文件状态
git status
```

## ✅ 安全检查清单

提交前请确认：

- [ ] `.env` 文件没有被添加到 Git（运行 `git status` 确认）
- [ ] API Key 没有出现在任何代码文件中
- [ ] `.gitignore` 文件包含了 `.env`
- [ ] 敏感信息没有包含在提交信息中

## 🎉 推送成功后

1. **访问您的仓库**：`https://github.com/YOUR_USERNAME/ai-clothing-tryon`
2. **添加 README 徽章**：在 README 中更新仓库链接
3. **设置仓库描述**：添加项目标签和描述
4. **部署到 Vercel**：
   ```bash
   # 访问 Vercel 并导入您的新仓库
   # 记得设置环境变量！
   ```

## 📝 提交信息规范

后续提交建议使用以下格式：

```bash
# 功能
git commit -m "feat: 添加新功能描述"

# 修复
git commit -m "fix: 修复问题描述"

# 文档
git commit -m "docs: 更新文档"

# 样式
git commit -m "style: 调整样式"

# 重构
git commit -m "refactor: 重构代码"

# 性能
git commit -m "perf: 优化性能"

# 测试
git commit -m "test: 添加测试"
```

---

💡 **提示**：执行 `./git-push-commands.sh` 可以自动完成步骤 1 的所有命令！