-- A4CO Platform Database Initialization
-- Single database approach for simplified development setup

-- Create the main database (already created in docker-compose.yml)
-- CREATE DATABASE IF NOT EXISTS a4co_platform;

-- Create a single application user with access to the main database
-- Note: Use environment variable for password in production

-- For development, grant additional privileges

-- Create extensions that might be needed by the services

-- Optional: Create schemas for each service (if you want logical separation)
-- CREATE SCHEMA IF NOT EXISTS auth;
-- CREATE SCHEMA IF NOT EXISTS user_management;
-- CREATE SCHEMA IF NOT EXISTS product_catalog;
-- CREATE SCHEMA IF NOT EXISTS order_processing;
-- CREATE SCHEMA IF NOT EXISTS payment_processing;

-- Grant usage on schemas to the application user
-- GRANT USAGE ON SCHEMA auth TO a4co_app;
-- GRANT USAGE ON SCHEMA user_management TO a4co_app;
-- GRANT USAGE ON SCHEMA product_catalog TO a4co_app;
-- GRANT USAGE ON SCHEMA order_processing TO a4co_app;
-- GRANT USAGE ON SCHEMA payment_processing TO a4co_app;
-- NOTE:
-- This SQL file uses shell-style variable expansion (e.g. ${APP_DB_PASSWORD}) and MUST be
-- preprocessed with envsubst before execution in CI or local scripts. Example:
--   envsubst < scripts/init-db.sql | psql -h HOST -U USER -d a4co_platform
--
-- Required environment variables (no sensible defaults in production):
--   APP_DB_PASSWORD : password for the 'a4co_app' database user (must be provided)
--
-- SECURITY: Do NOT commit expanded SQL files with secrets. Use GitHub secrets and envsubst
-- in CI. Extension creation and other superuser operations should be performed by DBAs.

-- Create the main database (if not already present in the environment)
-- Note: In CI we use the disposable database a4co_platform from the postgres service
-- CREATE DATABASE IF NOT EXISTS a4co_platform;

-- Create a single application user with an explicitly provided password (no fallback)
CREATE ROLE a4co_app WITH LOGIN PASSWORD '${APP_DB_PASSWORD}';

-- Grant only necessary privileges (least-privilege principle)
-- Allow connection to the database
GRANT CONNECT ON DATABASE a4co_platform TO a4co_app;

-- On the public schema, allow the app to create objects it needs and use existing ones
GRANT USAGE ON SCHEMA public TO a4co_app;
GRANT CREATE ON SCHEMA public TO a4co_app;

-- Grant privileges on existing tables and sequences (affects current objects)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO a4co_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO a4co_app;

-- NOTE: The CREATEDB privilege is intentionally omitted. If you need it for dev only,
-- uncomment the following line in a secure, local-only context:
-- ALTER ROLE a4co_app CREATEDB;

-- Create extensions that might be needed by the services. These operations require
-- superuser privileges; prefer to have DBAs provision extensions in production.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Optional: Create schemas for each service (if you want logical separation)
-- CREATE SCHEMA IF NOT EXISTS auth;
-- CREATE SCHEMA IF NOT EXISTS user_management;
-- CREATE SCHEMA IF NOT EXISTS product_catalog;
-- CREATE SCHEMA IF NOT EXISTS order_processing;
-- CREATE SCHEMA IF NOT EXISTS payment_processing;

-- Grant usage on schemas to the application user (if created)
-- GRANT USAGE ON SCHEMA auth TO a4co_app;
-- GRANT USAGE ON SCHEMA user_management TO a4co_app;
-- GRANT USAGE ON SCHEMA product_catalog TO a4co_app;
-- GRANT USAGE ON SCHEMA order_processing TO a4co_app;
-- GRANT USAGE ON SCHEMA payment_processing TO a4co_app;
