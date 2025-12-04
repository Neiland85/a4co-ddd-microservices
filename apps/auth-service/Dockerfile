FROM node:22-alpine

WORKDIR /app

# Copia archivos del monorepo (contexto es la raíz)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/auth-service ./apps/auth-service

# Instala dependencias
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Construye la aplicación
RUN pnpm --filter "@a4co/auth-service" build

EXPOSE 3002

CMD ["pnpm", "--filter", "@a4co/auth-service", "start:prod"]
