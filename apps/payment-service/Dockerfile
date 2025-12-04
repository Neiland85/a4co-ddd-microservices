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
COPY apps/payment-service/package.json ./apps/payment-service/
RUN pnpm install --frozen-lockfile

# -------- BUILD --------
FROM deps AS build
COPY apps/payment-service ./apps/payment-service
WORKDIR /app/apps/payment-service
RUN pnpm run build

# -------- PROD --------
FROM node:22-alpine AS prod
WORKDIR /app
RUN corepack enable && apk add --no-cache libc6-compat
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/payment-service/dist ./apps/payment-service/dist
COPY --from=build /app/apps/payment-service/node_modules ./apps/payment-service/node_modules
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "apps/payment-service/dist/main.js"]
