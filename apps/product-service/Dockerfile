# Development Dockerfile for product-service
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root workspace files
COPY ../../package.json ../../pnpm-lock.yaml ./

# Copy shared packages
COPY ../../packages/shared-utils ./packages/shared-utils
COPY ../../packages/observability ./packages/observability

# Copy product-service
COPY . ./apps/product-service

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared packages first
RUN pnpm --filter shared-utils build
RUN pnpm --filter observability build

# Build product-service
WORKDIR /app/apps/product-service
RUN pnpm build

# Expose port
EXPOSE 3000

# Development command with hot reload
CMD ["pnpm", "start:dev"]
