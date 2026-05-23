#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

export PORT="${PORT:-3000}"
export ORDERS_SERVICE_URL="${ORDERS_SERVICE_URL:-http://localhost:3004}"
export ORDER_SERVICE_URL="${ORDER_SERVICE_URL:-http://localhost:3004}"
export INVENTORY_SERVICE_URL="${INVENTORY_SERVICE_URL:-http://localhost:3006}"
export INVENTORY_URL="${INVENTORY_URL:-http://localhost:3006}"
export NATS_URL="${NATS_URL:-nats://localhost:4222}"

echo "Starting api-gateway"
echo "PORT=$PORT"
echo "ORDERS_SERVICE_URL=$ORDERS_SERVICE_URL"
echo "INVENTORY_SERVICE_URL=$INVENTORY_SERVICE_URL"
echo "NATS_URL=$NATS_URL"

exec node apps/infrastructure/gateway/dist/main.js
