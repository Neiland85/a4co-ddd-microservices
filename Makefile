# A4CO DDD Microservices - Development Environment
.PHONY: help up down restart logs clean build

# Default target
help: ## Show this help message
	@echo "A4CO DDD Microservices Development Commands"
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ========================================
# DEVELOPMENT ENVIRONMENT
# ========================================

up: ## Start all services (infrastructure + core microservices)
	@echo "🚀 Starting A4CO development environment..."
	docker-compose up -d
	@echo "✅ Services started! Waiting for health checks..."
	@sleep 10
	@echo "📊 Service Status:"
	@docker-compose ps

down: ## Stop all services
	@echo "🛑 Stopping A4CO development environment..."
	docker-compose down
	@echo "✅ Services stopped!"

restart: ## Restart all services
	@echo "🔄 Restarting A4CO development environment..."
	docker-compose restart
	@echo "✅ Services restarted!"

logs: ## Show logs from all services
	docker-compose logs -f

# ========================================
# INFRASTRUCTURE MANAGEMENT
# ========================================

infra-up: ## Start only infrastructure services (postgres, nats, redis)
	@echo "🏗️ Starting infrastructure services..."
	docker-compose up -d postgres nats redis
	@echo "✅ Infrastructure ready!"

infra-down: ## Stop only infrastructure services
	@echo "🏗️ Stopping infrastructure services..."
	docker-compose down postgres nats redis

# ========================================
# MICROSERVICES MANAGEMENT
# ========================================

services-up: ## Start only core microservices (auth, user, product, order, payment)
	@echo "🔧 Starting core microservices..."
	docker-compose up -d auth-service user-service product-service order-service payment-service
	@echo "✅ Microservices started!"

services-down: ## Stop only core microservices
	@echo "🔧 Stopping core microservices..."
	docker-compose down auth-service user-service product-service order-service payment-service

# ========================================
# INDIVIDUAL SERVICES
# ========================================

auth-up: ## Start only auth service
	docker-compose up -d auth-service

user-up: ## Start only user service
	docker-compose up -d user-service

product-up: ## Start only product service
	docker-compose up -d product-service

order-up: ## Start only order service
	docker-compose up -d order-service

payment-up: ## Start only payment service
	docker-compose up -d payment-service

# ========================================
# UTILITIES
# ========================================

clean: ## Remove all containers, volumes, and images
	@echo "🧹 Cleaning up Docker environment..."
	docker-compose down -v --rmi all
	@echo "✅ Cleanup complete!"

build: ## Rebuild all service images
	@echo "🔨 Rebuilding service images..."
	docker-compose build --no-cache
	@echo "✅ Images rebuilt!"

status: ## Show status of all services
	@echo "📊 Service Status:"
	@docker-compose ps

health: ## Check health of all services
	@echo "🏥 Health Check:"
	@docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"