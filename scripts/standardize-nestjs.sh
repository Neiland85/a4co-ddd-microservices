#!/bin/bash
set -e

echo "🔧 Estandarizando versiones de NestJS a 11.x"
echo "=============================================="

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Target versions
NESTJS_VERSION="^11.1.8"
NESTJS_CONFIG_VERSION="^4.0.2"
NESTJS_JWT_VERSION="^11.0.1"
NESTJS_PASSPORT_VERSION="^10.0.3"
NESTJS_SWAGGER_VERSION="^11.2.1"
NESTJS_MICROSERVICES_VERSION="^11.1.8"

echo -e "${YELLOW}Target version: NestJS $NESTJS_VERSION${NC}"
echo ""

# Servicios a actualizar
services=(
  "apps/order-service"
  "apps/payment-service"
  "apps/inventory-service"
  "apps/auth-service"
  "apps/product-service"
  "apps/user-service"
  "apps/notification-service"
)

# Función para actualizar un servicio
update_service() {
  local service_path=$1
  local service_name=$(basename $service_path)

  if [ ! -f "$service_path/package.json" ]; then
    echo -e "${YELLOW}⚠️  Skipping $service_name (no package.json)${NC}"
    return
  fi

  echo -e "${GREEN}📦 Actualizando $service_name...${NC}"

  cd $service_path

  # Actualizar dependencias NestJS
  pnpm add @nestjs/common@${NESTJS_VERSION} \
           @nestjs/core@${NESTJS_VERSION} \
           @nestjs/platform-express@${NESTJS_VERSION} \
           @nestjs/microservices@${NESTJS_MICROSERVICES_VERSION} \
           2>/dev/null || echo "  Algunas dependencias no aplicables"

  # Actualizar devDependencies
  pnpm add -D @nestjs/cli@^10.4.5 \
              @nestjs/schematics@^10.1.4 \
              @nestjs/testing@${NESTJS_VERSION} \
              2>/dev/null || echo "  Algunas devDependencies no aplicables"

  cd - > /dev/null
  echo -e "  ${GREEN}✅ $service_name actualizado${NC}"
  echo ""
}

# Actualizar root package.json
echo -e "${GREEN}📦 Actualizando root package.json...${NC}"
pnpm add @nestjs/config@${NESTJS_CONFIG_VERSION} \
         @nestjs/swagger@${NESTJS_SWAGGER_VERSION} \
         -w

echo ""

# Actualizar cada servicio
for service in "${services[@]}"; do
  update_service $service
done

echo ""
echo -e "${GREEN}🎉 Actualización completada!${NC}"
echo ""
echo "Verificando versiones instaladas:"
pnpm list @nestjs/common @nestjs/core @nestjs/microservices --depth=0 2>/dev/null | grep @nestjs || echo "Run 'pnpm install' to verify"

echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Ejecuta 'pnpm install' en la raíz para sincronizar${NC}"
echo ""
echo "Next steps:"
echo "  1. pnpm install"
echo "  2. pnpm build:all"
echo "  3. Verificar que no hay errores de compilación"
