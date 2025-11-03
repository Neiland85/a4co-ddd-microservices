-- A4CO Platform Database Initialization
-- Single database approach for simplified development setup

-- Create the main database (already created in docker-compose.yml)
-- CREATE DATABASE IF NOT EXISTS a4co_platform;

-- Create a single application user with access to the main database
-- Note: Use environment variable for password in production
CREATE USER IF NOT EXISTS a4co_app WITH PASSWORD '${APP_DB_PASSWORD:-secure_dev_password}';
GRANT ALL PRIVILEGES ON DATABASE a4co_platform TO a4co_app;
GRANT USAGE ON SCHEMA public TO a4co_app;

-- For development, grant additional privileges
ALTER USER a4co_app CREATEDB;

-- Create extensions that might be needed by the services
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
