# Development Dockerfile for auth-service
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root workspace files
COPY ../../package.json ../../pnpm-lock.yaml ./

# Copy shared packages
COPY ../../packages/shared-utils ./packages/shared-utils
COPY ../../packages/observability ./packages/observability

# Copy auth-service
COPY . ./apps/auth-service

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared packages first
RUN pnpm --filter shared-utils build
RUN pnpm --filter observability build

# Build auth-service
WORKDIR /app/apps/auth-service
RUN pnpm build

# Expose port
EXPOSE 3001

# Development command with hot reload
CMD ["pnpm", "start:dev"]
