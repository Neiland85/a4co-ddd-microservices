# Development Dockerfile for inventory-service
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root workspace files
COPY ../../package.json ../../pnpm-lock.yaml ./

# Copy shared packages
COPY ../../packages/shared-utils ./packages/shared-utils
COPY ../../packages/observability ./packages/observability

# Copy inventory-service
COPY . ./apps/inventory-service

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared packages first
RUN pnpm --filter shared-utils build
RUN pnpm --filter observability build

# Build inventory-service
WORKDIR /app/apps/inventory-service
RUN pnpm build

# Expose port
EXPOSE 3003

# Development command with hot reload
CMD ["pnpm", "start:dev"]
