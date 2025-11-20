#!/bin/bash

# Script de inicialización del entorno de desarrollo
# Uso: ./scripts/setup-dev.sh

set -e

echo "🚀 Iniciando configuración del entorno de desarrollo..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ npm $(npm --version) detectado"

# Copiar .env.example a .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo "⚠️  Por favor, edita el archivo .env con tus credenciales"
else
    echo "✅ Archivo .env ya existe"
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Iniciar Docker Compose
echo "🐳 Iniciando PostgreSQL con Docker..."
docker-compose up -d postgres

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

# Generar cliente Prisma
echo "🔧 Generando cliente de Prisma..."
npm run db:generate

# Ejecutar migraciones
echo "🗄️  Ejecutando migraciones de base de datos..."
npm run db:migrate

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "📚 Próximos pasos:"
echo "  1. Edita el archivo .env con tus credenciales"
echo "  2. Ejecuta: npm run start:dev"
echo "  3. Abre: http://localhost:3000"
echo "  4. Swagger: http://localhost:3000/api/docs"
echo ""
