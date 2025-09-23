#!/bin/bash

# Script de limpieza y sanitización del proyecto a4co-ddd-microservices
# Elimina archivos compilados, node_modules innecesarios y archivos temporales

set -e

echo "🧹 Iniciando limpieza del proyecto..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Contadores
files_removed=0
dirs_removed=0

# 1. Eliminar archivos compilados en servicios
log "Eliminando archivos compilados en servicios..."
find ./apps -type f \( -name "*.d.ts" -o -name "*.js" -o -name "*.map" \) ! -path "*/node_modules/*" -delete -print | wc -l | xargs -I {} echo "Archivos compilados eliminados: {}"

# 2. Eliminar node_modules en servicios individuales (deberían usar el root)
log "Eliminando node_modules duplicados en servicios..."
for service in ./apps/*/; do
    if [ -d "${service}node_modules" ]; then
        rm -rf "${service}node_modules"
        log "Eliminado: ${service}node_modules"
        ((dirs_removed++))
    fi
done

# 3. Eliminar archivos .next en servicios (build artifacts)
log "Eliminando directorios .next..."
find ./apps -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
find ./apps -name ".next" -type d | wc -l | xargs -I {} echo "Directorios .next eliminados: {}"

# 4. Eliminar archivos temporales y de build
log "Eliminando archivos temporales..."
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true
find . -name ".eslintcache" -delete 2>/dev/null || true
find . -name "*.log" -delete 2>/dev/null || true

# 5. Limpiar archivos duplicados en raíz
log "Verificando archivos duplicados..."

# Lista de archivos que podrían estar duplicados
duplicate_candidates=(
    "package.json"
    "tsconfig.json"
    "jest.config.js"
    "eslint.config.js"
)

for file in "${duplicate_candidates[@]}"; do
    count=$(find . -maxdepth 2 -name "$file" | wc -l)
    if [ "$count" -gt 1 ]; then
        warn "Encontrados $count archivos '$file' - verificar si son necesarios"
    fi
done

# 6. Verificar y limpiar archivos de documentación excesivos
log "Analizando archivos de documentación..."
md_files=$(find . -maxdepth 1 -name "*.md" | wc -l)
if [ "$md_files" -gt 10 ]; then
    warn "Encontrados $md_files archivos .md en raíz - considerar mover a /docs/"
fi

# 7. Verificar archivos grandes que no deberían estar en git
log "Verificando archivos grandes..."
find . -type f -size +10M ! -path "./node_modules/*" ! -path "./.git/*" 2>/dev/null | while read -r file; do
    warn "Archivo grande encontrado: $file ($(du -h "$file" | cut -f1))"
done

# 8. Limpiar archivos de configuración temporales
log "Eliminando archivos de configuración temporales..."
rm -f package-broken.json package-fixed.json 2>/dev/null || true

# 9. Verificar symlinks rotos
log "Verificando symlinks rotos..."
find . -type l ! -exec test -e {} \; -print 2>/dev/null | while read -r link; do
    warn "Symlink roto: $link"
done

# 10. Verificar permisos de ejecución incorrectos
log "Verificando permisos de archivos..."
find . -name "*.sh" -type f ! -executable | while read -r file; do
    warn "Script sin permisos de ejecución: $file"
    chmod +x "$file"
    log "Permisos corregidos: $file"
done

log ""
log "✅ Limpieza completada!"
log "📊 Resumen:"
log "   - Directorios eliminados: $dirs_removed"
log "   - Verificar archivos duplicados manualmente"
log "   - Considerar mover documentación a /docs/"
log ""
log "🧹 Para una limpieza más profunda, ejecutar: pnpm clean:all"