#!/bin/bash

# Test Event-Driven Flow Script
# This script creates multiple test orders to demonstrate the saga pattern

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ORDER_SERVICE_URL="${ORDER_SERVICE_URL:-http://localhost:3004}"
NUM_ORDERS="${NUM_ORDERS:-10}"

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    Event-Driven Flow Test - Creating ${NUM_ORDERS} Test Orders${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if order service is available
echo -e "${YELLOW}Checking order service availability...${NC}"
if ! curl -s "${ORDER_SERVICE_URL}/orders" > /dev/null 2>&1; then
    echo -e "${RED}❌ Order service not available at ${ORDER_SERVICE_URL}${NC}"
    echo -e "${YELLOW}Please start the order service first:${NC}"
    echo "  pnpm run --filter=@a4co/order-service start:dev"
    exit 1
fi
echo -e "${GREEN}✅ Order service is running${NC}"
echo ""

# Arrays to track results
declare -a ORDER_IDS
declare -a STATUSES

# Create orders
echo -e "${BLUE}Creating ${NUM_ORDERS} test orders...${NC}"
echo ""

for i in $(seq 1 $NUM_ORDERS); do
    echo -e "${YELLOW}Creating order ${i}/${NUM_ORDERS}...${NC}"
    
    # Create order
    RESPONSE=$(curl -s -X POST "${ORDER_SERVICE_URL}/orders" \
        -H "Content-Type: application/json" \
        -d "{
            \"customerId\": \"customer-${i}\",
            \"items\": [
                {
                    \"productId\": \"product-test-${i}\",
                    \"quantity\": $(( ( RANDOM % 5 ) + 1 )),
                    \"unitPrice\": $(( ( RANDOM % 50 ) + 10 )).99
                }
            ]
        }")
    
    # Extract order ID and initial status
    ORDER_ID=$(echo "$RESPONSE" | grep -o '"orderId":"[^"]*' | cut -d'"' -f4)
    INITIAL_STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$ORDER_ID" ]; then
        ORDER_IDS+=("$ORDER_ID")
        echo -e "${GREEN}  ✓ Order created: ${ORDER_ID} (${INITIAL_STATUS})${NC}"
    else
        echo -e "${RED}  ✗ Failed to create order${NC}"
    fi
    
    # Small delay between orders
    sleep 0.5
done

echo ""
echo -e "${BLUE}Waiting 5 seconds for async processing...${NC}"
sleep 5

# Check final status of all orders
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    Final Order Status${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

CONFIRMED=0
CANCELLED=0
PENDING=0
FAILED=0

for ORDER_ID in "${ORDER_IDS[@]}"; do
    # Get order status
    STATUS_RESPONSE=$(curl -s "${ORDER_SERVICE_URL}/orders/${ORDER_ID}")
    FINAL_STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"status":"[^"]*' | cut -d'"' -f4)
    
    case "$FINAL_STATUS" in
        "CONFIRMED")
            CONFIRMED=$((CONFIRMED + 1))
            echo -e "${GREEN}✅ ${ORDER_ID}: CONFIRMED${NC}"
            ;;
        "CANCELLED")
            CANCELLED=$((CANCELLED + 1))
            echo -e "${RED}❌ ${ORDER_ID}: CANCELLED${NC}"
            ;;
        "PENDING")
            PENDING=$((PENDING + 1))
            echo -e "${YELLOW}⏳ ${ORDER_ID}: PENDING${NC}"
            ;;
        *)
            FAILED=$((FAILED + 1))
            echo -e "${RED}⚠️  ${ORDER_ID}: ${FINAL_STATUS}${NC}"
            ;;
    esac
    
    STATUSES+=("$FINAL_STATUS")
done

# Calculate statistics
TOTAL=${#ORDER_IDS[@]}
SUCCESS_RATE=$(echo "scale=1; $CONFIRMED * 100 / $TOTAL" | bc)
FAILURE_RATE=$(echo "scale=1; $CANCELLED * 100 / $TOTAL" | bc)

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    Statistics${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Total Orders:    ${TOTAL}"
echo -e "${GREEN}Confirmed:       ${CONFIRMED} (${SUCCESS_RATE}%)${NC}"
echo -e "${RED}Cancelled:       ${CANCELLED} (${FAILURE_RATE}%)${NC}"
echo -e "${YELLOW}Still Pending:   ${PENDING}${NC}"
echo -e "${RED}Failed/Unknown:  ${FAILED}${NC}"
echo ""

# Expected behavior
if [ $CONFIRMED -gt 0 ] && [ $CANCELLED -gt 0 ]; then
    echo -e "${GREEN}✅ Test PASSED: Both successful and failed orders detected${NC}"
    echo -e "${GREEN}   This demonstrates the saga pattern compensation flow!${NC}"
else
    echo -e "${YELLOW}⚠️  Unexpected results:${NC}"
    if [ $CONFIRMED -eq $TOTAL ]; then
        echo -e "${YELLOW}   All orders succeeded - expected ~90% with default config${NC}"
    elif [ $CANCELLED -eq $TOTAL ]; then
        echo -e "${YELLOW}   All orders failed - check payment service configuration${NC}"
    elif [ $PENDING -gt 0 ]; then
        echo -e "${YELLOW}   Some orders still pending - services may be slow or not running${NC}"
    fi
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "To view service logs:"
echo -e "  ${YELLOW}Order Service:     tail -f apps/order-service/logs/*${NC}"
echo -e "  ${YELLOW}Payment Service:   tail -f apps/payment-service/logs/*${NC}"
echo -e "  ${YELLOW}Inventory Service: tail -f apps/inventory-service/logs/*${NC}"
echo ""
echo -e "To monitor NATS events (requires nats CLI):"
echo -e "  ${YELLOW}nats sub '>'${NC}"
echo ""
