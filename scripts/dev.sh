#!/bin/bash

# 🚀 A4CO DDD Microservices - Script de Desarrollo
# Versión: 1.0.0
# Fecha: $(date)

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función de logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Función para verificar dependencias
check_dependencies() {
    log "Verificando dependencias del sistema..."

    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js no está instalado. Por favor instala Node.js 18+"
        exit 1
    fi

    # Verificar pnpm
    if ! command -v pnpm &> /dev/null; then
        error "pnpm no está instalado. Por favor instala pnpm"
        exit 1
    fi

    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        warning "Docker no está instalado. Algunos comandos pueden no funcionar"
    fi

    success "Dependencias verificadas correctamente"
}

# Función para instalar dependencias
install_deps() {
    log "Instalando dependencias del proyecto..."
    pnpm install
    success "Dependencias instaladas"
}

# Función para verificar configuración
check_config() {
    log "Verificando configuración del proyecto..."

    # Verificar archivos de configuración
    if [ ! -f ".env.local" ]; then
        warning "Archivo .env.local no encontrado. Copiando desde .env.example"
        cp .env.example .env.local 2>/dev/null || warning "No se pudo copiar .env.example"
    fi

    # Verificar configuración de TypeScript
    if [ ! -f "tsconfig.json" ]; then
        error "Archivo tsconfig.json no encontrado"
        exit 1
    fi

    success "Configuración verificada"
}

# Función para limpiar cache y builds
clean() {
    log "Limpiando cache y builds..."
    rm -rf node_modules/.cache
    rm -rf apps/*/node_modules/.cache
    rm -rf packages/*/node_modules/.cache
    rm -rf apps/*/.next
    rm -rf apps/*/dist
    rm -rf packages/*/dist
    rm -rf .turbo
    success "Cache y builds limpiados"
}

# Función para desarrollo completo
dev_full() {
    info "Iniciando desarrollo completo del proyecto..."
    info "Esto iniciará todos los servicios con Docker Compose"

    # Verificar si Docker está corriendo
    if ! docker info &> /dev/null; then
        error "Docker no está corriendo. Por favor inicia Docker"
        exit 1
    fi

    # Levantar servicios con Docker Compose
    docker-compose -f docker-compose.dev.yml up -d

    success "Servicios de desarrollo iniciados"
    info "Accede a los servicios en:"
    echo "  - Traefik Dashboard: http://localhost:8080"
    echo "  - Design System: http://design.localhost:6006"
    echo "  - Web App: http://localhost:3000"
    echo "  - Dashboard: http://dashboard.localhost:3001"
    echo "  - API Gateway: http://api.localhost:3333"
}

# Función para desarrollo específico
dev_service() {
    local service=$1

    if [ -z "$service" ]; then
        error "Debes especificar un servicio. Uso: $0 dev [service-name]"
        echo "Servicios disponibles:"
        echo "  - frontend (Next.js apps)"
        echo "  - backend (NestJS services)"
        echo "  - design-system"
        echo "  - dashboard"
        exit 1
    fi

    case $service in
        "frontend")
            info "Iniciando desarrollo frontend..."
            pnpm run dev:frontend
            ;;
        "backend")
            info "Iniciando desarrollo backend..."
            pnpm run dev:backend
            ;;
        "design-system")
            info "Iniciando desarrollo design system..."
            pnpm run storybook:dev
            ;;
        "dashboard")
            info "Iniciando desarrollo dashboard..."
            pnpm --filter dashboard-web run dev
            ;;
        *)
            error "Servicio '$service' no reconocido"
            exit 1
            ;;
    esac
}

# Función para ejecutar tests
run_tests() {
    local mode=${1:-"all"}

    case $mode in
        "all")
            info "Ejecutando todos los tests..."
            pnpm run test
            ;;
        "watch")
            info "Ejecutando tests en modo watch..."
            pnpm run test:watch
            ;;
        "coverage")
            info "Ejecutando tests con cobertura..."
            pnpm run test:coverage
            ;;
        *)
            error "Modo de test '$mode' no reconocido"
            exit 1
            ;;
    esac
}

# Función para linting
run_lint() {
    local mode=${1:-"check"}

    case $mode in
        "check")
            info "Verificando linting..."
            pnpm run lint
            ;;
        "fix")
            info "Corrigiendo linting..."
            pnpm run lint:fix
            ;;
        *)
            error "Modo de lint '$mode' no reconocido"
            exit 1
            ;;
    esac
}

# Función para build
run_build() {
    local target=${1:-"all"}

    case $target in
        "all")
            info "Construyendo todo el proyecto..."
            pnpm run build:all
            ;;
        "frontend")
            info "Construyendo aplicaciones frontend..."
            pnpm --filter "./apps/web/**" run build
            ;;
        "backend")
            info "Construyendo servicios backend..."
            pnpm --filter "*-service" run build
            ;;
        *)
            error "Target '$target' no reconocido"
            exit 1
            ;;
    esac
}

# Función para mostrar ayuda
show_help() {
    echo "🚀 A4CO DDD Microservices - Script de Desarrollo"
    echo ""
    echo "Uso: $0 [comando] [opciones]"
    echo ""
    echo "Comandos disponibles:"
    echo "  setup           Configurar el proyecto por primera vez"
    echo "  dev             Iniciar desarrollo"
    echo "    dev full      Iniciar todos los servicios con Docker"
    echo "    dev [service] Iniciar servicio específico (frontend, backend, design-system, dashboard)"
    echo "  test            Ejecutar tests"
    echo "    test all      Ejecutar todos los tests"
    echo "    test watch    Ejecutar tests en modo watch"
    echo "    test coverage Ejecutar tests con cobertura"
    echo "  lint            Ejecutar linting"
    echo "    lint check    Verificar linting"
    echo "    lint fix      Corregir linting"
    echo "  build           Construir el proyecto"
    echo "    build all     Construir todo"
    echo "    build frontend Construir frontend"
    echo "    build backend Construir backend"
    echo "  clean           Limpiar cache y builds"
    echo "  logs            Ver logs de Docker"
    echo "  stop            Detener servicios de Docker"
    echo "  help            Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 setup                    # Configurar proyecto"
    echo "  $0 dev full                 # Iniciar desarrollo completo"
    echo "  $0 dev frontend             # Iniciar solo frontend"
    echo "  $0 test coverage            # Ejecutar tests con cobertura"
    echo "  $0 build all                # Construir todo el proyecto"
}

# Función principal
main() {
    local command=$1
    shift

    case $command in
        "setup")
            check_dependencies
            install_deps
            check_config
            success "Proyecto configurado correctamente"
            ;;
        "dev")
            if [ "$1" = "full" ]; then
                check_dependencies
                check_config
                dev_full
            else
                dev_service "$1"
            fi
            ;;
        "test")
            run_tests "$1"
            ;;
        "lint")
            run_lint "$1"
            ;;
        "build")
            run_build "$1"
            ;;
        "clean")
            clean
            ;;
        "logs")
            info "Mostrando logs de Docker..."
            docker-compose -f docker-compose.dev.yml logs -f
            ;;
        "stop")
            info "Deteniendo servicios de Docker..."
            docker-compose -f docker-compose.dev.yml down
            success "Servicios detenidos"
            ;;
        "help"|"-h"|"--help"|"")
            show_help
            ;;
        *)
            error "Comando '$command' no reconocido"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"
