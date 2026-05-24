#!/usr/bin/env bash
set -euo pipefail

echo "== A4CO beta smoke =="
echo

urls=(
  "http://localhost:8088/api/v1/health"
  "http://localhost:8088/api/v1/health/ready"
  "http://localhost:8088/api/v1/health/live"
  "http://localhost:3004/orders"
  "http://localhost:3006/api/inventory/health"
  "http://localhost:18222/healthz"
)

for url in "${urls[@]}"; do
  echo "---- ${url} ----"
  curl -fsS --max-time 8 "${url}"
  echo
  echo
done

echo "✅ A4CO beta smoke passed"
