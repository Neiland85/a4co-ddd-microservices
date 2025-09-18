#!/bin/bash

# 🎯 A4CO DDD Microservices - Script Maestro
# Orquesta todo el proceso de levantamiento de servicios
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
WHITE='\033[1;37m'
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

header() {
    echo -e "${PURPLE}🎯 $1${NC}"
}

# Función para mostrar banner
show_banner() {
    echo ""
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC} ${WHITE}🎯 A4CO DDD MICROSERVICES - SISTEMA DE LEVANTAMIENTO MAESTRO${NC} ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Función para verificar sistema
check_system() {
    header "VERIFICANDO SISTEMA"

    # Verificar OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        info "Sistema operativo: Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        info "Sistema operativo: macOS"
    else
        warning "Sistema operativo no reconocido: $OSTYPE"
    fi

    # Verificar arquitectura
    local arch=$(uname -m)
    info "Arquitectura: $arch"

    # Verificar memoria disponible
    if command -v free &> /dev/null; then
        local mem_gb=$(free -g | awk 'NR==2{printf "%.1f", $2}')
        info "Memoria RAM: ${mem_gb}GB"
        if (( $(echo "$mem_gb < 4" | bc -l) )); then
            warning "Se recomienda al menos 4GB de RAM para el desarrollo completo"
        fi
    fi

    # Verificar espacio en disco
    local disk_gb=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
    info "Espacio disponible: ${disk_gb}GB"
    if [ "$disk_gb" -lt 10 ]; then
        warning "Se recomienda al menos 10GB de espacio libre"
    fi

    success "Verificación del sistema completada"
}

# Función para verificar dependencias
check_dependencies() {
    header "VERIFICANDO DEPENDENCIAS"

    local deps_ok=true

    # Verificar Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node -v)
        info "Node.js: $node_version"
        local major_version=$(node -v | sed 's/v//' | cut -d. -f1)
        if [ "$major_version" -lt 18 ]; then
            error "Node.js versión insuficiente. Se requiere 18+"
            deps_ok=false
        fi
    else
        error "Node.js no está instalado"
        deps_ok=false
    fi

    # Verificar pnpm
    if command -v pnpm &> /dev/null; then
        local pnpm_version=$(pnpm -v)
        info "pnpm: v$pnpm_version"
    else
        error "pnpm no está instalado"
        deps_ok=false
    fi

    # Verificar Docker
    if command -v docker &> /dev/null; then
        local docker_version=$(docker -v)
        info "Docker: $docker_version"
    else
        error "Docker no está instalado"
        deps_ok=false
    fi

    # Verificar Docker Compose
    if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
        info "Docker Compose: Disponible"
    else
        error "Docker Compose no está disponible"
        deps_ok=false
    fi

    # Verificar Git
    if command -v git &> /dev/null; then
        local git_version=$(git --version)
        info "Git: $git_version"
    else
        warning "Git no está instalado (opcional)"
    fi

    if [ "$deps_ok" = true ]; then
        success "Todas las dependencias están instaladas"
    else
        error "Faltan dependencias críticas. Instálalas antes de continuar"
        exit 1
    fi
}

# Función para configurar proyecto
setup_project() {
    header "CONFIGURANDO PROYECTO"

    # Verificar si ya está configurado
    if [ -d "node_modules" ] && [ -f ".env.local" ]; then
        info "El proyecto ya está configurado"
        return
    fi

    # Instalar dependencias
    info "Instalando dependencias..."
    pnpm install

    # Configurar variables de entorno
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            info "Configurando variables de entorno..."
            cp .env.example .env.local
            warning "⚠️  Revisa y configura las variables en .env.local"
        else
            warning "No se encontró .env.example"
        fi
    fi

    success "Proyecto configurado"
}

# Función para mostrar menú de opciones
show_menu() {
    echo ""
    echo -e "${CYAN}Selecciona una opción:${NC}"
    echo "1) 🚀 Despliegue completo (Docker)"
    echo "2) 💻 Desarrollo local completo"
    echo "3) 🔧 Servicios individuales"
    echo "4) 🔨 Compilación del proyecto"
    echo "5) 🧪 Ejecutar tests"
    echo "6) 📊 Estado del sistema"
    echo "7) 🧹 Limpieza del sistema"
    echo "8) ❓ Ayuda"
    echo "0) Salir"
    echo ""
}

# Función para despliegue completo con Docker
deploy_full() {
    header "DESPLIEGUE COMPLETO CON DOCKER"

    info "Este comando iniciará todos los servicios usando Docker Compose"
    info "Incluye: API Gateway, Base de datos, Redis, y todos los microservicios"

    # Verificar Docker
    if ! docker info &> /dev/null; then
        error "Docker no está corriendo. Inicia Docker y vuelve a intentar"
        return 1
    fi

    # Ejecutar despliegue
    if [ -f "deploy.sh" ]; then
        ./deploy.sh deploy
    else
        error "Script deploy.sh no encontrado"
        return 1
    fi
}

# Función para desarrollo local
dev_local() {
    header "DESARROLLO LOCAL"

    info "Iniciando desarrollo local completo..."

    # Verificar configuración
    if [ ! -f ".env.local" ]; then
        warning "Configura primero las variables de entorno"
        setup_project
    fi

    # Iniciar servicios de desarrollo
    if [ -f "dev.sh" ]; then
        ./dev.sh dev full
    else
        error "Script dev.sh no encontrado"
        return 1
    fi
}

# Función para gestionar servicios individuales
manage_services() {
    header "GESTIÓN DE SERVICIOS INDIVIDUALES"

    if [ ! -f "service.sh" ]; then
        error "Script service.sh no encontrado"
        return 1
    fi

    echo ""
    echo "Servicios disponibles:"
    ./service.sh list

    echo ""
    echo "Comandos disponibles:"
    echo "  ./service.sh start [servicio]     - Iniciar servicio"
    echo "  ./service.sh build [servicio]     - Construir servicio"
    echo "  ./service.sh logs [servicio]      - Ver logs del servicio"
    echo "  ./service.sh status               - Estado de todos los servicios"
    echo ""

    info "Ejecuta los comandos directamente o presiona Enter para volver al menú"
    read -r
}

# Función para compilar proyecto
build_project() {
    header "COMPILACIÓN DEL PROYECTO"

    if [ ! -f "build.sh" ]; then
        error "Script build.sh no encontrado"
        return 1
    fi

    echo ""
    echo "Opciones de compilación:"
    echo "1) Compilación completa (verificación + build + tests)"
    echo "2) Compilación rápida (solo build)"
    echo "3) Solo backend"
    echo "4) Solo frontend"
    echo "5) Solo paquetes"
    echo ""

    read -p "Selecciona opción (1-5): " build_option

    case $build_option in
        1) ./build.sh all ;;
        2) ./build.sh fast ;;
        3) ./build.sh backend ;;
        4) ./build.sh frontend ;;
        5) ./build.sh packages ;;
        *) warning "Opción no válida" ;;
    esac
}

# Función para ejecutar tests
run_tests() {
    header "EJECUCIÓN DE TESTS"

    if [ -f "dev.sh" ]; then
        echo ""
        echo "Opciones de testing:"
        echo "1) Ejecutar todos los tests"
        echo "2) Tests en modo watch"
        echo "3) Tests con cobertura"
        echo ""

        read -p "Selecciona opción (1-3): " test_option

        case $test_option in
            1) ./dev.sh test all ;;
            2) ./dev.sh test watch ;;
            3) ./dev.sh test coverage ;;
            *) warning "Opción no válida" ;;
        esac
    else
        error "Script dev.sh no encontrado"
    fi
}

# Función para mostrar estado del sistema
show_system_status() {
    header "ESTADO DEL SISTEMA"

    echo ""
    echo "📊 INFORMACIÓN DEL SISTEMA"
    echo "=========================="

    # Estado de Docker
    if docker info &> /dev/null; then
        echo -e "🐳 Docker: ${GREEN}Activo${NC}"

        # Contenedores corriendo
        local containers=$(docker ps -q | wc -l)
        echo "Contenedores activos: $containers"

        # Imágenes
        local images=$(docker images -q | wc -l)
        echo "Imágenes disponibles: $images"
    else
        echo -e "🐳 Docker: ${RED}Inactivo${NC}"
    fi

    echo ""

    # Estado de servicios del proyecto
    if [ -f "docker-compose.dev.yml" ]; then
        echo "🔧 SERVICIOS DEL PROYECTO"
        echo "=========================="
        if docker-compose -f docker-compose.dev.yml ps &> /dev/null; then
            docker-compose -f docker-compose.dev.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
        else
            echo "No se pudieron obtener los estados de los servicios"
        fi
    fi

    echo ""

    # Estado de Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node -v)
        echo -e "📦 Node.js: ${GREEN}$node_version${NC}"
    fi

    # Estado de pnpm
    if command -v pnpm &> /dev/null; then
        local pnpm_version=$(pnpm -v)
        echo -e "📦 pnpm: ${GREEN}v$pnpm_version${NC}"
    fi
}

# Función para limpiar sistema
clean_system() {
    header "LIMPIEZA DEL SISTEMA"

    warning "⚠️  Esta acción limpiará caches, builds y contenedores no utilizados"
    read -p "¿Estás seguro? (y/N): " confirm

    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        # Limpiar con build.sh
        if [ -f "build.sh" ]; then
            ./build.sh clean
        fi

        # Limpiar Docker
        if [ -f "deploy.sh" ]; then
            ./deploy.sh clean
        fi

        success "Sistema limpiado"
    else
        info "Limpieza cancelada"
    fi
}

# Función para mostrar ayuda
show_help() {
    header "AYUDA - A4CO DDD MICROSERVICES"

    echo ""
    echo "DESCRIPCIÓN:"
    echo "Este script maestro orquesta todo el proceso de desarrollo y despliegue"
    echo "del sistema de microservicios A4CO basado en Domain Driven Design."
    echo ""

    echo "SCRIPTS DISPONIBLES:"
    echo "  ./start.sh          - Script maestro (este script)"
    echo "  ./dev.sh            - Desarrollo y testing"
    echo "  ./build.sh          - Compilación del proyecto"
    echo "  ./deploy.sh         - Despliegue con Docker"
    echo "  ./service.sh        - Gestión de servicios individuales"
    echo ""

    echo "SERVICIOS PRINCIPALES:"
    echo "  🔐 Auth Service     - Autenticación y autorización"
    echo "  👤 User Service     - Gestión de usuarios"
    echo "  📦 Product Service  - Catálogo de productos"
    echo "  🛒 Order Service    - Gestión de pedidos"
    echo "  💳 Payment Service  - Procesamiento de pagos"
    echo "  📧 Notification     - Sistema de notificaciones"
    echo "  📊 Analytics        - Análisis y métricas"
    echo "  💬 Chat Service     - Sistema de mensajería"
    echo "  📝 CMS Service      - Sistema de gestión de contenido"
    echo ""

    echo "COMANDOS RÁPIDOS:"
    echo "  ./start.sh          - Menú interactivo"
    echo "  ./dev.sh dev full   - Desarrollo completo"
    echo "  ./deploy.sh deploy  - Despliegue completo"
    echo "  ./build.sh all      - Compilar todo"
    echo ""

    echo "VARIABLES DE ENTORNO:"
    echo "  DEPLOY_ENV          - Entorno (development/production)"
    echo "  NODE_ENV           - Entorno de Node.js"
    echo ""

    echo "Para más información, consulta la documentación en docs/"
}

# Función principal
main() {
    show_banner

    # Verificaciones iniciales
    check_system
    check_dependencies

    # Menú principal
    while true; do
        show_menu
        read -p "Opción: " option

        case $option in
            1) deploy_full ;;
            2) dev_local ;;
            3) manage_services ;;
            4) build_project ;;
            5) run_tests ;;
            6) show_system_status ;;
            7) clean_system ;;
            8) show_help ;;
            0)
                info "¡Hasta luego! 👋"
                exit 0
                ;;
            *)
                error "Opción no válida"
                ;;
        esac

        echo ""
        read -p "Presiona Enter para continuar..."
    done
}

# Verificar si se ejecutó con parámetros
if [ $# -gt 0 ]; then
    case $1 in
        "setup") setup_project ;;
        "deploy") deploy_full ;;
        "dev") dev_local ;;
        "build") build_project ;;
        "test") run_tests ;;
        "status") show_system_status ;;
        "clean") clean_system ;;
        "help"|"-h"|"--help") show_help ;;
        *) error "Parámetro no reconocido: $1"; show_help ;;
    esac
else
    main
fi
