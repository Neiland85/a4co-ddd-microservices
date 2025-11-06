#!/bin/bash
# =============================================================================
# A4CO Microservices Platform - Cleanup Script
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}
NAMESPACE="a4co-${ENVIRONMENT}"
RELEASE_NAME="a4co-microservices"

echo -e "${BLUE}=========================================================================${NC}"
echo -e "${BLUE}  A4CO Microservices Platform - Cleanup${NC}"
echo -e "${BLUE}=========================================================================${NC}"
echo ""
echo -e "${YELLOW}⚠️  WARNING: This will DELETE all resources in namespace '${NAMESPACE}'${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo -e "${RED}Cleanup cancelled${NC}"
  exit 1
fi

echo -e "${BLUE}▶ Uninstalling Helm release${NC}"
echo "─────────────────────────────────────────────────────────────────────────"
helm uninstall ${RELEASE_NAME} -n ${NAMESPACE} || echo "Release not found"

echo ""
echo -e "${BLUE}▶ Deleting namespace${NC}"
echo "─────────────────────────────────────────────────────────────────────────"
kubectl delete namespace ${NAMESPACE} || echo "Namespace not found"

echo ""
echo -e "${GREEN}✓ Cleanup completed${NC}"
echo -e "${BLUE}=========================================================================${NC}"
