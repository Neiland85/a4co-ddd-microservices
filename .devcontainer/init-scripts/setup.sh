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
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "a4co-microservices"
    static_configs:
      - targets: ["dev:3000", "dev:3001", "redis:6379", "postgres:5432"]
PROMEOF
  echo "✅ Archivo prometheus.yml creado correctamente."
else
  echo "✅ Archivo prometheus.yml ya existente, no se recrea."
fi
