#!/bin/bash
set -e

# Script para crear múltiples bases de datos en PostgreSQL
# Usa la variable de entorno POSTGRES_MULTIPLE_DATABASES

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
    echo "Creando múltiples bases de datos: $POSTGRES_MULTIPLE_DATABASES"
    
    # Separar por comas y crear cada base de datos
    for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
        echo "Creando base de datos: $db"
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
            CREATE DATABASE "$db";
            GRANT ALL PRIVILEGES ON DATABASE "$db" TO "$POSTGRES_USER";
EOSQL
    done
    
    echo "Bases de datos creadas exitosamente"
fi