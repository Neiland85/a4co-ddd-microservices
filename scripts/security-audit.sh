#!/bin/bash

# Script de auditoría de seguridad para archivos sensibles
# Uso: ./scripts/security-audit.sh [directorio]
# Si no se especifica directorio, usa el directorio actual

set -e

TARGET_DIR="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔍 Iniciando auditoría de seguridad en: $TARGET_DIR"
echo "📅 Fecha: $(date)"
echo "========================================"

cd "$PROJECT_ROOT"

# Función para imprimir resultados
print_result() {
    local check_name="$1"
    local status="$2"
    local details="$3"

    if [ "$status" = "PASS" ]; then
        echo "✅ $check_name: $details"
    elif [ "$status" = "WARN" ]; then
        echo "⚠️  $check_name: $details"
    else
        echo "❌ $check_name: $details"
    fi
}

# 1. Buscar archivos potencialmente sensibles
echo ""
echo "1. 📁 Buscando archivos potencialmente sensibles..."
SENSITIVE_FILES=$(find "$TARGET_DIR" \
    -name "*.key" \
    -o -name "*ssh*" \
    -o -name "*private*" \
    -o -name "*secret*" \
    -o -name "*token*" \
    -o -name "*password*" \
    -o -name "*credential*" \
    -o -name "*.pem" \
    -o -name "*.p12" \
    -o -name "*.pfx" \
    2>/dev/null | grep -v node_modules | grep -v ".git" | grep -v ".next" | grep -v ".venv" | grep -v "scripts/" | grep -v "__pycache__" | wc -l)

# Mostrar algunos ejemplos si hay archivos encontrados
if [ "$SENSITIVE_FILES" -gt 0 ]; then
    print_result "Archivos sensibles" "WARN" "Encontrados $SENSITIVE_FILES archivos potencialmente sensibles"
    echo "   Ejemplos encontrados:"
    find "$TARGET_DIR" \
        -name "*.key" \
        -o -name "*ssh*" \
        -o -name "*private*" \
        -o -name "*secret*" \
        -o -name "*token*" \
        -o -name "*password*" \
        -o -name "*credential*" \
        -o -name "*.pem" \
        -o -name "*.p12" \
        -o -name "*.pfx" \
        2>/dev/null | grep -v node_modules | grep -v ".git" | grep -v ".next" | grep -v ".venv" | grep -v "scripts/" | grep -v "__pycache__" | head -5 | sed 's/^/     - /'
else
    print_result "Archivos sensibles" "PASS" "No se encontraron archivos sensibles"
fi

# 2. Buscar secrets hardcodeados en código fuente
echo ""
echo "2. 🔍 Buscando secrets hardcodeados en código fuente..."
HARD_CODED_SECRETS=$(grep -r \
    "BEGIN OPENSSH PRIVATE KEY\|BEGIN RSA PRIVATE KEY\|BEGIN EC PRIVATE KEY\|sk_live_\|sk_test_\|ghp_\|xoxb-\|xoxp-\|eyJ[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=.next \
    --exclude-dir=dist \
    --exclude-dir=build \
    --include="*.js" \
    --include="*.ts" \
    --include="*.jsx" \
    --include="*.tsx" \
    --include="*.json" \
    --include="*.md" \
    "$TARGET_DIR" 2>/dev/null | wc -l)

if [ "$HARD_CODED_SECRETS" -gt 0 ]; then
    print_result "Secrets hardcodeados" "FAIL" "Encontrados $HARD_CODED_SECRETS posibles secrets hardcodeados"
    grep -r \
        "BEGIN OPENSSH PRIVATE KEY\|BEGIN RSA PRIVATE KEY\|BEGIN EC PRIVATE KEY\|sk_live_\|sk_test_\|ghp_\|xoxb-\|xoxp-\|eyJ[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*" \
        --exclude-dir=node_modules \
        --exclude-dir=.git \
        --exclude-dir=.next \
        --exclude-dir=dist \
        --exclude-dir=build \
        --include="*.js" \
        --include="*.ts" \
        --include="*.jsx" \
        --include="*.tsx" \
        --include="*.json" \
        --include="*.md" \
        "$TARGET_DIR" 2>/dev/null | head -10 | sed 's/^/   - /'
else
    print_result "Secrets hardcodeados" "PASS" "No se encontraron secrets hardcodeados"
fi

# 3. Verificar permisos de archivos sensibles
echo ""
echo "3. 🔒 Verificando permisos de archivos de configuración..."
CONFIG_FILES=$(find "$TARGET_DIR" \
    -name ".env*" \
    -o -name "config*.json" \
    -o -name "config*.js" \
    -o -name "config*.ts" \
    2>/dev/null | grep -v node_modules | grep -v ".git")

PERM_ISSUES=0
SECURE_FILES=0
for file in $CONFIG_FILES; do
    if [ -f "$file" ]; then
        perms=$(stat -c "%a" "$file" 2>/dev/null || stat -f "%A" "$file" 2>/dev/null)
        # Permisos seguros: 600 (rw-------) o 400 (r--------)
        if [ "$perms" = "600" ] || [ "$perms" = "400" ]; then
            SECURE_FILES=$((SECURE_FILES + 1))
        else
            echo "   ⚠️  Permisos no seguros en: $file ($perms - debería ser 600 o 400)"
            PERM_ISSUES=$((PERM_ISSUES + 1))
        fi
    fi
done

if [ "$PERM_ISSUES" -gt 0 ]; then
    print_result "Permisos de archivos" "WARN" "$PERM_ISSUES archivos con permisos no seguros (deben ser 600 o 400)"
else
    print_result "Permisos de archivos" "PASS" "Todos los archivos de configuración tienen permisos seguros ($SECURE_FILES archivos verificados)"
fi

# 4. Verificar .gitignore
echo ""
echo "4. 📋 Verificando configuración de .gitignore..."
if [ -f ".gitignore" ]; then
    GITIGNORE_ISSUES=0

    # Verificar que ignore archivos sensibles comunes
    for pattern in ".env" "*.key" "*.pem" "*.p12" "*.pfx" "secrets/" ".secrets/"; do
        if ! grep -q "^$pattern" .gitignore 2>/dev/null && ! grep -q "/$pattern" .gitignore 2>/dev/null; then
            echo "   ⚠️  .gitignore no incluye: $pattern"
            GITIGNORE_ISSUES=$((GITIGNORE_ISSUES + 1))
        fi
    done

    if [ "$GITIGNORE_ISSUES" -gt 0 ]; then
        print_result ".gitignore" "WARN" "$GITIGNORE_ISSUES patrones sensibles no incluidos"
    else
        print_result ".gitignore" "PASS" "Configuración adecuada"
    fi
else
    print_result ".gitignore" "FAIL" "Archivo .gitignore no encontrado"
fi

# 5. Verificar hooks de git
echo ""
echo "5. 🪝 Verificando hooks de git..."
if [ -f ".git/hooks/pre-commit" ] && grep -q "gitleaks\|secrets" .git/hooks/pre-commit 2>/dev/null; then
    print_result "Pre-commit hooks" "PASS" "Hook de escaneo de secrets configurado"
else
    print_result "Pre-commit hooks" "WARN" "No se encontró hook de escaneo de secrets"
fi

echo ""
echo "========================================"
echo "🏁 Auditoría de seguridad completada"
echo ""
echo "📊 Resumen:"
echo "   - Archivos sensibles encontrados: $SENSITIVE_FILES"
echo "   - Secrets hardcodeados: $HARD_CODED_SECRETS"
echo "   - Problemas de permisos: $PERM_ISSUES"
echo ""
echo "💡 Recomendaciones:"
echo "   - Revisa cualquier archivo marcado como WARNING o FAIL"
echo "   - Asegúrate de que los secrets estén en variables de entorno"
echo "   - Usa herramientas como gitleaks para escaneo continuo"
echo "   - Configura permisos restrictivos en archivos sensibles"
