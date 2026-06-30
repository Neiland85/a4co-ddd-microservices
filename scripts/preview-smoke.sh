#!/usr/bin/env bash
set -euo pipefail

echo "== A4CO preview smoke =="
echo "Delegating to the canonical buyer smoke command."
echo

pnpm run buyer:smoke
