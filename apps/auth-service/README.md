# Auth Service

## Overview

- **Puerto:** 3001
- **Framework:** NestJS 10.x
- **Database:** Prisma + PostgreSQL

## Quick Start

```bash
cd apps/auth-service
pnpm install
pnpm start:dev
```

## API Endpoints

- POST /api/v1/auth/login
- POST /api/v1/auth/register
- POST /api/v1/auth/refresh
- GET /api/v1/auth/profile
- POST /api/v1/auth/logout

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
