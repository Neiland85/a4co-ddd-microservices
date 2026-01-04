# 🚀 Preview & Production Deployment Guide

## Overview

This guide covers the deployment process for A4CO DDD Microservices across different environments:

- **Development**: Local development with hot-reload
- **Preview/Staging**: Testing environment before production
- **Production**: Live production environment

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Preview Environment](#preview-environment)
3. [Production Environment](#production-environment)
4. [Verification Steps](#verification-steps)
5. [Troubleshooting](#troubleshooting)
6. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Software

- **Docker**: Version 20.10 or later
- **Docker Compose**: Version 2.0 or later
- **Node.js**: Version 18 or later (for local development)
- **pnpm**: Version 8 or later

### Verify Installation

```bash
docker --version
docker-compose --version
node --version
pnpm --version
```

### Clone Repository

```bash
git clone https://github.com/Neiland85/a4co-ddd-microservices.git
cd a4co-ddd-microservices
```

---

## Preview Environment

The preview environment is designed for testing and validating changes before deploying to production.

### Quick Start

Run the automated setup script:

```bash
./start-preview.sh
```

This script will:
1. Check prerequisites
2. Create `.env.preview` if it doesn't exist
3. Build Docker images
4. Start all services
5. Wait for services to be healthy
6. Display access information

### Manual Setup

If you prefer manual setup:

#### 1. Create Environment File

```bash
cp .env.preview.example .env.preview
```

Edit `.env.preview` with your configuration:

```bash
# Required changes:
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_here
REDIS_PASSWORD=your_redis_password
```

#### 2. Build Images

```bash
pnpm run preview:build
# or
docker-compose -f docker-compose.preview.yml --env-file .env.preview build
```

#### 3. Start Services

```bash
pnpm run preview:up
# or
docker-compose -f docker-compose.preview.yml --env-file .env.preview up -d
```

#### 4. Check Status

```bash
pnpm run preview:ps
# or
docker-compose -f docker-compose.preview.yml --env-file .env.preview ps
```

### Preview Services

Once running, access:

#### Frontend Applications
- **Dashboard (Next.js)**: http://localhost:3001
- **Main Frontend (Vite)**: http://localhost:5173

#### Backend Services
- **API Gateway**: http://localhost:8080
- **API Gateway Health**: http://localhost:8080/api/v1/health
- **API Gateway Swagger**: http://localhost:8080/api/docs
- **Auth Service**: http://localhost:4000
- **Order Service**: http://localhost:3000
- **Payment Service**: http://localhost:3001 (note: conflicts with dashboard on prod)
- **Inventory Service**: http://localhost:3002
- **Product Service**: http://localhost:3003

#### Infrastructure
- **PostgreSQL**: localhost:5432
- **NATS**: localhost:4222
- **NATS Monitoring**: http://localhost:8222
- **Redis**: localhost:6379

### Preview Management Commands

```bash
# View all logs
pnpm run preview:logs

# View specific service logs
docker-compose -f docker-compose.preview.yml --env-file .env.preview logs -f api-gateway

# Restart all services
pnpm run preview:restart

# Restart specific service
docker-compose -f docker-compose.preview.yml --env-file .env.preview restart api-gateway

# Stop all services
pnpm run preview:down

# Stop and remove volumes (clean slate)
docker-compose -f docker-compose.preview.yml --env-file .env.preview down -v
```

---

## Production Environment

The production environment uses optimized configurations with security best practices.

### Pre-Production Checklist

Before deploying to production, ensure:

- ✅ All tests pass in preview environment
- ✅ Security audit completed
- ✅ Environment variables configured securely
- ✅ SSL/TLS certificates ready (if applicable)
- ✅ Database backups configured
- ✅ Monitoring and alerting set up
- ✅ Rollback plan prepared

### Setup Production

#### 1. Create Production Environment File

```bash
cp .env.production.template .env.production
```

#### 2. Configure Production Variables

Edit `.env.production` with **strong, unique values**:

```bash
# CRITICAL: Change these values!
POSTGRES_PASSWORD=<strong-password-min-20-chars>
JWT_SECRET=<generate-with-openssl-rand-base64-64>
REDIS_PASSWORD=<strong-redis-password>

# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Set production mode
USE_SIMULATED_PAYMENT=false
NODE_ENV=production
LOG_LEVEL=info

# Production CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

#### 3. Generate Secure Secrets

```bash
# Generate JWT Secret
openssl rand -base64 64

# Generate strong passwords
openssl rand -base64 32
```

#### 4. Build Production Images

```bash
pnpm run prod:build
# or
docker-compose -f docker-compose.prod.yml --env-file .env.production build
```

#### 5. Start Production Services

```bash
pnpm run prod:up
# or
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

#### 6. Verify Production Deployment

```bash
pnpm run prod:ps

# Check health endpoints
curl http://localhost/api/v1/health
```

### Production Management Commands

```bash
# View logs
pnpm run prod:logs

# View specific service logs
docker-compose -f docker-compose.prod.yml --env-file .env.production logs -f api-gateway

# Restart services
pnpm run prod:restart

# Stop services
pnpm run prod:down

# Update services (rolling update)
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --no-deps --build <service-name>
```

---

## Verification Steps

### 1. Verify Infrastructure

```bash
# Check database connection
docker exec a4co-preview-postgres pg_isready -U postgres

# Check NATS
curl http://localhost:8222/healthz

# Check Redis
docker exec a4co-preview-redis redis-cli ping
```

### 2. Verify Backend Services

```bash
# API Gateway health
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

### 3. Verify Frontend Applications

```bash
# Dashboard (Next.js)
curl http://localhost:3001

# Frontend (Vite)
curl http://localhost:5173
```

### 4. Test Frontend-Backend Integration

1. Open dashboard: http://localhost:3001
2. Try to login (if auth is configured)
3. Check browser console for API calls
4. Verify API calls reach backend: `pnpm run preview:logs | grep api-gateway`

### 5. Test Service Communication

```bash
# Check NATS communication
docker logs a4co-preview-nats

# Check service logs for event messages
docker-compose -f docker-compose.preview.yml --env-file .env.preview logs | grep "Event"
```

---

## Troubleshooting

### Services Not Starting

**Problem**: Services fail to start or show unhealthy status

**Solutions**:

```bash
# Check logs for errors
docker-compose -f docker-compose.preview.yml --env-file .env.preview logs

# Check specific service
docker logs a4co-preview-api-gateway

# Verify port availability
netstat -tulpn | grep -E '(3000|3001|4000|5432|6379)'

# Remove and recreate
docker-compose -f docker-compose.preview.yml --env-file .env.preview down -v
docker-compose -f docker-compose.preview.yml --env-file .env.preview up -d
```

### Database Connection Issues

**Problem**: Services can't connect to PostgreSQL

**Solutions**:

```bash
# Verify database is running
docker exec a4co-preview-postgres pg_isready

# Check database logs
docker logs a4co-preview-postgres

# Test connection
docker exec a4co-preview-postgres psql -U postgres -c "SELECT 1"

# Verify DATABASE_URL in .env.preview
cat .env.preview | grep DATABASE_URL
```

### Frontend Can't Connect to Backend

**Problem**: Frontend shows connection errors

**Solutions**:

1. **Check CORS configuration**:
   ```bash
   # Verify CORS_ORIGIN includes frontend URLs
   cat .env.preview | grep CORS_ORIGIN
   ```

2. **Check API Gateway logs**:
   ```bash
   docker logs a4co-preview-api-gateway
   ```

3. **Test API Gateway directly**:
   ```bash
   curl http://localhost:8080/api/v1/health
   ```

4. **Check browser console** for specific error messages

### Build Failures

**Problem**: Docker build fails

**Solutions**:

```bash
# Clean build cache
docker builder prune -a

# Rebuild without cache
docker-compose -f docker-compose.preview.yml --env-file .env.preview build --no-cache

# Check Dockerfile syntax
docker build -f apps/gateway/Dockerfile .
```

### Port Conflicts

**Problem**: Port already in use

**Solutions**:

```bash
# Find process using port
lsof -i :8080
netstat -tulpn | grep 8080

# Kill process or change port in docker-compose.preview.yml
# Edit ports section:
# ports:
#   - "8081:3000"  # Change host port
```

---

## Rollback Procedures

### Quick Rollback

If production deployment fails:

```bash
# Stop current deployment
pnpm run prod:down

# Restore from backup tag
git checkout <previous-stable-tag>

# Redeploy
pnpm run prod:build
pnpm run prod:up
```

### Database Rollback

```bash
# Restore database from backup
docker exec -i a4co-postgres psql -U postgres < backup.sql

# Or restore specific database
docker exec -i a4co-postgres psql -U postgres -d order_db < order_db_backup.sql
```

### Gradual Rollback

Roll back individual services:

```bash
# Rollback specific service
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --no-deps --build order-service
```

---

## Best Practices

### Security

- ✅ Never commit `.env.preview` or `.env.production` files
- ✅ Use strong, unique passwords (min 20 characters)
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Use SSL/TLS in production
- ✅ Enable firewall rules
- ✅ Regular security audits

### Monitoring

- ✅ Set up health check monitoring
- ✅ Configure log aggregation
- ✅ Enable error tracking (Sentry)
- ✅ Monitor resource usage
- ✅ Set up alerting for critical issues

### Backups

- ✅ Automated daily database backups
- ✅ Test restore procedures regularly
- ✅ Store backups off-site
- ✅ Keep backups for 30+ days

### Deployment

- ✅ Always test in preview first
- ✅ Deploy during low-traffic periods
- ✅ Use rolling updates for zero downtime
- ✅ Have rollback plan ready
- ✅ Monitor closely after deployment

---

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Production Best Practices](https://docs.nestjs.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [NATS Documentation](https://docs.nats.io/)

---

## Support

For issues or questions:

1. Check logs: `pnpm run preview:logs`
2. Review this documentation
3. Check [Troubleshooting](#troubleshooting) section
4. Open an issue on GitHub

---

**Last Updated**: 2026-01-04
**Version**: 1.0.0
