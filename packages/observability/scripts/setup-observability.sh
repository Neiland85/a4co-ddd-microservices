#!/bin/bash

# A4CO Observability Setup Script
# Este script configura la infraestructura completa de observabilidad

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar dependencias
check_dependencies() {
    log_info "Verificando dependencias..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
        exit 1
    fi
    
    log_success "Dependencias verificadas"
}

# Crear directorios necesarios
create_directories() {
    log_info "Creando directorios de configuración..."
    
    mkdir -p prometheus
    mkdir -p grafana/dashboards
    mkdir -p grafana/datasources
    mkdir -p alertmanager
    mkdir -p loki
    mkdir -p promtail
    
    log_success "Directorios creados"
}

# Crear configuración de Prometheus
create_prometheus_config() {
    log_info "Creando configuración de Prometheus..."
    
    cat > prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alerts.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'a4co-services'
    static_configs:
      - targets: 
        - 'order-service:9464'
        - 'user-service:9464'
        - 'product-service:9464'
        - 'payment-service:9464'
        - 'inventory-service:9464'
        - 'notification-service:9464'
        - 'analytics-service:9464'
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'otel-collector'
    static_configs:
      - targets: ['otel-collector:8889']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'grafana'
    static_configs:
      - targets: ['grafana:3000']
    metrics_path: '/metrics'
    scrape_interval: 30s
EOF

    log_success "Configuración de Prometheus creada"
}

# Crear configuración de Grafana
create_grafana_config() {
    log_info "Creando configuración de Grafana..."
    
    # Datasource de Prometheus
    cat > grafana/datasources/prometheus.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF

    # Datasource de Loki
    cat > grafana/datasources/loki.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    editable: true
EOF

    # Dashboard provisioning
    cat > grafana/dashboards/dashboard.yml << 'EOF'
apiVersion: 1

providers:
  - name: 'A4CO Dashboards'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
EOF

    log_success "Configuración de Grafana creada"
}

# Crear configuración de Alertmanager
create_alertmanager_config() {
    log_info "Creando configuración de Alertmanager..."
    
    cat > alertmanager/alertmanager.yml << 'EOF'
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'
  routes:
    - match:
        severity: critical
      receiver: 'web.hook'
      repeat_interval: 30m
    - match:
        severity: warning
      receiver: 'web.hook'
      repeat_interval: 1h

receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://127.0.0.1:5001/'
        send_resolved: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'service']
EOF

    log_success "Configuración de Alertmanager creada"
}

# Crear configuración de Loki
create_loki_config() {
    log_info "Creando configuración de Loki..."
    
    cat > loki/loki-config.yml << 'EOF'
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2020-05-15
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /tmp/loki/boltdb-shipper-active
    cache_location: /tmp/loki/boltdb-shipper-cache
    cache_ttl: 24h
    shared_store: filesystem
  filesystem:
    directory: /tmp/loki/chunks

compactor:
  working_directory: /tmp/loki/boltdb-shipper-compactor
  shared_store: filesystem

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: false
  retention_period: 0s
EOF

    log_success "Configuración de Loki creada"
}

# Crear configuración de Promtail
create_promtail_config() {
    log_info "Creando configuración de Promtail..."
    
    cat > promtail/promtail-config.yml << 'EOF'
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log

  - job_name: containers
    static_configs:
      - targets:
          - localhost
        labels:
          job: containerlogs
          __path__: /var/lib/docker/containers/*/*log

    pipeline_stages:
      - json:
          expressions:
            stream: stream
            attrs: attrs
            tag: attrs.tag
            time: time
      - labels:
          tag:
      - timestamp:
          source: time
          format: RFC3339Nano
      - output:
          source: log
EOF

    log_success "Configuración de Promtail creada"
}

# Crear configuración de OpenTelemetry Collector
create_otel_config() {
    log_info "Creando configuración de OpenTelemetry Collector..."
    
    cat > otel-collector-config.yml << 'EOF'
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 1s
    send_batch_size: 1024
  resource:
    attributes:
      - key: environment
        value: "development"
        action: upsert

exporters:
  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true
  prometheus:
    endpoint: "0.0.0.0:8889"
    namespace: "a4co"
    const_labels:
      label1: value1
    send_timestamps: true
    metric_expiration: 180m
    enable_open_metrics: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch, resource]
      exporters: [jaeger]
    metrics:
      receivers: [otlp]
      processors: [batch, resource]
      exporters: [prometheus]
EOF

    log_success "Configuración de OpenTelemetry Collector creada"
}

# Crear archivo .env
create_env_file() {
    log_info "Creando archivo .env..."
    
    cat > .env << 'EOF'
# Observability Configuration
NODE_ENV=development

# Jaeger Configuration
JAEGER_ENDPOINT=http://localhost:14268/api/traces

# OpenTelemetry Configuration
OTEL_ENDPOINT=http://localhost:4318/v1/traces

# Frontend Configuration
NEXT_PUBLIC_OTEL_ENDPOINT=http://localhost:4318/v1/traces

# Service Configuration
SERVICE_NAME=order-service
SERVICE_VERSION=1.0.0

# Logging Configuration
LOG_LEVEL=info
LOG_PRETTY_PRINT=true

# Metrics Configuration
METRICS_PORT=9464
METRICS_ENDPOINT=/metrics
EOF

    log_success "Archivo .env creado"
}

# Crear script de health check
create_health_check() {
    log_info "Creando script de health check..."
    
    cat > scripts/health-check.sh << 'EOF'
#!/bin/bash

# Health check para servicios de observabilidad

echo "🔍 Verificando servicios de observabilidad..."

# Prometheus
echo -n "Prometheus: "
if curl -s http://localhost:9090/api/v1/status/targets > /dev/null; then
    echo "✅ OK"
else
    echo "❌ ERROR"
fi

# Grafana
echo -n "Grafana: "
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ OK"
else
    echo "❌ ERROR"
fi

# Jaeger
echo -n "Jaeger: "
if curl -s http://localhost:16686/api/services > /dev/null; then
    echo "✅ OK"
else
    echo "❌ ERROR"
fi

# Alertmanager
echo -n "Alertmanager: "
if curl -s http://localhost:9093/api/v1/status > /dev/null; then
    echo "✅ OK"
else
    echo "❌ ERROR"
fi

# Loki
echo -n "Loki: "
if curl -s http://localhost:3100/ready > /dev/null; then
    echo "✅ OK"
else
    echo "❌ ERROR"
fi

echo ""
echo "🎯 URLs de acceso:"
echo "  Grafana: http://localhost:3000 (admin/a4co-admin-2024)"
echo "  Prometheus: http://localhost:9090"
echo "  Jaeger: http://localhost:16686"
echo "  Alertmanager: http://localhost:9093"
echo "  Loki: http://localhost:3100"
EOF

    chmod +x scripts/health-check.sh
    log_success "Script de health check creado"
}

# Función principal
main() {
    echo "🚀 A4CO Observability Setup"
    echo "=========================="
    echo ""
    
    check_dependencies
    create_directories
    create_prometheus_config
    create_grafana_config
    create_alertmanager_config
    create_loki_config
    create_promtail_config
    create_otel_config
    create_env_file
    create_health_check
    
    echo ""
    log_success "Configuración completada!"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Ejecuta: docker-compose -f docker-compose.observability.yml up -d"
    echo "2. Verifica el estado: ./scripts/health-check.sh"
    echo "3. Accede a Grafana: http://localhost:3000 (admin/a4co-admin-2024)"
    echo "4. Importa el dashboard desde: grafana/dashboards/a4co-observability.json"
    echo ""
    echo "🔧 Para integrar en tus servicios:"
    echo "1. Instala el paquete: pnpm add @a4co/observability"
    echo "2. Configura la observabilidad según los ejemplos en examples/"
    echo "3. Asegúrate de que tus servicios expongan métricas en /metrics"
    echo ""
}

# Ejecutar función principal
main "$@"