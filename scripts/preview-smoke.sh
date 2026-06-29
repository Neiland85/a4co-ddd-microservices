#!/usr/bin/env bash
set -euo pipefail

echo "== A4CO preview smoke =="
echo "This script delegates to the buyer-ready core runtime baseline."
echo "For the extended legacy preview compose file, inspect docker-compose.preview.yml manually."
echo

bash scripts/beta-smoke.sh
