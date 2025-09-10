#!/bin/bash

# Configuración de Prettier + ESLint
# Script para verificar y corregir formato de código

set -e

echo "🔧 Configurando Prettier + ESLint..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar si las dependencias están instaladas
check_dependencies() {
    print_status "Verificando dependencias..."
    
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm no está instalado"
        exit 1
    fi
    
    if ! pnpm list prettier >/dev/null 2>&1; then
        print_warning "Prettier no está instalado, instalando..."
        pnpm install --dev prettier
    fi
    
    if ! pnpm list eslint >/dev/null 2>&1; then
        print_warning "ESLint no está instalado, instalando..."
        pnpm install --dev eslint
    fi
}

# Verificar formato
check_format() {
    print_status "Verificando formato con Prettier..."
    
    if pnpm run format:check; then
        print_status "Formato correcto ✨"
    else
        print_warning "Archivos con formato incorrecto encontrados"
        read -p "¿Quieres corregir automáticamente? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            pnpm run format
            print_status "Formato corregido ✨"
        fi
    fi
}

# Verificar linting
check_lint() {
    print_status "Verificando linting con ESLint..."
    
    if pnpm run lint:check; then
        print_status "Linting correcto ✨"
    else
        print_warning "Errores de linting encontrados"
        read -p "¿Quieres corregir automáticamente los errores que se puedan arreglar? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            pnpm run lint:fix
            print_status "Errores de linting corregidos ✨"
        fi
    fi
}

# Verificar markdown linting
check_markdown() {
    print_status "Verificando linting de Markdown..."
    
    if pnpm run lint:md; then
        print_status "Markdown linting correcto ✨"
    else
        print_warning "Errores de markdown encontrados"
        read -p "¿Quieres corregir automáticamente los errores de markdown? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            pnpm run lint:md:fix
            print_status "Errores de markdown corregidos ✨"
        fi
    fi
}

# Ejecutar verificaciones
main() {
    echo "🚀 Iniciando verificación de código..."
    
    check_dependencies
    check_format
    check_lint
    check_markdown
    
    print_status "Verificación completada! 🎉"
    echo ""
    echo "📝 Comandos disponibles:"
    echo "  pnpm run format        - Formatear todos los archivos"
    echo "  pnpm run format:check  - Verificar formato"
    echo "  pnpm run lint:fix      - Corregir errores de linting"
    echo "  pnpm run lint:check    - Verificar linting"
    echo "  pnpm run lint:md       - Verificar markdown"
    echo "  pnpm run lint:md:fix   - Corregir errores de markdown"
}

# Verificar si se pasa un argumento
case "${1:-}" in
    "check")
        check_dependencies
        check_format
        check_lint
        check_markdown
        ;;
    "format")
        check_dependencies
        pnpm run format
        ;;
    "lint")
        check_dependencies
        pnpm run lint:fix
        ;;
    "markdown")
        check_dependencies
        pnpm run lint:md:fix
        ;;
    *)
        main
        ;;
esac
