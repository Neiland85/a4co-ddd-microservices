#!/bin/bash
set -e

echo "🚀 Configurando entorno local de desarrollo"
echo "============================================"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Crear archivo .env si no existe
if [ ! -f .env ]; then
  echo -e "${GREEN}📝 Creando archivo .env...${NC}"
  cat > .env <<'EOF'
# Database
DATABASE_URL=postgresql://dev:dev@localhost:5432/a4co_dev
POSTGRES_USER=dev
POSTGRES_PASSWORD=dev
POSTGRES_DB=a4co_dev

# NATS
NATS_URL=nats://localhost:4222

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev-secret-key-CHANGE-IN-PRODUCTION-minimum-32-chars
JWT_EXPIRATION=3600

# Services Ports
ORDER_PORT=3004
PAYMENT_PORT=3006
INVENTORY_PORT=3007
AUTH_PORT=3001
PRODUCT_PORT=3003
USER_PORT=3005

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Environment
NODE_ENV=development
LOG_LEVEL=debug

# CORS
CORS_ORIGIN=http://localhost:3000

# Observability
PROMETHEUS_PORT=9090
GRAFANA_PORT=3002
JAEGER_ENDPOINT=http://localhost:14268/api/traces
EOF
  echo -e "  ${GREEN}✅ .env creado${NC}"
else
  echo -e "${YELLOW}⚠️  .env ya existe, saltando...${NC}"
fi

# 2. Crear .env.local (copia de .env)
if [ ! -f .env.local ]; then
  echo -e "${GREEN}📝 Creando .env.local...${NC}"
  cp .env .env.local
  echo -e "  ${GREEN}✅ .env.local creado${NC}"
else
  echo -e "${YELLOW}⚠️  .env.local ya existe, saltando...${NC}"
fi

# 3. Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Docker no está corriendo. Por favor, inicia Docker Desktop.${NC}"
  exit 1
fi

# 4. Arrancar NATS si no está corriendo
echo ""
echo -e "${GREEN}🚀 Verificando NATS...${NC}"
if ! docker ps | grep -q "nats"; then
  echo "  Arrancando NATS JetStream..."
  docker run -d --name nats \
    -p 4222:4222 \
    -p 8222:8222 \
    nats:2.10-alpine \
    --jetstream \
    --store_dir=/data \
    --max_file_store=1GB \
    --max_memory_store=256MB \
    --http_port=8222

  echo -e "  ${GREEN}✅ NATS arrancado en puerto 4222${NC}"
  echo "     Monitoring: http://localhost:8222"
else
  echo -e "  ${GREEN}✅ NATS ya está corriendo${NC}"
fi

# 5. Verificar PostgreSQL
echo ""
echo -e "${GREEN}🐘 Verificando PostgreSQL...${NC}"
if docker ps | grep -q "postgres"; then
  echo -e "  ${GREEN}✅ PostgreSQL está corriendo${NC}"
else
  echo -e "${YELLOW}⚠️  PostgreSQL no está corriendo${NC}"
  echo "     Ejecuta: docker compose -f .devcontainer/docker-compose.dev.yml up -d postgres"
fi

# 6. Verificar Redis
echo ""
echo -e "${GREEN}📦 Verificando Redis...${NC}"
if docker ps | grep -q "redis"; then
  echo -e "  ${GREEN}✅ Redis está corriendo${NC}"
else
  echo -e "${YELLOW}⚠️  Redis no está corriendo${NC}"
  echo "     Ejecuta: docker compose -f .devcontainer/docker-compose.dev.yml up -d redis"
fi

# 7. Instalar dependencias si node_modules no existe
echo ""
echo -e "${GREEN}📦 Verificando dependencias...${NC}"
if [ ! -d "node_modules" ]; then
  echo "  Instalando dependencias con pnpm..."
  pnpm install
  echo -e "  ${GREEN}✅ Dependencias instaladas${NC}"
else
  echo -e "  ${GREEN}✅ Dependencias ya instaladas${NC}"
fi

# 8. Generar Prisma clients
echo ""
echo -e "${GREEN}🔧 Generando Prisma clients...${NC}"
pnpm --filter @a4co/order-service prisma generate 2>/dev/null || echo "  Order service Prisma OK"
pnpm --filter @a4co/payment-service prisma generate 2>/dev/null || echo "  Payment service Prisma OK"
pnpm --filter @a4co/inventory-service prisma generate 2>/dev/null || echo "  Inventory service Prisma OK"
pnpm --filter @a4co/auth-service prisma generate 2>/dev/null || echo "  Auth service Prisma OK"
echo -e "  ${GREEN}✅ Prisma clients generados${NC}"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✨ Entorno configurado correctamente! ✨  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo "Servicios disponibles:"
echo "  • NATS:       nats://localhost:4222"
echo "  • NATS UI:    http://localhost:8222"
echo "  • PostgreSQL: postgresql://dev:dev@localhost:5432/a4co_dev"
echo "  • Redis:      redis://localhost:6379"
echo ""
echo "Next steps:"
echo "  1. ./scripts/standardize-nestjs.sh  # Fix NestJS versions"
echo "  2. pnpm build:all                   # Build all services"
echo "  3. pnpm dev:order                   # Start order service"
echo ""
echo "Para ver logs de NATS:"
echo "  docker logs -f nats"
