FROM node:20-alpine AS builder
RUN npm install -g pnpm@8 turbo @nestjs/cli
WORKDIR /app

# Copiamos TODO lo necesario del monorepo
COPY pnpm-lock.yaml pnpm-workspace.yaml turbo.json package.json ./
COPY apps/gateway ./apps/gateway
COPY packages/shared-utils ./packages/shared-utils

# Instalamos dependencias del workspace
RUN pnpm install --force

# Build solo del gateway
RUN pnpm run build --filter @a4co/gateway

# Stage producción
FROM node:20-alpine
RUN npm install -g pnpm@8
WORKDIR /app

COPY --from=builder /app/apps/gateway/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/main"]
