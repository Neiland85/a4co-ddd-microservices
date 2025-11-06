#!/bin/bash
# =============================================================================
# A4CO Microservices Platform - Rollback Script
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
REVISION=${2:-0}

echo -e "${BLUE}=========================================================================${NC}"
echo -e "${BLUE}  A4CO Microservices Platform - Rollback${NC}"
echo -e "${BLUE}=========================================================================${NC}"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
  echo -e "${RED}Error: Invalid environment '${ENVIRONMENT}'${NC}"
  echo "Usage: $0 [dev|staging|production] [revision_number]"
  exit 1
fi

echo -e "${GREEN}Environment:${NC} ${ENVIRONMENT}"
echo -e "${GREEN}Namespace:${NC} ${NAMESPACE}"
echo ""

# Show release history
echo -e "${BLUE}▶ Release History${NC}"
echo "─────────────────────────────────────────────────────────────────────────"
helm history ${RELEASE_NAME} -n ${NAMESPACE} --max 10

echo ""

# If no revision specified, use previous
if [ "$REVISION" -eq "0" ]; then
  echo -e "${YELLOW}Rolling back to previous revision...${NC}"
  helm rollback ${RELEASE_NAME} -n ${NAMESPACE} --wait --timeout 5m
else
  echo -e "${YELLOW}Rolling back to revision ${REVISION}...${NC}"
  helm rollback ${RELEASE_NAME} ${REVISION} -n ${NAMESPACE} --wait --timeout 5m
fi

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Rollback completed successfully${NC}"
else
  echo -e "${RED}✗ Rollback failed${NC}"
  exit 1
fi

# Verify
echo ""
echo -e "${BLUE}▶ Verifying Rollback${NC}"
echo "─────────────────────────────────────────────────────────────────────────"

kubectl get pods -n ${NAMESPACE}

echo ""
echo -e "${GREEN}✓ Rollback verification complete${NC}"
echo -e "${BLUE}=========================================================================${NC}"
