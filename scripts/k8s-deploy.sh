#!/bin/bash
# =============================================================================
# A4CO Microservices Platform - Kubernetes Deployment Script
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
NAMESPACE="a4co-${ENVIRONMENT}"
CHART_PATH="infra/helm/a4co-microservices"
RELEASE_NAME="a4co-microservices"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
  echo -e "${RED}Error: Invalid environment '${ENVIRONMENT}'${NC}"
  echo "Usage: $0 [dev|staging|production]"
  exit 1
fi

echo -e "${BLUE}=========================================================================${NC}"
echo -e "${BLUE}  A4CO Microservices Platform - Kubernetes Deployment${NC}"
echo -e "${BLUE}=========================================================================${NC}"
echo ""
echo -e "${GREEN}Environment:${NC} ${ENVIRONMENT}"
echo -e "${GREEN}Namespace:${NC} ${NAMESPACE}"
echo -e "${GREEN}Chart:${NC} ${CHART_PATH}"
echo ""

# Function to print section headers
print_header() {
  echo ""
  echo -e "${BLUE}▶ $1${NC}"
  echo "─────────────────────────────────────────────────────────────────────────"
}

# Check prerequisites
print_header "Checking Prerequisites"

if ! command -v kubectl &> /dev/null; then
  echo -e "${RED}✗ kubectl not found${NC}"
  exit 1
fi
echo -e "${GREEN}✓ kubectl found${NC}"

if ! command -v helm &> /dev/null; then
  echo -e "${RED}✗ helm not found${NC}"
  exit 1
fi
echo -e "${GREEN}✓ helm found${NC}"

# Check cluster connection
if ! kubectl cluster-info &> /dev/null; then
  echo -e "${RED}✗ Cannot connect to Kubernetes cluster${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Connected to Kubernetes cluster${NC}"

CLUSTER_NAME=$(kubectl config current-context)
echo -e "${YELLOW}Current context: ${CLUSTER_NAME}${NC}"

# Confirmation for production
if [ "$ENVIRONMENT" = "production" ]; then
  echo ""
  echo -e "${YELLOW}⚠️  WARNING: You are deploying to PRODUCTION!${NC}"
  echo -e "${YELLOW}Cluster: ${CLUSTER_NAME}${NC}"
  read -p "Are you sure you want to continue? (yes/no): " -r
  echo
  if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${RED}Deployment cancelled${NC}"
    exit 1
  fi
fi

# Create namespace
print_header "Creating Namespace"
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
kubectl label namespace ${NAMESPACE} environment=${ENVIRONMENT} --overwrite
echo -e "${GREEN}✓ Namespace '${NAMESPACE}' ready${NC}"

# Add Helm repositories
print_header "Updating Helm Repositories"
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update
echo -e "${GREEN}✓ Helm repositories updated${NC}"

# Update chart dependencies
print_header "Updating Chart Dependencies"
cd ${CHART_PATH}
helm dependency update
cd - > /dev/null
echo -e "${GREEN}✓ Chart dependencies updated${NC}"

# Lint the chart
print_header "Linting Helm Chart"
helm lint ${CHART_PATH} \
  --values ${CHART_PATH}/values-${ENVIRONMENT}.yaml \
  --set global.environment=${ENVIRONMENT}

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Helm chart validation passed${NC}"
else
  echo -e "${RED}✗ Helm chart validation failed${NC}"
  exit 1
fi

# Dry run
print_header "Running Dry-Run Deployment"
helm upgrade --install ${RELEASE_NAME} ${CHART_PATH} \
  --namespace ${NAMESPACE} \
  --values ${CHART_PATH}/values-${ENVIRONMENT}.yaml \
  --set global.environment=${ENVIRONMENT} \
  --set global.imageRegistry=ghcr.io \
  --dry-run --debug > /dev/null

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Dry-run completed successfully${NC}"
else
  echo -e "${RED}✗ Dry-run failed${NC}"
  exit 1
fi

# Deploy
print_header "Deploying to Kubernetes"
helm upgrade --install ${RELEASE_NAME} ${CHART_PATH} \
  --namespace ${NAMESPACE} \
  --values ${CHART_PATH}/values-${ENVIRONMENT}.yaml \
  --set global.environment=${ENVIRONMENT} \
  --set global.imageRegistry=ghcr.io \
  --timeout 10m \
  --wait \
  --atomic \
  --cleanup-on-fail

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Deployment completed successfully${NC}"
else
  echo -e "${RED}✗ Deployment failed${NC}"
  exit 1
fi

# Verify deployment
print_header "Verifying Deployment"

echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod \
  --selector=tier=backend \
  --namespace=${NAMESPACE} \
  --timeout=300s || true

echo ""
echo "Deployment Status:"
kubectl get deployments -n ${NAMESPACE}

echo ""
echo "Pod Status:"
kubectl get pods -n ${NAMESPACE}

echo ""
echo "Service Status:"
kubectl get services -n ${NAMESPACE}

echo ""
echo "HPA Status:"
kubectl get hpa -n ${NAMESPACE}

# Summary
print_header "Deployment Summary"
echo -e "${GREEN}✓ Deployment completed successfully${NC}"
echo ""
echo "Useful commands:"
echo "  View pods:           kubectl get pods -n ${NAMESPACE}"
echo "  View logs:           kubectl logs -f -n ${NAMESPACE} -l tier=backend"
echo "  View services:       kubectl get svc -n ${NAMESPACE}"
echo "  View ingress:        kubectl get ingress -n ${NAMESPACE}"
echo "  View HPA:            kubectl get hpa -n ${NAMESPACE}"
echo "  Port forward:        kubectl port-forward -n ${NAMESPACE} svc/auth-service 3001:3001"
echo ""
echo -e "${BLUE}=========================================================================${NC}"
