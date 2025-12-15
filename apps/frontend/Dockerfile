# ================================================================================
# Multi-stage Dockerfile for Frontend (Vite) - Production-Ready
# ================================================================================

# -------- BASE --------
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# Install pnpm and basic dependencies
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && \
    apk add --no-cache libc6-compat curl

# -------- DEPENDENCIES --------
FROM base AS deps
WORKDIR /usr/src/app

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages ./packages

# Install dependencies
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# -------- BUILDER --------
FROM deps AS builder
WORKDIR /usr/src/app

# Copy source code
COPY apps/frontend ./apps/frontend
COPY packages ./packages

# Build the application
WORKDIR /usr/src/app/apps/frontend
RUN pnpm run build

# -------- DEVELOPMENT --------
FROM deps AS development
WORKDIR /usr/src/app

# Copy source code
COPY apps/frontend ./apps/frontend
COPY packages ./packages

# Set environment
ENV NODE_ENV=development
WORKDIR /usr/src/app/apps/frontend

EXPOSE 3000

# Health check for dev mode
HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=5 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["pnpm", "run", "dev"]

# -------- PRODUCTION --------
FROM nginx:alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built assets
COPY --from=builder /usr/src/app/apps/frontend/dist /usr/share/nginx/html

# Create simple nginx configuration for SPA
RUN echo 'events { worker_connections 1024; } \n\
http { \n\
  include /etc/nginx/mime.types; \n\
  default_type application/octet-stream; \n\
  server { \n\
    listen 80; \n\
    root /usr/share/nginx/html; \n\
    index index.html; \n\
    location / { \n\
      try_files $uri $uri/ /index.html; \n\
    } \n\
  } \n\
}' > /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
