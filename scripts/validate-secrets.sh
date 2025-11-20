#!/bin/bash

echo "🔍 Validating no hardcoded secrets..."

# Buscar patrones sospechosos en cambios
SUSPICIOUS_PATTERNS=(
  "password.*=.*['\"]"
  "secret.*=.*['\"]"
  "token.*=.*['\"]"
  "api_key.*=.*['\"]"
)

for pattern in "${SUSPICIOUS_PATTERNS[@]}"; do
  matches=$(git diff main...develop | grep -iE "$pattern" || true)
  if [ -n "$matches" ]; then
    echo "⚠️ Potential secret found:"
    echo "$matches"
    exit 1
  fi
done

echo "✅ No hardcoded secrets detected"
