#!/bin/bash

# 🔧 A4CO DDD Microservices - Gestor de Servicios
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

# Lista de servicios disponibles
SERVICES=(
    "auth-service"
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

# Función para verificar si un servicio existe
service_exists() {
    local service=$1
    for s in "${SERVICES[@]}"; do
        if [ "$s" = "$service" ]; then
            return 0
        fi
    done
    return 1
}

# Función para verificar estado de un servicio
check_service_status() {
    local service=$1

    if [ ! -d "apps/$service" ]; then
        error "Servicio '$service' no encontrado en apps/$service"
        return 1
    fi

    # Verificar package.json
    if [ ! -f "apps/$service/package.json" ]; then
        warning "package.json no encontrado para $service"
        return 1
    fi

    return 0
}

# Función para iniciar un servicio específico
start_service() {
    local service=$1
    local mode=${2:-"dev"}

    if ! service_exists "$service"; then
        error "Servicio '$service' no reconocido"
        echo "Servicios disponibles: ${SERVICES[*]}"
        exit 1
    fi

    if ! check_service_status "$service"; then
        exit 1
    fi

    log "Iniciando servicio: $service (modo: $mode)"

    case $mode in
        "dev")
            cd "apps/$service"
            if [ -f "package.json" ]; then
                if grep -q '"dev"' package.json; then
                    pnpm run dev
                else
                    warning "Script 'dev' no encontrado, intentando 'start'"
                    pnpm run start
                fi
            fi
            ;;
        "build")
            cd "apps/$service"
            if [ -f "package.json" ] && grep -q '"build"' package.json; then
                pnpm run build
                success "Servicio $service construido"
            else
                warning "Script 'build' no encontrado para $service"
            fi
            ;;
        "test")
            cd "apps/$service"
            if [ -f "package.json" ] && grep -q '"test"' package.json; then
                pnpm run test
            else
                warning "Script 'test' no encontrado para $service"
            fi
            ;;
        *)
            error "Modo '$mode' no reconocido"
            exit 1
            ;;
    esac
}

# Función para iniciar múltiples servicios
start_multiple_services() {
    local services=("$@")

    if [ ${#services[@]} -eq 0 ]; then
        error "Debes especificar al menos un servicio"
        exit 1
    fi

    info "Iniciando ${#services[@]} servicios..."

    # Usar trap para manejar señales
    trap 'error "Interrumpido por el usuario"; exit 1' INT TERM

    # Iniciar servicios en background
    local pids=()
    local service_names=()

    for service in "${services[@]}"; do
        if service_exists "$service" && check_service_status "$service"; then
            log "Iniciando $service..."
            start_service "$service" &
            pids+=($!)
            service_names+=("$service")
        else
            warning "Saltando servicio $service (no válido o no encontrado)"
        fi
    done

    # Esperar a que terminen
    if [ ${#pids[@]} -gt 0 ]; then
        info "Servicios iniciados. Presiona Ctrl+C para detener todos"

        # Función para detener todos los servicios
        cleanup() {
            log "Deteniendo servicios..."
            for pid in "${pids[@]}"; do
                if kill -0 $pid 2>/dev/null; then
                    kill $pid
                fi
            done
            success "Todos los servicios detenidos"
            exit 0
        }

        trap cleanup INT TERM

        # Esperar a que algún proceso termine
        wait "${pids[0]}"
    fi
}

# Función para mostrar estado de servicios
show_services_status() {
    info "Estado de servicios disponibles:"

    printf "%-20s %-10s %-10s %-10s\n" "Servicio" "Existe" "Package" "Scripts"
    printf "%-20s %-10s %-10s %-10s\n" "--------" "------" "-------" "-------"

    for service in "${SERVICES[@]}"; do
        local exists="❌"
        local has_package="❌"
        local has_scripts="❌"

        if [ -d "apps/$service" ]; then
            exists="✅"
            if [ -f "apps/$service/package.json" ]; then
                has_package="✅"
                # Verificar scripts básicos
                if grep -q '"dev"\|"start"\|"build"' "apps/$service/package.json" 2>/dev/null; then
                    has_scripts="✅"
                fi
            fi
        fi

        printf "%-20s %-10s %-10s %-10s\n" "$service" "$exists" "$has_package" "$has_scripts"
    done
}

# Función para mostrar logs de un servicio
show_service_logs() {
    local service=$1

    if ! service_exists "$service"; then
        error "Servicio '$service' no reconocido"
        exit 1
    fi

    if [ ! -d "apps/$service" ]; then
        error "Directorio del servicio no encontrado"
        exit 1
    fi

    info "Mostrando logs del servicio: $service"
    echo "Presiona Ctrl+C para salir"

    # Si hay un archivo de log, mostrarlo
    if [ -f "apps/$service/logs/app.log" ]; then
        tail -f "apps/$service/logs/app.log"
    elif [ -f "apps/$service/app.log" ]; then
        tail -f "apps/$service/app.log"
    else
        warning "No se encontraron archivos de log para $service"
        info "Los logs aparecerán aquí cuando el servicio se ejecute"
        # Mantener el script corriendo
        while true; do
            sleep 1
        done
    fi
}

# Función para mostrar ayuda
show_help() {
    echo "🔧 A4CO DDD Microservices - Gestor de Servicios"
    echo ""
    echo "Uso: $0 [comando] [servicio] [opciones]"
    echo ""
    echo "Comandos disponibles:"
    echo "  start [service]     Iniciar un servicio específico"
    echo "  start [service1,service2,...]  Iniciar múltiples servicios"
    echo "  build [service]     Construir un servicio"
    echo "  test [service]      Ejecutar tests de un servicio"
    echo "  logs [service]      Mostrar logs de un servicio"
    echo "  status              Mostrar estado de todos los servicios"
    echo "  list                Listar servicios disponibles"
    echo "  help                Mostrar esta ayuda"
    echo ""
    echo "Servicios disponibles:"
    for service in "${SERVICES[@]}"; do
        echo "  - $service"
    done
    echo ""
    echo "Ejemplos:"
    echo "  $0 start auth-service           # Iniciar servicio de autenticación"
    echo "  $0 start auth-service,user-service  # Iniciar múltiples servicios"
    echo "  $0 build product-service        # Construir servicio de productos"
    echo "  $0 logs notification-service    # Ver logs del servicio de notificaciones"
    echo "  $0 status                       # Ver estado de todos los servicios"
}

# Función principal
main() {
    local command=$1
    shift

    case $command in
        "start")
            if [ $# -eq 0 ]; then
                error "Debes especificar al menos un servicio"
                exit 1
            fi

            # Verificar si hay múltiples servicios separados por coma
            if [[ "$1" == *","* ]]; then
                IFS=',' read -ra services <<< "$1"
                start_multiple_services "${services[@]}"
            else
                start_service "$1" "$2"
            fi
            ;;
        "build")
            if [ $# -eq 0 ]; then
                error "Debes especificar un servicio"
                exit 1
            fi
            start_service "$1" "build"
            ;;
        "test")
            if [ $# -eq 0 ]; then
                error "Debes especificar un servicio"
                exit 1
            fi
            start_service "$1" "test"
            ;;
        "logs")
            if [ $# -eq 0 ]; then
                error "Debes especificar un servicio"
                exit 1
            fi
            show_service_logs "$1"
            ;;
        "status")
            show_services_status
            ;;
        "list")
            info "Servicios disponibles:"
            for service in "${SERVICES[@]}"; do
                echo "  - $service"
            done
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
