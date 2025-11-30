# -------- BASE --------
FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && apk add --no-cache libc6-compat

# -------- DEPS --------
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile

# -------- BUILD --------
FROM deps AS build
COPY apps/frontend/ ./apps/frontend/
WORKDIR /app/apps/frontend
RUN pnpm run build || true

# -------- DEV --------
FROM deps AS dev
COPY apps/frontend/ ./apps/frontend/
WORKDIR /app/apps/frontend
ENV NODE_ENV=development
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# -------- PROD --------
FROM node:22-alpine AS prod
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
COPY --from=build --chown=nodejs:nodejs /app/apps/frontend/ ./
USER nodejs
ENV NODE_ENV=production
EXPOSE 3000
# Prometheus labels for service discovery
LABEL prometheus.io/scrape="true" \
      prometheus.io/port="3000" \
      prometheus.io/path="/metrics" \
      a4co.region="andalucia" \
      a4co.service="frontend"
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
CMD ["pnpm", "run", "start"]
