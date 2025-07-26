#!/bin/bash

echo "🚀 Arrancando el Mercado Local de Jaén..."
echo "📍 Ubicación: apps/dashboard-web"
echo "🌐 Puerto: 3001"
echo ""

cd apps/dashboard-web

echo "📦 Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    echo "🔧 Instalando dependencias..."
    pnpm install
fi

echo "🔥 Iniciando servidor de desarrollo..."
echo "🌐 Dashboard estará disponible en: http://localhost:3001"
echo "🧪 Página de testing en: http://localhost:3001/test-integrations"
echo ""
echo "📡 APIs disponibles:"
echo "   • http://localhost:3001/api/sales-opportunities"
echo "   • http://localhost:3001/api/products"
echo "   • http://localhost:3001/api/artisans"
echo ""

# Arrancar el servidor en puerto 3001
pnpm dev --port 3001
