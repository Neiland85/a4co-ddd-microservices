#!/bin/bash

# Script para verificar servicios disponibles en el monorepo

echo "🔍 Verificando servicios disponibles en el monorepo A4CO..."
echo "=================================================="

# Frontend Apps
echo -e "\n📱 APLICACIONES FRONTEND:"
if [ -d "apps/web/v0dev/a-head" ]; then
    echo "  ✅ Frontend Principal (Next.js) - apps/web/v0dev/a-head"
fi
if [ -d "apps/dashboard-web" ]; then
    echo "  ✅ Dashboard Web - apps/dashboard-web"
fi

# Design System
echo -e "\n🎨 SISTEMA DE DISEÑO:"
if [ -d "packages/design-system" ] && [ -f "packages/design-system/package.json" ]; then
    if grep -q "storybook" "packages/design-system/package.json"; then
        echo "  ✅ Design System con Storybook - packages/design-system"
    fi
fi

# Backend Services
echo -e "\n⚙️  MICROSERVICIOS BACKEND:"
for service_dir in apps/*-service; do
    if [ -d "$service_dir" ]; then
        service_name=$(basename "$service_dir")
        echo "  ✅ $service_name - $service_dir"
    fi
done

# Check for package.json scripts
echo -e "\n📋 SCRIPTS DISPONIBLES EN package.json:"
if [ -f "package.json" ]; then
    echo "Scripts principales:"
    grep -E '"(dev|start|build|test)"' package.json | sed 's/^/  /'
fi

# Check for infrastructure
echo -e "\n🐳 INFRAESTRUCTURA:"
if [ -f "docker-compose.dev.yml" ]; then
    echo "  ✅ docker-compose.dev.yml encontrado"
fi
if [ -f "docker-compose.messaging.yml" ]; then
    echo "  ✅ docker-compose.messaging.yml encontrado"
fi
if [ -f "scripts/start-messaging-infrastructure.sh" ]; then
    echo "  ✅ Script de infraestructura de mensajería encontrado"
fi

# Check ports configuration
echo -e "\n🔌 PUERTOS ESPERADOS:"
echo "  - Frontend: 3000"
echo "  - Dashboard: 3001" 
echo "  - Storybook: 6006"
echo "  - Backend services: 4001-4010"
echo "  - PostgreSQL: 5432"
echo "  - Redis: 6379"
echo "  - NATS: 4222"

echo -e "\n✨ Para iniciar todos los servicios, ejecuta:"
echo "  ./scripts/start-dev-services.sh"
echo "  o"
echo "  pnpm dev"