FROM node:22-alpine AS base
WORKDIR /usr/src/app
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && apk add --no-cache libc6-compat

FROM base AS deps
COPY ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./
COPY ../../package.json ./
COPY ../../apps/inventory-service/package.json ./apps/inventory-service/
RUN pnpm install

FROM deps AS build
WORKDIR /usr/src/app/apps/inventory-service
COPY . .
RUN pnpm run build

FROM deps AS dev
WORKDIR /usr/src/app/apps/inventory-service
ENV NODE_ENV=development
EXPOSE 3000
CMD ["pnpm", "run", "start:dev"]

FROM node:22-alpine AS prod
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/apps/inventory-service/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
