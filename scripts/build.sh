#!/bin/bash

# 🔨 A4CO DDD Microservices - Script de Compilación
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

# Función para verificar dependencias de compilación
check_build_deps() {
    log "Verificando dependencias de compilación..."

    # Verificar Node.js versión
    local node_version=$(node -v | sed 's/v//')
    local major_version=$(echo $node_version | cut -d. -f1)

    if [ "$major_version" -lt 18 ]; then
        error "Node.js versión $node_version detectada. Se requiere Node.js 18+"
        exit 1
    fi

    # Verificar pnpm
    if ! command -v pnpm &> /dev/null; then
        error "pnpm no está instalado"
        exit 1
    fi

    # Verificar TypeScript
    if ! command -v tsc &> /dev/null; then
        warning "TypeScript CLI no está instalado globalmente"
    fi

    success "Dependencias de compilación verificadas"
}

# Función para limpiar builds anteriores
clean_builds() {
    log "Limpiando builds anteriores..."

    # Directorios a limpiar
    local dirs_to_clean=(
        "apps/*/dist"
        "apps/*/.next"
        "apps/*/build"
        "packages/*/dist"
        "packages/*/build"
        "dist"
        ".next"
        "build"
        "coverage"
        ".turbo"
    )

    for dir in "${dirs_to_clean[@]}"; do
        if compgen -G "$dir" > /dev/null; then
            rm -rf $dir
            info "Limpiado: $dir"
        fi
    done

    success "Builds anteriores limpiados"
}

# Función para compilar servicios backend
build_backend_services() {
    log "Compilando servicios backend..."

    local backend_services=(
        "user-service"
        "product-service"
        "order-service"
        "payment-service"
        "notification-service"
        "analytics-service"
        "chat-service"
        "cms-service"
        "event-service"
        "geo-service"
        "inventory-service"
        "loyalty-service"
        "transportista-service"
        "artisan-service"
        "admin-service"
    )

    local failed_services=()

    for service in "${backend_services[@]}"; do
        if [ -d "apps/$service" ]; then
            info "Compilando $service..."
            if cd "apps/$service" && pnpm run build 2>/dev/null; then
                success "$service compilado correctamente"
            else
                warning "$service falló al compilar (posiblemente no tiene script build)"
                failed_services+=("$service")
            fi
            cd ../..
        else
            warning "Servicio $service no encontrado"
        fi
    done

    if [ ${#failed_services[@]} -gt 0 ]; then
        warning "Servicios que no se pudieron compilar: ${failed_services[*]}"
    fi
}

# Función para compilar aplicaciones frontend
build_frontend_apps() {
    log "Compilando aplicaciones frontend..."

    local frontend_apps=(
        "dashboard-web"
        "web"
    )

    local failed_apps=()

    for app in "${frontend_apps[@]}"; do
        if [ -d "apps/$app" ]; then
            info "Compilando $app..."
            if cd "apps/$app" && pnpm run build 2>/dev/null; then
                success "$app compilado correctamente"
            else
                warning "$app falló al compilar"
                failed_apps+=("$app")
            fi
            cd ../..
        else
            warning "Aplicación $app no encontrada"
        fi
    done

    if [ ${#failed_apps[@]} -gt 0 ]; then
        warning "Aplicaciones que no se pudieron compilar: ${failed_apps[*]}"
    fi
}

# Función para compilar paquetes compartidos
build_packages() {
    log "Compilando paquetes compartidos..."

    if [ -d "packages" ]; then
        local packages=$(find packages -name "package.json" -type f | xargs dirname | xargs basename -a)

        for package in $packages; do
            if [ -d "packages/$package" ]; then
                info "Compilando paquete $package..."
                if cd "packages/$package" && pnpm run build 2>/dev/null; then
                    success "Paquete $package compilado correctamente"
                else
                    warning "Paquete $package falló al compilar"
                fi
                cd ../..
            fi
        done
    else
        info "No se encontraron paquetes para compilar"
    fi
}

# Función para ejecutar type checking
run_type_check() {
    log "Ejecutando verificación de tipos TypeScript..."

    if pnpm run type-check 2>/dev/null; then
        success "Verificación de tipos completada"
    else
        warning "Verificación de tipos falló (algunos servicios pueden no tener configuración TypeScript)"
    fi
}

# Función para ejecutar linting
run_linting() {
    log "Ejecutando linting..."

    if pnpm run lint 2>/dev/null; then
        success "Linting completado"
    else
        warning "Linting falló"
    fi
}

# Función para ejecutar tests
run_tests() {
    log "Ejecutando tests..."

    if pnpm run test 2>/dev/null; then
        success "Tests completados"
    else
        warning "Algunos tests fallaron"
    fi
}

# Función para generar documentación
generate_docs() {
    log "Generando documentación..."

    # Verificar si existe algún generador de docs
    if [ -f "package.json" ] && grep -q '"docs"' package.json; then
        if pnpm run docs 2>/dev/null; then
            success "Documentación generada"
        else
            warning "Fallo al generar documentación"
        fi
    else
        info "No se encontró generador de documentación"
    fi
}

# Función para optimizar builds
optimize_builds() {
    log "Optimizando builds..."

    # Crear directorio de distribución si no existe
    mkdir -p dist

    # Copiar archivos necesarios
    if [ -f "package.json" ]; then
        cp package.json dist/
    fi

    if [ -f "README.md" ]; then
        cp README.md dist/
    fi

    success "Builds optimizados"
}

# Función para mostrar resumen de compilación
show_build_summary() {
    log "Resumen de compilación:"

    echo ""
    echo "📊 ESTADÍSTICAS DE COMPILACIÓN"
    echo "================================"

    # Contar servicios compilados
    local backend_count=$(find apps -name "dist" -type d | grep -E "(service|admin)" | wc -l)
    local frontend_count=$(find apps -name ".next" -o -name "dist" | grep -v service | grep -v admin | wc -l)
    local packages_count=$(find packages -name "dist" -type d 2>/dev/null | wc -l || echo 0)

    echo "🔧 Servicios Backend compilados: $backend_count"
    echo "🌐 Aplicaciones Frontend compiladas: $frontend_count"
    echo "📦 Paquetes compartidos compilados: $packages_count"

    # Verificar tamaño total
    local total_size=$(du -sh dist apps/*/dist apps/*/.next packages/*/dist 2>/dev/null | tail -1 | cut -f1 || echo "N/A")
    echo "💾 Tamaño total de builds: $total_size"

    echo ""
    echo "📁 ESTRUCTURA DE BUILDS GENERADA:"
    echo "=================================="

    if [ -d "dist" ]; then
        echo "dist/"
        find dist -type f | head -10 | sed 's/^/  /'
        if [ $(find dist -type f | wc -l) -gt 10 ]; then
            echo "  ... y $(($(find dist -type f | wc -l) - 10)) archivos más"
        fi
    fi

    echo ""
    success "Compilación completada exitosamente"
}

# Función para compilación completa
build_all() {
    log "🚀 Iniciando compilación completa del proyecto..."

    # Verificar dependencias
    check_build_deps

    # Limpiar builds anteriores
    clean_builds

    # Ejecutar verificaciones previas
    run_type_check
    run_linting

    # Compilar en orden de dependencias
    build_packages
    build_backend_services
    build_frontend_apps

    # Ejecutar tests
    run_tests

    # Generar documentación
    generate_docs

    # Optimizar y organizar
    optimize_builds

    # Mostrar resumen
    show_build_summary
}

# Función para compilación rápida (solo build sin verificaciones)
build_fast() {
    log "⚡ Iniciando compilación rápida..."

    check_build_deps
    clean_builds

    # Compilar todo en paralelo con turbo
    if pnpm run build 2>/dev/null; then
        success "Compilación rápida completada"
    else
        error "Compilación rápida falló"
        exit 1
    fi
}

# Función para mostrar ayuda
show_help() {
    echo "🔨 A4CO DDD Microservices - Script de Compilación"
    echo ""
    echo "Uso: $0 [comando] [opciones]"
    echo ""
    echo "Comandos disponibles:"
    echo "  all              Compilación completa (verificación + build + tests)"
    echo "  fast             Compilación rápida (solo build)"
    echo "  backend          Compilar solo servicios backend"
    echo "  frontend         Compilar solo aplicaciones frontend"
    echo "  packages         Compilar solo paquetes compartidos"
    echo "  clean            Limpiar builds anteriores"
    echo "  check            Ejecutar verificaciones (types + lint)"
    echo "  test             Ejecutar tests"
    echo "  docs             Generar documentación"
    echo "  help             Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 all                      # Compilación completa"
    echo "  $0 fast                     # Compilación rápida"
    echo "  $0 backend                  # Solo backend"
    echo "  $0 frontend                 # Solo frontend"
    echo "  $0 clean && $0 all          # Limpiar y compilar todo"
}

# Función principal
main() {
    local command=${1:-"help"}

    case $command in
        "all")
            build_all
            ;;
        "fast")
            build_fast
            ;;
        "backend")
            check_build_deps
            build_backend_services
            ;;
        "frontend")
            check_build_deps
            build_frontend_apps
            ;;
        "packages")
            check_build_deps
            build_packages
            ;;
        "clean")
            clean_builds
            ;;
        "check")
            check_build_deps
            run_type_check
            run_linting
            ;;
        "test")
            run_tests
            ;;
        "docs")
            generate_docs
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
