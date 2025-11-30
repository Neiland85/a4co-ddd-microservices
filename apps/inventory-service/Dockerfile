# -------- BASE --------
FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && apk add --no-cache libc6-compat

# -------- DEPS --------
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/observability/package.json ./packages/observability/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY apps/inventory-service/package.json ./apps/inventory-service/
RUN pnpm install --frozen-lockfile

# -------- BUILD --------
FROM deps AS build
COPY packages/ ./packages/
COPY apps/inventory-service/ ./apps/inventory-service/
COPY tsconfig.base.json tsconfig.json ./
WORKDIR /app/apps/inventory-service
RUN pnpm run build

# -------- DEV --------
FROM deps AS dev
COPY packages/ ./packages/
COPY apps/inventory-service/ ./apps/inventory-service/
WORKDIR /app/apps/inventory-service
ENV NODE_ENV=development
EXPOSE 3005
CMD ["pnpm", "run", "start:dev"]

# -------- PROD --------
FROM node:20-alpine AS prod
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
COPY --from=build --chown=nodejs:nodejs /app/apps/inventory-service/dist ./dist
USER nodejs
ENV NODE_ENV=production
ENV PORT=3005
EXPOSE 3005
# Prometheus labels for service discovery
LABEL prometheus.io/scrape="true" \
      prometheus.io/port="3005" \
      prometheus.io/path="/metrics" \
      a4co.region="andalucia" \
      a4co.service="inventory-service"
# Non-strict healthcheck (warning only, won't fail container)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3005/health || true
CMD ["node", "dist/main.js"]
