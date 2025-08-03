#!/bin/bash
# Script maestro para análisis de impacto crítico

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎯 ANÁLISIS DE IMPACTO CRÍTICO${NC}"
echo "=============================="
echo "Fecha: $(date)"
echo ""

# Crear directorio de reportes
mkdir -p reports

# 1. Bundle Analysis
echo -e "\n${YELLOW}📦 1. BUNDLE SIZE ANALYSIS...${NC}"
if [ -d "apps/dashboard-web" ]; then
    cd apps/dashboard-web
    # Instalar dependencias si no existen
    if ! npm list @next/bundle-analyzer > /dev/null 2>&1; then
        echo "Instalando @next/bundle-analyzer..."
        pnpm add -D @next/bundle-analyzer
    fi
    ANALYZE=true pnpm build > ../../reports/bundle.txt 2>&1
    cd ../..
    echo -e "${GREEN}✓ Bundle analysis completado${NC}"
else
    echo -e "${RED}✗ No se encontró apps/dashboard-web${NC}"
fi

# 2. Dead Code Detection
echo -e "\n${YELLOW}💀 2. DEAD CODE DETECTION...${NC}"
if ! command -v ts-prune &> /dev/null; then
    echo "Instalando ts-prune..."
    pnpm add -D ts-prune
fi
npx ts-prune --project tsconfig.json --ignore "*.test.ts|*.spec.ts" > reports/dead-code.txt 2>&1
echo -e "${GREEN}✓ Dead code analysis completado${NC}"

# 3. Complexity Analysis
echo -e "\n${YELLOW}🔄 3. COMPLEJIDAD CICLOMÁTICA...${NC}"
if ! npm list eslint-plugin-complexity > /dev/null 2>&1; then
    echo "Instalando eslint-plugin-complexity..."
    pnpm add -D eslint-plugin-complexity
fi

# Buscar archivos de dominio y handlers
if [ -d "apps" ]; then
    find apps \( -path "*/src/domain/*.ts" -o -path "*/src/application/handlers/*.ts" \) | \
    xargs npx eslint --rule 'complexity: ["error", 10]' --format json > reports/complexity.json 2>&1
    echo -e "${GREEN}✓ Análisis de complejidad completado${NC}"
else
    echo -e "${RED}✗ No se encontró directorio apps${NC}"
fi

# 4. Circular Dependencies
echo -e "\n${YELLOW}🔗 4. DEPENDENCIAS CIRCULARES...${NC}"
if ! command -v madge &> /dev/null; then
    echo "Instalando madge..."
    pnpm add -D madge
fi
npx madge --circular --extensions ts,tsx apps/ > reports/circular.txt 2>&1
echo -e "${GREEN}✓ Análisis de dependencias completado${NC}"

# 5. Generar resumen
echo -e "\n${YELLOW}📊 GENERANDO RESUMEN EJECUTIVO...${NC}"

cat > reports/impact-summary.md << EOF
# 📊 Resumen de Análisis de Impacto

**Fecha**: $(date)
**Proyecto**: a4co-ddd-microservices

## 📦 Bundle Size
$(tail -n 20 reports/bundle.txt | grep -E "(First Load JS|Build optimized|chunks)" || echo "Ver reports/bundle.txt para detalles")

## 💀 Dead Code
Total de exports no usados: $(wc -l < reports/dead-code.txt)
Top 10 archivos con dead code:
$(head -n 10 reports/dead-code.txt)

## 🔄 Complejidad
$(if [ -s reports/complexity.json ]; then echo "Análisis completado. Ver reports/complexity.json"; else echo "No se encontraron problemas de complejidad"; fi)

## 🔗 Dependencias Circulares
$(if grep -q "Circular" reports/circular.txt 2>/dev/null; then echo "⚠️ SE ENCONTRARON DEPENDENCIAS CIRCULARES:"; head -n 20 reports/circular.txt; else echo "✅ No se encontraron dependencias circulares"; fi)

---

## 🎯 Acciones Recomendadas

1. **Bundle Size**: $(if grep -q "First Load JS.*[0-9][0-9][0-9]" reports/bundle.txt 2>/dev/null; then echo "⚠️ Optimizar - First Load JS > 100KB"; else echo "✅ Bundle size aceptable"; fi)
2. **Dead Code**: $(if [ $(wc -l < reports/dead-code.txt) -gt 50 ]; then echo "⚠️ Eliminar exports no usados"; else echo "✅ Nivel aceptable de dead code"; fi)
3. **Dependencias**: $(if grep -q "Circular" reports/circular.txt 2>/dev/null; then echo "⚠️ Refactorizar dependencias circulares"; else echo "✅ Sin problemas de dependencias"; fi)

EOF

echo -e "${GREEN}✅ Análisis completo. Resultados en: ./reports/${NC}"
echo ""
echo "Archivos generados:"
ls -la reports/

# Mostrar resumen en consola
echo -e "\n${GREEN}=== RESUMEN RÁPIDO ===${NC}"
cat reports/impact-summary.md