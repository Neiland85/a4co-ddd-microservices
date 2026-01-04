# GitHub Actions Workflows - Disabled

## Status: Workflows Disabled ❌

All GitHub Actions workflows have been disabled and moved to `.github/workflows-disabled/` to simplify the CI/CD pipeline and reduce runner complexity.

### Why Were Workflows Disabled?

The workflows were consuming excessive runner minutes and adding unnecessary complexity. The project has been simplified to use **local development and manual deployment** instead.

### Disabled Workflows

The following workflows have been disabled:

1. **ci.yml** → `ci.yml.disabled`
   - Previously: Lint, Test, Build, Deploy
   - Now: Use local scripts instead

2. **e2e.yml** → `e2e.yml.disabled`
   - Previously: End-to-end tests with Docker
   - Now: Run E2E tests locally

3. **deploy-production.yml** → `deploy-production.yml.disabled`
   - Previously: Docker build and deployment
   - Now: Use manual deployment scripts

### Alternative: Local Scripts

Instead of GitHub Actions, use the following local scripts:

#### 🧹 Cleanup Scripts

```bash
# Clean build artifacts and cache
pnpm run clean

# Deep cleanup (removes everything including node_modules)
pnpm run clean:deep

# Or use the scripts directly
./scripts/cleanup.sh
./scripts/cleanup-deep.sh
```

#### 🚀 Setup & Development

```bash
# Complete setup (after clone or deep cleanup)
pnpm run setup

# Start development
pnpm run dev

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Lint code
pnpm run lint
```

#### 🏗️ Build & Deploy

```bash
# Build for production
pnpm run build

# Build specific service
pnpm --filter @a4co/auth-service build

# Start with Docker Compose
docker compose up -d

# Deploy to production (manual)
docker compose -f docker-compose.prod.yml up -d
```

### Composite Actions (Still Available)

The reusable composite action for monorepo setup is still available at:
- `.github/actions/setup-monorepo/action.yml`

This can be used if workflows are re-enabled in the future.

### Re-enabling Workflows

If you need to re-enable workflows:

```bash
cp .github/workflows-disabled/ci.yml.disabled .github/workflows/ci.yml
cp .github/workflows-disabled/e2e.yml.disabled .github/workflows/e2e.yml
cp .github/workflows-disabled/deploy-production.yml.disabled .github/workflows/deploy-production.yml
```

### Benefits of Disabling Workflows

✅ **No runner costs** - Zero GitHub Actions minutes consumed
✅ **Faster development** - No waiting for CI to complete
✅ **More control** - Developers run tests locally before pushing
✅ **Simpler architecture** - Less infrastructure to maintain
✅ **Local-first** - All commands work locally without CI dependency

---

**Last Updated:** 2026-01-04
**Status:** Workflows disabled, using local scripts instead
