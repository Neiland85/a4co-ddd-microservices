#!/bin/bash

# ================================================================================
# Preview Environment Verification Script
# ================================================================================
# This script verifies the preview environment configuration without building
# ================================================================================

# Don't exit on error - we want to collect all results
# set -e

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

# Initialize counters
PASSED=0
FAILED=0

# Test function
test_file() {
    local file=$1
    local description=$2

    if [ -f "$file" ]; then
        print_success "$description exists"
        ((PASSED++))
        return 0
    else
        print_error "$description NOT found"
        ((FAILED++))
        return 1
    fi
}

# Test directory
test_dir() {
    local dir=$1
    local description=$2

    if [ -d "$dir" ]; then
        print_success "$description exists"
        ((PASSED++))
        return 0
    else
        print_error "$description NOT found"
        ((FAILED++))
        return 1
    fi
}

# Test command
test_command() {
    local cmd=$1
    local description=$2

    if command -v $cmd &> /dev/null; then
        print_success "$description is available"
        ((PASSED++))
        return 0
    else
        print_error "$description NOT available"
        ((FAILED++))
        return 1
    fi
}

# Test docker compose syntax
test_compose_syntax() {
    local compose_file=$1
    local description=$2

    if docker compose -f "$compose_file" config > /dev/null 2>&1; then
        print_success "$description syntax is valid"
        ((PASSED++))
        return 0
    else
        print_error "$description syntax is INVALID"
        ((FAILED++))
        return 1
    fi
}

print_header "Preview Environment Verification"

# Check prerequisites
print_header "1. Prerequisites"
test_command "docker" "Docker"

# Check for docker compose (either standalone or plugin)
if command -v docker-compose &> /dev/null; then
    print_success "Docker Compose (standalone) is available"
    ((PASSED++))
elif docker compose version &> /dev/null; then
    print_success "Docker Compose (plugin) is available"
    ((PASSED++))
else
    print_error "Docker Compose NOT available"
    ((FAILED++))
fi

if command -v pnpm &> /dev/null; then
    print_success "pnpm package manager is available"
    ((PASSED++))
else
    print_warning "pnpm package manager NOT available (optional for local development)"
fi

# Check configuration files
print_header "2. Configuration Files"
test_file "docker-compose.preview.yml" "Preview docker-compose file"
test_file ".env.preview.example" "Preview environment template"
test_file ".env.preview" "Preview environment file"
test_file "docker-compose.prod.yml" "Production docker-compose file"
test_file ".env.production.template" "Production environment template"

# Check deployment scripts
print_header "3. Deployment Scripts"
test_file "start-preview.sh" "Preview startup script"
if [ -f "start-preview.sh" ]; then
    if [ -x "start-preview.sh" ]; then
        print_success "Preview startup script is executable"
        ((PASSED++))
    else
        print_warning "Preview startup script is not executable (run: chmod +x start-preview.sh)"
    fi
fi

# Check documentation
print_header "4. Documentation"
test_file "DEPLOYMENT_GUIDE.md" "Deployment guide"
test_file "PRODUCTION_READINESS_CHECKLIST.md" "Production readiness checklist"
test_file "README.md" "Project README"

# Check Dockerfiles
print_header "5. Service Dockerfiles"
test_file "apps/order-service/Dockerfile" "Order Service Dockerfile"
test_file "apps/payment-service/Dockerfile" "Payment Service Dockerfile"
test_file "apps/inventory-service/Dockerfile" "Inventory Service Dockerfile"
test_file "apps/product-service/Dockerfile" "Product Service Dockerfile"
test_file "apps/gateway/Dockerfile" "API Gateway Dockerfile"
test_file "apps/dashboard-client/Dockerfile" "Dashboard Client Dockerfile"
test_file "apps/frontend/Dockerfile" "Frontend Dockerfile"

# Check service directories
print_header "6. Service Directories"
test_dir "apps/order-service" "Order Service"
test_dir "apps/payment-service" "Payment Service"
test_dir "apps/inventory-service" "Inventory Service"
test_dir "apps/product-service" "Product Service"
test_dir "apps/gateway" "API Gateway"
test_dir "apps/dashboard-client" "Dashboard Client"
test_dir "apps/frontend" "Frontend"

# Check package.json scripts
print_header "7. Package.json Scripts"
if [ -f "package.json" ]; then
    if grep -q "preview:start" package.json; then
        print_success "preview:start script defined"
        ((PASSED++))
    else
        print_error "preview:start script NOT defined"
        ((FAILED++))
    fi

    if grep -q "preview:up" package.json; then
        print_success "preview:up script defined"
        ((PASSED++))
    else
        print_error "preview:up script NOT defined"
        ((FAILED++))
    fi

    if grep -q "prod:up" package.json; then
        print_success "prod:up script defined"
        ((PASSED++))
    else
        print_error "prod:up script NOT defined"
        ((FAILED++))
    fi
fi

# Check Docker Compose syntax
print_header "8. Docker Compose Validation"
if [ -f ".env.preview" ]; then
    test_compose_syntax "docker-compose.preview.yml" "Preview docker-compose"
fi

# Check init.sql for database initialization
print_header "9. Database Initialization"
test_file "init.sql" "Database init script"

# Summary
print_header "Verification Summary"
TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo -e "Total Tests: ${BLUE}$TOTAL${NC}"
echo -e "Passed:      ${GREEN}$PASSED${NC}"
echo -e "Failed:      ${RED}$FAILED${NC}"
echo -e "Success Rate: ${BLUE}$PERCENTAGE%${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    print_success "All checks passed! ✅"
    echo ""
    print_info "Next steps:"
    echo "  1. Review and customize .env.preview file"
    echo "  2. Run: ./start-preview.sh"
    echo "  3. Or run: pnpm run preview:start"
    echo "  4. Access dashboard at: http://localhost:3001"
    echo "  5. Access API gateway at: http://localhost:8080"
    echo ""
    exit 0
else
    print_warning "Some checks failed. Please review the output above."
    echo ""
    print_info "Fix the issues and run this script again."
    echo ""
    exit 1
fi
