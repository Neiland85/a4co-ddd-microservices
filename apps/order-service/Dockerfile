# -------- BASE --------
FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && apk add --no-cache libc6-compat

# -------- INSTALL --------
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY apps/order-service/package.json ./apps/order-service/
RUN pnpm install --frozen-lockfile

# -------- BUILD --------
FROM deps AS build
COPY apps/order-service ./apps/order-service
WORKDIR /app/apps/order-service
RUN pnpm run build

# -------- PROD --------
FROM node:22-alpine AS prod
WORKDIR /app
RUN corepack enable && apk add --no-cache libc6-compat
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/order-service/dist ./apps/order-service/dist
COPY --from=build /app/apps/order-service/node_modules ./apps/order-service/node_modules
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/order-service/dist/main.js"]
