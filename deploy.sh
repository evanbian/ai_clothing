#!/bin/bash

# AI 试衣间 - 腾讯云部署脚本
# 使用方法: bash deploy.sh [docker|pm2|direct]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
APP_NAME="ai-tryon"
APP_DIR="/var/www/ai-tryon"
REPO_URL="https://github.com/evanbian/ai_clothing.git"
BRANCH="main"

# 输出函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查系统依赖
check_dependencies() {
    log_info "检查系统依赖..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_warn "Node.js 未安装，正在安装..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    # 检查 Git
    if ! command -v git &> /dev/null; then
        log_warn "Git 未安装，正在安装..."
        sudo apt-get update
        sudo apt-get install -y git
    fi
    
    log_info "依赖检查完成"
}

# 克隆或更新代码
update_code() {
    log_info "更新代码..."
    
    if [ -d "$APP_DIR" ]; then
        cd $APP_DIR
        git fetch origin
        git reset --hard origin/$BRANCH
        git pull origin $BRANCH
    else
        sudo mkdir -p $APP_DIR
        sudo chown $USER:$USER $APP_DIR
        git clone -b $BRANCH $REPO_URL $APP_DIR
        cd $APP_DIR
    fi
    
    # 进入项目目录
    cd $APP_DIR/gemini-image-editing-nextjs-quickstart
    
    log_info "代码更新完成"
}

# 设置环境变量
setup_env() {
    log_info "配置环境变量..."
    
    if [ ! -f ".env" ]; then
        cp .env.production .env
        log_warn "请编辑 .env 文件，填入你的 API 密钥"
        log_warn "使用命令: nano $APP_DIR/gemini-image-editing-nextjs-quickstart/.env"
        exit 1
    fi
    
    log_info "环境变量配置完成"
}

# Docker 部署方式
deploy_docker() {
    log_info "使用 Docker 部署..."
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        log_warn "Docker 未安装，正在安装..."
        curl -fsSL https://get.docker.com | sh
        sudo usermod -aG docker $USER
        log_warn "请重新登录以使 Docker 权限生效"
        exit 1
    fi
    
    # 检查 Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_warn "Docker Compose 未安装，正在安装..."
        sudo apt-get install -y docker-compose
    fi
    
    # 构建并启动容器
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    
    log_info "Docker 部署完成"
    log_info "应用运行在: http://localhost:3000"
}

# PM2 部署方式
deploy_pm2() {
    log_info "使用 PM2 部署..."
    
    # 安装依赖
    npm ci
    
    # 构建项目
    npm run build
    
    # 检查 PM2
    if ! command -v pm2 &> /dev/null; then
        log_warn "PM2 未安装，正在安装..."
        npm install -g pm2
    fi
    
    # 停止旧进程
    pm2 stop $APP_NAME 2>/dev/null || true
    pm2 delete $APP_NAME 2>/dev/null || true
    
    # 启动新进程
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup systemd -u $USER --hp /home/$USER
    
    log_info "PM2 部署完成"
    log_info "查看状态: pm2 status"
    log_info "查看日志: pm2 logs $APP_NAME"
}

# 直接运行方式
deploy_direct() {
    log_info "使用直接运行方式..."
    
    # 安装依赖
    npm ci
    
    # 构建项目
    npm run build
    
    # 创建 systemd 服务
    sudo tee /etc/systemd/system/ai-tryon.service > /dev/null <<EOF
[Unit]
Description=AI Try-On Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR/gemini-image-editing-nextjs-quickstart
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF
    
    # 重载并启动服务
    sudo systemctl daemon-reload
    sudo systemctl enable ai-tryon
    sudo systemctl restart ai-tryon
    
    log_info "Systemd 服务部署完成"
    log_info "查看状态: sudo systemctl status ai-tryon"
    log_info "查看日志: sudo journalctl -u ai-tryon -f"
}

# 配置 Nginx
setup_nginx() {
    log_info "配置 Nginx..."
    
    # 检查 Nginx
    if ! command -v nginx &> /dev/null; then
        log_warn "Nginx 未安装，正在安装..."
        sudo apt-get update
        sudo apt-get install -y nginx
    fi
    
    # 复制配置文件
    sudo cp nginx.conf /etc/nginx/sites-available/ai-tryon
    sudo ln -sf /etc/nginx/sites-available/ai-tryon /etc/nginx/sites-enabled/
    
    # 测试配置
    sudo nginx -t
    
    # 重载 Nginx
    sudo systemctl reload nginx
    
    log_info "Nginx 配置完成"
    log_warn "请记得配置 SSL 证书和域名"
}

# 主函数
main() {
    log_info "开始部署 AI 试衣间应用..."
    
    # 检查部署方式
    DEPLOY_MODE=${1:-pm2}
    
    # 执行部署流程
    check_dependencies
    update_code
    setup_env
    
    case $DEPLOY_MODE in
        docker)
            deploy_docker
            ;;
        pm2)
            deploy_pm2
            ;;
        direct)
            deploy_direct
            ;;
        *)
            log_error "未知的部署方式: $DEPLOY_MODE"
            log_info "使用方法: bash deploy.sh [docker|pm2|direct]"
            exit 1
            ;;
    esac
    
    # 配置 Nginx（可选）
    read -p "是否配置 Nginx? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_nginx
    fi
    
    log_info "🎉 部署完成！"
    log_info "访问地址: http://你的服务器IP:3000"
    log_info "如已配置域名: https://你的域名"
}

# 运行主函数
main "$@"