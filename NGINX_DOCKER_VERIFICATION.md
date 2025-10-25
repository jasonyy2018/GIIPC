# Nginx and Docker Verification Guide

## Overview
This guide helps verify that Nginx and Docker are properly configured to serve the updated mobile menu typography and all other frontend changes.

## Quick Verification

### Run Verification Script
```bash
# Windows
verify-nginx-docker.bat

# The script will check:
# 1. Docker installation
# 2. Docker Compose installation
# 3. Running containers
# 4. Nginx configuration
# 5. Frontend files
# 6. Mobile menu typography updates
```

## Manual Verification Steps

### 1. Check Docker Status

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# List running containers
docker ps --filter "name=giip"
```

Expected output:
```
CONTAINER ID   IMAGE              COMMAND                  STATUS         PORTS
xxxxx          giip-frontend      "/docker-entrypoint.…"   Up X minutes   0.0.0.0:80->80/tcp
xxxxx          giip-backend       "docker-entrypoint.s…"   Up X minutes   0.0.0.0:3000->3000/tcp
xxxxx          giip-database      "docker-entrypoint.s…"   Up X minutes   0.0.0.0:5432->5432/tcp
```

### 2. Verify Nginx Configuration

```bash
# Check if nginx.conf exists
ls frontend/nginx.conf

# View nginx configuration
cat frontend/nginx.conf
```

Key settings to verify:
- ✓ Gzip compression enabled
- ✓ Cache headers configured
- ✓ Security headers present
- ✓ Static asset caching (1 year)
- ✓ HTML caching (1 hour)

### 3. Verify Frontend Files

Check that all required files exist:
```bash
# Core HTML files
frontend/index.html
frontend/about.html
frontend/contact.html
frontend/admin.html
frontend/privacy.html
frontend/terms.html

# CSS files
frontend/css/typography.css
frontend/css/auth.css

# JavaScript files
frontend/js/common.js
frontend/js/api-client.js
frontend/js/data-renderer.js
frontend/js/auth.js
frontend/js/admin.js
```

### 4. Verify Mobile Menu Typography Updates

Check `frontend/index.html` for:

```css
/* Mobile menu button */
.mobile-menu-btn {
    font-size: 20px; /* Proportional to 16px menu text */
    padding: 8px 12px;
}

@media (max-width: 768px) {
    body {
        font-size: 16px;
        line-height: 1.6;
    }
    
    #mobile-nav-drawer ul li a {
        font-size: 16px !important;
        line-height: 1.6 !important;
        padding: 12px 12px !important;
    }
}
```

### 5. Test Container Health

```bash
# Check frontend health
curl http://localhost/health

# Check backend health
curl http://localhost:3000/api/health

# Check database connection
docker exec giip-database pg_isready -U giip_user -d giip_db
```

Expected responses:
- Frontend: `healthy`
- Backend: `{"status":"ok","timestamp":"..."}`
- Database: `accepting connections`

## Rebuild Containers with Latest Changes

### Option 1: Quick Rebuild Script
```bash
# Windows
rebuild-docker.bat

# This will:
# 1. Stop all containers
# 2. Rebuild images with --no-cache
# 3. Start containers
# 4. Verify services
```

### Option 2: Manual Rebuild
```bash
# Stop containers
docker-compose down

# Rebuild without cache (ensures latest changes)
docker-compose build --no-cache

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option 3: Rebuild Specific Service
```bash
# Rebuild only frontend
docker-compose build --no-cache web
docker-compose up -d web

# Rebuild only backend
docker-compose build --no-cache api
docker-compose up -d api
```

## Verify Changes in Browser

### 1. Clear Browser Cache
- **Chrome/Edge:** Ctrl + Shift + Delete → Clear cached images and files
- **Firefox:** Ctrl + Shift + Delete → Cached Web Content
- **Safari:** Cmd + Option + E

### 2. Hard Refresh
- **Windows:** Ctrl + F5 or Ctrl + Shift + R
- **Mac:** Cmd + Shift + R

### 3. Test Mobile Menu
1. Open http://localhost in browser
2. Open DevTools (F12)
3. Toggle device toolbar (Ctrl + Shift + M)
4. Select a mobile device (e.g., iPhone 12)
5. Click the hamburger menu (☰)
6. Verify:
   - ✓ Menu button is 20px
   - ✓ Menu items are 16px
   - ✓ Line height is 1.6
   - ✓ Padding is 12px
   - ✓ System fonts are used

### 4. Inspect Typography
In DevTools:
```javascript
// Check menu button size
getComputedStyle(document.querySelector('.mobile-menu-btn')).fontSize
// Should return: "20px"

// Check menu item size
getComputedStyle(document.querySelector('#mobile-nav-drawer ul li a')).fontSize
// Should return: "16px"

// Check line height
getComputedStyle(document.querySelector('#mobile-nav-drawer ul li a')).lineHeight
// Should return: "25.6px" (16px * 1.6)
```

## Common Issues and Solutions

### Issue 1: Changes Not Visible
**Solution:**
```bash
# Rebuild without cache
docker-compose down
docker-compose build --no-cache web
docker-compose up -d

# Clear browser cache and hard refresh
```

### Issue 2: Container Won't Start
**Solution:**
```bash
# Check logs
docker-compose logs web

# Check if port is in use
netstat -ano | findstr :80

# Kill process using port 80 (if needed)
taskkill /PID <PID> /F
```

### Issue 3: Nginx Configuration Error
**Solution:**
```bash
# Test nginx configuration
docker exec giip-frontend nginx -t

# View nginx error log
docker exec giip-frontend cat /var/log/nginx/error.log
```

### Issue 4: CSS Not Loading
**Solution:**
```bash
# Check if CSS files are in container
docker exec giip-frontend ls -la /usr/share/nginx/html/css/

# Check nginx access log
docker exec giip-frontend tail -f /var/log/nginx/access.log
```

## Verification Checklist

- [ ] Docker is installed and running
- [ ] Docker Compose is installed
- [ ] All three containers are running (web, api, db)
- [ ] Nginx configuration is valid
- [ ] All frontend files are present
- [ ] Mobile menu typography is updated in index.html
- [ ] Frontend health endpoint responds
- [ ] Backend health endpoint responds
- [ ] Database is accepting connections
- [ ] Browser cache is cleared
- [ ] Mobile menu displays correctly
- [ ] Typography matches specifications (16px text, 20px button)
- [ ] System fonts are loading

## Performance Verification

### Check Gzip Compression
```bash
curl -H "Accept-Encoding: gzip" -I http://localhost/index.html | findstr "Content-Encoding"
# Should return: Content-Encoding: gzip
```

### Check Cache Headers
```bash
curl -I http://localhost/css/typography.css | findstr "Cache-Control"
# Should return: Cache-Control: public, immutable
```

### Check Response Times
```bash
# Frontend
curl -o nul -s -w "Time: %{time_total}s\n" http://localhost

# Backend
curl -o nul -s -w "Time: %{time_total}s\n" http://localhost:3000/api/health
```

## Monitoring

### View Real-time Logs
```bash
# All services
docker-compose logs -f

# Frontend only
docker-compose logs -f web

# Backend only
docker-compose logs -f api

# Database only
docker-compose logs -f db
```

### Check Resource Usage
```bash
# Container stats
docker stats --no-stream

# Specific container
docker stats giip-frontend --no-stream
```

## Rollback Procedure

If issues occur after rebuild:

```bash
# Stop current containers
docker-compose down

# Restore from backup (if available)
# Or revert code changes

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

## Additional Resources

- **Docker Documentation:** https://docs.docker.com/
- **Nginx Documentation:** https://nginx.org/en/docs/
- **Docker Compose Documentation:** https://docs.docker.com/compose/

## Support

If verification fails:
1. Check container logs: `docker-compose logs`
2. Verify file permissions
3. Ensure ports 80, 3000, 5432 are available
4. Check Docker daemon is running
5. Review error messages in logs

## Summary

This verification ensures:
- ✓ Docker and Nginx are properly configured
- ✓ All containers are running and healthy
- ✓ Mobile menu typography updates are applied
- ✓ Static assets are cached correctly
- ✓ Gzip compression is enabled
- ✓ Security headers are present
- ✓ All frontend files are accessible

Run `verify-nginx-docker.bat` regularly to ensure everything is working correctly!
