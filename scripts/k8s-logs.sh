#!/bin/bash
# =============================================================================
# A4CO Microservices Platform - Logs Viewer Script
# =============================================================================

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}
SERVICE=${2:-all}
NAMESPACE="a4co-${ENVIRONMENT}"

echo -e "${BLUE}=========================================================================${NC}"
echo -e "${BLUE}  A4CO Microservices Platform - Logs Viewer${NC}"
echo -e "${BLUE}=========================================================================${NC}"
echo ""
echo -e "${GREEN}Environment:${NC} ${ENVIRONMENT}"
echo -e "${GREEN}Namespace:${NC} ${NAMESPACE}"
echo -e "${GREEN}Service:${NC} ${SERVICE}"
echo ""

if [ "$SERVICE" = "all" ]; then
  echo "Following logs for all microservices..."
  kubectl logs -f -n ${NAMESPACE} -l tier=backend --max-log-requests=10 --tail=100
else
  SERVICE_NAME="${SERVICE}-service"
  echo "Following logs for ${SERVICE_NAME}..."
  kubectl logs -f -n ${NAMESPACE} -l app=${SERVICE_NAME} --tail=100
fi
