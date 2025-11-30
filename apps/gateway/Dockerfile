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
