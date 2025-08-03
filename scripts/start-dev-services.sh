#!/bin/bash

# 🚀 A4CO Marketplace - Simple Dev Services Starter
# Script simplificado para iniciar servicios de desarrollo

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
                            
   Marketplace Local de Jaén
   Starting Dev Services...
EOF
echo -e "${NC}"

# Función para abrir en navegador
open_browser() {
    local url=$1
    if command -v xdg-open &> /dev/null; then
        xdg-open "$url" 2>/dev/null &
    elif command -v open &> /dev/null; then
        open "$url" 2>/dev/null &
    elif command -v start &> /dev/null; then
        start "$url" 2>/dev/null &
    fi
}

echo -e "${CYAN}📦 Instalando dependencias si es necesario...${NC}"
if [ ! -d "node_modules" ]; then
    pnpm install
fi

echo -e "\n${GREEN}🚀 Iniciando todos los servicios con Turbo...${NC}"
echo -e "${YELLOW}Esto levantará:${NC}"
echo -e "  - Frontend principal en ${BLUE}http://localhost:3000${NC}"
echo -e "  - Dashboard web en ${BLUE}http://localhost:3001${NC}"
echo -e "  - Design System/Storybook en ${BLUE}http://localhost:6006${NC}"
echo -e "  - Microservicios backend en puertos 4000+"

echo -e "\n${YELLOW}💡 Tip: Abre otra terminal para ejecutar comandos adicionales${NC}"
echo -e "${YELLOW}💡 Presiona Ctrl+C para detener todos los servicios${NC}\n"

# Abrir navegadores después de un delay
(
    sleep 15
    echo -e "\n${GREEN}🌐 Abriendo servicios en el navegador...${NC}"
    open_browser "http://localhost:3000"
    open_browser "http://localhost:6006"
    open_browser "http://localhost:3001"
) &

# Ejecutar turbo dev (esto bloqueará hasta Ctrl+C)
pnpm dev