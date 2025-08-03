#!/bin/bash

# 🚀 A4CO Marketplace - Start All Services Script
# Este script levanta todos los servicios del monorepo en desarrollo

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para logs con colores
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
    _  _   ____  ____  ___  
   / )( \ / ___)/ ___)/ _ \ 
   \ (/ /      ) (__ ) __ (
    \__/ \____)\___)\__)(__)
                            
   Marketplace Local de Jaén
   Starting All Services...
EOF
echo -e "${NC}"

# Crear directorio para logs
LOGS_DIR="logs/$(date +'%Y%m%d_%H%M%S')"
mkdir -p "$LOGS_DIR"

# Array para almacenar PIDs
declare -a PIDS=()
declare -a SERVICE_NAMES=()

# Función para limpiar al salir
cleanup() {
    echo -e "\n${YELLOW}Deteniendo todos los servicios...${NC}"
    for i in "${!PIDS[@]}"; do
        if kill -0 "${PIDS[$i]}" 2>/dev/null; then
            echo -e "${RED}Deteniendo ${SERVICE_NAMES[$i]}...${NC}"
            kill "${PIDS[$i]}" 2>/dev/null || true
        fi
    done
    
    # Detener infraestructura Docker
    if [[ "$DOCKER_STARTED" == "true" ]]; then
        echo -e "${YELLOW}Deteniendo infraestructura Docker...${NC}"
        docker-compose -f docker-compose.messaging.yml down
    fi
    
    exit 0
}

trap cleanup EXIT INT TERM

# Verificar dependencias
check_dependencies() {
    log "🔍 Verificando dependencias..."
    
    local missing=0
    
    # Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js no está instalado"
        missing=1
    else
        info "Node.js: $(node --version)"
    fi
    
    # pnpm
    if ! command -v pnpm &> /dev/null; then
        error "pnpm no está instalado"
        missing=1
    else
        info "pnpm: $(pnpm --version)"
    fi
    
    # Docker
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado"
        missing=1
    else
        info "Docker: $(docker --version)"
    fi
    
    if [ $missing -eq 1 ]; then
        error "Faltan dependencias necesarias"
        exit 1
    fi
}

# Instalar dependencias si es necesario
install_dependencies() {
    if [ ! -d "node_modules" ]; then
        log "📦 Instalando dependencias del monorepo..."
        pnpm install
    fi
}

# Iniciar infraestructura Docker
start_docker_infrastructure() {
    log "🐳 Iniciando infraestructura Docker..."
    
    # Iniciar mensajería y bases de datos
    if [ -f "docker-compose.messaging.yml" ]; then
        docker-compose -f docker-compose.messaging.yml up -d
        DOCKER_STARTED="true"
        sleep 5  # Esperar a que los servicios estén listos
    else
        warn "No se encontró docker-compose.messaging.yml, iniciando script de infraestructura..."
        if [ -f "scripts/start-messaging-infrastructure.sh" ]; then
            bash scripts/start-messaging-infrastructure.sh &
            sleep 10
        fi
    fi
}

# Función para iniciar un servicio
start_service() {
    local name=$1
    local dir=$2
    local port=$3
    local command=$4
    
    echo -e "${CYAN}🚀 Iniciando $name en puerto $port...${NC}"
    
    cd "$dir"
    if [ ! -d "node_modules" ]; then
        pnpm install
    fi
    cd - > /dev/null
    
    # Ejecutar comando y guardar logs
    (cd "$dir" && $command) > "$LOGS_DIR/${name}.log" 2>&1 &
    local pid=$!
    
    PIDS+=($pid)
    SERVICE_NAMES+=("$name")
    
    # Verificar que el proceso se inició
    sleep 2
    if kill -0 $pid 2>/dev/null; then
        echo -e "${GREEN}✅ $name iniciado (PID: $pid)${NC}"
    else
        error "❌ Error al iniciar $name"
        tail -n 20 "$LOGS_DIR/${name}.log"
    fi
}

# Verificar e instalar
check_dependencies
install_dependencies

# Iniciar infraestructura
start_docker_infrastructure

# Build inicial si es necesario
if [ ! -d "packages/design-system/dist" ]; then
    log "🔨 Compilando paquetes compartidos..."
    pnpm build --filter=@a4co/design-system
fi

echo -e "\n${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}     INICIANDO SERVICIOS DE DESARROLLO     ${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}\n"

# 1. Design System / Storybook
start_service "design-system" "packages/design-system" "6006" "pnpm storybook"

# 2. Frontend Principal (Next.js)
start_service "web-frontend" "apps/web/v0dev/a-head" "3000" "pnpm dev"

# 3. Dashboard Web
start_service "dashboard-web" "apps/dashboard-web" "3001" "pnpm dev"

# 4. Backend Microservicios
# Auth Service
if [ -d "apps/auth-service" ]; then
    start_service "auth-service" "apps/auth-service" "4001" "pnpm start:dev"
fi

# Product Service
if [ -d "apps/product-service" ]; then
    start_service "product-service" "apps/product-service" "4002" "pnpm start:dev"
fi

# User Service
if [ -d "apps/user-service" ]; then
    start_service "user-service" "apps/user-service" "4003" "pnpm start:dev"
fi

# Order Service
if [ -d "apps/order-service" ]; then
    start_service "order-service" "apps/order-service" "4004" "pnpm start:dev"
fi

# Inventory Service
if [ -d "apps/inventory-service" ]; then
    start_service "inventory-service" "apps/inventory-service" "4005" "pnpm start:dev"
fi

# Payment Service
if [ -d "apps/payment-service" ]; then
    start_service "payment-service" "apps/payment-service" "4006" "pnpm start:dev"
fi

# Notification Service
if [ -d "apps/notification-service" ]; then
    start_service "notification-service" "apps/notification-service" "4007" "pnpm start:dev"
fi

# Esperar a que los servicios estén listos
sleep 5

echo -e "\n${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}         SERVICIOS DISPONIBLES             ${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}\n"

echo -e "${GREEN}📚 Design System (Storybook):${NC} http://localhost:6006"
echo -e "${GREEN}🌐 Frontend Principal:${NC} http://localhost:3000"
echo -e "${GREEN}📊 Dashboard Web:${NC} http://localhost:3001"
echo -e "${GREEN}🔐 Auth Service:${NC} http://localhost:4001"
echo -e "${GREEN}📦 Product Service:${NC} http://localhost:4002"
echo -e "${GREEN}👤 User Service:${NC} http://localhost:4003"
echo -e "${GREEN}🛒 Order Service:${NC} http://localhost:4004"
echo -e "${GREEN}📋 Inventory Service:${NC} http://localhost:4005"
echo -e "${GREEN}💳 Payment Service:${NC} http://localhost:4006"
echo -e "${GREEN}🔔 Notification Service:${NC} http://localhost:4007"

echo -e "\n${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}         INFRAESTRUCTURA                   ${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}\n"

echo -e "${CYAN}🐘 PostgreSQL:${NC} localhost:5432"
echo -e "${CYAN}🔴 Redis:${NC} localhost:6379"
echo -e "${CYAN}📨 NATS:${NC} localhost:4222"
echo -e "${CYAN}📈 NATS Monitor:${NC} http://localhost:8222"

if command -v docker &> /dev/null; then
    # Verificar si Jaeger está corriendo
    if docker ps | grep -q jaeger; then
        echo -e "${CYAN}🔍 Jaeger UI:${NC} http://localhost:16686"
    fi
    
    # Verificar si Prometheus está corriendo
    if docker ps | grep -q prometheus; then
        echo -e "${CYAN}📊 Prometheus:${NC} http://localhost:9090"
    fi
fi

echo -e "\n${YELLOW}📁 Los logs se encuentran en: $LOGS_DIR${NC}"
echo -e "${YELLOW}💡 Presiona Ctrl+C para detener todos los servicios${NC}\n"

# Función para mostrar logs en tiempo real
show_logs() {
    local service=$1
    local log_file="$LOGS_DIR/${service}.log"
    if [ -f "$log_file" ]; then
        echo -e "\n${CYAN}═══ Logs de $service ═══${NC}"
        tail -f "$log_file"
    else
        error "No se encontraron logs para $service"
    fi
}

# Abrir navegador si está disponible
if command -v xdg-open &> /dev/null; then
    sleep 3
    xdg-open "http://localhost:3000" &
    xdg-open "http://localhost:6006" &
elif command -v open &> /dev/null; then
    sleep 3
    open "http://localhost:3000" &
    open "http://localhost:6006" &
fi

# Mantener el script corriendo
echo -e "\n${GREEN}✅ Todos los servicios están iniciándose...${NC}"
echo -e "${YELLOW}💡 Puedes ver los logs de un servicio específico con: tail -f $LOGS_DIR/<nombre-servicio>.log${NC}\n"

# Esperar indefinidamente
while true; do
    sleep 1
done