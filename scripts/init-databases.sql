-- Script de inicialización de bases de datos para A4CO
-- Este script se ejecuta automáticamente al levantar el contenedor de PostgreSQL

-- Crear bases de datos para cada microservicio
CREATE DATABASE a4co_auth;
CREATE DATABASE a4co_product;
CREATE DATABASE a4co_user;
CREATE DATABASE a4co_order;
CREATE DATABASE a4co_payment;
CREATE DATABASE a4co_notification;
CREATE DATABASE a4co_inventory;
CREATE DATABASE a4co_loyalty;
CREATE DATABASE a4co_chat;
CREATE DATABASE a4co_cms;
CREATE DATABASE a4co_analytics;
CREATE DATABASE a4co_artisan;
CREATE DATABASE a4co_geo;
CREATE DATABASE a4co_event;

-- Crear usuario de desarrollo con permisos completos
CREATE USER a4co_dev WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE a4co_auth TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_product TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_user TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_order TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_payment TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_notification TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_inventory TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_loyalty TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_chat TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_cms TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_analytics TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_artisan TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_geo TO a4co_dev;
GRANT ALL PRIVILEGES ON DATABASE a4co_event TO a4co_dev;

-- Configurar extensiones necesarias en cada base de datos
\c a4co_auth
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c a4co_product
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c a4co_user
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c a4co_geo
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c a4co_analytics
CREATE EXTENSION IF NOT EXISTS "timescaledb";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Mensaje de confirmación
\echo 'Bases de datos inicializadas correctamente para A4CO'