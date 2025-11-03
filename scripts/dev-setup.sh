#!/bin/bash

# ============================================
# A4CO Dev Setup Script
# ============================================
# Este script configura el entorno de desarrollo local

set -e

echo "🚀 Configurando entorno de desarrollo A4CO..."
echo ""

# ============================================
# 1. Verificar requisitos
# ============================================
echo "📋 Verificando requisitos..."

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm no está instalado. Instálalo con: npm install -g pnpm@10.14.0"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instálalo primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose no está instalado. Por favor instálalo primero."
    exit 1
fi

echo "✅ Requisitos verificados"
echo ""

# ============================================
# 2. Crear archivo .env si no existe
# ============================================
echo "📝 Configurando variables de entorno..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Archivo .env creado desde .env.example"
    echo "⚠️  IMPORTANTE: Revisa el archivo .env y configura los valores necesarios"
else
    echo "✅ Archivo .env ya existe"
fi

echo ""

# ============================================
# 3. Levantar servicios de infraestructura
# ============================================
echo "🐳 Iniciando servicios de infraestructura (PostgreSQL, NATS, Redis)..."

# Verificar si ya están corriendo
if docker-compose -f compose.dev.yaml ps | grep -q "Up"; then
    echo "⚠️  Servicios de infraestructura ya están corriendo"
else
    docker-compose -f compose.dev.yaml up -d
    echo "✅ Servicios de infraestructura iniciados"
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    sleep 5
fi

echo ""

# ============================================
# 4. Instalar dependencias
# ============================================
echo "📦 Instalando dependencias con pnpm..."

pnpm install --frozen-lockfile

echo ""

# ============================================
# 5. Compilar packages compartidos
# ============================================
echo "🔨 Compilando packages compartidos..."

echo "  → @a4co/observability"
pnpm --filter @a4co/observability build || echo "⚠️  Error compilando observability"

echo "  → @a4co/shared-utils"
pnpm --filter @a4co/shared-utils build || echo "⚠️  Error compilando shared-utils"

echo "  → @a4co/design-system"
pnpm --filter @a4co/design-system build || echo "⚠️  Error compilando design-system"

echo ""

# ============================================
# 6. Generar schemas Prisma
# ============================================
echo "📊 Generando schemas Prisma..."

services=(
    "apps/auth-service"
    "apps/user-service"
    "apps/product-service"
    "apps/order-service"
    "apps/payment-service"
)

for service in "${services[@]}"; do
    if [ -d "$service/prisma" ]; then
        echo "  → $service"
        cd "$service"
        npx prisma generate || echo "⚠️  Error generando schema para $service"
        cd ../..
    fi
done

echo ""

# ============================================
# 7. Resumen final
# ============================================
echo "============================================"
echo "✅ Entorno de desarrollo listo!"
echo "============================================"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Para iniciar TODOS los servicios:"
echo "   pnpm dev"
echo ""
echo "2. Para iniciar servicios específicos:"
echo "   pnpm dev:auth      # Auth Service (puerto 3001)"
echo "   pnpm dev:user      # User Service (puerto 3003)"
echo "   pnpm dev:product   # Product Service (puerto 3002)"
echo "   pnpm dev:order     # Order Service (puerto 3004)"
echo "   pnpm dev:payment   # Payment Service (puerto 3006)"
echo "   pnpm dev:frontend  # Frontend (puerto 5173)"
echo ""
echo "3. Documentación Swagger:"
echo "   http://localhost:3001/api/docs  # Auth Service"
echo "   http://localhost:3002/api     # Product Service"
echo "   http://localhost:3003/api     # User Service"
echo "   http://localhost:3004/api     # Order Service"
echo "   http://localhost:3006/api     # Payment Service"
echo ""
echo "4. Para detener servicios de infraestructura:"
echo "   docker-compose -f compose.dev.yaml down"
echo ""
echo "============================================"
