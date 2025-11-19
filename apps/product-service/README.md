# Product Service

## Overview

- **Puerto:** 3003
- **Framework:** NestJS 10.x
- **Database:** Prisma + PostgreSQL

## Quick Start

```bash
cd apps/product-service
pnpm install
pnpm start:dev
```

## API Endpoints

- POST /api/v1/products
- GET /api/v1/products
- GET /api/v1/products/:id
- PATCH /api/v1/products/:id
- DELETE /api/v1/products/:id

## Testing

```bash
pnpm test
pnpm test:coverage
```

## Architecture

- Domain layer: `src/domain/`
- Application layer: `src/application/`
- Infrastructure: `src/infrastructure/`
- Presentation: `src/presentation/`

