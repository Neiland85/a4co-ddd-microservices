-- Script para crear usuario readonly en PostgreSQL
-- Ejecutar como superuser (psql -U postgres -h <host> -d postgres)

-- Crear usuario readonly
CREATE USER readonly_user WITH PASSWORD 'X9v$7kP#b2Q!r8Zt';

-- Otorgar permisos de conexión a la base de datos
GRANT CONNECT ON DATABASE a4co_db TO readonly_user;

-- Otorgar permisos de uso del esquema public
GRANT USAGE ON SCHEMA public TO readonly_user;

-- Otorgar permisos SELECT en todas las tablas existentes
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Configurar permisos por defecto para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly_user;

-- Otorgar permisos SELECT en todas las secuencias existentes
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly_user;

-- Configurar permisos por defecto para secuencias futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO readonly_user;

-- Verificar que el usuario se creó correctamente
SELECT usename, usecreatedb, usesuper, userepl FROM pg_user WHERE usename = 'readonly_user';