#!/bin/bash

# Pre-commit hook para escaneo de secretos
# Este script se ejecuta antes de cada commit para detectar posibles secretos

set -e

echo "🔍 Ejecutando escaneo de secretos con Gitleaks..."

# Ejecutar gitleaks detect en los archivos staged
# --verbose: mostrar detalles
# --redact: ocultar valores sensibles en la salida
# Usar git diff --cached --name-only para obtener archivos staged
STAGED_FILES=$(git diff --cached --name-only)

if [ -z "$STAGED_FILES" ]; then
    echo "ℹ️ No hay archivos staged para verificar"
    exit 0
fi

# Crear un archivo temporal con el contenido de los archivos staged
TEMP_FILE=$(mktemp)
for file in $STAGED_FILES; do
    if [ -f "$file" ]; then
        echo "=== $file ===" >> "$TEMP_FILE"
        cat "$file" >> "$TEMP_FILE"
        echo "" >> "$TEMP_FILE"
    fi
done

# Ejecutar gitleaks en el archivo temporal
if cat "$TEMP_FILE" | gitleaks detect --pipe --verbose --redact; then
    echo "✅ No se encontraron secretos en los archivos staged"
    rm "$TEMP_FILE"
else
    echo "❌ ¡Se encontraron posibles secretos!"
    echo ""
    echo "Para continuar con el commit, puedes:"
    echo "1. Remover los archivos con secretos del staging: git reset HEAD <archivo>"
    echo "2. Usar --no-verify para saltar este hook (NO RECOMENDADO): git commit --no-verify"
    echo ""
    rm "$TEMP_FILE"
    exit 1
fi
