#!/bin/bash

# Script para iniciar todos los servicios del monorepo para testing

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 INICIANDO SERVICIOS A4CO DDD MICROSERVICES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del monorepo"
    exit 1
fi

# 1. Iniciar infraestructura con Docker Compose
echo "🐳 PASO 1: Iniciando infraestructura (PostgreSQL, NATS, Redis)..."
docker-compose -f compose.dev.yaml up -d

if [ $? -ne 0 ]; then
    echo "❌ Error al iniciar infraestructura"
    exit 1
fi

echo "✅ Infraestructura iniciada"
echo ""

# Esperar un poco para que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 5

# 2. Verificar servicios Docker
echo ""
echo "📊 Estado de servicios Docker:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "NAMES|a4co"
echo ""

# 3. Instrucciones para iniciar microservicios
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 PASO 2: Iniciar Microservicios Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Abre terminales separadas y ejecuta:"
echo ""
echo "  Terminal 1 - Auth Service (puerto 3001):"
echo "    cd apps/auth-service && pnpm install && pnpm run dev"
echo ""
echo "  Terminal 2 - User Service (puerto 3002):"
echo "    cd apps/user-service && pnpm install && pnpm run dev"
echo ""
echo "  Terminal 3 - Product Service (puerto 3003):"
echo "    cd apps/product-service && pnpm install && pnpm run dev"
echo ""
echo "  Terminal 4 - Order Service (puerto 3004):"
echo "    cd apps/order-service && pnpm install && pnpm run dev"
echo ""
echo "  Terminal 5 - Payment Service (puerto 3005):"
echo "    cd apps/payment-service && pnpm install && pnpm run dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 PASO 3: Iniciar Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Terminal 6 - Frontend (puerto 5173):"
echo "    cd apps/frontend && pnpm install && pnpm run dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 VERIFICACIÓN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Una vez iniciados todos los servicios, verifica:"
echo ""
echo "  ✅ http://localhost:3001/api/v1/health  (auth-service)"
echo "  ✅ http://localhost:3002/api/v1/health  (user-service)"
echo "  ✅ http://localhost:3003/api/v1/health  (product-service)"
echo "  ✅ http://localhost:3004/api/v1/health  (order-service)"
echo "  ✅ http://localhost:3005/api/v1/health  (payment-service)"
echo "  ✅ http://localhost:5173                (frontend)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 DOCUMENTACIÓN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Ver guías de testing:"
echo "  • TESTING_INTEGRACION.md"
echo "  • INTEGRACION_FRONTEND_BACKEND.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

