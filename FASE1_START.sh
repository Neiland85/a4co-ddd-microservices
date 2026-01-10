#!/bin/bash

# A4CO FASE 1 - Infrastructure Startup Script
# ============================================

set -e

ROOT_DIR="/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices"
cd "$ROOT_DIR"

echo "🚀 A4CO FASE 1 - Infrastructure Startup"
echo "=========================================="

# 1. Verificar Docker
echo "✅ Verificando Docker..."
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "postgres|nats" || echo "⚠️  Containers no encontrados"

# 2. Verificar Build
echo "✅ Build status..."
pnpm run build > /dev/null 2>&1 && echo "✓ Build completado" || echo "✗ Build falló"

# 3. Prisma DB Push
echo "✅ Prisma schema sync..."
echo "⚠️  Note: Prisma sync moved to individual services"
cd "$ROOT_DIR"

# 4. Environment check
echo "✅ Environment Variables:"
echo "   DATABASE_URL: $DATABASE_URL"
echo "   NATS_URL: $NATS_URL"
echo "   NODE_ENV: $NODE_ENV"

# 5. Services ready
echo ""
echo "✅ FASE 1 Infrastructure Status:"
echo "   - PostgreSQL: $(docker ps --format '{{.Names}} {{.Status}}' | grep postgres || echo 'Not running')"
echo "   - NATS: $(docker ps --format '{{.Names}} {{.Status}}' | grep nats || echo 'Not running')"
echo ""
echo "🎯 Next: Run 'pnpm run dev:backend' to start services"
