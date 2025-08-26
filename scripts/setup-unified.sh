#!/bin/bash

# 🚀 A4CO DDD Microservices - Configuración Unificada
# Script para configurar todo el monorepo con pnpm y Turbo

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
    _  _   ____  ____  ___  
   / )( \ / ___)/ ___)/ _ \ 
   \ (/ /      ) (__ ) __ (
    \__/ \____)\___)\__)(__)
                            
   DDD Microservices Setup
   Configuración Unificada
EOF
echo -e "${NC}"

# Función para verificar comandos
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ Error: $1 no está instalado${NC}"
        exit 1
    fi
}

# Verificar dependencias
echo -e "${CYAN}🔍 Verificando dependencias...${NC}"
check_command "node"
check_command "pnpm"

echo -e "${GREEN}✅ Todas las dependencias están instaladas${NC}"

# Generar package.json faltantes
echo -e "\n${CYAN}📦 Generando package.json para microservicios...${NC}"
node scripts/generate-microservice-packages.js

# Instalar dependencias
echo -e "\n${CYAN}📥 Instalando dependencias con pnpm...${NC}"
pnpm install

# Verificar que todos los servicios tengan package.json
echo -e "\n${CYAN}🔍 Verificando estructura del monorepo...${NC}"
missing_packages=()

for service in apps/*/; do
    if [ -d "$service" ]; then
        service_name=$(basename "$service")
        if [ ! -f "$service/package.json" ]; then
            missing_packages+=("$service_name")
        fi
    fi
done

if [ ${#missing_packages[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Servicios sin package.json:${NC}"
    printf '  - %s\n' "${missing_packages[@]}"
    echo -e "${YELLOW}💡 Ejecuta: node scripts/generate-microservice-packages.js${NC}"
else
    echo -e "${GREEN}✅ Todos los servicios tienen package.json${NC}"
fi

# Construir paquetes compartidos primero
echo -e "\n${CYAN}🏗️  Construyendo paquetes compartidos...${NC}"
pnpm --filter "./packages/*" build

# Verificar configuración de Turbo
echo -e "\n${CYAN}⚡ Verificando configuración de Turbo...${NC}"
if [ -f "turbo.json" ]; then
    echo -e "${GREEN}✅ turbo.json configurado${NC}"
else
    echo -e "${RED}❌ turbo.json no encontrado${NC}"
fi

# Verificar configuración de pnpm workspace
echo -e "\n${CYAN}📁 Verificando configuración de pnpm workspace...${NC}"
if [ -f "pnpm-workspace.yaml" ]; then
    echo -e "${GREEN}✅ pnpm-workspace.yaml configurado${NC}"
else
    echo -e "${RED}❌ pnpm-workspace.yaml no encontrado${NC}"
fi

# Ejecutar validación
echo -e "\n${CYAN}✅ Ejecutando validación del monorepo...${NC}"
pnpm run validate

echo -e "\n${GREEN}🎉 Configuración unificada completada!${NC}"
echo -e "\n${BLUE}📋 Comandos disponibles:${NC}"
echo -e "  ${YELLOW}pnpm dev${NC}          - Iniciar todos los servicios"
echo -e "  ${YELLOW}pnpm build${NC}        - Construir todos los servicios"
echo -e "  ${YELLOW}pnpm test${NC}         - Ejecutar todos los tests"
echo -e "  ${YELLOW}pnpm lint${NC}         - Lintear todo el código"
echo -e "  ${YELLOW}pnpm format${NC}       - Formatear todo el código"
echo -e "  ${YELLOW}pnpm type-check${NC}   - Verificar tipos TypeScript"

echo -e "\n${BLUE}🚀 Para iniciar desarrollo:${NC}"
echo -e "  ${YELLOW}pnpm dev${NC}"

echo -e "\n${PURPLE}💡 Tip: Usa 'pnpm --filter @a4co/[service-name] [command]' para comandos específicos${NC}"
