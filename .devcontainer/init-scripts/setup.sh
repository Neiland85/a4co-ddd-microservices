#!/bin/bash
echo "✅ setup.sh running..."

PROM_PATH="/workspace/infra/observability/prometheus.yml"

if [ ! -f "$PROM_PATH" ]; then
  echo "⚙️  Generando archivo prometheus.yml..."
  mkdir -p /workspace/infra/observability
  cat <<'PROMEOF' > "$PROM_PATH"
global:
  scrape_interval: 10s
  evaluation_interval: 10s

scrape_configs:
  # Prometheus itself
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # Microservicios del monorepo
  - job_name: "a4co-microservices"
    static_configs:
      - targets:
          - "dev:3000"    # gateway o BFF
          - "dev:3001"    # transportista-service
          - "dev:3002"    # otros servicios (Next.js, etc.)
          - "redis:6379"
          - "postgres:5432"

  # Node exporter (si lo añades más adelante)
  - job_name: "node"
    static_configs:
      - targets: ["dev:9100"]

PROMEOF
  echo "✅ Archivo prometheus.yml creado correctamente."
else
  echo "✅ Archivo prometheus.yml ya existente, no se recrea."
fi
