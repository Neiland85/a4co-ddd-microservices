#!/bin/bash
# Script para normalizar Dockerfiles

# Define el template de Dockerfile normalizado
DOCKERFILE_TEMPLATE='# -------- BASE --------
FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && apk add --no-cache libc6-compat

# -------- INSTALL --------
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY apps/SERVICE_NAME/package.json ./apps/SERVICE_NAME/
RUN pnpm install --frozen-lockfile

# -------- BUILD --------
FROM deps AS build
COPY apps/SERVICE_NAME ./apps/SERVICE_NAME
WORKDIR /app/apps/SERVICE_NAME
RUN pnpm run build

# -------- PROD --------
FROM node:22-alpine AS prod
WORKDIR /app
RUN corepack enable && apk add --no-cache libc6-compat
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/SERVICE_NAME/dist ./apps/SERVICE_NAME/dist
COPY --from=build /app/apps/SERVICE_NAME/node_modules ./apps/SERVICE_NAME/node_modules
ENV NODE_ENV=production
EXPOSE PORT
CMD ["node", "apps/SERVICE_NAME/dist/main.js"]'
