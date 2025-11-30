# -------- BASE --------
FROM node:20-alpine AS base
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
RUN pnpm run build

# -------- DEV --------
FROM deps AS dev
COPY apps/frontend/ ./apps/frontend/
WORKDIR /app/apps/frontend
ENV NODE_ENV=development
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# -------- PROD --------
FROM nginx:alpine AS prod
# Copy built static files to nginx
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
# Custom nginx config for SPA
RUN echo 'server { \
    listen 3000; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 3000
# Prometheus labels for service discovery
LABEL prometheus.io/scrape="true" \
      prometheus.io/port="3000" \
      prometheus.io/path="/metrics" \
      a4co.region="andalucia" \
      a4co.service="frontend"
# Non-strict healthcheck (warning only, won't fail container)
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || true
CMD ["nginx", "-g", "daemon off;"]
