#!/bin/bash

# ================================================================
# A4CO Observability Stack Launcher
# PR4: Observability Event-Driven Infrastructure
# ================================================================
#
# This script helps you start the observability stack with proper
# configuration and health checks.
#
# Usage:
#   ./scripts/start-observability.sh [options]
#
# Options:
#   --build         Build images before starting
#   --no-detach     Run in foreground (don't detach)
#   --env-file      Path to custom env file
#   --help          Show this help message
#
# ================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default values
BUILD=false
DETACH=true
ENV_FILE="${PROJECT_ROOT}/.env.observability"
COMPOSE_FILE="${PROJECT_ROOT}/docker-compose.observability.yml"

# ================================================================
# Functions
# ================================================================

print_header() {
    echo -e "${BLUE}"
    echo "================================================================"
    echo "  A4CO Observability Stack Launcher"
    echo "  PR4: Event-Driven Observability Infrastructure"
    echo "================================================================"
    echo -e "${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

show_help() {
    cat << EOF
A4CO Observability Stack Launcher

Usage: ./scripts/start-observability.sh [options]

Options:
    --build         Build images before starting
    --no-detach     Run in foreground (don't detach)
    --env-file      Path to custom env file (default: .env.observability)
    --help          Show this help message

Examples:
    # Start with defaults
    ./scripts/start-observability.sh

    # Rebuild and start
    ./scripts/start-observability.sh --build

    # Run in foreground
    ./scripts/start-observability.sh --no-detach

    # Use custom env file
    ./scripts/start-observability.sh --env-file .env.prod

Access URLs:
    Grafana:        http://localhost:3000 (admin/admin)
    Prometheus:     http://localhost:9090
    AlertManager:   http://localhost:9093
    Loki:           http://localhost:3100

For more information, see: infra/observability/README.md

EOF
}

check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker found: $(docker --version | cut -d' ' -f3)"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose found: $(docker-compose --version | cut -d' ' -f4)"
    
    # Check compose file exists
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "Compose file not found: $COMPOSE_FILE"
        exit 1
    fi
    print_success "Compose file found"
}

check_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        print_warning "Environment file not found: $ENV_FILE"
        
        if [ -f "${ENV_FILE}.example" ]; then
            print_info "Creating $ENV_FILE from example..."
            cp "${ENV_FILE}.example" "$ENV_FILE"
            print_success "Created $ENV_FILE"
            print_warning "Please review and update $ENV_FILE with your values"
        else
            print_info "No .env file needed, using defaults"
        fi
    else
        print_success "Environment file found"
    fi
}

start_stack() {
    print_info "Starting observability stack..."
    
    local CMD="docker-compose -f $COMPOSE_FILE"
    
    # Add env file if exists
    if [ -f "$ENV_FILE" ]; then
        CMD="$CMD --env-file $ENV_FILE"
    fi
    
    # Add build flag if requested
    if [ "$BUILD" = true ]; then
        print_info "Building images..."
        $CMD build
    fi
    
    # Start services
    if [ "$DETACH" = true ]; then
        $CMD up -d
    else
        $CMD up
    fi
}

wait_for_service() {
    local service=$1
    local url=$2
    local max_attempts=30
    local attempt=1
    
    print_info "Waiting for $service to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -sf "$url" > /dev/null 2>&1; then
            print_success "$service is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo ""
    print_warning "$service did not become ready in time"
    return 1
}

verify_services() {
    print_info "Verifying services..."
    
    # Wait for services to start
    sleep 5
    
    # Check Prometheus
    wait_for_service "Prometheus" "http://localhost:9090/-/healthy"
    
    # Check Loki
    wait_for_service "Loki" "http://localhost:3100/ready"
    
    # Check Grafana
    wait_for_service "Grafana" "http://localhost:3000/api/health"
    
    # Check AlertManager
    wait_for_service "AlertManager" "http://localhost:9093/-/healthy"
    
    print_success "All services are running!"
}

show_access_info() {
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo -e "${GREEN}  Observability Stack Started Successfully!${NC}"
    echo -e "${GREEN}================================================================${NC}"
    echo ""
    echo -e "${BLUE}Access URLs:${NC}"
    echo "  Grafana:        http://localhost:3000 (admin/admin)"
    echo "  Prometheus:     http://localhost:9090"
    echo "  AlertManager:   http://localhost:9093"
    echo "  Loki:           http://localhost:3100"
    echo ""
    echo -e "${BLUE}Useful Commands:${NC}"
    echo "  View logs:      docker-compose -f $COMPOSE_FILE logs -f"
    echo "  Stop stack:     docker-compose -f $COMPOSE_FILE down"
    echo "  Restart:        docker-compose -f $COMPOSE_FILE restart"
    echo ""
    echo -e "${BLUE}Dashboards:${NC}"
    echo "  Main:           http://localhost:3000/d/a4co-main"
    echo "  Events:         http://localhost:3000/d/a4co-events"
    echo "  NATS:           http://localhost:3000/d/a4co-nats"
    echo ""
    echo -e "${BLUE}Documentation:${NC}"
    echo "  README:         infra/observability/README.md"
    echo "  Full Docs:      docs/PR4-OBSERVABILITY-SETUP.md"
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo ""
}

# ================================================================
# Main Script
# ================================================================

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --build)
            BUILD=true
            shift
            ;;
        --no-detach)
            DETACH=false
            shift
            ;;
        --env-file)
            ENV_FILE="$2"
            shift 2
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run the script
print_header
check_prerequisites
check_env_file
start_stack

if [ "$DETACH" = true ]; then
    verify_services
    show_access_info
else
    print_info "Running in foreground mode. Press Ctrl+C to stop."
fi
