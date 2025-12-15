# 🛍️ A4CO - DDD Microservices Platform

A Domain-Driven Design (DDD) microservices platform built with **NestJS**, **Next.js**, and **NATS** for Andalusian small commerce collaboration.

## 🏗️ Architecture

This project follows a **hexagonal architecture** with **DDD principles**:
- Domain-driven microservices (Order, Payment, Inventory, Auth, Product)
- Event-driven communication via NATS JetStream
- API Gateway for unified access
- Observability stack (Prometheus, Grafana, Loki)
- Production-ready Docker infrastructure

## 🚀 Quick Start

### Development Environment

#### Prerequisites

- Node.js 22+
- pnpm 10.14.0+
- Docker & Docker Compose 2.20+
- PostgreSQL 16+

#### Installation

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma clients
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Start all services in development
pnpm run dev:all

# Or start specific services
pnpm run dev:backend  # Backend services only
pnpm run dev:frontend # Frontend only
```

### Production Deployment

#### Quick Deploy with Docker Compose

```bash
# Create production environment file
cp .env.production.template .env.production
# Edit .env.production with secure values

# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

For detailed production deployment instructions, see:
- **[Production Deployment Guide](docs/PRODUCTION_DEPLOY.md)** - Complete deployment walkthrough
- **[Production Checklist](docs/PRODUCTION_CHECKLIST.md)** - Pre-deployment verification
- **[Security Guidelines](docs/SECURITY.md)** - Security best practices

#### CI/CD Automated Deployment

Automated deployment via GitHub Actions:
1. Push to `main` branch triggers build
2. Docker images are built and pushed to GHCR
3. Manual deployment via workflow dispatch
4. Smoke tests verify deployment

See `.github/workflows/deploy-production.yml` for configuration.

## 📁 Estructura del Proyecto

```
src/
├── modules/           # Módulos de negocio
│   ├── auth/         # Autenticación
│   ├── products/     # Gestión de productos
│   ├── orders/       # Pedidos
│   ├── users/        # Usuarios
│   └── artisans/     # Artesanos
├── common/           # Utilidades compartidas
├── config/           # Configuración
└── main.ts           # Punto de entrada
```

## 🛠️ Scripts Disponibles

- `npm run start:dev` - Inicia en modo desarrollo
- `npm run build` - Construye para producción
- `npm run start:prod` - Inicia en modo producción
- `npm run test` - Ejecuta tests
- `npm run lint` - Ejecuta linter

## 🗄️ Base de Datos

### Prisma ORM

- Schema: `prisma/schema.prisma`
- Migraciones: `npm run prisma:migrate`
- Studio: `npm run prisma:studio`

### Variables de Entorno

```env
DATABASE_URL="postgresql://user:password@localhost:5432/artisan_portal"
JWT_SECRET="your-secret-key"
```

## 📦 Technology Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Architecture**: Hexagonal (Ports & Adapters) + DDD
- **Database**: PostgreSQL 16 with Prisma ORM
- **Message Broker**: NATS 2.10 with JetStream
- **Authentication**: JWT with refresh tokens
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + Supertest
- **E2E Testing**: Playwright + Testcontainers

### Frontend
- **Dashboard**: Next.js 15 + React 19
- **Main App**: Vite + React
- **UI Components**: shadcn/ui + Tailwind CSS
- **State**: Zustand
- **Animation**: Framer Motion

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose (production-ready)
- **Reverse Proxy**: Nginx with SSL/TLS + rate limiting
- **Caching**: Redis 7
- **CI/CD**: GitHub Actions
- **Registry**: GitHub Container Registry (GHCR)

### Observability
- **Metrics**: Prometheus + prom-client
- **Visualization**: Grafana
- **Logging**: Loki + Promtail
- **Tracing**: OpenTelemetry (optional)
- **Alerting**: AlertManager

### Security
- **Network Isolation**: Segregated Docker networks
- **Secrets Management**: Environment variables + GitHub Secrets
- **Container Security**: Non-root users, minimal base images
- **API Security**: Rate limiting, CORS, security headers
- **Database**: SSL/TLS connections, encrypted passwords

## 📊 Observabilidad (PR4)

El proyecto incluye una infraestructura completa de observabilidad para monitoreo, logging y alertas.

### Stack de Observabilidad

- **Grafana**: Dashboards y visualización
- **Prometheus**: Recolección de métricas
- **Loki**: Agregación de logs
- **Promtail**: Recolección de logs
- **AlertManager**: Gestión de alertas
- **NATS Exporter**: Métricas de NATS

### Inicio Rápido

```bash
# Iniciar stack de observabilidad
./scripts/start-observability.sh

# Acceder a Grafana
# URL: http://localhost:3000 (admin/admin)
```

### Dashboards Disponibles

- **Main Dashboard**: Métricas HTTP, latencia, disponibilidad
- **Events Dashboard**: Eventos publicados/consumidos, errores, latencia
- **NATS Dashboard**: Clientes, throughput, JetStream, consumer lag

### Documentación

- **Guía Rápida**: `infra/observability/README.md`
- **Documentación Completa**: `docs/PR4-OBSERVABILITY-SETUP.md` (50KB)

### Comandos Útiles

```bash
# Ver logs
docker-compose -f docker-compose.observability.yml logs -f

# Detener stack
./scripts/stop-observability.sh

# Detener y eliminar datos
./scripts/stop-observability.sh --remove-volumes
```

## 🧪 Testing

### E2E Testing Suite

Comprehensive End-to-End tests for the complete order flow using Playwright and Testcontainers.

**Quick Start:**
```bash
# Run E2E tests (automated setup)
./scripts/run-e2e-tests.sh

# Run with UI mode (interactive)
./scripts/run-e2e-tests.sh --ui

# Run in headed mode (see browser)
./scripts/run-e2e-tests.sh --headed

# View test report
cd apps/dashboard-client
pnpm run test:e2e:report
```

**Test Coverage (14 tests):**
- ✅ User Authentication (JWT)
- ✅ Product Catalog Browsing
- ✅ Order Creation via Gateway
- ✅ Payment Processing & NATS Events
- ✅ Order Confirmation
- ✅ Happy Path Flow (successful order)
- ✅ Saga Rollback (payment failure)
- ✅ Event Traceability & Correlation

**Documentation:**
- [E2E Testing Guide](docs/e2e-tests.md) - Complete documentation
- [Quick Start Guide](docs/e2e-quick-start.md) - Get started in 3 steps
- [Dashboard E2E README](apps/dashboard-client/e2e/README.md) - Test structure

**CI/CD Integration:**
- Automated tests on every PR to `main`/`develop`
- Blocks merge on test failures
- Artifacts: HTML reports, videos, screenshots

### Unit & Integration Tests

```bash
# Run all tests
pnpm run test

# Run tests for specific service
pnpm --filter @a4co/order-service test
pnpm --filter @a4co/payment-service test
pnpm --filter @a4co/inventory-service test

# Run with coverage
pnpm run test:coverage
```

## 🔒 Security

### Production Security Recommendations

**Before deploying to production**, ensure you:

1. **Secrets Management**
   - Never commit `.env.production` to version control
   - Use strong passwords (20+ characters with mixed case, numbers, symbols)
   - Generate JWT secret with: `openssl rand -base64 64`
   - Store secrets in secure vault (GitHub Secrets, AWS Secrets Manager, HashiCorp Vault)
   - Rotate secrets every 90 days

2. **SSL/TLS Configuration**
   - Obtain valid SSL certificates (Let's Encrypt recommended)
   - Enable HSTS after testing
   - Use TLS 1.2+ only
   - Configure strong cipher suites

3. **Network Security**
   - Configure firewall (allow only ports 80, 443, 22)
   - Enable rate limiting (configured in nginx)
   - Use DDoS protection (Cloudflare or equivalent)
   - Restrict CORS origins to your domain only

4. **Database Security**
   - Use strong database passwords
   - Enable SSL connections
   - Configure regular automated backups
   - Test backup restoration
   - Limit database access to backend network only

5. **Container Security**
   - All containers run as non-root users
   - Use minimal base images (alpine)
   - Regular security scanning (Trivy, Snyk)
   - Keep base images updated

For detailed security guidelines, see **[docs/SECURITY.md](docs/SECURITY.md)**

### Secrets Management Options

- **GitHub Secrets**: For CI/CD workflows
- **AWS Secrets Manager**: For AWS deployments
- **HashiCorp Vault**: For enterprise deployments
- **Azure Key Vault**: For Azure deployments
- **1Password/LastPass**: For team secret sharing

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow DDD principles and hexagonal architecture
- Write tests for new features
- Update documentation
- Follow existing code style (ESLint + Prettier)
- Keep commits atomic and well-described

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 📞 Support & Documentation

- **Production Guide**: [docs/PRODUCTION_DEPLOY.md](docs/PRODUCTION_DEPLOY.md)
- **Security Guide**: [docs/SECURITY.md](docs/SECURITY.md)
- **Architecture**: [docs/architecture/](docs/architecture/)
- **API Docs**: [docs/REST_ENDPOINTS_DOCUMENTATION.md](docs/REST_ENDPOINTS_DOCUMENTATION.md)
- **Observability**: [docs/PR4-OBSERVABILITY-SETUP.md](docs/PR4-OBSERVABILITY-SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/Neiland85/a4co-ddd-microservices/issues)

