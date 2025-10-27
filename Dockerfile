# Optimized multi-stage build for CI/CD
dependabot/docker/node-25-alpine
FROM node:25-alpine AS base
FROM node:20-alpine3.19 AS base
main

# Install pnpm and turbo globally
RUN npm install -g pnpm@8 turbo

# Set working directory
WORKDIR /app

# Copy workspace config and package files for dependency caching
COPY pnpm-workspace.yaml turbo.json package.json pnpm-lock.yaml ./
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

# Install all dependencies (including dev dependencies for building) with force to handle lockfile issues
RUN pnpm install --frozen-lockfile --force

# Copy source code
COPY . .

# Build all packages
RUN pnpm run build

# Development stage - with hot reload support
dependabot/docker/node-25-alpine
FROM node:25-alpine AS development
FROM node:20-alpine3.19 AS development
main

# Install pnpm and turbo globally
RUN npm install -g pnpm@8 turbo

# Set working directory
WORKDIR /app

# Copy workspace config and package files
COPY pnpm-workspace.yaml turbo.json package.json pnpm-lock.yaml ./
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

# Install all dependencies (including dev dependencies) with force
RUN pnpm install --frozen-lockfile --force

# Copy source code
COPY . .

# Expose port (default for development)
EXPOSE 3000

# Default command for development
CMD ["pnpm", "run", "dev"]

# Production stage - minimal runtime
FROM node:25-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm@8

# Set working directory
WORKDIR /app

# Copy built artifacts and package files
COPY --from=base /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=base /app/apps/*/dist ./apps/
COPY --from=base /app/packages/*/dist ./packages/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Expose port (default for production)
EXPOSE 3000

# Default command for production (override in docker-compose for specific services)
CMD ["pnpm", "run", "start"]
