#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "== A4CO local runtime preparation =="

echo "1) Ensuring apps/packages symlink..."
if [ ! -e apps/packages ]; then
  ln -s ../packages apps/packages
  echo "created apps/packages -> ../packages"
else
  echo "apps/packages already exists"
fi

echo "2) Cleaning stale TypeScript build info..."
find packages apps -name "*.tsbuildinfo" -print -delete 2>/dev/null || true

echo "3) Building preview scope..."
pnpm run build:preview

echo "4) Rebuilding shared-events as CommonJS for local runtime..."
rm -rf packages/shared-events/dist
pnpm --filter @a4co/shared-events exec tsc -p tsconfig.preview.cjs.json

echo "5) Marking runtime dist folders as CommonJS..."
for d in \
  apps/services/order-service/dist \
  apps/services/inventory-service/dist \
  apps/infrastructure/gateway/dist \
  packages/domain/order/dist \
  packages/domain/inventory/dist \
  packages/shared-utils/dist \
  packages/shared-events/dist \
  packages/observability/dist
do
  if [ -d "$d" ]; then
    printf '{\n  "type": "commonjs"\n}\n' > "$d/package.json"
    echo "commonjs runtime marker -> $d/package.json"
  else
    echo "skip missing dist -> $d"
  fi
done

echo "6) Linking inventory Prisma generated client for dist runtime..."
if [ -d "apps/services/inventory-service/prisma/generated" ]; then
  rm -rf apps/services/inventory-service/dist/prisma
  ln -s ../prisma apps/services/inventory-service/dist/prisma
  echo "inventory prisma runtime link -> apps/services/inventory-service/dist/prisma"
else
  echo "WARNING: inventory Prisma generated client not found"
  echo "Run: pnpm --filter @a4co/inventory-service run prisma:generate"
fi

echo "7) Verifying key entrypoints..."
find apps/services/order-service apps/services/inventory-service apps/infrastructure/gateway \
  -path "*/node_modules/*" -prune -o \
  -type f \
  -path "*dist*main.js" \
  -print 2>/dev/null || true

echo "== local runtime preparation done =="
