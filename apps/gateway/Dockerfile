# -------- BASE --------
FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && apk add --no-cache libc6-compat

# -------- DEPS --------
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/gateway/package.json ./apps/gateway/
RUN pnpm install --frozen-lockfile

# -------- BUILD --------
FROM deps AS build
COPY apps/gateway/ ./apps/gateway/
WORKDIR /app/apps/gateway
# Gateway is a simple Express app without build step
RUN echo "No build step required for gateway"

# -------- DEV --------
FROM deps AS dev
COPY apps/gateway/ ./apps/gateway/
WORKDIR /app/apps/gateway
ENV NODE_ENV=development
EXPOSE 3000
CMD ["node", "index.js"]

# -------- PROD --------
FROM node:22-alpine AS prod
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
COPY --from=deps /app/apps/gateway/package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/apps/gateway/index.js ./
USER nodejs
ENV NODE_ENV=production
EXPOSE 3000
# Prometheus labels for service discovery
LABEL prometheus.io/scrape="true" \
      prometheus.io/port="3000" \
      prometheus.io/path="/metrics" \
      a4co.region="andalucia" \
      a4co.service="gateway"
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["node", "index.js"]
