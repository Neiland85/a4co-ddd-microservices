#!/bin/bash

# ================================================================================
# Preview Environment Startup Script
# ================================================================================
# This script helps you set up and start the preview environment
# ================================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "\n${BLUE}===================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed"
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    print_success "Docker daemon is running"
}

# Setup environment file
setup_env_file() {
    print_header "Setting Up Environment File"
    
    if [ ! -f ".env.preview" ]; then
        print_info "Creating .env.preview from template..."
        cp .env.preview.example .env.preview
        print_success ".env.preview created"
        print_warning "Please edit .env.preview to customize your configuration"
        print_info "Press Enter to continue or Ctrl+C to exit and edit first"
        read
    else
        print_success ".env.preview already exists"
    fi
}

# Build and start services
start_services() {
    print_header "Building and Starting Services"
    
    print_info "Building Docker images (this may take a few minutes)..."
    docker-compose -f docker-compose.preview.yml --env-file .env.preview build
    
    print_success "Docker images built successfully"
    
    print_info "Starting services..."
    docker-compose -f docker-compose.preview.yml --env-file .env.preview up -d
    
    print_success "Services started"
}

# Wait for services to be healthy
wait_for_services() {
    print_header "Waiting for Services to be Healthy"
    
    print_info "Waiting for database to be ready..."
    timeout=60
    elapsed=0
    
    while [ $elapsed -lt $timeout ]; do
        if docker-compose -f docker-compose.preview.yml --env-file .env.preview ps postgres | grep -q "healthy"; then
            print_success "Database is healthy"
            break
        fi
        sleep 2
        elapsed=$((elapsed + 2))
        echo -n "."
    done
    
    if [ $elapsed -ge $timeout ]; then
        print_error "Database failed to become healthy"
        exit 1
    fi
    
    print_info "Waiting for services to be ready (this may take 1-2 minutes)..."
    sleep 30
    
    print_success "Services are ready"
}

# Show service status
show_status() {
    print_header "Service Status"
    docker-compose -f docker-compose.preview.yml --env-file .env.preview ps
}

# Show access information
show_access_info() {
    print_header "Preview Environment Ready!"
    
    echo -e "${GREEN}Frontend Applications:${NC}"
    echo -e "  • Dashboard (Next.js):     ${BLUE}http://localhost:3001${NC}"
    echo -e "  • Main Frontend (Vite):    ${BLUE}http://localhost:5173${NC}"
    echo ""
    echo -e "${GREEN}Backend Services:${NC}"
    echo -e "  • API Gateway:             ${BLUE}http://localhost:8080${NC}"
    echo -e "  • API Gateway Health:      ${BLUE}http://localhost:8080/api/v1/health${NC}"
    echo -e "  • API Gateway Swagger:     ${BLUE}http://localhost:8080/api/docs${NC}"
    echo -e "  • Auth Service:            ${BLUE}http://localhost:4000${NC}"
    echo -e "  • Order Service:           ${BLUE}http://localhost:3000${NC}"
    echo -e "  • Payment Service:         ${BLUE}http://localhost:3001${NC}"
    echo -e "  • Inventory Service:       ${BLUE}http://localhost:3002${NC}"
    echo -e "  • Product Service:         ${BLUE}http://localhost:3003${NC}"
    echo ""
    echo -e "${GREEN}Infrastructure:${NC}"
    echo -e "  • PostgreSQL:              ${BLUE}localhost:5432${NC}"
    echo -e "  • NATS:                    ${BLUE}localhost:4222${NC}"
    echo -e "  • NATS Monitoring:         ${BLUE}http://localhost:8222${NC}"
    echo -e "  • Redis:                   ${BLUE}localhost:6379${NC}"
    echo ""
    echo -e "${YELLOW}Useful Commands:${NC}"
    echo -e "  • View logs:               ${BLUE}docker-compose -f docker-compose.preview.yml --env-file .env.preview logs -f${NC}"
    echo -e "  • View logs (service):     ${BLUE}docker-compose -f docker-compose.preview.yml --env-file .env.preview logs -f <service-name>${NC}"
    echo -e "  • Stop services:           ${BLUE}docker-compose -f docker-compose.preview.yml --env-file .env.preview down${NC}"
    echo -e "  • Restart services:        ${BLUE}docker-compose -f docker-compose.preview.yml --env-file .env.preview restart${NC}"
    echo -e "  • Remove volumes:          ${BLUE}docker-compose -f docker-compose.preview.yml --env-file .env.preview down -v${NC}"
    echo ""
}

# Main execution
main() {
    print_header "A4CO Preview Environment Setup"
    
    check_prerequisites
    setup_env_file
    start_services
    wait_for_services
    show_status
    show_access_info
    
    print_success "Preview environment is ready!"
}

# Run main function
main
