# Production Deployment Guide

## 📋 Overview

This guide provides step-by-step instructions for deploying the A4CO DDD Microservices platform to production using Docker and Docker Compose.

## 🎯 Prerequisites

Before deploying to production, ensure you have:

### Infrastructure Requirements
- **Server**: Linux server (Ubuntu 22.04 LTS recommended)
- **RAM**: Minimum 8GB, recommended 16GB+
- **CPU**: Minimum 4 cores, recommended 8+ cores
- **Disk**: Minimum 50GB SSD storage
- **Docker**: Version 24.0+ installed
- **Docker Compose**: Version 2.20+ installed

### Network Requirements
- **Ports**: 80 (HTTP), 443 (HTTPS) open to public
- **Firewall**: Configured to allow necessary ports
- **Domain**: DNS configured pointing to your server
- **SSL Certificate**: Valid SSL certificate (Let's Encrypt recommended)

### Access Requirements
- **SSH Access**: Root or sudo access to production server
- **GitHub**: Access to container registry (GHCR) or Docker Hub
- **Secrets**: Access to secrets management system

## 📦 Deployment Methods

### Method 1: Manual Deployment (Recommended for Initial Setup)

#### Step 1: Prepare the Server

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Verify installations
docker --version
docker compose version
```

#### Step 2: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/a4co-ddd-microservices.git
cd a4co-ddd-microservices

# Checkout the main branch
git checkout main
```

#### Step 3: Configure Environment Variables

```bash
# Copy the template
cp .env.production.template .env.production

# Edit with your secure values
nano .env.production
```

**Required Variables to Configure:**

1. **Database**
   ```env
   POSTGRES_PASSWORD=<generate-strong-password>
   REDIS_PASSWORD=<generate-strong-password>
   ```

2. **JWT Authentication**
   ```bash
   # Generate secure JWT secret
   openssl rand -base64 64
   ```
   ```env
   JWT_SECRET=<paste-generated-secret>
   ```

3. **Stripe Payment Gateway**
   ```env
   STRIPE_SECRET_KEY=sk_live_<your-stripe-key>
   STRIPE_WEBHOOK_SECRET=whsec_<your-webhook-secret>
   ```

4. **CORS & Domain**
   ```env
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   ```

#### Step 4: Set Up SSL Certificates

**Option A: Using Let's Encrypt (Recommended)**

```bash
# Install certbot
sudo apt install certbot

# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates to project
sudo mkdir -p infra/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem infra/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem infra/ssl/key.pem
sudo chown -R $USER:$USER infra/ssl
```

**Option B: Using Custom Certificates**

```bash
# Create SSL directory
mkdir -p infra/ssl

# Copy your certificates
cp /path/to/your/cert.pem infra/ssl/cert.pem
cp /path/to/your/key.pem infra/ssl/key.pem
```

#### Step 5: Build Docker Images

```bash
# Build all services
docker compose -f docker-compose.prod.yml build

# Verify images
docker images | grep a4co
```

#### Step 6: Initialize Database

```bash
# Start only PostgreSQL first
docker compose -f docker-compose.prod.yml up -d postgres

# Wait for PostgreSQL to be healthy
docker compose -f docker-compose.prod.yml ps postgres

# Run migrations (if applicable)
docker compose -f docker-compose.prod.yml exec postgres psql -U postgres -d microservices_db -f /docker-entrypoint-initdb.d/init.sql
```

#### Step 7: Start All Services

```bash
# Start all services
docker compose -f docker-compose.prod.yml --env-file .env.production up -d

# Check status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

#### Step 8: Verify Deployment

```bash
# Check health endpoints
curl http://localhost/health
curl http://localhost/api/v1/health

# Test authentication endpoint
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Method 2: CI/CD Automated Deployment

See `.github/workflows/deploy-prod.yml` for automated deployment configuration.

#### GitHub Actions Setup

1. **Configure Secrets in GitHub**
   - Go to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `DOCKER_REGISTRY_TOKEN`
     - `PRODUCTION_SERVER_SSH_KEY`
     - `PRODUCTION_ENV_FILE` (base64 encoded .env.production)
     - `POSTGRES_PASSWORD`
     - `JWT_SECRET`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_WEBHOOK_SECRET`

2. **Trigger Deployment**
   ```bash
   # Push to main branch
   git push origin main

   # Or trigger manually
   gh workflow run deploy-prod.yml
   ```

## 🔍 Post-Deployment Verification

### 1. Health Checks

```bash
# Check all service health
docker compose -f docker-compose.prod.yml ps

# Individual service health
curl http://localhost/health
curl http://localhost/api/v1/health
curl http://localhost:4000/health  # Auth service
curl http://localhost:3000/health  # Order service
curl http://localhost:3001/health  # Payment service
curl http://localhost:3002/health  # Inventory service
```

### 2. Database Connectivity

```bash
# Connect to PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres psql -U postgres -d microservices_db

# Check databases
\l

# Check connections
SELECT * FROM pg_stat_activity;
```

### 3. Message Broker (NATS)

```bash
# Check NATS monitoring
curl http://localhost:8222/varz

# Check JetStream status
curl http://localhost:8222/jsz
```

### 4. Application Functionality

- **Frontend**: Visit https://yourdomain.com
- **Dashboard**: Visit https://yourdomain.com/dashboard
- **API Docs**: Visit https://yourdomain.com/api/docs (if enabled)
- **Authentication**: Test login/register flows
- **Orders**: Create a test order
- **Payments**: Process a test payment

## 📊 Monitoring

### Log Management

```bash
# View all logs
docker compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker compose -f docker-compose.prod.yml logs -f auth-service
docker compose -f docker-compose.prod.yml logs -f order-service

# Export logs
docker compose -f docker-compose.prod.yml logs --no-color > logs_$(date +%Y%m%d_%H%M%S).txt
```

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Network status
docker network ls
docker network inspect a4co-ddd-microservices_backend-net
```

### Application Metrics

- **NATS Monitoring**: http://your-server:8222
- **Database Monitoring**: Use pg_stat_statements extension
- **Custom Metrics**: Integrate Prometheus/Grafana (see observability docs)

## 🔄 Updates and Rollbacks

### Rolling Update

```bash
# Pull latest changes
git pull origin main

# Rebuild changed services
docker compose -f docker-compose.prod.yml build

# Restart services with zero downtime
docker compose -f docker-compose.prod.yml up -d --no-deps --build auth-service
docker compose -f docker-compose.prod.yml up -d --no-deps --build order-service
```

### Rollback

```bash
# Checkout previous version
git checkout <previous-commit-hash>

# Rebuild and restart
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

## 🛡️ Security Checklist

Before going live, verify:

- [ ] All secrets are stored securely (not in code)
- [ ] SSL/TLS certificates are valid and configured
- [ ] Firewall rules are properly configured
- [ ] Database passwords are strong (20+ characters)
- [ ] JWT secret is cryptographically secure
- [ ] CORS origins are properly restricted
- [ ] Rate limiting is enabled
- [ ] Security headers are configured
- [ ] Swagger/debug endpoints are disabled
- [ ] Database backups are configured
- [ ] Monitoring and alerting are set up
- [ ] Log rotation is configured
- [ ] Non-root users are used in containers

## 🚨 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs <service-name>

# Check environment variables
docker compose -f docker-compose.prod.yml config

# Verify network connectivity
docker compose -f docker-compose.prod.yml exec <service-name> ping postgres
```

### Database Connection Issues

```bash
# Check PostgreSQL status
docker compose -f docker-compose.prod.yml exec postgres pg_isready

# Check connection from service
docker compose -f docker-compose.prod.yml exec auth-service nc -zv postgres 5432
```

### High Memory Usage

```bash
# Check container memory
docker stats --no-stream

# Adjust resource limits in docker-compose.prod.yml
# See deploy.resources.limits sections
```

### Certificate Renewal (Let's Encrypt)

```bash
# Renew certificates
sudo certbot renew

# Copy renewed certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem infra/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem infra/ssl/key.pem

# Restart nginx
docker compose -f docker-compose.prod.yml restart nginx
```

## 📞 Support

For production support:
- **Documentation**: [https://github.com/your-org/a4co-ddd-microservices/docs](./README.md)
- **Issues**: [GitHub Issues](https://github.com/your-org/a4co-ddd-microservices/issues)
- **Security**: security@yourdomain.com

## 📚 Additional Resources

- [Security Guidelines](./SECURITY.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [Architecture Documentation](./architecture/README.md)
- [API Documentation](./REST_ENDPOINTS_DOCUMENTATION.md)
- [Monitoring Setup](./PRODUCTION_MONITORING_SETUP.md)
