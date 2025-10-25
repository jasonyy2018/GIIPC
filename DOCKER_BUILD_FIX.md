# Docker 构建修复

## 🐛 问题

Docker 构建失败，错误信息：
```
ERROR [web 16/17] COPY test-mobile-menu-docker.html /usr/share/nginx/html/
failed to compute cache key: "/test-mobile-menu-docker.html": not found
```

## 🔍 原因

`frontend/Dockerfile` 中引用了 `test-mobile-menu-docker.html`，但这个文件：
- 存在于项目根目录
- 不存在于 `frontend/` 目录
- Docker 构建上下文是 `frontend/` 目录

## ✅ 解决方案

从 `frontend/Dockerfile` 中移除这行：

### 修改前
```dockerfile
COPY test-api.html /usr/share/nginx/html/
COPY test-paths.html /usr/share/nginx/html/
COPY test-mobile-menu-docker.html /usr/share/nginx/html/  ← 移除这行
COPY health /usr/share/nginx/html/
```

### 修改后
```dockerfile
COPY test-api.html /usr/share/nginx/html/
COPY test-paths.html /usr/share/nginx/html/
COPY health /usr/share/nginx/html/
```

## 📁 测试文件说明

测试文件位于项目根目录，不需要包含在 Docker 镜像中：
- `test-mobile-menu-docker.html` - 根目录
- `test-final-verification.html` - 根目录
- `test-tailwind-mobile-menu.html` - 根目录
- 等等...

这些文件用于本地开发测试，不需要部署到生产环境。

## 🚀 现在可以重新构建

```bash
# Windows
rebuild-docker.bat

# Linux/Mac
./rebuild-docker.sh
```

## ✅ 修改的文件

- `frontend/Dockerfile` - 移除了不存在的文件引用

## 🎯 结果

Docker 现在应该可以成功构建了！
