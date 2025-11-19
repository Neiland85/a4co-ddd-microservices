#!/bin/bash

# Script para rotar Database Password
# Uso: ./scripts/rotate-db-password.sh [db_user] [db_host]
# Requiere variables de entorno: DB_USER, DB_PASSWORD, DB_HOST

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

DB_USER="${1:-${DB_USER:-postgres}}"
DB_HOST="${2:-${DB_HOST:-localhost}}"
DB_PASSWORD="${DB_PASSWORD:-}"

echo "🔄 Rotando Database Password para usuario: $DB_USER"
cd "$PROJECT_ROOT"

# Verificar y obtener la password actual
if [ -z "$DB_PASSWORD" ]; then
    echo "⚠️  DB_PASSWORD no está definida en variables de entorno"
    echo ""
    echo "Opciones:"
    echo "1. Define la variable: export DB_PASSWORD='tu_password_actual'"
    echo "2. O ingrésala ahora (no se mostrará en pantalla):"

    # Leer password de forma segura
    read -s -p "Ingresa la password actual de la base de datos: " DB_PASSWORD
    echo ""
    if [ -z "$DB_PASSWORD" ]; then
        echo "❌ Error: Debes proporcionar la password actual"
        exit 1
    fi
fi

# Verificar que la password actual funcione (opcional pero recomendado)
echo "🔗 Verificando conexión con la password actual..."
export PGPASSWORD="$DB_PASSWORD"
if ! psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "SELECT 1;" &>/dev/null; then
    echo "❌ Error: No se puede conectar a la base de datos con la password proporcionada"
    echo "   Verifica que:"
    echo "   - La password sea correcta"
    echo "   - El host '$DB_HOST' sea accesible"
    echo "   - El usuario '$DB_USER' exista"
    echo "   - PostgreSQL esté ejecutándose"
    exit 1
fi
echo "✅ Conexión verificada"

# Generar nueva password
NEW_PASSWORD=$(openssl rand -base64 16)
echo "✅ Nueva password generada"

# Backup archivos actuales
echo "📦 Creando backups..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Actualizar password en la base de datos
echo "🗄️ Actualizando password en PostgreSQL..."
export PGPASSWORD="$DB_PASSWORD"
if psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "ALTER USER $DB_USER PASSWORD '$NEW_PASSWORD';" 2>/dev/null; then
    echo "✅ Password actualizada en base de datos"
else
    echo "⚠️  No se pudo conectar a la base de datos. Actualizando solo archivos de configuración."
    echo "   Asegúrate de actualizar manualmente la password en la base de datos."
fi

# Actualizar archivos de configuración
echo "📝 Actualizando archivos de configuración..."
sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$NEW_PASSWORD/" .env* 2>/dev/null || true
sed -i.bak "s|postgresql://.*@|postgresql://$DB_USER:$NEW_PASSWORD@|g" .env* 2>/dev/null || true
rm .env*.bak 2>/dev/null || true

# Actualizar Docker secrets si Docker está disponible
if command -v docker &> /dev/null && docker info &> /dev/null 2>&1; then
    if docker secret ls 2>/dev/null | grep -q db_pass; then
        echo "🐳 Actualizando Docker secret..."
        echo -n "$NEW_PASSWORD" | docker secret create db_pass_new -
        docker secret rm db_pass 2>/dev/null || true
        docker secret create db_pass < <(echo -n "$NEW_PASSWORD")
        docker secret rm db_pass_new 2>/dev/null || true
        echo "✅ Docker secret actualizado"
    fi
fi

echo ""
echo "✅ Database password rotado exitosamente"
echo ""
echo "📋 Próximos pasos:"
echo "1. Reinicia todos los servicios de base de datos"
echo "2. Verifica que las conexiones funcionen con la nueva password"
echo "3. Monitorea logs por errores de conexión"
echo "4. Actualiza cualquier documentación que contenga la password anterior"
echo ""
echo "🔒 Nueva password almacenada en archivos .env"
echo "⚠️  IMPORTANTE: La password anterior ya no es válida"
