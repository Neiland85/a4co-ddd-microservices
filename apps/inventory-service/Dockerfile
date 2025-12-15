# ================================================================================
# Multi-stage Dockerfile for Inventory Service (Production-Ready)
# ================================================================================

# -------- BASE --------
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# Install pnpm and basic dependencies
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && \
    apk add --no-cache libc6-compat curl && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# -------- DEPENDENCIES --------
FROM base AS deps
WORKDIR /usr/src/app

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/inventory-service/package.json ./apps/inventory-service/
COPY packages/observability/package.json ./packages/observability/ 2>/dev/null || true
COPY packages/shared-utils/package.json ./packages/shared-utils/ 2>/dev/null || true

# Install dependencies
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# -------- BUILDER --------
FROM deps AS builder
WORKDIR /usr/src/app

# Copy source code
COPY apps/inventory-service ./apps/inventory-service
COPY packages ./packages

# Generate Prisma client
WORKDIR /usr/src/app/apps/inventory-service
RUN pnpm exec prisma generate 2>/dev/null || true

# Build the application
RUN pnpm run build

# -------- PRODUCTION --------
FROM base AS production
WORKDIR /usr/src/app

# Copy node_modules from deps stage
COPY --from=deps --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=deps --chown=nestjs:nodejs /usr/src/app/apps/inventory-service/node_modules ./apps/inventory-service/node_modules

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/apps/inventory-service/dist ./apps/inventory-service/dist
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/apps/inventory-service/package.json ./apps/inventory-service/

# Copy Prisma schema and generated client
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/apps/inventory-service/prisma ./apps/inventory-service/prisma 2>/dev/null || true
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/node_modules/.prisma ./node_modules/.prisma 2>/dev/null || true

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3002/health || exit 1

# Working directory
WORKDIR /usr/src/app/apps/inventory-service

# Start the application
CMD ["node", "dist/main.js"]
