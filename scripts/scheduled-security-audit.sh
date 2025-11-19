#!/bin/bash

# Script de auditoría de seguridad programada
# Este script se puede ejecutar manualmente o programar con cron
# Para programar: crontab -e y agregar:
# 0 2 * * 0 /path/to/project/scripts/scheduled-security-audit.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

LOG_FILE="$PROJECT_ROOT/logs/security-audit-$(date +%Y%m%d).log"

# Crear directorio de logs si no existe
mkdir -p "$PROJECT_ROOT/logs"

echo "🔍 Iniciando auditoría de seguridad programada - $(date)" | tee -a "$LOG_FILE"
echo "==================================================" | tee -a "$LOG_FILE"

cd "$PROJECT_ROOT"

# Ejecutar auditoría completa
if [ -f "scripts/security-audit.sh" ]; then
    echo "📊 Ejecutando auditoría completa..." | tee -a "$LOG_FILE"
    ./scripts/security-audit.sh >> "$LOG_FILE" 2>&1
    echo "" | tee -a "$LOG_FILE"
else
    echo "❌ Script de auditoría no encontrado" | tee -a "$LOG_FILE"
fi

# Verificar si hay cambios en archivos sensibles desde la última auditoría
echo "🔍 Verificando cambios en archivos sensibles..." | tee -a "$LOG_FILE"
if [ -f ".git/refs/heads/main" ] || [ -f ".git/refs/heads/develop" ]; then
    echo "Repositorio git detectado - verificando cambios..." | tee -a "$LOG_FILE"

    # Obtener fecha de la última auditoría (7 días atrás por defecto)
    LAST_AUDIT=$(find logs -name "security-audit-*.log" -mtime -7 | head -1 | xargs ls -t | head -1)
    if [ -n "$LAST_AUDIT" ]; then
        LAST_DATE=$(stat -f "%Sm" -t "%Y-%m-%d" "$LAST_AUDIT" 2>/dev/null || date -r "$LAST_AUDIT" +%Y-%m-%d)
        echo "Última auditoría: $LAST_DATE" | tee -a "$LOG_FILE"

        # Verificar cambios en archivos .env
        ENV_CHANGES=$(git log --since="$LAST_DATE" --oneline -- .env* 2>/dev/null || echo "")
        if [ -n "$ENV_CHANGES" ]; then
            echo "⚠️  Cambios detectados en archivos .env:" | tee -a "$LOG_FILE"
            echo "$ENV_CHANGES" | tee -a "$LOG_FILE"
        else
            echo "✅ No hay cambios en archivos .env" | tee -a "$LOG_FILE"
        fi
    fi
else
    echo "ℹ️  No es un repositorio git o no hay rama main/develop" | tee -a "$LOG_FILE"
fi

# Verificar permisos de archivos críticos
echo "" | tee -a "$LOG_FILE"
echo "🔒 Verificando permisos de archivos críticos..." | tee -a "$LOG_FILE"
CRITICAL_FILES=".env .env.local .env.production"
for file in $CRITICAL_FILES; do
    if [ -f "$file" ]; then
        perms=$(stat -c "%a" "$file" 2>/dev/null || stat -f "%A" "$file" 2>/dev/null)
        if [ "${perms: -1}" -gt 6 ]; then
            echo "⚠️  Permisos demasiado permisivos en $file: $perms" | tee -a "$LOG_FILE"
        else
            echo "✅ Permisos correctos en $file: $perms" | tee -a "$LOG_FILE"
        fi
    fi
done

# Generar resumen
echo "" | tee -a "$LOG_FILE"
echo "📋 Resumen de auditoría programada:" | tee -a "$LOG_FILE"
echo "- Fecha: $(date)" | tee -a "$LOG_FILE"
echo "- Log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "- Estado: Completada" | tee -a "$LOG_FILE"

# Limpiar logs antiguos (mantener últimos 30 días)
echo "" | tee -a "$LOG_FILE"
echo "🧹 Limpiando logs antiguos..." | tee -a "$LOG_FILE"
find "$PROJECT_ROOT/logs" -name "security-audit-*.log" -mtime +30 -delete 2>/dev/null || true

echo "" | tee -a "$LOG_FILE"
echo "✅ Auditoría de seguridad programada completada" | tee -a "$LOG_FILE"

# Enviar notificación si hay hallazgos críticos (opcional)
# Aquí se podría integrar con herramientas como Slack, email, etc.

exit 0
