#!/usr/bin/env bash
#
# Script de configuración del terminal para a4co-ddd-microservices
# Este script configura el entorno de desarrollo de manera consistente
#

set -e  # Salir si hay algún error

echo "🚀 Configurando terminal para a4co-ddd-microservices..."

# --- 1. Definir variables de entorno del proyecto
export PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PROJECT_NAME="a4co-ddd-microservices"

# --- 2. Configurar PATH para herramientas del proyecto
export PATH="$PROJECT_ROOT/node_modules/.bin:$PATH"
export PATH="$PROJECT_ROOT/scripts:$PATH"

# --- 3. Configurar variables de entorno específicas
export NODE_ENV="development"
export AWS_REGION="us-east-1"

# --- 4. Configurar alias útiles para el proyecto
alias dev="npm run dev"
alias build="npm run build"
alias test="npm test"
alias lint="npm run lint"

alias gs="git status"
alias ga="git add"
alias gc="git commit"
alias gp="git push"
alias gl="git log --oneline"

# --- 5. Función para cambiar al directorio del proyecto
function a4co() {
    cd "$PROJECT_ROOT"
    echo "📍 Cambiado a: $PROJECT_ROOT"
    echo "🔧 Proyecto: $PROJECT_NAME"
    echo "🌍 Entorno: $NODE_ENV"
}

# --- 6. Función para verificar el estado del proyecto
function status() {
    echo "📊 Estado del proyecto $PROJECT_NAME:"
    echo "📍 Directorio: $(pwd)"
    echo "🌿 Rama Git: $(git branch --show-current)"
    echo "📦 Node: $(node --version)"
    echo "🔧 NPM: $(npm --version)"
}

# --- 7. Función para limpiar el proyecto
function clean() {
    echo "🧹 Limpiando proyecto..."
    rm -rf node_modules
    rm -rf .turbo
    rm -rf dist
    rm -rf build
    echo "✅ Limpieza completada"
}

# --- 8. Función para reinstalar dependencias
function reinstall() {
    echo "📦 Reinstalando dependencias..."
    clean
    npm install
    echo "✅ Dependencias reinstaladas"
}

# --- 9. Mostrar información del proyecto
echo "✅ Terminal configurado para $PROJECT_NAME"
echo "📍 Directorio raíz: $PROJECT_ROOT"
echo "🔧 Comandos disponibles:"
echo "   - a4co: Cambiar al directorio del proyecto"
echo "   - status: Ver estado del proyecto"
echo "   - clean: Limpiar archivos generados"
echo "   - reinstall: Reinstalar dependencias"
echo "   - dev/build/test/lint: Alias para npm scripts"

# --- 10. Cambiar al directorio del proyecto
cd "$PROJECT_ROOT"
echo "🎯 Terminal configurado y listo para usar!"

