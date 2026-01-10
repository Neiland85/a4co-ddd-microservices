<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly.
- You have access to the Nx MCP server and its tools; use them to help the user.
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` MCP tool to analyze and understand the specific project structure and dependencies.
- For questions around Nx configuration, best practices, or if unsure, use the `nx_docs` tool to get relevant, up-to-date documentation.
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to identify issues.

<!-- nx configuration end-->

---

# a4co-ddd-microservices — Agent Operating Rules

This repository is a **DDD-first monorepo** using **Nx + pnpm** with strict architectural boundaries.

All AI assistants (Gemini, Copilot, others) MUST follow these rules.

---

## 1. Architectural Model (MANDATORY)

### Layers

- **Domain**
  - Pure business logic
  - Entities, Value Objects, Aggregates, Domain Events
  - ❌ No framework imports
  - ❌ No Prisma / HTTP / NestJS
  - ❌ No application or infrastructure dependencies

- **Application**
  - Use cases, DTOs, ports (interfaces)
  - Orchestrates domain logic
  - Depends ONLY on domain
  - ❌ No Prisma / HTTP controllers

- **Infrastructure**
  - Prisma, repositories, external services
  - Implements application ports
  - Depends on application + domain

- **Presentation**
  - Controllers, guards, middleware, DTO validation
  - Depends on application
  - No domain logic

Any suggestion that violates these rules is INVALID.

---

## 2. Bounded Context Rules

- Each bounded context lives in its own folder:
  - `packages/domain-*`
  - or `apps/*-service`
- ❌ No cross-imports between bounded contexts
- Communication is done ONLY via:
  - Application-level DTOs
  - Events (async)
- No shared entities across domains

---

## 3. TypeScript & Tooling Rules

- TypeScript strict mode is enforced
- Respect `tsconfig.base.json`
- Use path aliases exclusively:
  - `@a4co/domain-*`
  - `@a4co/shared-utils`
- ❌ No fragile relative imports across packages
- Builds must work with:
  - `nx build`
  - `pnpm -r run build`

---

## 4. Nx & Monorepo Discipline

- Always reason in terms of:
  - project boundaries
  - dependency graph
- Do NOT suggest:
  - moving files across contexts without justification
  - global tsconfig hacks
- Prefer incremental, scoped changes

---

## 5. DTO Strategy (IMPORTANT)

- DTOs are **application-layer contracts**
- DTOs may live in:
  - `packages/application-dtos` (preferred)
- Domain entities are NEVER exposed to the frontend
- Mapping is done in application services

---

## 6. AI Interaction Rules

- Gemini:
  - Used for architecture, refactors, decisions
  - Must validate structure before proposing changes
- Copilot:
  - Used for implementation details
  - Must follow existing patterns
- No speculative code
- No “quick fixes” that break architecture

---

## 7. Build Stability First

- If build is broken:
  - Fix build BEFORE adding features
- Avoid parallel changes across many packages
- Prefer sequential validation

---

## 8. Definition of Done

A change is considered DONE only if:

- Architecture rules are respected
- Nx graph remains valid
- Build passes or failure is explicitly understood
- No new cross-context coupling is introduced

---

This file is the **single source of truth** for how this monorepo is evolved.
