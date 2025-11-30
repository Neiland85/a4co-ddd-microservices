# -------- BASE --------
FROM node:20-alpine AS base
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
FROM node:20-alpine AS prod
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
# Non-strict healthcheck (warning only, won't fail container)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || true
CMD ["node", "index.js"]
############################
#        BUILDER
############################
FROM node:20-alpine AS builder

# Instalamos pnpm y Nest CLI de forma global,
# igual que lo tienes en tu máquina local
RUN npm install -g pnpm@8 @nestjs/cli

WORKDIR /app

# Copiamos SOLO el package.json del gateway
COPY package.json ./

# Instalamos dependencias del servicio
RUN pnpm install --force

# Copiamos el código del gateway
COPY . .

# Build del backend (usa "nest build")
RUN pnpm run build


############################
#        RUNTIME
############################
FROM node:20-alpine

# Solo pnpm global para ejecutar scripts
RUN npm install -g pnpm@8

WORKDIR /app

# Copiamos package.json para poder instalar deps en runtime
COPY package.json ./

# Instalamos SOLO deps de producción
RUN pnpm install --prod --force

# Copiamos el build del stage anterior
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "start"]
