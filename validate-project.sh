#!/bin/bash

# Script de validación del proyecto a4co-ddd-microservices
# Verifica que el proyecto esté limpio y bien estructurado

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función para logging
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

log "🔍 Iniciando validación del proyecto..."

errors=0
warnings=0

# 1. Verificar que no hay archivos compilados en servicios
log "Verificando archivos compilados en servicios..."
compiled_files=$(find ./apps -name "*.d.ts" -o -name "*.js.map" -o -name "*.d.ts.map" | grep -v node_modules | wc -l)
if [ "$compiled_files" -gt 0 ]; then
    error "Encontrados $compiled_files archivos compilados en servicios"
    ((errors++))
else
    success "No hay archivos compilados en servicios"
fi

# 2. Verificar que no hay node_modules en servicios individuales
log "Verificando node_modules duplicados..."
for service in ./apps/*/; do
    if [ -d "${service}node_modules" ]; then
        error "node_modules encontrado en ${service}"
        ((errors++))
    fi
done
if [ "$errors" -eq 0 ]; then
    success "No hay node_modules duplicados en servicios"
fi

# 3. Verificar estructura de documentación
log "Verificando estructura de documentación..."
if [ -d "docs/architecture" ] && [ -d "docs/deployment" ] && [ -d "docs/development" ]; then
    success "Estructura de documentación organizada correctamente"
else
    warn "Estructura de documentación podría mejorarse"
    ((warnings++))
fi

# 4. Verificar que los scripts principales existen y son ejecutables
log "Verificando scripts principales..."
scripts=("clean-project.sh" "check-dockerhub.sh")
for script in "${scripts[@]}"; do
    if [ -x "$script" ]; then
        success "Script $script es ejecutable"
    else
        warn "Script $script no es ejecutable o no existe"
        ((warnings++))
    fi
done

# 5. Verificar configuración de pnpm workspace
log "Verificando configuración de pnpm workspace..."
if [ -f "pnpm-workspace.yaml" ]; then
    success "pnpm-workspace.yaml existe"
else
    error "pnpm-workspace.yaml no encontrado"
    ((errors++))
fi

# 6. Verificar que turbo.json está configurado
log "Verificando configuración de Turbo..."
if [ -f "turbo.json" ]; then
    success "turbo.json existe"
else
    error "turbo.json no encontrado"
    ((errors++))
fi

# 7. Verificar archivos de configuración importantes
log "Verificando archivos de configuración..."
config_files=(".gitignore" ".eslintrc.json" ".prettierrc" "tsconfig.json")
for config in "${config_files[@]}"; do
    if [ -f "$config" ]; then
        success "$config existe"
    else
        warn "$config no encontrado"
        ((warnings++))
    fi
done

# 8. Verificar que no hay archivos grandes en el repo
log "Verificando archivos grandes..."
large_files=$(find . -type f -size +5M ! -path "./node_modules/*" ! -path "./.git/*" 2>/dev/null | wc -l)
if [ "$large_files" -gt 0 ]; then
    warn "Encontrados $large_files archivos grandes (>5MB) fuera de node_modules"
    ((warnings++))
else
    success "No hay archivos grandes problemáticos"
fi

# 9. Verificar dependencias vulnerables (básico)
log "Verificación básica de dependencias..."
if command -v pnpm &> /dev/null; then
    # Verificar si hay overrides de seguridad
    if grep -q "lodash.*>=" package.json; then
        success "Overrides de seguridad configurados"
    else
        warn "Considerar configurar overrides de seguridad"
        ((warnings++))
    fi
else
    warn "pnpm no disponible para verificación completa"
fi

# Resultado final
echo ""
log "📊 Resultado de validación:"
echo "   Errores críticos: $errors"
echo "   Advertencias: $warnings"

if [ "$errors" -eq 0 ]; then
    if [ "$warnings" -eq 0 ]; then
        success "¡Proyecto completamente limpio y bien estructurado!"
    else
        success "Proyecto limpio con algunas advertencias menores"
    fi
else
    error "Se encontraron errores que requieren atención"
    exit 1
fi