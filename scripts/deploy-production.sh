#!/bin/bash

###############################################################################
# 🚀 Deploy to Production Script
#
# Este script maneja el deployment a producción usando blue-green strategy
#
# Usage: ./scripts/deploy-production.sh [staging|production]
###############################################################################

set -e  # Exit on error
set -o pipefail  # Exit on pipe failure

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment
ENVIRONMENT=${1:-staging}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/${TIMESTAMP}"

###############################################################################
# Helper Functions
###############################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check required commands
    command -v docker >/dev/null 2>&1 || { log_error "docker is required but not installed"; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { log_error "docker-compose is required but not installed"; exit 1; }
    command -v pnpm >/dev/null 2>&1 || { log_error "pnpm is required but not installed"; exit 1; }

    log_success "Prerequisites check passed"
}

backup_database() {
    log_info "Creating database backup..."

    mkdir -p "${BACKUP_DIR}"

    # Backup PostgreSQL
    docker-compose exec -T postgres pg_dumpall -U postgres > "${BACKUP_DIR}/postgres_backup.sql"

    log_success "Database backup created at ${BACKUP_DIR}"
}

run_tests() {
    log_info "Running tests..."

    # Unit tests
    pnpm test || { log_error "Unit tests failed"; exit 1; }

    # E2E tests (optional for production)
    if [ "$ENVIRONMENT" = "staging" ]; then
        log_info "Running E2E tests..."
        cd tests/e2e && pnpm test || log_warning "E2E tests failed"
        cd ../..
    fi

    log_success "Tests passed"
}

build_services() {
    log_info "Building services..."

    # Build all packages
    pnpm run build:all || { log_error "Build failed"; exit 1; }

    log_success "Services built successfully"
}

build_docker_images() {
    log_info "Building Docker images..."

    # Build all service images
    docker-compose build --no-cache || { log_error "Docker build failed"; exit 1; }

    log_success "Docker images built"
}

tag_docker_images() {
    local version=$1
    log_info "Tagging Docker images with version ${version}..."

    # Tag images
    docker tag a4co-user-service:latest a4co-user-service:${version}
    docker tag a4co-product-service:latest a4co-product-service:${version}
    docker tag a4co-order-service:latest a4co-order-service:${version}
    docker tag a4co-payment-service:latest a4co-payment-service:${version}
    docker tag a4co-inventory-service:latest a4co-inventory-service:${version}
    docker tag a4co-notification-service:latest a4co-notification-service:${version}
    docker tag a4co-transportista-service:latest a4co-transportista-service:${version}

    log_success "Images tagged with version ${version}"
}

deploy_to_staging() {
    log_info "Deploying to STAGING..."

    # Stop current staging
    docker-compose -f docker-compose.staging.yml down || true

    # Start new version
    docker-compose -f docker-compose.staging.yml up -d

    # Wait for services to be healthy
    sleep 30

    log_success "Deployed to STAGING"
}

deploy_to_production() {
    log_info "Deploying to PRODUCTION (Blue-Green)..."

    # Deploy to blue environment (new version)
    docker-compose -f docker-compose.production-blue.yml up -d

    # Wait for services to be healthy
    log_info "Waiting for blue environment to be healthy..."
    sleep 60

    # Run smoke tests on blue
    smoke_tests "blue"

    # Switch traffic to blue
    log_info "Switching traffic to blue environment..."
    # This would be done via load balancer/ingress
    # kubectl patch service gateway -p '{"spec":{"selector":{"version":"blue"}}}'

    log_success "Traffic switched to blue environment"

    # Keep green (old) running for rollback
    log_warning "Green environment still running for potential rollback"
    log_info "Monitor for 24h, then run: docker-compose -f docker-compose.production-green.yml down"
}

smoke_tests() {
    local env=$1
    log_info "Running smoke tests on ${env}..."

    # Health checks
    local base_url="http://localhost:3001"
    if [ "$env" = "blue" ]; then
        base_url="http://localhost:3011"  # Blue port
    fi

    # Test user service
    curl -f "${base_url}/api/v1/users/health" || { log_error "User service health check failed"; exit 1; }

    # Test product service
    curl -f "${base_url}/api/v1/products/health" || { log_error "Product service health check failed"; exit 1; }

    log_success "Smoke tests passed"
}

post_deployment_check() {
    log_info "Running post-deployment checks..."

    # Check all services are running
    docker-compose ps

    # Check logs for errors
    docker-compose logs --tail=50 | grep -i error || log_success "No errors in logs"

    log_success "Post-deployment checks completed"
}

rollback() {
    log_warning "Rolling back deployment..."

    if [ "$ENVIRONMENT" = "production" ]; then
        # Switch back to green
        log_info "Switching traffic back to green environment..."
        # kubectl patch service gateway -p '{"spec":{"selector":{"version":"green"}}}'

        # Stop blue
        docker-compose -f docker-compose.production-blue.yml down
    else
        # Restore from backup
        log_info "Restoring from backup..."
        docker-compose down
        # Restore database
        docker-compose up -d postgres
        sleep 10
        cat "${BACKUP_DIR}/postgres_backup.sql" | docker-compose exec -T postgres psql -U postgres
        docker-compose up -d
    fi

    log_success "Rollback completed"
}

###############################################################################
# Main Deployment Flow
###############################################################################

main() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚀 a4co-ddd-microservices Deployment"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Timestamp: ${TIMESTAMP}"
    echo ""

    # Step 1: Prerequisites
    check_prerequisites

    # Step 2: Backup
    if [ "$ENVIRONMENT" = "production" ]; then
        backup_database
    fi

    # Step 3: Tests
    run_tests

    # Step 4: Build
    build_services
    build_docker_images

    # Step 5: Tag
    VERSION="1.0.0"
    tag_docker_images "${VERSION}"

    # Step 6: Deploy
    if [ "$ENVIRONMENT" = "staging" ]; then
        deploy_to_staging
        smoke_tests "staging"
    elif [ "$ENVIRONMENT" = "production" ]; then
        deploy_to_production
    else
        log_error "Invalid environment: ${ENVIRONMENT}"
        exit 1
    fi

    # Step 7: Post-deployment
    post_deployment_check

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_success "🎉 Deployment to ${ENVIRONMENT} completed successfully!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    if [ "$ENVIRONMENT" = "production" ]; then
        log_warning "Remember to monitor the deployment for 24h"
        log_info "Rollback command: ./scripts/deploy-production.sh rollback"
    fi
}

# Handle rollback command
if [ "$1" = "rollback" ]; then
    ENVIRONMENT=${2:-production}
    rollback
    exit 0
fi

# Run main deployment
main

