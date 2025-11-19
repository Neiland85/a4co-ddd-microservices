#!/bin/bash

# Script para rotar JWT Secret
# Uso: ./scripts/rotate-jwt-secret.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔄 Rotando JWT Secret..."
cd "$PROJECT_ROOT"

# Generar nuevo secret
NEW_SECRET=$(openssl rand -base64 32)
echo "✅ Nuevo JWT Secret generado"

# Backup archivos actuales
echo "📦 Creando backups..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Actualizar archivos .env
echo "📝 Actualizando archivos .env..."
sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$NEW_SECRET/" .env* 2>/dev/null || true
rm .env*.bak 2>/dev/null || true

# Actualizar GitHub Secrets si gh CLI está disponible
if command -v gh &> /dev/null && gh auth status &> /dev/null 2>&1; then
    echo "🔐 Actualizando GitHub Secret..."
    echo "$NEW_SECRET" | gh secret set JWT_SECRET
    echo "✅ GitHub Secret actualizado"
else
    echo "⚠️  GitHub CLI no disponible. Actualiza manualmente el secret en GitHub."
fi

echo ""
echo "✅ JWT Secret rotado exitosamente"
echo ""
echo "📋 Próximos pasos:"
echo "1. Reinicia todos los servicios que usan JWT"
echo "2. Los tokens JWT existentes serán inválidos después de expirar"
echo "3. Monitorea logs por errores de autenticación"
echo "4. Actualiza documentación si es necesario"
echo ""
echo "🔒 Nuevo secret almacenado en archivos .env"
echo "⚠️  IMPORTANTE: No compartas este secret"
