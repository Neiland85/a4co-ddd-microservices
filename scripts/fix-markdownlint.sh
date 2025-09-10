#!/bin/bash

# Script para arreglar errores comunes de markdownlint
echo "🔧 Arreglando errores de markdownlint..."

# Función para arreglar puntuación trailing en headings
fix_trailing_punctuation() {
    echo "📝 Arreglando puntuación trailing en headings..."
    find . -name "*.md" -type f -exec sed -i 's/\(^#\+.*\):$/\1/g' {} \;
}

# Función para arreglar líneas muy largas en ciertos archivos
fix_long_lines() {
    echo "📏 Notificando sobre líneas largas (requiere revisión manual)..."
    echo "Las siguientes líneas exceden 120 caracteres y necesitan revisión manual:"
    markdownlint "*.md" 2>&1 | grep "MD013/line-length" | head -5
}

# Función para agregar líneas en blanco alrededor de code fences
fix_fences() {
    echo "🔗 Arreglando code fences sin líneas en blanco..."
    find . -name "*.md" -type f -exec sed -i '/^```/i\\' {} \;
    find . -name "*.md" -type f -exec sed -i '/^```$/a\\' {} \;
}

# Ejecutar correcciones
fix_trailing_punctuation
fix_fences

echo "✅ Correcciones automáticas completadas."
echo "⚠️  Algunos errores requieren revisión manual."
