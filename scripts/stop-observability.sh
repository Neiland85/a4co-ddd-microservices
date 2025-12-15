#!/bin/bash

# ================================================================
# A4CO Observability Stack Stop Script
# PR4: Observability Event-Driven Infrastructure
# ================================================================
#
# This script stops the observability stack safely.
#
# Usage:
#   ./scripts/stop-observability.sh [options]
#
# Options:
#   --remove-volumes    Remove data volumes (WARNING: data loss!)
#   --help              Show this help message
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
REMOVE_VOLUMES=false
COMPOSE_FILE="${PROJECT_ROOT}/docker-compose.observability.yml"

# ================================================================
# Functions
# ================================================================

print_header() {
    echo -e "${BLUE}"
    echo "================================================================"
    echo "  A4CO Observability Stack Stop Script"
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
A4CO Observability Stack Stop Script

Usage: ./scripts/stop-observability.sh [options]

Options:
    --remove-volumes    Remove data volumes (WARNING: This will delete all data!)
    --help              Show this help message

Examples:
    # Stop services (keep data)
    ./scripts/stop-observability.sh

    # Stop services and remove all data
    ./scripts/stop-observability.sh --remove-volumes

EOF
}

confirm_removal() {
    if [ "$REMOVE_VOLUMES" = true ]; then
        echo ""
        print_warning "You are about to remove all data volumes!"
        print_warning "This will delete:"
        print_warning "  - All Prometheus metrics data"
        print_warning "  - All Grafana dashboards and settings"
        print_warning "  - All Loki log data"
        print_warning "  - All AlertManager configuration"
        echo ""
        read -p "Are you sure you want to continue? (yes/no): " confirm
        
        if [ "$confirm" != "yes" ]; then
            print_info "Operation cancelled"
            exit 0
        fi
    fi
}

stop_stack() {
    print_info "Stopping observability stack..."
    
    local CMD="docker-compose -f $COMPOSE_FILE down"
    
    if [ "$REMOVE_VOLUMES" = true ]; then
        CMD="$CMD -v"
        print_warning "Removing volumes..."
    fi
    
    $CMD
    
    if [ $? -eq 0 ]; then
        print_success "Observability stack stopped successfully"
    else
        print_error "Failed to stop observability stack"
        exit 1
    fi
}

show_status() {
    echo ""
    print_info "Current status:"
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
}

# ================================================================
# Main Script
# ================================================================

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --remove-volumes)
            REMOVE_VOLUMES=true
            shift
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
confirm_removal
stop_stack
show_status

echo -e "${GREEN}================================================================${NC}"
echo -e "${GREEN}  Observability stack has been stopped${NC}"
if [ "$REMOVE_VOLUMES" = true ]; then
    echo -e "${YELLOW}  All data volumes have been removed${NC}"
else
    echo -e "${BLUE}  Data volumes have been preserved${NC}"
fi
echo -e "${GREEN}================================================================${NC}"
echo ""
