#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

export PORT="${PORT:-3004}"
export NATS_URL="${NATS_URL:-nats://localhost:4222}"
export DATABASE_URL="${DATABASE_URL:-postgresql://a4co_preview:a4co_preview_password@localhost:5433/order_db?schema=public}"

echo "Starting order-service"
echo "PORT=$PORT"
echo "NATS_URL=$NATS_URL"
echo "DATABASE_URL=$DATABASE_URL"

exec node apps/services/order-service/dist/src/main.js
