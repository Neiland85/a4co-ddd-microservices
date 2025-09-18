#!/bin/bash

# ⚙️ A4CO DDD Microservices - Configuración Inicial
# Prepara el entorno de desarrollo completo
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
    echo -e "${PURPLE}⚙️  $1${NC}"
}

# Función para mostrar banner
show_banner() {
    echo ""
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC} ${WHITE}⚙️  A4CO DDD MICROSERVICES - CONFIGURACIÓN INICIAL${NC} ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Función para verificar sistema operativo
check_os() {
    header "VERIFICANDO SISTEMA OPERATIVO"

    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        info "Sistema operativo: Linux"

        # Verificar distribución
        if [ -f /etc/os-release ]; then
            local distro=$(grep '^PRETTY_NAME' /etc/os-release | cut -d'=' -f2 | tr -d '"')
            info "Distribución: $distro"
        fi

    elif [[ "$OSTYPE" == "darwin"* ]]; then
        info "Sistema operativo: macOS"
        local mac_version=$(sw_vers -productVersion)
        info "Versión: $mac_version"

    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        info "Sistema operativo: Windows"
        warning "Asegúrate de tener WSL2 o Docker Desktop configurado"

    else
        warning "Sistema operativo no reconocido: $OSTYPE"
        warning "El sistema podría no ser totalmente compatible"
    fi

    success "Sistema operativo verificado"
}

# Función para instalar dependencias del sistema
install_system_deps() {
    header "INSTALANDO DEPENDENCIAS DEL SISTEMA"

    # Detectar gestor de paquetes
    local package_manager=""

    if command -v apt &> /dev/null; then
        package_manager="apt"
        info "Gestor de paquetes detectado: apt (Ubuntu/Debian)"
    elif command -v yum &> /dev/null; then
        package_manager="yum"
        info "Gestor de paquetes detectado: yum (RHEL/CentOS)"
    elif command -v dnf &> /dev/null; then
        package_manager="dnf"
        info "Gestor de paquetes detectado: dnf (Fedora)"
    elif command -v pacman &> /dev/null; then
        package_manager="pacman"
        info "Gestor de paquetes detectado: pacman (Arch Linux)"
    elif command -v brew &> /dev/null; then
        package_manager="brew"
        info "Gestor de paquetes detectado: brew (macOS)"
    else
        warning "No se detectó un gestor de paquetes conocido"
        info "Instala manualmente: Node.js 18+, pnpm, Docker, Git"
        return
    fi

    # Instalar dependencias según el gestor
    case $package_manager in
        "apt")
            info "Actualizando lista de paquetes..."
            sudo apt update

            info "Instalando dependencias..."
            sudo apt install -y curl wget git build-essential

            # Instalar Node.js si no está
            if ! command -v node &> /dev/null; then
                info "Instalando Node.js 18..."
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            fi

            # Instalar Docker si no está
            if ! command -v docker &> /dev/null; then
                info "Instalando Docker..."
                curl -fsSL https://get.docker.com -o get-docker.sh
                sudo sh get-docker.sh
                sudo usermod -aG docker $USER
                warning "Reinicia la sesión para usar Docker sin sudo"
            fi
            ;;

        "brew")
            info "Instalando dependencias con Homebrew..."

            # Instalar Node.js si no está
            if ! command -v node &> /dev/null; then
                info "Instalando Node.js..."
                brew install node
            fi

            # Instalar Docker si no está disponible
            if ! command -v docker &> /dev/null; then
                info "Docker Desktop debe instalarse manualmente en macOS"
                info "Descárgalo desde: https://www.docker.com/products/docker-desktop"
            fi
            ;;

        *)
            warning "Instalación automática no disponible para $package_manager"
            info "Instala manualmente: Node.js 18+, Docker, Git"
            ;;
    esac

    success "Dependencias del sistema instaladas"
}

# Función para instalar Node.js y pnpm
install_nodejs_tools() {
    header "INSTALANDO HERRAMIENTAS DE NODE.JS"

    # Verificar Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node -v | sed 's/v//')
        local major_version=$(echo $node_version | cut -d. -f1)
        info "Node.js detectado: $node_version"

        if [ "$major_version" -lt 18 ]; then
            warning "Node.js versión $node_version detectada, se recomienda 18+"
            info "Actualiza Node.js manualmente o usa nvm"
        fi
    else
        error "Node.js no está instalado"
        info "Instálalo desde: https://nodejs.org/"
        return 1
    fi

    # Verificar/Instalar pnpm
    if ! command -v pnpm &> /dev/null; then
        info "Instalando pnpm..."
        npm install -g pnpm
    else
        local pnpm_version=$(pnpm -v)
        info "pnpm detectado: v$pnpm_version"
    fi

    # Verificar/Instalar Turbo
    if ! command -v turbo &> /dev/null; then
        info "Instalando Turborepo..."
        pnpm add -g turbo
    else
        local turbo_version=$(turbo --version)
        info "Turbo detectado: $turbo_version"
    fi

    success "Herramientas de Node.js instaladas"
}

# Función para configurar Docker
setup_docker() {
    header "CONFIGURANDO DOCKER"

    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado"
        info "Instálalo desde: https://www.docker.com/get-started"
        return 1
    fi

    # Verificar que Docker esté corriendo
    if ! docker info &> /dev/null; then
        error "Docker no está corriendo"
        info "Inicia Docker Desktop o el servicio de Docker"
        return 1
    fi

    local docker_version=$(docker -v)
    info "Docker: $docker_version"

    # Verificar Docker Compose
    if command -v docker-compose &> /dev/null; then
        local compose_version=$(docker-compose -v)
        info "Docker Compose (v1): $compose_version"
    elif docker compose version &> /dev/null; then
        local compose_version=$(docker compose version)
        info "Docker Compose (v2): $compose_version"
    else
        warning "Docker Compose no está disponible"
        info "Asegúrate de tener Docker Compose instalado"
    fi

    success "Docker configurado correctamente"
}

# Función para configurar el proyecto
setup_project() {
    header "CONFIGURANDO PROYECTO"

    # Verificar que estemos en el directorio correcto
    if [ ! -f "package.json" ]; then
        error "No se encontró package.json. Asegúrate de estar en la raíz del proyecto"
        return 1
    fi

    # Verificar archivos de configuración
    local config_files=("turbo.json" "pnpm-workspace.yaml" "tsconfig.json")
    for file in "${config_files[@]}"; do
        if [ ! -f "$file" ]; then
            error "Archivo de configuración faltante: $file"
            return 1
        fi
    done

    info "Archivos de configuración verificados"

    # Instalar dependencias del proyecto
    info "Instalando dependencias del proyecto..."
    pnpm install

    # Configurar variables de entorno
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            info "Configurando variables de entorno..."
            cp .env.example .env.local
            warning "⚠️  Revisa y configura las variables en .env.local antes de continuar"
        else
            warning "No se encontró .env.example"
            info "Crea un archivo .env.local con las variables necesarias"
        fi
    fi

    # Hacer ejecutables los scripts
    info "Configurando permisos de scripts..."
    chmod +x *.sh
    chmod +x scripts/*.sh 2>/dev/null || true

    success "Proyecto configurado"
}

# Función para verificar configuración
verify_setup() {
    header "VERIFICANDO CONFIGURACIÓN"

    local all_good=true

    # Verificar Node.js versión
    if command -v node &> /dev/null; then
        local node_version=$(node -v | sed 's/v//')
        local major_version=$(echo $node_version | cut -d. -f1)
        if [ "$major_version" -ge 18 ]; then
            success "Node.js $node_version ✓"
        else
            error "Node.js versión insuficiente: $node_version (requiere 18+)"
            all_good=false
        fi
    else
        error "Node.js no instalado"
        all_good=false
    fi

    # Verificar pnpm
    if command -v pnpm &> /dev/null; then
        success "pnpm ✓"
    else
        error "pnpm no instalado"
        all_good=false
    fi

    # Verificar Docker
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        success "Docker ✓"
    else
        error "Docker no disponible o no corriendo"
        all_good=false
    fi

    # Verificar dependencias del proyecto
    if [ -d "node_modules" ]; then
        success "Dependencias del proyecto ✓"
    else
        error "Dependencias del proyecto no instaladas"
        all_good=false
    fi

    # Verificar scripts
    local scripts=("start.sh" "dev.sh" "build.sh" "deploy.sh" "service.sh")
    for script in "${scripts[@]}"; do
        if [ -x "$script" ]; then
            success "Script $script ✓"
        else
            error "Script $script no ejecutable"
            all_good=false
        fi
    done

    if [ "$all_good" = true ]; then
        success "🎉 Configuración completada exitosamente"
        echo ""
        info "Próximos pasos:"
        echo "  1. Configura las variables de entorno en .env.local"
        echo "  2. Ejecuta: ./start.sh"
        echo "  3. Selecciona una opción del menú principal"
        echo ""
        info "Comandos útiles:"
        echo "  ./start.sh          - Menú principal"
        echo "  ./dev.sh dev full   - Desarrollo completo"
        echo "  ./deploy.sh deploy  - Despliegue con Docker"
        echo "  ./build.sh all      - Compilar proyecto"
    else
        error "Hay problemas en la configuración que deben resolverse"
        return 1
    fi
}

# Función para mostrar ayuda
show_help() {
    header "AYUDA - CONFIGURACIÓN INICIAL"

    echo ""
    echo "DESCRIPCIÓN:"
    echo "Este script configura completamente el entorno de desarrollo"
    echo "para el proyecto A4CO DDD Microservices."
    echo ""

    echo "QUE HACE ESTE SCRIPT:"
    echo "  ✅ Verifica el sistema operativo"
    echo "  ✅ Instala dependencias del sistema (Node.js, Docker, etc.)"
    echo "  ✅ Configura herramientas de desarrollo (pnpm, Turbo)"
    echo "  ✅ Prepara el proyecto (dependencias, permisos, configuración)"
    echo "  ✅ Verifica que todo esté correctamente configurado"
    echo ""

    echo "OPCIONES:"
    echo "  --help, -h          Mostrar esta ayuda"
    echo "  --skip-system       Saltar instalación de dependencias del sistema"
    echo "  --skip-docker       Saltar configuración de Docker"
    echo ""

    echo "EJEMPLOS:"
    echo "  ./setup.sh              - Configuración completa"
    echo "  ./setup.sh --skip-docker - Saltar Docker"
    echo ""

    echo "DEPENDENCIAS REQUERIDAS:"
    echo "  - Node.js 18+"
    echo "  - pnpm"
    echo "  - Docker & Docker Compose"
    echo "  - Git"
    echo ""

    echo "DESPUÉS DE LA CONFIGURACIÓN:"
    echo "  Ejecuta ./start.sh para acceder al menú principal"
}

# Función principal
main() {
    local skip_system=false
    local skip_docker=false

    # Procesar argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --skip-system)
                skip_system=true
                ;;
            --skip-docker)
                skip_docker=true
                ;;
            *)
                error "Opción no reconocida: $1"
                show_help
                exit 1
                ;;
        esac
        shift
    done

    show_banner

    # Verificar sistema operativo
    check_os

    # Instalar dependencias del sistema
    if [ "$skip_system" = false ]; then
        install_system_deps
    else
        info "Saltando instalación de dependencias del sistema"
    fi

    # Instalar herramientas de Node.js
    install_nodejs_tools

    # Configurar Docker
    if [ "$skip_docker" = false ]; then
        setup_docker
    else
        info "Saltando configuración de Docker"
    fi

    # Configurar proyecto
    setup_project

    # Verificar configuración final
    verify_setup
}

# Ejecutar función principal
main "$@"
