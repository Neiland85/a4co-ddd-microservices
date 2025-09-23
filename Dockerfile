# Multi-stage build for Node.js monorepo with pnpm
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy workspace packages
COPY packages/ ./packages/
COPY apps/ ./apps/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build all packages
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from base stage
COPY --from=base --chown=nodejs:nodejs /app/package.json ./
COPY --from=base --chown=nodejs:nodejs /app/pnpm-lock.yaml ./
COPY --from=base --chown=nodejs:nodejs /app/packages ./packages
COPY --from=base --chown=nodejs:nodejs /app/apps ./apps

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod && pnpm store prune

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')"

# Default command
CMD ["pnpm", "start"]
