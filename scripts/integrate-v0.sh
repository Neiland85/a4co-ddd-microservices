#!/bin/bash

# 🎨 Script de Integración V0 → Proyecto Jaén
# Automatiza la integración de componentes generados en V0.dev

echo "🎨 Integración V0 → Mercado Local de Jaén"
echo "========================================="

# Crear estructura de directorios
echo "📁 Creando estructura de directorios..."
mkdir -p src/components/v0
mkdir -p src/types/v0
mkdir -p src/utils/v0

# Función para integrar un componente de V0
integrate_v0_component() {
    local component_name=$1
    local v0_file=$2
    
    echo "🔧 Integrando componente: $component_name"
    
    # Backup del componente existente si existe
    if [ -f "src/components/market/$component_name.tsx" ]; then
        cp "src/components/market/$component_name.tsx" "src/components/market/$component_name.backup.tsx"
        echo "   ✅ Backup creado: $component_name.backup.tsx"
    fi
    
    # Copiar componente de V0
    if [ -f "$v0_file" ]; then
        cp "$v0_file" "src/components/v0/$component_name.tsx"
        echo "   ✅ Componente V0 copiado"
        
        # Auto-ajustar imports para nuestro proyecto
        sed -i '' 's/import { Button }/import { Button } from "..\/ui\/button"/g' "src/components/v0/$component_name.tsx"
        sed -i '' 's/import { Card }/import { Card } from "..\/ui\/card"/g' "src/components/v0/$component_name.tsx"
        
        echo "   ✅ Imports ajustados"
    else
        echo "   ❌ Archivo V0 no encontrado: $v0_file"
    fi
}

# Menú interactivo
echo ""
echo "¿Qué componente quieres integrar?"
echo "1. ProductCatalog"
echo "2. ProductSearch" 
echo "3. ArtisanDirectory"
echo "4. SalesOpportunityBoard"
echo "5. MarketplaceDashboard"
echo "6. Todos los componentes"

read -p "Selecciona una opción (1-6): " option

case $option in
    1)
        read -p "Ruta del archivo V0 ProductCatalog: " v0_file
        integrate_v0_component "ProductCatalog" "$v0_file"
        ;;
    2)
        read -p "Ruta del archivo V0 ProductSearch: " v0_file
        integrate_v0_component "ProductSearch" "$v0_file"
        ;;
    3)
        read -p "Ruta del archivo V0 ArtisanDirectory: " v0_file
        integrate_v0_component "ArtisanDirectory" "$v0_file"
        ;;
    4)
        read -p "Ruta del archivo V0 SalesOpportunityBoard: " v0_file
        integrate_v0_component "SalesOpportunityBoard" "$v0_file"
        ;;
    5)
        read -p "Ruta del archivo V0 MarketplaceDashboard: " v0_file
        integrate_v0_component "MarketplaceDashboard" "$v0_file"
        ;;
    6)
        echo "📁 Buscando archivos V0 en ./v0-exports/"
        for file in ./v0-exports/*.tsx; do
            if [ -f "$file" ]; then
                filename=$(basename "$file" .tsx)
                integrate_v0_component "$filename" "$file"
            fi
        done
        ;;
    *)
        echo "❌ Opción no válida"
        exit 1
        ;;
esac

# Verificar tipos TypeScript
echo ""
echo "🔍 Verificando tipos TypeScript..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ Tipos TypeScript válidos"
else
    echo "⚠️  Errores de tipos encontrados. Revisar componentes integrados."
fi

# Ejecutar linting
echo ""
echo "🧹 Ejecutando linting..."
npm run lint

echo ""
echo "🎉 ¡Integración completada!"
echo "📝 Próximos pasos:"
echo "   1. Revisar componentes en src/components/v0/"
echo "   2. Conectar con hooks existentes"
echo "   3. Ajustar styling si es necesario"
echo "   4. Probar en http://localhost:3001"
