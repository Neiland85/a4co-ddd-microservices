#!/bin/bash

# 🚀 A4CO Marketplace - Messaging Infrastructure Startup Script
# Este script inicia toda la infraestructura de mensajería y monitoreo

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
     cursor/design-microservice-communication-strategy-a023
   \( / /     ) (__ ) __ (

   \ (/ /      ) (__ ) __ (
   develop
    \__/ \____)\___)\__)(__)
                            
   Marketplace Local de Jaén
   Messaging Infrastructure
EOF
echo -e "${NC}"

# Verificar dependencias
check_dependencies() {
    log "🔍 Verificando dependencias..."
    
    # Docker
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    # Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
        exit 1
    fi
    
    # Verificar que Docker esté corriendo
    if ! docker info &> /dev/null; then
        error "Docker no está corriendo. Por favor inicia Docker primero."
        exit 1
    fi
    
    log "✅ Todas las dependencias están instaladas"
}

# Crear directorios necesarios
create_directories() {
    log "📁 Creando directorios necesarios..."
    
    mkdir -p config/{nats,prometheus,grafana/provisioning/{dashboards,datasources}}
    mkdir -p data/{nats,redis,prometheus,grafana,elasticsearch}
    
    log "✅ Directorios creados"
}

# Crear configuración de Prometheus
create_prometheus_config() {
    log "⚙️ Creando configuración de Prometheus..."
    
    cat > config/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'nats'
    static_configs:
      - targets: ['nats:8222']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'microservices'
    static_configs:
      - targets: [
          'order-service:3001',
          'payment-service:3002', 
          'inventory-service:3003',
          'user-service:3004',
          'notification-service:3005'
        ]
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
EOF

    log "✅ Configuración de Prometheus creada"
}

# Crear configuración de Grafana
create_grafana_config() {
    log "⚙️ Creando configuración de Grafana..."
    
    # Datasource configuration
    cat > config/grafana/provisioning/datasources/prometheus.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true

  - name: Elasticsearch
    type: elasticsearch
    access: proxy
    url: http://elasticsearch:9200
    database: "logstash-*"
    interval: Daily
    timeField: "@timestamp"
    editable: true
EOF

    # Dashboard configuration
    cat > config/grafana/provisioning/dashboards/dashboard.yml << 'EOF'
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
EOF

    log "✅ Configuración de Grafana creada"
}

# Crear configuración de NATS
create_nats_config() {
    log "⚙️ Creando configuración de NATS..."
    
    cat > config/nats/nats.conf << 'EOF'
# NATS Server Configuration for A4CO Marketplace

# Connection settings
port: 4222
http_port: 8222

# JetStream settings
jetstream {
    store_dir: /data
    max_memory_store: 1GB
    max_file_store: 10GB
}

# Monitoring
monitor_port: 8222

# Logging
debug: false
trace: false
logtime: true

# Limits
max_connections: 1000
max_payload: 1MB

# Cluster configuration (for future scaling)
cluster {
    name: a4co-marketplace
    listen: 0.0.0.0:6222
}

# WebSocket configuration (for web clients)
websocket {
    port: 9222
    no_tls: true
}
EOF

    log "✅ Configuración de NATS creada"
}

# Iniciar servicios
start_services() {
    log "🚀 Iniciando servicios de infraestructura..."
    
    # Limpiar servicios existentes
    info "Limpiando servicios existentes..."
    docker-compose -f docker-compose.messaging.yml down -v 2>/dev/null || true
    
    # Iniciar servicios
    info "Iniciando servicios con Docker Compose..."
    docker-compose -f docker-compose.messaging.yml up -d
    
    log "✅ Servicios iniciados"
}

# Verificar salud de servicios
check_services_health() {
    log "🏥 Verificando salud de servicios..."
    
    services=(
        "nats:4222:NATS"
        "redis:6379:Redis" 
        "prometheus:9090:Prometheus"
        "grafana:3000:Grafana"
        "elasticsearch:9200:Elasticsearch"
        "jaeger:16686:Jaeger"
    )
    
    for service in "${services[@]}"; do
        IFS=':' read -r host port name <<< "$service"
        
        info "Verificando $name ($host:$port)..."

        # Esperar hasta 60 segundos (versión segura sin braces expansion)
        local max_attempts=60
        local attempt=1
        while [ $attempt -le $max_attempts ]; do
            if nc -z $host $port 2>/dev/null; then
                log "✅ $name está listo"
                break
            fi
            if [ $attempt -eq $max_attempts ]; then
                warn "⚠️ $name no responde después de 60 segundos"
            fi
            sleep 1
            attempt=$((attempt + 1))
        done
    done
}

# Mostrar información de servicios
show_service_info() {
    log "📋 Información de servicios:"
    echo ""
    echo -e "${BLUE}🔗 URLs de servicios:${NC}"
    echo -e "  • NATS Monitoring:    ${GREEN}http://localhost:8222${NC}"
    echo -e "  • Grafana Dashboard:  ${GREEN}http://localhost:3000${NC} (admin/admin123)"
    echo -e "  • Prometheus:         ${GREEN}http://localhost:9090${NC}"
    echo -e "  • Jaeger Tracing:     ${GREEN}http://localhost:16686${NC}"
    echo -e "  • Kibana (Logs):      ${GREEN}http://localhost:5601${NC}"
    echo -e "  • Elasticsearch:      ${GREEN}http://localhost:9200${NC}"
    echo ""
    echo -e "${BLUE}📊 Conexiones internas:${NC}"
    echo -e "  • NATS Client:        ${GREEN}nats://localhost:4222${NC}"
    echo -e "  • Redis:              ${GREEN}redis://localhost:6379${NC}"
    echo -e "  • WebSocket:          ${GREEN}ws://localhost:9222${NC}"
    echo ""
    echo -e "${YELLOW}💡 Comandos útiles:${NC}"
    echo -e "  • Ver logs:           ${GREEN}docker-compose -f docker-compose.messaging.yml logs -f${NC}"
    echo -e "  • Parar servicios:    ${GREEN}docker-compose -f docker-compose.messaging.yml down${NC}"
    echo -e "  • Reiniciar:          ${GREEN}./scripts/start-messaging-infrastructure.sh${NC}"
    echo ""
}

# Función principal
main() {
    log "🎯 Iniciando infraestructura de mensajería A4CO..."
    
    check_dependencies
    create_directories
    create_prometheus_config
    create_grafana_config
    create_nats_config
    start_services
    
    # Esperar a que los servicios estén listos
    info "⏳ Esperando a que los servicios estén listos..."
    sleep 10
    
    check_services_health
    show_service_info
    
    log "🎉 ¡Infraestructura de mensajería lista!"
    echo ""
    echo -e "${GREEN}🚀 Para conectar tus microservicios a NATS:${NC}"
    echo -e "   ${BLUE}const eventBus = new NatsEventBus('mi-servicio');${NC}"
    echo -e "   ${BLUE}await eventBus.connect(['nats://localhost:4222']);${NC}"
    echo ""
    echo -e "${GREEN}📖 Lee la documentación completa en:${NC}"
    echo -e "   ${BLUE}./ESTRATEGIA_COMUNICACION_MICROSERVICIOS.md${NC}"
}

# Manejar Ctrl+C
trap 'echo -e "\n${YELLOW}⏹️ Deteniendo script...${NC}"; exit 0' INT

# Ejecutar función principal
main "$@"