#!/usr/bin/env bash
set -euo pipefail

echo "== A4CO buyer-ready validation =="
echo

echo "== Toolchain =="
node -v
pnpm -v
docker --version
docker compose version
echo

echo "== Static/core validation =="
pnpm run validate:package
pnpm run lint:preview
pnpm run test:preview
pnpm run build:preview
echo

echo "== Runtime baseline =="
pnpm run buyer:runtime:up
pnpm run buyer:runtime:ps
pnpm run buyer:smoke
echo

echo "== Cleanup =="
pnpm run buyer:runtime:down
echo

echo "A4CO buyer-ready validation completed"
