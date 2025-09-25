# A4CO DDD Microservices - AI Agent Guidelines

## 🏗️ Architecture Overview

**Domain-Driven Design (DDD) Microservices Monorepo** for Andalusian small commerce collaborative platform.

### Service Architecture
- **Backend Services**: NestJS with hexagonal architecture (`domain/`, `application/`, `infrastructure/`, `presentation/`)
- **Frontend**: Next.js 15 + React 19 + Tailwind CSS + shadcn/ui components
- **Shared Packages**: `@a4co/observability` (OpenTelemetry), `@a4co/design-system`, `@a4co/shared-utils`
- **Data Layer**: Prisma ORM with PostgreSQL
- **Communication**: REST APIs with Swagger docs, event-driven with domain events

### Key Structural Patterns

#### Hexagonal Architecture (Backend Services)
```
apps/{service-name}/src/
├── domain/           # Business rules, entities, value objects
├── application/      # Use cases, ports/interfaces
├── infrastructure/   # External concerns (DB, external APIs)
└── presentation/     # Controllers, DTOs, middleware
```

#### Domain Layer Organization
```
domain/
├── aggregates/       # Order, User, Product aggregates
├── events/          # Domain events (OrderCreated, PaymentSucceeded)
├── services/        # Domain services
└── value-objects/   # Email, Money, Address VOs
```

#### API Contract Pattern
```typescript
// apps/{service}/src/contracts/api/v1/
// - DTOs for request/response
// - Versioned contracts: CreateOrderV1Dto, OrderResponseV2Dto
```

## 🔧 Development Workflows

### Package Management
- **pnpm workspaces** for monorepo management
- **Turbo** for task orchestration and caching
- Run commands: `pnpm run {script}` or `turbo run {task}`

### Build & Run Commands
```bash
# Full monorepo build
pnpm run build

# Run all services in dev mode
pnpm run dev:all

# Frontend only (dashboard on port 3001)
pnpm run dev:frontend

# Backend services only
pnpm run dev:backend

# Database operations
pnpm run db:generate  # Generate Prisma client
pnpm run db:push      # Push schema to DB
pnpm run db:migrate   # Run migrations
```

### Testing Strategy
- **Jest** for unit/integration tests
- **Vitest** for design-system component tests
- **Playwright** for E2E tests (design-system)
- Coverage reports: `pnpm run test:coverage`

### Code Quality
- **ESLint** + **Prettier** with auto-fix
- **TypeScript strict mode** enabled
- **Husky** pre-commit hooks (when configured)

## 📋 Critical Patterns & Conventions

### 1. Domain Event Versioning
```typescript
// ❌ Avoid: Unversioned events
export const ORDER_CREATED = "order.created";

// ✅ Required: Versioned events
export const ORDER_CREATED_V1 = "order.created.v1";
export const ORDER_CREATED_V2 = "order.created.v2";
```

### 2. API Contract Versioning
- Each service must have: `apps/{service}/src/contracts/api/v1/`
- DTOs for requests/responses with explicit versioning
- Use `class-validator` + `class-transformer` for validation

### 3. Observability Usage
```typescript
// ❌ Avoid: Business logic in observability
const dddLogger = logger.withDDD({
  aggregateName: 'Order',
  aggregateId: 'order-123',
  commandName: 'CreateOrder'
});

// ✅ Required: Domain-agnostic context
const contextLogger = logger.withContext({
  aggregate: req.headers['x-aggregate-type'],
  aggregateId: req.headers['x-aggregate-id'],
  operation: req.headers['x-operation-type']
});
```

### 4. Dependency Injection (NestJS)
```typescript
@Module({
  providers: [
    // Domain services
    { provide: 'UserRepositoryPort', useClass: PrismaUserRepository },
    // Application services
    CreateOrderUseCase,
    // Infrastructure
    PrismaService
  ],
  controllers: [OrderController]
})
export class OrderModule {}
```

### 5. Error Handling
- Use NestJS exception filters
- Domain errors vs infrastructure errors
- Consistent error response format

### 6. Security Middleware
```typescript
// Applied in main.ts
app.use(helmet({...}));
app.enableCors({...});
app.useGlobalPipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true
}));
```

## 🎨 Frontend Patterns

### Component Architecture
- **shadcn/ui** components in `@a4co/design-system`
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management

### File Structure (Next.js)
```
apps/dashboard-web/
├── app/              # Next.js 13+ app router
├── components/       # UI components
├── lib/             # Utilities, hooks
└── styles/          # Global styles
```

## 🔍 Integration Points

### Cross-Service Communication
- **REST APIs** for synchronous communication
- **Domain Events** for asynchronous communication
- **Shared DTOs** only for event contracts (not API contracts)

### External Dependencies
- **PostgreSQL** via Prisma
- **Redis** for caching (when configured)
- **AWS ECS Fargate** for deployment
- **OpenTelemetry** + Jaeger for tracing

## 🚫 Critical Anti-Patterns to Avoid

1. **Business Logic in Shared Packages**: Keep `@a4co/observability` domain-agnostic
2. **Tight Coupling**: Services should communicate via contracts, not direct imports
3. **Unversioned Contracts**: All APIs and events must be versioned
4. **Mixed Concerns**: Infrastructure code should not leak into domain/application layers

## 📚 Reference Materials

- **ADRs**: `docs/adr/` - Architecture decision records
- **API Docs**: Swagger UI on each service (`/api/docs`)
- **Component Library**: `@a4co/design-system` Storybook
- **Database Schema**: Prisma schema files in each service

## 🤖 AI Agent Best Practices

- Always check existing patterns before implementing new features
- Use the established DDD structure for backend services
- Follow the design system for consistent UI components
- Reference ADRs for architectural decisions
- Test changes across the monorepo before committing

---

*This document should be updated as the codebase evolves. Last updated: 2025-01-25*