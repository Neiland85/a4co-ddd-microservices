# 📝 Preview & Production Quick Reference

## Quick Start Commands

### Preview Environment

```bash
# Setup and start (automated)
./start-preview.sh

# Or manually
cp .env.preview.example .env.preview
docker compose -f docker-compose.preview.yml --env-file .env.preview up -d

# View logs
docker compose -f docker-compose.preview.yml --env-file .env.preview logs -f

# Stop
docker compose -f docker-compose.preview.yml --env-file .env.preview down
```

### Production Environment

```bash
# Setup
cp .env.production.template .env.production
# Edit .env.production with secure values

# Start
docker compose -f docker-compose.prod.yml --env-file .env.production up -d

# View logs
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f

# Stop
docker compose -f docker-compose.prod.yml --env-file .env.production down
```

---

## Access URLs

### Preview
- **Dashboard**: http://localhost:3001
- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8080
- **API Docs**: http://localhost:8080/api/docs
- **NATS Monitor**: http://localhost:8222

### Production
- Configure in nginx and .env.production

---

## Health Checks

```bash
# API Gateway
curl http://localhost:8080/api/v1/health

# Auth Service
curl http://localhost:4000/health

# Order Service
curl http://localhost:3000/health

# Payment Service
curl http://localhost:3001/health

# Inventory Service
curl http://localhost:3002/health

# Product Service
curl http://localhost:3003/health
```

---

## Troubleshooting

### Check Service Status
```bash
docker compose -f docker-compose.preview.yml --env-file .env.preview ps
```

### View Specific Service Logs
```bash
docker compose -f docker-compose.preview.yml --env-file .env.preview logs -f <service-name>
```

### Restart Service
```bash
docker compose -f docker-compose.preview.yml --env-file .env.preview restart <service-name>
```

### Clean Start
```bash
docker compose -f docker-compose.preview.yml --env-file .env.preview down -v
docker compose -f docker-compose.preview.yml --env-file .env.preview up -d
```

---

## Database Access

```bash
# PostgreSQL
docker exec -it a4co-preview-postgres psql -U postgres

# Redis
docker exec -it a4co-preview-redis redis-cli -a preview_redis_password
```

---

## Documentation

- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Testing Guide**: [PREVIEW_TESTING_GUIDE.md](./PREVIEW_TESTING_GUIDE.md)
- **Production Checklist**: [PRODUCTION_READINESS_CHECKLIST.md](./PRODUCTION_READINESS_CHECKLIST.md)

---

## NPM Scripts

```bash
# Preview
pnpm run preview:start    # Automated setup
pnpm run preview:up       # Start services
pnpm run preview:down     # Stop services
pnpm run preview:logs     # View logs
pnpm run preview:ps       # Check status
pnpm run preview:restart  # Restart services
pnpm run preview:build    # Build images

# Production
pnpm run prod:up          # Start services
pnpm run prod:down        # Stop services
pnpm run prod:logs        # View logs
pnpm run prod:ps          # Check status
pnpm run prod:restart     # Restart services
pnpm run prod:build       # Build images
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Check: `netstat -tulpn \| grep <port>` |
| CORS errors | Verify CORS_ORIGIN in .env.preview |
| Database connection failed | Check DATABASE_URL and postgres health |
| Service unhealthy | Check logs: `docker logs <container-name>` |
| 404 on API | Check API Gateway routes and service URLs |

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-04
