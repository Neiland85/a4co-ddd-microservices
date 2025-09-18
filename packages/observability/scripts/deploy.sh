#!/bin/bash

# Script de despliegue para A4CO Observability
# Uso: ./deploy.sh [environment] [action]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
ENVIRONMENT=${1:-development}
ACTION=${2:-deploy}

# URLs de servicios
JAEGER_URL="http://localhost:16686"
PROMETHEUS_URL="http://localhost:9090"
GRAFANA_URL="http://localhost:3000"

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Función para verificar dependencias
check_dependencies() {
    log "Verificando dependencias..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado"
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose no está instalado"
    fi
    
    # Verificar kubectl (solo para producción)
    if [ "$ENVIRONMENT" = "production" ]; then
        if ! command -v kubectl &> /dev/null; then
            error "kubectl no está instalado"
        fi
    fi
    
    log "Dependencias verificadas ✓"
}

# Función para crear archivos de configuración
create_config_files() {
    log "Creando archivos de configuración..."
    
    # Crear .env si no existe
    if [ ! -f .env ]; then
        cat > .env << EOF
# A4CO Observability Configuration
ENVIRONMENT=$ENVIRONMENT

# Jaeger Configuration
JAEGER_ENDPOINT=http://localhost:14268/api/traces
OTLP_ENDPOINT=http://localhost:4318/v1/traces

# Prometheus Configuration
PROMETHEUS_PORT=9090

# Grafana Configuration
GRAFANA_PORT=3000
GRAFANA_ADMIN_PASSWORD=admin123

# Service Configuration
SERVICE_NAME=product-service
LOG_LEVEL=info
METRICS_PORT=9464

# Frontend Configuration
REACT_APP_LOG_ENDPOINT=http://localhost:3000/api/logs
REACT_APP_TRACE_ENDPOINT=http://localhost:4318/v1/traces
REACT_APP_API_BASE_URL=http://localhost:3000
EOF
        log "Archivo .env creado ✓"
    fi
    
    # Crear docker-compose.yml si no existe
    if [ ! -f docker-compose.yml ]; then
        cat > docker-compose.yml << EOF
version: '3.8'

services:
  jaeger:
    image: jaegertracing/all-in-one:1.50
    container_name: a4co-jaeger
    ports:
      - "16686:16686"   # UI
      - "14268:14268"   # HTTP Collector
      - "14250:14250"   # gRPC Collector
      - "4318:4318"     # OTLP HTTP
      - "4317:4317"     # OTLP gRPC
    environment:
      - COLLECTOR_OTLP_ENABLED=true
      - COLLECTOR_OTLP_HTTP_PORT=4318
      - COLLECTOR_OTLP_GRPC_PORT=4317
    networks:
      - a4co-network
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:v2.45.0
    container_name: a4co-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./k8s/prometheus-config.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    networks:
      - a4co-network
    restart: unless-stopped

  grafana:
    image: grafana/grafana:10.0.0
    container_name: a4co-grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
      - GF_INSTALL_PLUGINS=grafana-piechart-panel,grafana-worldmap-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./k8s/grafana-dashboards:/etc/grafana/provisioning/dashboards
      - ./k8s/grafana-datasources:/etc/grafana/provisioning/datasources
    networks:
      - a4co-network
    restart: unless-stopped
    depends_on:
      - prometheus

volumes:
  prometheus_data:
  grafana_data:

networks:
  a4co-network:
    driver: bridge
EOF
        log "Archivo docker-compose.yml creado ✓"
    fi
    
    # Crear prometheus-config.yml
    mkdir -p k8s
    cat > k8s/prometheus-config.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'jaeger'
    static_configs:
      - targets: ['jaeger:14269']

  - job_name: 'product-service'
    static_configs:
      - targets: ['host.docker.internal:9464']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'auth-service'
    static_configs:
      - targets: ['host.docker.internal:9465']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'order-service'
    static_configs:
      - targets: ['host.docker.internal:9466']
    metrics_path: '/metrics'
    scrape_interval: 10s
EOF
        log "Archivo prometheus-config.yml creado ✓"
}

# Función para desplegar con Docker Compose
deploy_docker_compose() {
    log "Desplegando con Docker Compose..."
    
    # Detener servicios existentes
    docker-compose down 2>/dev/null || true
    
    # Construir y levantar servicios
    docker-compose up -d
    
    # Esperar a que los servicios estén listos
    log "Esperando a que los servicios estén listos..."
    sleep 10
    
    # Verificar estado de los servicios
    check_services_health
}

# Función para desplegar con Kubernetes
deploy_kubernetes() {
    log "Desplegando con Kubernetes..."
    
    # Crear namespace
    kubectl create namespace observability --dry-run=client -o yaml | kubectl apply -f -
    
    # Aplicar configuraciones
    kubectl apply -f k8s/jaeger.yaml
    kubectl apply -f k8s/prometheus.yaml
    kubectl apply -f k8s/grafana.yaml
    
    # Esperar a que los pods estén listos
    log "Esperando a que los pods estén listos..."
    kubectl wait --for=condition=ready pod -l app=jaeger -n observability --timeout=300s
    kubectl wait --for=condition=ready pod -l app=prometheus -n observability --timeout=300s
    kubectl wait --for=condition=ready pod -l app=grafana -n observability --timeout=300s
    
    # Exponer servicios (opcional)
    kubectl port-forward -n observability svc/jaeger 16686:16686 &
    kubectl port-forward -n observability svc/prometheus 9090:9090 &
    kubectl port-forward -n observability svc/grafana 3000:3000 &
    
    log "Servicios expuestos en puertos locales ✓"
}

# Función para verificar salud de servicios
check_services_health() {
    log "Verificando salud de servicios..."
    
    # Verificar Jaeger
    if curl -s "$JAEGER_URL" > /dev/null; then
        log "Jaeger está funcionando ✓"
    else
        warn "Jaeger no está respondiendo"
    fi
    
    # Verificar Prometheus
    if curl -s "$PROMETHEUS_URL" > /dev/null; then
        log "Prometheus está funcionando ✓"
    else
        warn "Prometheus no está respondiendo"
    fi
    
    # Verificar Grafana
    if curl -s "$GRAFANA_URL" > /dev/null; then
        log "Grafana está funcionando ✓"
    else
        warn "Grafana no está respondiendo"
    fi
}

# Función para mostrar información de acceso
show_access_info() {
    echo ""
    log "🎉 Despliegue completado!"
    echo ""
    info "URLs de acceso:"
    echo "  📊 Jaeger UI:     $JAEGER_URL"
    echo "  📈 Prometheus:    $PROMETHEUS_URL"
    echo "  📋 Grafana:       $GRAFANA_URL (admin/admin123)"
    echo ""
    info "Comandos útiles:"
    echo "  Ver logs:         docker-compose logs -f"
    echo "  Detener:          docker-compose down"
    echo "  Reiniciar:        docker-compose restart"
    echo ""
    info "Variables de entorno para tus servicios:"
    echo "  JAEGER_ENDPOINT=$JAEGER_URL"
    echo "  OTLP_ENDPOINT=http://localhost:4318/v1/traces"
    echo "  METRICS_PORT=9464"
    echo ""
}

# Función para limpiar
cleanup() {
    log "Limpiando recursos..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        kubectl delete -f k8s/grafana.yaml --ignore-not-found=true
        kubectl delete -f k8s/prometheus.yaml --ignore-not-found=true
        kubectl delete -f k8s/jaeger.yaml --ignore-not-found=true
        kubectl delete namespace observability --ignore-not-found=true
    else
        docker-compose down -v
        docker system prune -f
    fi
    
    log "Limpieza completada ✓"
}

# Función para mostrar logs
show_logs() {
    log "Mostrando logs..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        kubectl logs -f -l app=jaeger -n observability &
        kubectl logs -f -l app=prometheus -n observability &
        kubectl logs -f -l app=grafana -n observability &
    else
        docker-compose logs -f
    fi
}

# Función para mostrar estado
show_status() {
    log "Estado de los servicios:"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        kubectl get pods -n observability
        kubectl get svc -n observability
    else
        docker-compose ps
    fi
}

# Función principal
main() {
    log "🚀 Iniciando despliegue de A4CO Observability"
    log "Ambiente: $ENVIRONMENT"
    log "Acción: $ACTION"
    echo ""
    
    case $ACTION in
        "deploy")
            check_dependencies
            create_config_files
            
            if [ "$ENVIRONMENT" = "production" ]; then
                deploy_kubernetes
            else
                deploy_docker_compose
            fi
            
            check_services_health
            show_access_info
            ;;
        "cleanup")
            cleanup
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "restart")
            if [ "$ENVIRONMENT" = "production" ]; then
                kubectl rollout restart deployment -n observability
            else
                docker-compose restart
            fi
            ;;
        *)
            error "Acción no válida. Uso: $0 [environment] [deploy|cleanup|logs|status|restart]"
            ;;
    esac
}

# Manejo de señales
trap 'error "Script interrumpido"' INT TERM

# Ejecutar función principal
main "$@"