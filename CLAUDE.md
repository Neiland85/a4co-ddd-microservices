# A4CO DDD Microservices Platform - AI Assistant Guide

This guide provides comprehensive information about the A4CO codebase structure, development workflows, and conventions for AI assistants working on this project.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture & Structure](#architecture--structure)
- [Development Workflow](#development-workflow)
- [Code Quality & Standards](#code-quality--standards)
- [Testing Strategy](#testing-strategy)
- [Build & Deployment](#build--deployment)
- [Nx Workspace Guidelines](#nx-workspace-guidelines)
- [Common Tasks & Operations](#common-tasks--operations)
- [Key Conventions](#key-conventions)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

**A4CO** is a Domain-Driven Design (DDD) microservices platform built for Andalusian small commerce collaboration. The platform implements **hexagonal architecture** with event-driven communication.

### Tech Stack Summary

- **Backend**: NestJS, TypeScript, PostgreSQL, Prisma, NATS JetStream
- **Frontend**: Next.js 15, React 19, Vite, Tailwind CSS, shadcn/ui
- **Infrastructure**: Docker, Nginx, Redis, Prometheus, Grafana, Loki
- **Tooling**: pnpm 10.14.0, Turbo, Nx 22.1.0, Jest, Playwright
- **Message Broker**: NATS 2.10 with JetStream
- **Observability**: Prometheus + Grafana + Loki + AlertManager

### Prerequisites

- Node.js 22+
- pnpm 10.14.0+
- Docker & Docker Compose 2.20+
- PostgreSQL 16+

---

## Architecture & Structure

### Monorepo Organization

The project uses a **pnpm workspace** with **Nx** and **Turbo** for task orchestration:

```
/
├── apps/                      # Applications and services
│   ├── services/             # Core microservices
│   │   ├── order-service/    # Order lifecycle & saga orchestration (Port 3004)
│   │   ├── payment-service/  # Payment processing (Port 3005)
│   │   ├── inventory-service/ # Stock management (Port 3006)
│   │   ├── auth-service/     # Authentication & authorization
│   │   ├── user-service/     # User account management
│   │   └── product-service/  # Product catalog
│   ├── infrastructure/       # Infrastructure services
│   │   ├── gateway/          # API Gateway (Port 8080)
│   │   └── notification-service/ # Event-driven notifications
│   ├── dashboard-client/     # React Vite client app (Port 3001)
│   ├── dashboard-web/        # Next.js 15 admin dashboard
│   └── frontend/             # Main customer-facing app
├── packages/                  # Shared packages
│   ├── domain/               # DDD domain models
│   │   ├── order/            # Order aggregate, VOs, events, repositories
│   │   ├── payment/          # Payment domain
│   │   ├── inventory/        # Inventory domain
│   │   └── shared/           # Shared kernel (Money VO, common types)
│   ├── shared-utils/         # Base classes, DTOs, utilities
│   ├── shared-events/        # Versioned domain events
│   ├── observability/        # Metrics, tracing, monitoring
│   └── design-system/        # UI components
├── libs/                      # Nx libraries
│   ├── config/               # Configuration management
│   └── shared-events/        # Event definitions
├── infra/                     # Infrastructure configs
│   ├── observability/        # Grafana, Prometheus, Loki configs
│   ├── nats/                 # NATS configuration
│   └── docker/               # Dockerfiles and compose files
├── docs/                      # Documentation
│   ├── adr/                  # Architecture Decision Records
│   ├── architecture/         # Architecture diagrams
│   └── compliance/           # Compliance documentation
└── scripts/                   # Automation scripts
```

### Hexagonal Architecture (Ports & Adapters)

Each microservice follows this consistent structure:

```
service/src/
├── domain/                    # Domain layer
│   ├── entities/             # Entities and aggregates
│   ├── value-objects/        # Immutable value objects
│   ├── events/               # Domain events (versioned)
│   ├── errors/               # Domain errors
│   ├── repositories/         # Repository interfaces (ports)
│   └── services/             # Domain services
├── application/              # Application layer
│   ├── use-cases/            # Use case implementations
│   ├── commands/             # Command handlers
│   ├── queries/              # Query handlers
│   └── sagas/                # Saga orchestration
├── infrastructure/           # Infrastructure layer
│   ├── repositories/         # Repository implementations (adapters)
│   ├── event-handlers/       # Event handlers
│   ├── messaging/            # NATS integration
│   └── metrics/              # Prometheus metrics
├── presentation/             # Presentation layer
│   ├── controllers/          # HTTP controllers
│   └── dtos/                 # Data transfer objects
├── contracts/                # API contracts
└── __tests__/               # Tests
    ├── unit/
    ├── integration/
    └── e2e/
```

### Event-Driven Architecture

- **Message Broker**: NATS JetStream for reliable event delivery
- **Saga Pattern**: Orchestration-based (Order Service is orchestrator)
- **Event Versioning**: All events are versioned (e.g., `order.created.v1`)
- **Correlation IDs**: Track requests across services

**Order Flow Example**:
```
Order Created → Inventory Reserved → Payment Processed → Order Confirmed
             ↓ (failure)          ↓ (failure)
        Compensating Transaction (Rollback)
```

### Domain-Driven Design Principles

1. **Bounded Contexts**: Each domain (Order, Payment, Inventory) is isolated
2. **Aggregates**: Enforce business invariants (e.g., Order aggregate)
3. **Value Objects**: Immutable concepts (e.g., Money, OrderId)
4. **Domain Events**: State changes communicate via events
5. **Repository Pattern**: Abstract data access with port interfaces
6. **Ubiquitous Language**: Consistent terminology across code and docs

### Path Aliases

The project uses TypeScript path aliases (defined in `tsconfig.base.json`):

```typescript
"@/*"                    → "src/*"
"@test/*"               → "test/*"
"@a4co/shared-utils"    → "packages/shared-utils/src/index.ts"
"@a4co/observability"   → "packages/observability/src"
"@a4co/shared-events"   → "packages/shared-events/dist"
"@a4co/domain-order"    → "packages/domain/order/src/index.ts"
"@a4co/domain-shared"   → "packages/domain/shared/src/index.ts"
"@a4co/domain-payment"  → "packages/domain/payment/src/index.ts"
"@a4co/domain-inventory"→ "packages/domain/inventory/src/index.ts"
```

---

## Development Workflow

### Initial Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma clients
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Start all services
pnpm run dev:all
```

### Environment Configuration

- Copy `.env.example` to `.env` for local development
- Each service may have its own `.env.example` file
- **NEVER** commit `.env` or `.env.production` files
- Generate JWT secrets with: `openssl rand -base64 64`

### Running Services

```bash
# Development
pnpm run dev:all              # All services in parallel
pnpm run dev:backend          # Backend services only
pnpm run dev:frontend         # Frontend only
pnpm run dev:order            # Specific service (order)
pnpm run dev:payment          # Specific service (payment)
pnpm run dev:inventory        # Specific service (inventory)

# Preview/Staging
pnpm run preview:start        # Automated setup and start
pnpm run preview:up           # Start services
pnpm run preview:logs         # View logs
pnpm run preview:down         # Stop services

# Production
pnpm run prod:up              # Start production stack
pnpm run prod:logs            # View logs
pnpm run prod:down            # Stop services
```

### Database Operations

```bash
# Generate Prisma client
pnpm run db:generate          # All services
turbo run prisma:generate     # Via Turbo

# Migrations
pnpm run db:migrate           # Run migrations
turbo run prisma:migrate      # Via Turbo

# Prisma Studio
pnpm run prisma:studio        # Open database GUI
```

### Observability Stack

```bash
# Start observability infrastructure
pnpm run observability:up
# Access Grafana at http://localhost:3000 (admin/admin)

# View logs
pnpm run observability:logs

# Stop stack
pnpm run observability:down
```

### Git Workflow

- **Main branch**: `main` (production-ready)
- **Feature branches**: `feature/description` or `claude/session-id`
- **Commit convention**: Conventional Commits (e.g., `feat:`, `fix:`, `docs:`)
- **Pre-commit hooks**: Automatically run linting via `simple-git-hooks`
- **Post-commit hooks**: Update CSpell dictionaries

---

## Code Quality & Standards

### TypeScript Configuration

- **Target**: ES2022
- **Module**: CommonJS (backend), ESM (frontend)
- **Strict mode**: Enabled
- **Key settings**:
  - `strictNullChecks: true`
  - `noImplicitReturns: true`
  - `experimentalDecorators: true` (for NestJS)
  - `emitDecoratorMetadata: true` (for NestJS)

### ESLint Configuration

**Root config**: `eslint.config.js` (Flat config format)

**Key rules**:
```javascript
{
  'no-console': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
}
```

**Running linting**:
```bash
pnpm run lint              # All packages
pnpm run lint:fix          # Auto-fix issues
turbo run lint             # Via Turbo (cached)
```

**Per-service configs**: Each service has its own `eslint.config.js`

### Prettier Configuration

**File**: `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Markdown Linting

```bash
pnpm run lint:md           # Check markdown files
pnpm run lint:md:fix       # Auto-fix markdown issues
```

### Code Style Guidelines

1. **Naming Conventions**:
   - Classes: PascalCase (e.g., `OrderService`)
   - Files: kebab-case (e.g., `order-service.ts`)
   - Interfaces: PascalCase with "I" prefix optional (e.g., `OrderRepository`)
   - Enums: PascalCase (e.g., `OrderStatus`)
   - Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)

2. **File Organization**:
   - One class per file (exceptions for small helpers)
   - Index files (`index.ts`) for barrel exports
   - Tests co-located with source: `__tests__/` directory

3. **Import Order**:
   - External dependencies first
   - Internal packages (`@a4co/*`)
   - Relative imports last
   - Group by blank lines

4. **Comments**:
   - Use JSDoc for public APIs
   - Inline comments for complex logic only
   - No commented-out code (use git history)

---

## Testing Strategy

### Testing Pyramid

1. **Unit Tests** (Jest)
2. **Integration Tests** (Jest + Testcontainers)
3. **E2E Tests** (Playwright)

### Unit Tests

**Framework**: Jest with ts-jest

**Location**: `src/__tests__/unit/` or co-located `*.spec.ts` files

**Configuration**: Each service has `jest.config.cjs`

**Running tests**:
```bash
pnpm run test              # All tests
pnpm run test:all          # Via Turbo
turbo run test             # With caching

# Specific service
pnpm --filter @a4co/order-service test

# With coverage
pnpm run test:coverage
```

**Test structure**:
```typescript
describe('OrderService', () => {
  describe('createOrder', () => {
    it('should create order with valid data', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Integration Tests

**Location**: `tests/integration/` or `src/__tests__/integration/`

**Tools**: Jest + Testcontainers (for DB/NATS)

**Purpose**: Test service interactions with databases and message brokers

### E2E Tests

**Framework**: Playwright

**Location**: `apps/dashboard-client/e2e/`

**Running E2E tests**:
```bash
# Automated setup and run
./scripts/run-e2e-tests.sh

# Interactive UI mode
./scripts/run-e2e-tests.sh --ui

# Headed mode (see browser)
./scripts/run-e2e-tests.sh --headed

# View report
cd apps/dashboard-client
pnpm run test:e2e:report
```

**E2E Coverage** (14 tests):
- ✅ User Authentication (JWT)
- ✅ Product Catalog Browsing
- ✅ Order Creation via Gateway
- ✅ Payment Processing & NATS Events
- ✅ Order Confirmation
- ✅ Happy Path Flow
- ✅ Saga Rollback (payment failure)
- ✅ Event Traceability

**Prerequisites**:
- Docker & Docker Compose v2
- Ports available: 8081, 3001, 4223, 8222, 5433, 6380

### Testing Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **Descriptive test names**: `should <expected behavior> when <condition>`
3. **Mock external dependencies**: Use Jest mocks for external services
4. **Test isolation**: Each test should be independent
5. **Coverage goals**: Aim for 80%+ on critical paths
6. **Fast tests**: Unit tests should run in milliseconds

---

## Build & Deployment

### Build System

**Primary tool**: Turbo (task orchestration with caching)

**Nx Integration**: Nx 22.1.0 for workspace management

### Build Configuration

**File**: `nx.json`

```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build", "generate"],
      "outputs": ["{projectRoot}/dist/**"],
      "cache": true
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": true
    }
  }
}
```

### Building the Project

```bash
# All packages
pnpm run build
pnpm run build:all         # Via Turbo (parallel + cached)

# Specific service
turbo run build --filter=@a4co/order-service
```

### Docker Deployment

**Environments**:
1. **Development**: `compose.dev.yaml`
2. **Preview/Staging**: `docker-compose.preview.yml`
3. **Production**: `docker-compose.prod.yml`
4. **Observability**: `docker-compose.observability.yml`
5. **Testing**: `docker-compose.test.yml`

**Network Topology** (Production):
```
┌─────────────────┐
│  frontend-net   │ (Public: Nginx, Dashboard)
└────────┬────────┘
         │
┌────────┴────────┐
│   backend-net   │ (Services: Gateway, Order, Payment, Inventory)
└────────┬────────┘
         │
┌────────┴────────┐
│    data-net     │ (Data stores: PostgreSQL, Redis, NATS)
└─────────────────┘
```

**Key features**:
- Multi-stage Docker builds
- Non-root container users
- Minimal Alpine base images
- Health checks for all services
- Volume persistence for data
- Resource limits and constraints

### Deployment Commands

```bash
# Preview environment
./start-preview.sh         # Automated setup
pnpm run preview:up
pnpm run preview:down

# Production environment
pnpm run prod:build        # Build images
pnpm run prod:up           # Start stack
pnpm run prod:logs         # Monitor logs
pnpm run prod:restart      # Restart services
pnpm run prod:down         # Stop stack
```

### CI/CD

**Platform**: GitHub Actions

**Workflows**: `.github/workflows/`

**Key pipelines**:
- Build and test on PR
- E2E tests on PR to main/develop
- Security scanning
- Docker image builds
- Deployment to staging/production

### Secrets Management

**Production checklist**:
- ✅ Never commit `.env.production`
- ✅ Use strong passwords (20+ chars)
- ✅ Generate JWT secrets: `openssl rand -base64 64`
- ✅ Rotate secrets every 90 days
- ✅ Use secret vaults (GitHub Secrets, AWS Secrets Manager, etc.)

---

## Nx Workspace Guidelines

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->

---

## Common Tasks & Operations

### Adding a New Microservice

1. Create service directory: `apps/services/new-service/`
2. Copy structure from existing service (e.g., `order-service`)
3. Update `package.json` with service name and dependencies
4. Create domain models in `packages/domain/new-domain/`
5. Define events in `packages/shared-events/`
6. Add Prisma schema if needed
7. Configure Dockerfile and add to compose files
8. Add tests and documentation

### Adding a Domain Event

1. Define event in `packages/domain/{context}/events/`
2. Version the event: `event-name.v1.ts`
3. Export from domain package index
4. Implement event handler in consuming services
5. Add integration tests

### Adding a New Shared Package

1. Create package: `packages/new-package/`
2. Add `package.json` with scope `@a4co/`
3. Add `tsconfig.json` extending base config
4. Update path aliases in `tsconfig.base.json`
5. Export public API from `index.ts`
6. Add to pnpm workspace if needed

### Debugging Services

```bash
# View service logs
docker compose -f docker-compose.preview.yml logs -f order-service

# View all logs
docker compose -f docker-compose.preview.yml logs -f

# Check service health
docker compose -f docker-compose.preview.yml ps

# Access service container
docker compose -f docker-compose.preview.yml exec order-service sh

# View NATS events
docker compose -f docker-compose.preview.yml logs -f nats

# View metrics
curl http://localhost:3004/orders/metrics
```

### Performance Monitoring

- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **NATS Monitoring**: http://localhost:8222

**Available dashboards**:
- Main Dashboard: HTTP metrics, latency, availability
- Events Dashboard: Event throughput, errors, latency
- NATS Dashboard: Clients, JetStream, consumer lag

### Cleaning the Project

```bash
# Standard clean
pnpm run clean              # Remove build artifacts

# Deep clean
pnpm run clean:deep         # Remove node_modules and build artifacts

# Clean Docker
docker compose -f docker-compose.preview.yml down -v
```

---

## Key Conventions

### API Design

1. **RESTful endpoints**: Use standard HTTP methods
2. **Versioning**: Include version in URL (e.g., `/api/v1/orders`)
3. **Response format**: Consistent DTOs (ResponseDTO, ErrorDTO)
4. **Error handling**: Standard error codes and messages
5. **Pagination**: Use PaginationDTO for list endpoints
6. **Documentation**: Swagger/OpenAPI annotations

### Event Naming

- **Format**: `{domain}.{action}.{version}`
- **Examples**:
  - `order.created.v1`
  - `payment.processed.v1`
  - `inventory.reserved.v1`

### Error Handling

1. **Domain errors**: Custom error classes in `domain/errors/`
2. **HTTP errors**: Use NestJS built-in exceptions
3. **Logging**: Structured logging with context
4. **Observability**: Track errors in metrics

### Database Conventions

1. **Table names**: Snake_case, plural (e.g., `orders`, `payment_transactions`)
2. **Column names**: Snake_case (e.g., `created_at`, `user_id`)
3. **Primary keys**: `id` (UUID preferred)
4. **Timestamps**: `created_at`, `updated_at` on all tables
5. **Soft deletes**: `deleted_at` nullable timestamp

### Environment Variables

- **Format**: UPPER_SNAKE_CASE
- **Prefixes**: Group by concern (e.g., `DATABASE_*`, `JWT_*`)
- **Defaults**: Provide sensible defaults in code
- **Validation**: Validate on application startup

---

## Troubleshooting

### Common Issues

**Build errors**:
```bash
# Clear caches
rm -rf .turbo node_modules/.cache
pnpm install
pnpm run build
```

**TypeScript errors**:
```bash
# Regenerate types
pnpm run db:generate
# Check tsconfig paths
# Ensure all referenced packages are built
```

**Test failures**:
```bash
# Check Docker is running
docker ps
# Ensure ports are available
# Clear test databases
docker compose -f docker-compose.test.yml down -v
```

**NATS connection issues**:
```bash
# Check NATS is running
docker compose -f docker-compose.preview.yml ps nats
# View NATS logs
docker compose -f docker-compose.preview.yml logs nats
# Check NATS monitoring
curl http://localhost:8222/healthz
```

**E2E test issues**:
- **NATS healthcheck fails**: View logs with `docker compose -f docker-compose.test.yml logs nats-test`
- **Services not starting**: Ensure Docker Compose v2 (`docker compose version`)
- **Port conflicts**: Check ports 8081, 3001, 4223, 8222, 5433, 6380 are free

### Getting Help

- **Documentation**: See `docs/` directory
- **ADRs**: Architecture decisions in `docs/adr/`
- **API Docs**: `docs/REST_ENDPOINTS_DOCUMENTATION.md`
- **Observability**: `docs/PR4-OBSERVABILITY-SETUP.md`
- **Security**: `docs/SECURITY.md`
- **E2E Testing**: `docs/e2e-tests.md`

---

## Additional Resources

- **Main README**: `/README.md` - Project overview and quick start
- **Architecture docs**: `/docs/architecture/` - System architecture
- **ADRs**: `/docs/adr/` - Architecture decision records
- **Deployment Guide**: `/DEPLOYMENT_GUIDE.md` - Production deployment
- **Quick Reference**: `/QUICK_REFERENCE.md` - Command reference
- **Security Guide**: `/docs/SECURITY.md` - Security best practices
- **Observability**: `/infra/observability/README.md` - Monitoring setup

---

**Last Updated**: 2026-01-12

**Maintainers**: A4CO Development Team

**License**: Apache License 2.0
