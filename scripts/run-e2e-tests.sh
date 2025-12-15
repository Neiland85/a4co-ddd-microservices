#!/bin/bash

###############################################################################
# E2E Test Runner Script
# 
# This script helps run E2E tests with proper setup and cleanup
# 
# Usage:
#   ./scripts/run-e2e-tests.sh [options]
#
# Options:
#   --headed        Run tests in headed mode (see browser)
#   --ui            Run tests in UI mode (interactive)
#   --debug         Run tests in debug mode
#   --report        Open test report after running
#   --no-cleanup    Don't cleanup Docker services after tests
#   --help          Show this help message
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Default options
HEADED=false
UI_MODE=false
DEBUG_MODE=false
SHOW_REPORT=false
CLEANUP=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --headed)
      HEADED=true
      shift
      ;;
    --ui)
      UI_MODE=true
      shift
      ;;
    --debug)
      DEBUG_MODE=true
      shift
      ;;
    --report)
      SHOW_REPORT=true
      shift
      ;;
    --no-cleanup)
      CLEANUP=false
      shift
      ;;
    --help)
      head -n 20 "$0" | tail -n +3 | sed 's/^# //'
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         A4CO E2E Test Suite Runner                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists docker; then
  echo -e "${RED}❌ Docker is not installed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Docker found${NC}"

if ! command_exists pnpm; then
  echo -e "${RED}❌ pnpm is not installed${NC}"
  echo "Install with: npm install -g pnpm@10.14.0"
  exit 1
fi
echo -e "${GREEN}✅ pnpm found${NC}"

# Check if Docker daemon is running
if ! docker info >/dev/null 2>&1; then
  echo -e "${RED}❌ Docker daemon is not running${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Docker daemon running${NC}"

echo ""

# Start Docker services
echo -e "${YELLOW}🚀 Starting test services...${NC}"
cd "$PROJECT_ROOT"

if docker compose -f docker-compose.test.yml ps | grep -q "Up"; then
  echo -e "${YELLOW}⚠️  Services already running, using existing containers${NC}"
else
  echo "Starting services with Docker Compose..."
  docker compose -f docker-compose.test.yml up -d
  
  echo -e "${YELLOW}⏳ Waiting for services to be healthy (30s)...${NC}"
  sleep 30
  
  # Check service health
  echo -e "${YELLOW}🔍 Checking service health...${NC}"
  
  # Check Gateway
  if curl -sf http://localhost:8081/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Gateway is healthy${NC}"
  else
    echo -e "${YELLOW}⚠️  Gateway might not be ready yet${NC}"
  fi
  
  # Check NATS
  if curl -sf http://localhost:8223/healthz >/dev/null 2>&1; then
    echo -e "${GREEN}✅ NATS is healthy${NC}"
  else
    echo -e "${YELLOW}⚠️  NATS might not be ready yet${NC}"
  fi
fi

echo ""

# Navigate to dashboard-client
cd "$PROJECT_ROOT/apps/dashboard-client"

# Install Playwright browsers if needed
if [ ! -d "$HOME/.cache/ms-playwright" ]; then
  echo -e "${YELLOW}📥 Installing Playwright browsers...${NC}"
  pnpm exec playwright install chromium --with-deps
  echo ""
fi

# Run tests based on mode
echo -e "${YELLOW}🧪 Running E2E tests...${NC}"
echo ""

TEST_CMD="pnpm run test:e2e"

if [ "$UI_MODE" = true ]; then
  TEST_CMD="pnpm run test:e2e:ui"
  echo -e "${BLUE}Running in UI mode...${NC}"
elif [ "$DEBUG_MODE" = true ]; then
  TEST_CMD="pnpm run test:e2e:debug"
  echo -e "${BLUE}Running in debug mode...${NC}"
elif [ "$HEADED" = true ]; then
  TEST_CMD="pnpm run test:e2e:headed"
  echo -e "${BLUE}Running in headed mode...${NC}"
fi

# Run the tests
if $TEST_CMD; then
  TEST_STATUS=0
  echo ""
  echo -e "${GREEN}✅ Tests completed successfully!${NC}"
else
  TEST_STATUS=$?
  echo ""
  echo -e "${RED}❌ Tests failed with exit code $TEST_STATUS${NC}"
fi

echo ""

# Show report if requested
if [ "$SHOW_REPORT" = true ]; then
  echo -e "${YELLOW}📊 Opening test report...${NC}"
  pnpm run test:e2e:report
fi

# Cleanup Docker services
if [ "$CLEANUP" = true ]; then
  echo -e "${YELLOW}🧹 Cleaning up test services...${NC}"
  cd "$PROJECT_ROOT"
  docker compose -f docker-compose.test.yml down -v
  echo -e "${GREEN}✅ Cleanup completed${NC}"
else
  echo -e "${YELLOW}⚠️  Skipping cleanup (services still running)${NC}"
  echo "To cleanup manually: docker compose -f docker-compose.test.yml down -v"
fi

echo ""

# Summary
if [ $TEST_STATUS -eq 0 ]; then
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  E2E Tests Completed Successfully! ✅                      ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
else
  echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  E2E Tests Failed ❌                                       ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${YELLOW}View detailed report: pnpm run test:e2e:report${NC}"
  echo -e "${YELLOW}View logs: docker compose -f docker-compose.test.yml logs${NC}"
fi

exit $TEST_STATUS
