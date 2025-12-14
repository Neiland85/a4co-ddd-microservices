#!/bin/bash

# Quick Start Script for Event-Driven Flow Services
# Starts all required services for testing the event-driven architecture

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    Event-Driven Microservices - Quick Start${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  docker-compose not found, trying docker compose...${NC}"
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Start infrastructure
echo -e "${BLUE}1. Starting infrastructure (PostgreSQL + NATS)...${NC}"
$DOCKER_COMPOSE up -d postgres nats

echo -e "${GREEN}✅ Infrastructure started${NC}"
echo ""

# Wait for PostgreSQL to be ready
echo -e "${BLUE}2. Waiting for PostgreSQL to be ready...${NC}"
for i in {1..30}; do
    if docker exec microservices-postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}⚠️  PostgreSQL not ready after 30 seconds${NC}"
    fi
    sleep 1
done
echo ""

# Check NATS
echo -e "${BLUE}3. Checking NATS...${NC}"
if curl -s http://localhost:8222/varz > /dev/null 2>&1; then
    echo -e "${GREEN}✅ NATS is running${NC}"
    echo -e "   ${YELLOW}Monitoring UI: http://localhost:8222${NC}"
else
    echo -e "${YELLOW}⚠️  NATS monitoring not accessible (may still be starting)${NC}"
fi
echo ""

# Environment setup
echo -e "${BLUE}4. Setting up environment variables...${NC}"
export USE_SIMULATED_PAYMENT=true
export PAYMENT_SUCCESS_RATE=0.9
echo -e "${GREEN}✅ USE_SIMULATED_PAYMENT=true${NC}"
echo -e "${GREEN}✅ PAYMENT_SUCCESS_RATE=0.9 (90% success)${NC}"
echo ""

# Install dependencies if needed
echo -e "${BLUE}5. Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies (this may take a while)...${NC}"
    pnpm install
fi
echo -e "${GREEN}✅ Dependencies ready${NC}"
echo ""

# Build shared-events
echo -e "${BLUE}6. Building shared-events library...${NC}"
cd libs/shared-events
if [ ! -d "dist" ]; then
    pnpm run build
fi
cd ../..
echo -e "${GREEN}✅ Shared events built${NC}"
echo ""

# Generate Prisma clients
echo -e "${BLUE}7. Generating Prisma clients...${NC}"
pnpm run db:generate
echo -e "${GREEN}✅ Prisma clients generated${NC}"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Now start the services in separate terminals:"
echo ""
echo -e "${YELLOW}Terminal 1 - Order Service:${NC}"
echo -e "  pnpm run --filter=@a4co/order-service start:dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Payment Service:${NC}"
echo -e "  USE_SIMULATED_PAYMENT=true pnpm run --filter=@a4co/payment-service start:dev"
echo ""
echo -e "${YELLOW}Terminal 3 - Inventory Service:${NC}"
echo -e "  pnpm run --filter=@a4co/inventory-service start:dev"
echo ""
echo -e "${BLUE}Or use tmux/screen to run all in one terminal${NC}"
echo ""
echo -e "Once services are running, test with:"
echo -e "  ${YELLOW}./scripts/test-event-flow.sh${NC}"
echo ""
echo -e "View logs with:"
echo -e "  ${YELLOW}docker-compose logs -f nats${NC}"
echo -e "  ${YELLOW}docker-compose logs -f postgres${NC}"
echo ""
