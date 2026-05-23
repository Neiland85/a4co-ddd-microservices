#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "Gateway dist/main candidates:"
find apps/infrastructure/gateway \
  -path "*/node_modules/*" -prune -o \
  -type f \
  -path "*dist*main.js" \
  -print 2>/dev/null || true

echo
echo "Gateway dist files:"
find apps/infrastructure/gateway \
  -path "*/node_modules/*" -prune -o \
  -type f \
  -path "*dist*" \
  -print 2>/dev/null | head -80 || true
