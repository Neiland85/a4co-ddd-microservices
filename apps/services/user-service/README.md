# User Service

## Overview

- **Puerto:** 3005
- **Framework:** NestJS 10.x
- **Database:** Prisma + PostgreSQL

## Quick Start

```bash
cd apps/user-service
pnpm install
pnpm start:dev
```

## API Endpoints

- POST /api/v1/users
- GET /api/v1/users
- GET /api/v1/users/:id
- PATCH /api/v1/users/:id
- DELETE /api/v1/users/:id

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

