# 腾讯云服务器部署指南

## 🚀 快速开始

### 1. 登录腾讯云服务器
```bash
ssh root@你的服务器IP
```

### 2. 下载部署脚本
```bash
wget https://raw.githubusercontent.com/evanbian/ai_clothing/main/gemini-image-editing-nextjs-quickstart/deploy.sh
chmod +x deploy.sh
```

### 3. 运行部署脚本
```bash
# 推荐：使用 PM2 部署
./deploy.sh pm2

# 或使用 Docker 部署
./deploy.sh docker

# 或使用 Systemd 直接运行
./deploy.sh direct
```

## 📋 手动部署步骤

### 方案一：PM2 部署（推荐）

#### 1. 安装依赖
```bash
# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2
```

#### 2. 克隆项目
```bash
cd /var/www
git clone https://github.com/evanbian/ai_clothing.git
cd ai_clothing/gemini-image-editing-nextjs-quickstart
```

#### 3. 配置环境变量
```bash
cp .env.production .env
nano .env

# 填入以下内容：
# OPEN_ROUTER_API_KEY=你的API密钥
# NEXT_PUBLIC_TRYON_MODEL_ID=gemini-25-flash
# NEXT_PUBLIC_ANALYSIS_MODEL_ID=gemini-20-flash
# NEXT_PUBLIC_SITE_URL=https://你的域名
```

#### 4. 安装并构建
```bash
npm ci
npm run build
```

#### 5. 启动应用
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 方案二：Docker 部署

#### 1. 安装 Docker
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

#### 2. 准备环境变量
```bash
# 创建 .env 文件
nano .env
# 填入你的 API 密钥
```

#### 3. 构建并运行
```bash
docker-compose up -d
```

### 方案三：直接运行

#### 1. 构建项目
```bash
npm ci
npm run build
```

#### 2. 直接启动
```bash
PORT=3000 npm start
```

## 🔧 Nginx 配置

### 1. 安装 Nginx
```bash
sudo apt-get update
sudo apt-get install nginx
```

### 2. 配置反向代理
```bash
sudo cp nginx.conf /etc/nginx/sites-available/ai-tryon
sudo ln -s /etc/nginx/sites-available/ai-tryon /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. 申请 SSL 证书（腾讯云免费证书）
1. 登录腾讯云控制台
2. 进入 SSL 证书管理
3. 申请免费 DV SSL 证书
4. 下载证书文件
5. 上传到服务器 `/etc/nginx/ssl/` 目录

## 🔍 常见问题

### 1. 端口被占用
```bash
# 查看端口占用
sudo lsof -i:3000
# 杀死进程
sudo kill -9 [PID]
```

### 2. PM2 日志查看
```bash
pm2 logs ai-tryon
pm2 monit
```

### 3. Docker 日志查看
```bash
docker-compose logs -f
```

### 4. 更新代码
```bash
git pull origin main
npm ci
npm run build
pm2 restart ai-tryon
```

### 5. 性能优化
- 使用 CDN 加速静态资源
- 开启 Nginx Gzip 压缩
- 配置 PM2 集群模式
- 使用腾讯云 Redis 缓存

## 🔒 安全建议

1. **修改 SSH 端口**
```bash
nano /etc/ssh/sshd_config
# Port 22 改为其他端口
systemctl restart sshd
```

2. **配置防火墙**
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 你的SSH端口/tcp
sudo ufw enable
```

3. **定期更新系统**
```bash
sudo apt-get update && sudo apt-get upgrade
```

4. **使用环境变量管理敏感信息**
- 不要将 API 密钥提交到 Git
- 使用 `.env` 文件管理配置

## 📊 监控

### 使用腾讯云监控
1. 安装监控 Agent
2. 配置告警规则
3. 监控 CPU、内存、网络

### 使用 PM2 监控
```bash
pm2 web
# 访问 http://服务器IP:9615
```

## 🆘 技术支持

- 腾讯云工单系统
- GitHub Issues
- 社区论坛

## 📝 部署检查清单

- [ ] Node.js 20+ 已安装
- [ ] Git 已安装
- [ ] 项目代码已克隆
- [ ] 环境变量已配置
- [ ] 依赖已安装 (npm ci)
- [ ] 项目已构建 (npm run build)
- [ ] 应用已启动
- [ ] Nginx 已配置（可选）
- [ ] SSL 证书已配置（可选）
- [ ] 防火墙已配置
- [ ] 监控已设置