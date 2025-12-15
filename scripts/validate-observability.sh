#!/bin/bash

# ================================================================
# A4CO Observability Stack Validation Script
# PR4: Observability Event-Driven Infrastructure
# ================================================================
#
# This script validates the observability infrastructure setup
# before deployment.
#
# Usage:
#   ./scripts/validate-observability.sh
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

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# ================================================================
# Functions
# ================================================================

print_header() {
    echo -e "${BLUE}"
    echo "================================================================"
    echo "  A4CO Observability Stack Validation"
    echo "================================================================"
    echo -e "${NC}"
}

print_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo "----------------------------------------"
}

print_test() {
    echo -n "  Testing: $1... "
}

print_pass() {
    echo -e "${GREEN}✓ PASS${NC}"
    PASSED=$((PASSED + 1))
}

print_fail() {
    echo -e "${RED}✗ FAIL${NC}"
    if [ -n "$1" ]; then
        echo -e "    ${RED}Error: $1${NC}"
    fi
    FAILED=$((FAILED + 1))
}

print_warn() {
    echo -e "${YELLOW}⚠ WARNING${NC}"
    if [ -n "$1" ]; then
        echo -e "    ${YELLOW}Warning: $1${NC}"
    fi
    WARNINGS=$((WARNINGS + 1))
}

# ================================================================
# Validation Tests
# ================================================================

validate_docker_compose() {
    print_section "Docker Compose Configuration"
    
    print_test "docker-compose.observability.yml exists"
    if [ -f "$PROJECT_ROOT/docker-compose.observability.yml" ]; then
        print_pass
    else
        print_fail "File not found"
        return
    fi
    
    print_test "docker-compose.observability.yml syntax"
    if docker compose -f "$PROJECT_ROOT/docker-compose.observability.yml" config > /dev/null 2>&1; then
        print_pass
    else
        print_fail "Invalid syntax"
    fi
}

validate_prometheus_configs() {
    print_section "Prometheus Configuration"
    
    local PROM_DIR="$PROJECT_ROOT/infra/observability/prometheus"
    
    print_test "prometheus.yml exists"
    if [ -f "$PROM_DIR/prometheus.yml" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "prometheus.yml syntax"
    if python3 -c "import yaml; yaml.safe_load(open('$PROM_DIR/prometheus.yml'))" 2>/dev/null; then
        print_pass
    else
        print_fail "Invalid YAML syntax"
    fi
    
    print_test "alerts.yml exists"
    if [ -f "$PROM_DIR/alerts.yml" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "alerts.yml syntax"
    if python3 -c "import yaml; yaml.safe_load(open('$PROM_DIR/alerts.yml'))" 2>/dev/null; then
        print_pass
    else
        print_fail "Invalid YAML syntax"
    fi
    
    print_test "recording-rules.yml exists"
    if [ -f "$PROM_DIR/recording-rules.yml" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
}

validate_loki_config() {
    print_section "Loki Configuration"
    
    local LOKI_DIR="$PROJECT_ROOT/infra/observability/loki"
    
    print_test "loki-config.yml exists"
    if [ -f "$LOKI_DIR/loki-config.yml" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "loki-config.yml syntax"
    if python3 -c "import yaml; yaml.safe_load(open('$LOKI_DIR/loki-config.yml'))" 2>/dev/null; then
        print_pass
    else
        print_fail "Invalid YAML syntax"
    fi
}

validate_promtail_config() {
    print_section "Promtail Configuration"
    
    local PROMTAIL_DIR="$PROJECT_ROOT/infra/observability/promtail"
    
    print_test "promtail-config.yml exists"
    if [ -f "$PROMTAIL_DIR/promtail-config.yml" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "promtail-config.yml syntax"
    if python3 -c "import yaml; yaml.safe_load(open('$PROMTAIL_DIR/promtail-config.yml'))" 2>/dev/null; then
        print_pass
    else
        print_fail "Invalid YAML syntax"
    fi
}

validate_alertmanager_config() {
    print_section "AlertManager Configuration"
    
    local AM_DIR="$PROJECT_ROOT/infra/observability/alertmanager"
    
    print_test "alertmanager.yml exists"
    if [ -f "$AM_DIR/alertmanager.yml" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "alertmanager.yml syntax"
    if python3 -c "import yaml; yaml.safe_load(open('$AM_DIR/alertmanager.yml'))" 2>/dev/null; then
        print_pass
    else
        print_fail "Invalid YAML syntax"
    fi
}

validate_grafana_configs() {
    print_section "Grafana Configuration"
    
    local GRAFANA_DIR="$PROJECT_ROOT/infra/observability/grafana"
    
    print_test "datasources.yml exists"
    if [ -f "$GRAFANA_DIR/provisioning/datasources/datasources.yml" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "datasources.yml syntax"
    if python3 -c "import yaml; yaml.safe_load(open('$GRAFANA_DIR/provisioning/datasources/datasources.yml'))" 2>/dev/null; then
        print_pass
    else
        print_fail "Invalid YAML syntax"
    fi
    
    print_test "dashboards provisioning config exists"
    if [ -f "$GRAFANA_DIR/provisioning/dashboards/dashboards.yml" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
}

validate_dashboards() {
    print_section "Grafana Dashboards"
    
    local DASHBOARD_DIR="$PROJECT_ROOT/infra/observability/grafana/dashboards"
    
    print_test "main-dashboard.json exists"
    if [ -f "$DASHBOARD_DIR/main-dashboard.json" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "main-dashboard.json syntax"
    if python3 -c "import json; json.load(open('$DASHBOARD_DIR/main-dashboard.json'))" 2>/dev/null; then
        print_pass
    else
        print_fail "Invalid JSON syntax"
    fi
    
    print_test "events-dashboard.json exists"
    if [ -f "$DASHBOARD_DIR/events/events-dashboard.json" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "events-dashboard.json syntax"
    if python3 -c "import json; json.load(open('$DASHBOARD_DIR/events/events-dashboard.json'))" 2>/dev/null; then
        print_pass
    else
        print_fail "Invalid JSON syntax"
    fi
    
    print_test "nats-dashboard.json exists"
    if [ -f "$DASHBOARD_DIR/nats/nats-dashboard.json" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "nats-dashboard.json syntax"
    if python3 -c "import json; json.load(open('$DASHBOARD_DIR/nats/nats-dashboard.json'))" 2>/dev/null; then
        print_pass
    else
        print_fail "Invalid JSON syntax"
    fi
}

validate_scripts() {
    print_section "Management Scripts"
    
    print_test "start-observability.sh exists"
    if [ -f "$PROJECT_ROOT/scripts/start-observability.sh" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "start-observability.sh is executable"
    if [ -x "$PROJECT_ROOT/scripts/start-observability.sh" ]; then
        print_pass
    else
        print_fail "File is not executable"
    fi
    
    print_test "stop-observability.sh exists"
    if [ -f "$PROJECT_ROOT/scripts/stop-observability.sh" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "stop-observability.sh is executable"
    if [ -x "$PROJECT_ROOT/scripts/stop-observability.sh" ]; then
        print_pass
    else
        print_fail "File is not executable"
    fi
}

validate_documentation() {
    print_section "Documentation"
    
    print_test "observability README.md exists"
    if [ -f "$PROJECT_ROOT/infra/observability/README.md" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test ".env.observability.example exists"
    if [ -f "$PROJECT_ROOT/.env.observability.example" ]; then
        print_pass
    else
        print_fail "File not found"
    fi
    
    print_test "PR4-OBSERVABILITY-SETUP.md exists"
    if [ -f "$PROJECT_ROOT/docs/PR4-OBSERVABILITY-SETUP.md" ]; then
        print_pass
    else
        print_warn "Full documentation not found (optional)"
    fi
}

show_summary() {
    echo ""
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}  Validation Summary${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo ""
    echo -e "  ${GREEN}Passed:${NC}   $PASSED"
    echo -e "  ${RED}Failed:${NC}   $FAILED"
    echo -e "  ${YELLOW}Warnings:${NC} $WARNINGS"
    echo ""
    
    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}✓ All validations passed!${NC}"
        echo -e "${GREEN}  The observability stack is ready to deploy.${NC}"
        echo ""
        echo -e "${BLUE}Next steps:${NC}"
        echo "  1. Review configuration files in infra/observability/"
        echo "  2. Run: ./scripts/start-observability.sh"
        echo "  3. Access Grafana at http://localhost:3000"
        echo ""
        return 0
    else
        echo -e "${RED}✗ Validation failed!${NC}"
        echo -e "${RED}  Please fix the errors above before deploying.${NC}"
        echo ""
        return 1
    fi
}

# ================================================================
# Main Script
# ================================================================

print_header
validate_docker_compose
validate_prometheus_configs
validate_loki_config
validate_promtail_config
validate_alertmanager_config
validate_grafana_configs
validate_dashboards
validate_scripts
validate_documentation
show_summary
