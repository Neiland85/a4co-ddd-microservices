#!/bin/bash

# 🚀 A4CO DDD Microservices - Script de Despliegue
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

# Configuración
DEPLOY_ENV=${DEPLOY_ENV:-"development"}
DOCKER_COMPOSE_FILE="docker-compose.dev.yml"

if [ "$DEPLOY_ENV" = "production" ]; then
    DOCKER_COMPOSE_FILE="docker-compose.yml"
fi

# Función para verificar prerrequisitos
check_prerequisites() {
    log "Verificando prerrequisitos de despliegue..."

    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado"
        exit 1
    fi

    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose no está instalado"
        exit 1
    fi

    # Verificar que Docker esté corriendo
    if ! docker info &> /dev/null; then
        error "Docker no está corriendo"
        exit 1
    fi

    # Verificar archivos de configuración
    if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
        error "Archivo $DOCKER_COMPOSE_FILE no encontrado"
        exit 1
    fi

    if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
        warning "Archivo de variables de entorno no encontrado"
    fi

    success "Prerrequisitos verificados"
}

# Función para preparar el entorno
prepare_environment() {
    log "Preparando entorno de despliegue..."

    # Crear directorios necesarios
    mkdir -p logs
    mkdir -p data
    mkdir -p backups

    # Verificar y crear archivo .env si no existe
    if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
        info "Creando .env.local desde .env.example"
        cp .env.example .env.local
        warning "Por favor configura las variables de entorno en .env.local"
    fi

    success "Entorno preparado"
}

# Función para construir imágenes Docker
build_images() {
    local no_cache=${1:-false}

    log "Construyendo imágenes Docker..."

    if [ "$no_cache" = true ]; then
        info "Construyendo sin cache..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    else
        docker-compose -f "$DOCKER_COMPOSE_FILE" build
    fi

    success "Imágenes Docker construidas"
}

# Función para iniciar servicios
start_services() {
    local detached=${1:-true}

    log "Iniciando servicios..."

    if [ "$detached" = true ]; then
        docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
        success "Servicios iniciados en segundo plano"
    else
        info "Iniciando servicios en primer plano (presiona Ctrl+C para detener)"
        docker-compose -f "$DOCKER_COMPOSE_FILE" up
    fi
}

# Función para detener servicios
stop_services() {
    log "Deteniendo servicios..."

    docker-compose -f "$DOCKER_COMPOSE_FILE" down

    success "Servicios detenidos"
}

# Función para reiniciar servicios
restart_services() {
    log "Reiniciando servicios..."

    docker-compose -f "$DOCKER_COMPOSE_FILE" restart

    success "Servicios reiniciados"
}

# Función para mostrar estado de servicios
show_status() {
    log "Estado de servicios:"

    docker-compose -f "$DOCKER_COMPOSE_FILE" ps

    echo ""
    info "Recursos utilizados:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

# Función para mostrar logs
show_logs() {
    local service=$1
    local follow=${2:-false}

    if [ -n "$service" ]; then
        log "Mostrando logs del servicio: $service"
        if [ "$follow" = true ]; then
            docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f "$service"
        else
            docker-compose -f "$DOCKER_COMPOSE_FILE" logs "$service"
        fi
    else
        log "Mostrando logs de todos los servicios"
        if [ "$follow" = true ]; then
            docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f
        else
            docker-compose -f "$DOCKER_COMPOSE_FILE" logs
        fi
    fi
}

# Función para ejecutar comandos en servicios
exec_command() {
    local service=$1
    local command=$2

    if [ -z "$service" ] || [ -z "$command" ]; then
        error "Uso: $0 exec [service] [command]"
        exit 1
    fi

    log "Ejecutando comando en $service: $command"
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec "$service" $command
}

# Función para hacer backup
create_backup() {
    local backup_name=${1:-"backup-$(date +%Y%m%d-%H%M%S)"}

    log "Creando backup: $backup_name"

    mkdir -p "backups/$backup_name"

    # Backup de bases de datos si existen
    if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q postgres; then
        info "Creando backup de PostgreSQL..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" exec postgres pg_dumpall -U postgres > "backups/$backup_name/postgres.sql"
    fi

    if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q redis; then
        info "Creando backup de Redis..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" exec redis redis-cli SAVE
        docker cp $(docker-compose -f "$DOCKER_COMPOSE_FILE" ps -q redis):/data/dump.rdb "backups/$backup_name/redis.rdb"
    fi

    # Backup de configuraciones
    cp .env.local "backups/$backup_name/.env.backup" 2>/dev/null || true
    cp docker-compose*.yml "backups/$backup_name/" 2>/dev/null || true

    success "Backup creado en backups/$backup_name"
}

# Función para restaurar backup
restore_backup() {
    local backup_name=$1

    if [ -z "$backup_name" ]; then
        error "Debes especificar el nombre del backup"
        echo "Backups disponibles:"
        ls -la backups/
        exit 1
    fi

    if [ ! -d "backups/$backup_name" ]; then
        error "Backup '$backup_name' no encontrado"
        exit 1
    fi

    log "Restaurando backup: $backup_name"

    warning "⚠️  Esta acción sobrescribirá los datos actuales. ¿Estás seguro? (y/N)"
    read -r confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        info "Restauración cancelada"
        exit 0
    fi

    # Restaurar bases de datos
    if [ -f "backups/$backup_name/postgres.sql" ]; then
        info "Restaurando PostgreSQL..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T postgres psql -U postgres < "backups/$backup_name/postgres.sql"
    fi

    if [ -f "backups/$backup_name/redis.rdb" ]; then
        info "Restaurando Redis..."
        docker cp "backups/$backup_name/redis.rdb" $(docker-compose -f "$DOCKER_COMPOSE_FILE" ps -q redis):/data/dump.rdb
        docker-compose -f "$DOCKER_COMPOSE_FILE" exec redis redis-cli FLUSHALL
    fi

    success "Backup restaurado"
}

# Función para limpiar contenedores e imágenes no utilizados
clean_docker() {
    log "Limpiando Docker..."

    warning "Esto eliminará contenedores, imágenes y volúmenes no utilizados. ¿Continuar? (y/N)"
    read -r confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        info "Limpieza cancelada"
        exit 0
    fi

    info "Deteniendo y eliminando contenedores..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down -v

    info "Eliminando imágenes no utilizadas..."
    docker image prune -f

    info "Eliminando volúmenes no utilizados..."
    docker volume prune -f

    success "Docker limpiado"
}

# Función para despliegue completo
deploy_full() {
    log "🚀 Iniciando despliegue completo..."

    check_prerequisites
    prepare_environment
    build_images
    start_services

    success "Despliegue completado"

    echo ""
    info "🌐 Servicios disponibles:"
    echo "  - Traefik Dashboard: http://localhost:8080"
    echo "  - API Gateway: http://api.localhost"
    echo "  - Dashboard: http://dashboard.localhost"
    echo "  - Design System: http://design.localhost:6006"
}

# Función para mostrar ayuda
show_help() {
    echo "🚀 A4CO DDD Microservices - Script de Despliegue"
    echo ""
    echo "Uso: $0 [comando] [opciones]"
    echo ""
    echo "Comandos disponibles:"
    echo "  deploy           Despliegue completo"
    echo "  start            Iniciar servicios"
    echo "  stop             Detener servicios"
    echo "  restart          Reiniciar servicios"
    echo "  status           Mostrar estado de servicios"
    echo "  logs [service]   Mostrar logs (opcional: servicio específico)"
    echo "  logs:follow      Mostrar logs en tiempo real"
    echo "  exec [service] [cmd]  Ejecutar comando en servicio"
    echo "  build            Construir imágenes Docker"
    echo "  build:no-cache   Construir imágenes sin cache"
    echo "  backup [name]    Crear backup"
    echo "  restore [name]   Restaurar backup"
    echo "  clean            Limpiar Docker"
    echo "  help             Mostrar esta ayuda"
    echo ""
    echo "Variables de entorno:"
    echo "  DEPLOY_ENV       Entorno de despliegue (development/production)"
    echo ""
    echo "Ejemplos:"
    echo "  $0 deploy                    # Despliegue completo"
    echo "  $0 start                     # Iniciar servicios"
    echo "  $0 logs api-gateway          # Ver logs del API Gateway"
    echo "  $0 exec postgres psql        # Ejecutar psql en PostgreSQL"
    echo "  $0 backup my-backup          # Crear backup"
    echo "  DEPLOY_ENV=production $0 deploy  # Despliegue en producción"
}

# Función principal
main() {
    local command=$1
    shift

    case $command in
        "deploy")
            deploy_full
            ;;
        "start")
            check_prerequisites
            start_services
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "status")
            show_status
            ;;
        "logs")
            if [ "$1" = "follow" ]; then
                show_logs "" true
            else
                show_logs "$1"
            fi
            ;;
        "logs:follow")
            show_logs "" true
            ;;
        "exec")
            exec_command "$1" "$2"
            ;;
        "build")
            check_prerequisites
            build_images
            ;;
        "build:no-cache")
            check_prerequisites
            build_images true
            ;;
        "backup")
            create_backup "$1"
            ;;
        "restore")
            restore_backup "$1"
            ;;
        "clean")
            clean_docker
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
