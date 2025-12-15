# ================================================================================
# Multi-stage Dockerfile for Product Service (Production-Ready)
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
COPY apps/product-service/package.json ./apps/product-service/
COPY packages ./packages

# Install dependencies
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# -------- BUILDER --------
FROM deps AS builder
WORKDIR /usr/src/app

# Copy source code
COPY apps/product-service ./apps/product-service
COPY packages ./packages

# Generate Prisma client (if schema exists)
WORKDIR /usr/src/app/apps/product-service
RUN if [ -f "prisma/schema.prisma" ]; then pnpm exec prisma generate; fi

# Build the application
RUN pnpm run build

# -------- PRODUCTION --------
FROM base AS production
WORKDIR /usr/src/app

# Copy node_modules from deps stage
COPY --from=deps --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=deps --chown=nestjs:nodejs /usr/src/app/apps/product-service/node_modules ./apps/product-service/node_modules

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/apps/product-service/dist ./apps/product-service/dist
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/apps/product-service/package.json ./apps/product-service/

# Copy Prisma schema and generated client (if exists)
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/apps/product-service/prisma ./apps/product-service/prisma
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/node_modules/.prisma ./node_modules/.prisma

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
WORKDIR /usr/src/app/apps/product-service

# Start the application
CMD ["node", "dist/main.js"]
