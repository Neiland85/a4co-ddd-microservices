#!/bin/bash

# Script para configurar archivos de variables de entorno
# A4CO DDD Microservices

set -e

echo "🚀 Configurando archivos de variables de entorno para A4CO DDD Microservices..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para crear archivo .env
create_env_file() {
    local source_file=$1
    local target_file=$2
    
    if [ -f "$target_file" ]; then
        echo -e "${YELLOW}⚠️  El archivo $target_file ya existe. Saltando...${NC}"
        return
    fi
    
    if [ -f "$source_file" ]; then
        cp "$source_file" "$target_file"
        echo -e "${GREEN}✅ Creado $target_file${NC}"
    else
        echo -e "${RED}❌ Archivo fuente $source_file no encontrado${NC}"
    fi
}

# Directorio raíz del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📍 Directorio del proyecto: $PROJECT_ROOT"

# 1. Crear .env.local en el directorio raíz
echo -e "\n📁 Creando archivo .env.local en el directorio raíz..."
create_env_file "env.config.example" ".env.local"

# 2. Crear .env para auth-service
echo -e "\n🔐 Creando archivo .env para auth-service..."
create_env_file "apps/auth-service/env.config.example" "apps/auth-service/.env"

# 3. Crear .env para product-service
echo -e "\n📦 Creando archivo .env para product-service..."
create_env_file "apps/product-service/env.config.example" "apps/product-service/.env"

# 4. Crear .env para user-service
echo -e "\n👤 Creando archivo .env para user-service..."
create_env_file "apps/user-service/env.config.example" "apps/user-service/.env"

# 5. Crear .env para otros servicios principales
echo -e "\n🏗️  Creando archivos .env para otros servicios..."

# Order Service
if [ -d "apps/order-service" ]; then
    create_env_file "apps/product-service/env.config.example" "apps/order-service/.env"
    # Personalizar puerto para order-service
    if [ -f "apps/order-service/.env" ]; then
        sed -i '' 's/PORT=3002/PORT=3004/' "apps/order-service/.env"
        sed -i '' 's/SERVICE_NAME=product-service/SERVICE_NAME=order-service/' "apps/order-service/.env"
        sed -i '' 's/DATABASE_URL=postgresql:\/\/user:password@localhost:5432\/products/DATABASE_URL=postgresql:\/\/user:password@localhost:5432\/orders/' "apps/order-service/.env"
        sed -i '' 's/METRICS_PORT=9092/METRICS_PORT=9094/' "apps/order-service/.env"
        echo -e "${GREEN}✅ Configurado order-service .env${NC}"
    fi
fi

# Inventory Service
if [ -d "apps/inventory-service" ]; then
    create_env_file "apps/product-service/env.config.example" "apps/inventory-service/.env"
    # Personalizar puerto para inventory-service
    if [ -f "apps/inventory-service/.env" ]; then
        sed -i '' 's/PORT=3002/PORT=3005/' "apps/inventory-service/.env"
        sed -i '' 's/SERVICE_NAME=product-service/SERVICE_NAME=inventory-service/' "apps/inventory-service/.env"
        sed -i '' 's/DATABASE_URL=postgresql:\/\/user:password@localhost:5432\/products/DATABASE_URL=postgresql:\/\/user:password@localhost:5432\/inventory/' "apps/inventory-service/.env"
        sed -i '' 's/METRICS_PORT=9092/METRICS_PORT=9095/' "apps/inventory-service/.env"
        echo -e "${GREEN}✅ Configurado inventory-service .env${NC}"
    fi
fi

# Payment Service
if [ -d "apps/payment-service" ]; then
    create_env_file "apps/product-service/env.config.example" "apps/payment-service/.env"
    # Personalizar puerto para payment-service
    if [ -f "apps/payment-service/.env" ]; then
        sed -i '' 's/PORT=3002/PORT=3006/' "apps/payment-service/.env"
        sed -i '' 's/SERVICE_NAME=product-service/SERVICE_NAME=payment-service/' "apps/payment-service/.env"
        sed -i '' 's/DATABASE_URL=postgresql:\/\/user:password@localhost:5432\/products/DATABASE_URL=postgresql:\/\/user:password@localhost:5432\/payments/' "apps/payment-service/.env"
        sed -i '' 's/METRICS_PORT=9092/METRICS_PORT=9096/' "apps/payment-service/.env"
        echo -e "${GREEN}✅ Configurado payment-service .env${NC}"
    fi
fi

echo -e "\n🎉 ¡Configuración de archivos .env completada!"
echo -e "\n📋 Próximos pasos:"
echo -e "1. Revisar y ajustar las variables en los archivos .env creados"
echo -e "2. Cambiar las contraseñas por defecto"
echo -e "3. Configurar las bases de datos PostgreSQL"
echo -e "4. Levantar los servicios con docker-compose"
echo -e "\n🚀 Comando para levantar servicios:"
echo -e "docker-compose -f docker-compose.dev.yml up -d"
