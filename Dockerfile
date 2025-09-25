# Optimized multi-stage build for CI/CD
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm@10.14.0 turbo

WORKDIR /app

# Copy workspace config first (for better caching)
COPY pnpm-workspace.yaml turbo.json ./

# Copy root package.json
COPY package.json pnpm-lock.yaml ./

# Copy package.json files for dependency resolution
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

# Install ALL dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build only essential packages (skip heavy ones like design-system if not needed)
RUN pnpm run build --filter="!@a4co/design-system" --filter="!dashboard-web"

# Production stage - minimal runtime
FROM node:20-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm@10.14.0

WORKDIR /app

# Copy built artifacts only
COPY --from=base /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=base /app/apps/*/dist ./apps/
COPY --from=base /app/packages/*/dist ./packages/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Expose port
EXPOSE 3000

# Default command (override in docker-compose for specific services)
CMD ["sh", "-c", "echo 'Multi-service image built successfully. Use docker-compose for individual services.'"]
