# Docker Deployment Guide

## Quick Start

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Setup Steps

1. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file**
   - Set a strong `JWT_SECRET` (use `openssl rand -base64 32`)
   - Set a secure `DB_PASSWORD`
   - Update `FRONTEND_URL` if needed

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Check service health**
   ```bash
   docker-compose ps
   ```

5. **View logs**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f api
   ```

## Services

### Frontend (web)
- **Port**: 80
- **URL**: http://localhost
- **Health**: http://localhost/health
- **Technology**: Nginx serving static files

### Backend (api)
- **Port**: 3000
- **URL**: http://localhost:3000
- **Health**: http://localhost:3000/api/health
- **Technology**: Node.js + Express

### Database (db)
- **Port**: 5432
- **Technology**: PostgreSQL 16
- **Data**: Persisted in `postgres-data` volume

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes all data)
```bash
docker-compose down -v
```

### Rebuild services
```bash
docker-compose up -d --build
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```

### Execute commands in containers
```bash
# Backend shell
docker-compose exec api sh

# Database shell
docker-compose exec db psql -U giip_user -d giip_db

# Frontend shell
docker-compose exec web sh
```

### Check service status
```bash
docker-compose ps
```

### Restart a service
```bash
docker-compose restart api
```

## Database Management

### Access PostgreSQL
```bash
docker-compose exec db psql -U giip_user -d giip_db
```

### Backup database
```bash
docker-compose exec db pg_dump -U giip_user giip_db > backup.sql
```

### Restore database
```bash
docker-compose exec -T db psql -U giip_user -d giip_db < backup.sql
```

### View database logs
```bash
docker-compose logs -f db
```

## Troubleshooting

### Service won't start
1. Check logs: `docker-compose logs [service-name]`
2. Verify .env file exists and has correct values
3. Check port conflicts: `netstat -an | grep LISTEN`

### Database connection issues
1. Wait for database to be healthy: `docker-compose ps`
2. Check database logs: `docker-compose logs db`
3. Verify credentials in .env match docker-compose.yml

### Frontend can't reach backend
1. Check API health: http://localhost:3000/api/health
2. Verify CORS settings in backend
3. Check browser console for errors

### Reset everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## Production Deployment

### Security Checklist
- [ ] Change default passwords in .env
- [ ] Generate strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL to production domain
- [ ] Enable HTTPS (use reverse proxy like Nginx or Traefik)
- [ ] Set up firewall rules
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging

### Performance Optimization
- [ ] Use Docker secrets for sensitive data
- [ ] Configure resource limits in docker-compose.yml
- [ ] Set up log rotation
- [ ] Use external PostgreSQL for better performance
- [ ] Enable CDN for static assets
- [ ] Configure database connection pooling

### Monitoring
```bash
# Resource usage
docker stats

# Service health
curl http://localhost:3000/api/health
curl http://localhost/health
```

## Development vs Production

### Development
```yaml
# Use .env with:
NODE_ENV=development
DB_HOST=localhost  # if running DB locally
```

### Production
```yaml
# Use .env with:
NODE_ENV=production
DB_HOST=db  # Docker service name
FRONTEND_URL=https://yourdomain.com
```

## Network Architecture

```
┌─────────────────────────────────────────┐
│         Docker Network (bridge)         │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐│
│  │   web    │  │   api    │  │  db   ││
│  │  :80     │  │  :3000   │  │ :5432 ││
│  │  Nginx   │→ │  Node.js │→ │ PG    ││
│  └──────────┘  └──────────┘  └───────┘│
│       ↑              ↑                  │
└───────┼──────────────┼──────────────────┘
        │              │
    Port 80        Port 3000
        │              │
    ┌───┴──────────────┴───┐
    │   Host Machine        │
    └───────────────────────┘
```

## Volume Management

### List volumes
```bash
docker volume ls
```

### Inspect volume
```bash
docker volume inspect giip-fullstack-app_postgres-data
```

### Backup volume
```bash
docker run --rm -v giip-fullstack-app_postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .
```

### Restore volume
```bash
docker run --rm -v giip-fullstack-app_postgres-data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres-backup.tar.gz -C /data
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Docker Image](https://hub.docker.com/_/node)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)
