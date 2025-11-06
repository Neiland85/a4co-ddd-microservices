#!/bin/bash
# =============================================================================
# A4CO Microservices Platform - Status Check Script
# =============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}
NAMESPACE="a4co-${ENVIRONMENT}"

echo -e "${BLUE}=========================================================================${NC}"
echo -e "${BLUE}  A4CO Microservices Platform - Status Check${NC}"
echo -e "${BLUE}=========================================================================${NC}"
echo ""
echo -e "${GREEN}Environment:${NC} ${ENVIRONMENT}"
echo -e "${GREEN}Namespace:${NC} ${NAMESPACE}"
echo ""

# Function to check resource status
check_resource() {
  local resource=$1
  local label=$2
  
  echo -e "${BLUE}▶ ${label}${NC}"
  echo "─────────────────────────────────────────────────────────────────────────"
  kubectl get ${resource} -n ${NAMESPACE} 2>/dev/null || echo "No ${label} found"
  echo ""
}

# Check all resources
check_resource "deployments" "Deployments"
check_resource "pods" "Pods"
check_resource "services" "Services"
check_resource "hpa" "Horizontal Pod Autoscalers"
check_resource "pdb" "Pod Disruption Budgets"
check_resource "ingress" "Ingress"
check_resource "configmaps" "ConfigMaps"
check_resource "secrets" "Secrets"
check_resource "servicemonitors" "Service Monitors"

# Check pod health
echo -e "${BLUE}▶ Pod Health Details${NC}"
echo "─────────────────────────────────────────────────────────────────────────"
kubectl get pods -n ${NAMESPACE} -o custom-columns=\
NAME:.metadata.name,\
STATUS:.status.phase,\
READY:.status.containerStatuses[0].ready,\
RESTARTS:.status.containerStatuses[0].restartCount,\
AGE:.metadata.creationTimestamp

echo ""

# Check events
echo -e "${BLUE}▶ Recent Events${NC}"
echo "─────────────────────────────────────────────────────────────────────────"
kubectl get events -n ${NAMESPACE} --sort-by='.lastTimestamp' | tail -20

echo ""

# Check resource usage
echo -e "${BLUE}▶ Resource Usage${NC}"
echo "─────────────────────────────────────────────────────────────────────────"
kubectl top pods -n ${NAMESPACE} 2>/dev/null || echo "Metrics server not available"

echo ""
echo -e "${BLUE}=========================================================================${NC}"
