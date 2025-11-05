#!/bin/bash

# Script para configurar secretos Docker y crear servicio OCR Validator
# Ejecutar cuando Docker esté funcionando correctamente
#
# USO:
#   DB_USER="tu_usuario" DB_PASSWORD="tu_password" ./setup-docker-secrets.sh

set -e

echo "=== Configurando secretos Docker para PostgreSQL ==="

# Validar que las variables de entorno requeridas estén definidas
if [ -z "${DB_USER}" ]; then
  echo "❌ ERROR: La variable DB_USER no está definida."
  echo "   Uso: DB_USER=\"tu_usuario\" DB_PASSWORD=\"tu_password\" ./setup-docker-secrets.sh"
  exit 1
fi

if [ -z "${DB_PASSWORD}" ]; then
  echo "❌ ERROR: La variable DB_PASSWORD no está definida."
  echo "   Uso: DB_USER=\"tu_usuario\" DB_PASSWORD=\"tu_password\" ./setup-docker-secrets.sh"
  exit 1
fi

# Crear secreto para el usuario de la base de datos
echo "Creando secreto db_user..."
echo -n "${DB_USER}" | docker secret create db_user -

# Crear secreto para la contraseña de la base de datos
echo "Creando secreto db_pass..."
echo -n "${DB_PASSWORD}" | docker secret create db_pass -

# Verificar que el secreto pg_ca existe (debe haberse creado antes)
echo "Verificando secreto pg_ca..."
docker secret ls | grep pg_ca || echo "ERROR: El secreto pg_ca no existe. Créalo primero con: cat ./ca.pem | docker secret create pg_ca -"

echo "=== Creando servicio OCR Validator ==="

# Crear el servicio usando los secretos
docker service create \
  --name ocr-validator \
  --replicas 3 \
  --publish published=8080,target=8080 \
  --secret source=pg_ca,target=pg_ca,uid=0,gid=0,mode=0400 \
  --secret source=db_user,target=db_user,uid=0,gid=0,mode=0400 \
  --secret source=db_pass,target=db_pass,uid=0,gid=0,mode=0400 \
  registry.example.com/yourorg/ocr-validator:1.2.3

echo "=== Servicio creado exitosamente ==="
echo ""
echo "Los secretos estarán disponibles en el contenedor en:"
echo "  - /run/secrets/pg_ca (certificado CA)"
echo "  - /run/secrets/db_user (usuario BD)"
echo "  - /run/secrets/db_pass (contraseña BD)"
echo ""
echo "Recuerda configurar el entrypoint del contenedor para construir DATABASE_URL desde estos secretos."
