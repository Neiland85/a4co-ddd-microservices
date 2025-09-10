#!/bin/bash

echo "🔍 Identificando archivos con hooks problemáticos..."

# Buscar archivos con hooks que tienen arrays vacíos o dependencias problemáticas
echo "📁 Archivos con useState([]):"
grep -r "useState.*\[\]" apps/web/v0dev/ --include="*.tsx" | head -10

echo -e "\n📁 Archivos con useEffect([]):"
grep -r "useEffect.*\[\]" apps/web/v0dev/ --include="*.tsx" | head -10

echo -e "\n📁 Archivos con setInterval sin cleanup:"
grep -r "setInterval" apps/web/v0dev/ --include="*.tsx" | head -5

echo -e "\n🧹 Limpiando archivos temporales y corruptos..."
find . -name "*.tmp" -delete
find . -name "*.bak" -delete
find . -name "*~" -delete

echo -e "\n✅ Análisis completado."
