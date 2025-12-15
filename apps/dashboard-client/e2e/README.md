# E2E Tests - Dashboard Client

## Overview

This directory contains End-to-End tests for the A4CO Dashboard Client, testing the complete order flow from user authentication to order delivery.

## Structure

```
e2e/
├── helpers/               # Test utility functions
│   ├── auth.helper.ts    # Authentication utilities
│   ├── api.helper.ts     # API interaction utilities
│   └── nats.helper.ts    # NATS event monitoring
├── order-flow.spec.ts    # Main E2E test suite
├── global-setup.ts       # Pre-test setup
├── global-teardown.ts    # Post-test cleanup
└── README.md             # This file
```

## Prerequisites

Before running E2E tests locally, ensure you have:

1. **docker-compose.test.yml** in project root (`../../docker-compose.test.yml`)
2. **Docker & Docker Compose v2** running
3. **Ports available**: 8081, 3001, 4223, 8222, 5433, 6380
4. **Node.js 22+** and **pnpm 10.14.0+**

### Local Environment Setup

```bash
# From project root, start test services
docker compose -f docker-compose.test.yml up -d

# Wait for services to be healthy (especially NATS)
sleep 15

# Verify NATS is ready
curl http://localhost:8222/healthz  # Should return "ok"

# Then run tests from dashboard-client directory
cd apps/dashboard-client
pnpm run test:e2e
```

## Running Tests

### Quick Start

```bash
# Run all tests
pnpm run test:e2e

# Run with UI
pnpm run test:e2e:ui

# Run in headed mode
pnpm run test:e2e:headed

# Debug specific test
pnpm run test:e2e:debug
```

### View Reports

```bash
pnpm run test:e2e:report
```

## Test Suites

### 1. User Authentication
- API-based login with JWT
- UI-based login flow
- Token management

### 2. Product Catalog
- Fetch products via Gateway
- Display products in UI
- Handle empty states

### 3. Order Creation
- Create orders with validation
- Invalid data handling
- Order status tracking

### 4. Payment Processing
- Payment initiation and success
- NATS event emission
- Event correlation

### 5. Order Confirmation
- Order status progression
- Final state validation

### 6. Happy Path
- Complete successful flow
- Event sequence validation

### 7. Saga Rollback
- Payment failure handling
- Inventory compensation
- Order cancellation

### 8. Event Traceability
- Correlation ID tracking
- Event statistics
- Cross-service tracing

## Helpers

### Auth Helper

```typescript
import { loginViaAPI, setAuthToken } from './helpers/auth.helper';

const tokens = await loginViaAPI(credentials);
await setAuthToken(page, tokens);
```

### API Helper

```typescript
import { createOrder, waitForOrderStatus } from './helpers/api.helper';

const order = await createOrder(orderRequest, token);
await waitForOrderStatus(order.orderId, 'CONFIRMED', token);
```

### NATS Monitor

```typescript
import { NATSEventMonitor, NATS_SUBJECTS } from './helpers/nats.helper';

const monitor = new NATSEventMonitor();
await monitor.startMonitoring();
const events = monitor.findEventsByCorrelationId(orderId);
```

## Configuration

See `playwright.config.ts` in parent directory for:
- Timeout settings
- Retry configuration
- Reporter options
- Browser settings

## Environment Variables

```bash
GATEWAY_URL=http://localhost:8081
DASHBOARD_URL=http://localhost:3001
TEST_USER_EMAIL=test@a4co.com
TEST_USER_PASSWORD=TestPassword123!
```

## Troubleshooting

### docker-compose.test.yml Issues

**Problem**: `docker-compose.test.yml` not found or services won't start

**Solution**:
```bash
# Verify file exists in project root
ls -la ../../docker-compose.test.yml

# Validate configuration
docker compose -f ../../docker-compose.test.yml config

# View services status
docker compose -f ../../docker-compose.test.yml ps

# Restart all services
docker compose -f ../../docker-compose.test.yml restart

# Full cleanup and restart
docker compose -f ../../docker-compose.test.yml down -v
docker compose -f ../../docker-compose.test.yml up -d
```

### NATS Healthcheck Failures

**Problem**: NATS container not healthy or tests can't connect

**Root Cause**: 
- Healthcheck timing out (retries: 10, interval: 5s, start_period: 10s)
- Port 8222 not accessible
- Using wrong healthcheck URL

**Solution**:
```bash
# Check NATS container status
docker compose -f ../../docker-compose.test.yml ps nats-test

# View NATS logs
docker compose -f ../../docker-compose.test.yml logs nats-test

# Test NATS monitoring endpoint directly (port 8222, not 8223!)
curl http://localhost:8222/healthz
# Should return: ok

# Test NATS client connection (port 4223)
docker exec nats-test nats-cli server info

# If still failing, restart NATS
docker compose -f ../../docker-compose.test.yml restart nats-test
sleep 15
```

**Note**: NATS uses:
- Port **8222** for monitoring/healthcheck (standard NATS port)
- Port **4223** for client connections (mapped from container's 4222)
- Healthcheck uses `wget` (available in alpine) not `curl`

### Services Not Ready

```bash
# Check service health
curl http://localhost:8081/health  # Gateway
curl http://localhost:3001         # Dashboard
curl http://localhost:8222/healthz # NATS

# Check all services status
docker compose -f ../../docker-compose.test.yml ps
```

### Test Timeouts

Increase timeout in test:
```typescript
test.setTimeout(120000); // 2 minutes
```

### Browser Issues

```bash
# Reinstall browsers
pnpm exec playwright install chromium --with-deps
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up after tests
3. **Assertions**: Assert all important states
4. **Helpers**: Use helpers for common operations
5. **Timeouts**: Set appropriate timeouts for async operations
6. **Naming**: Use descriptive test names

## More Information

See the complete guide at: [docs/e2e-tests.md](../../../docs/e2e-tests.md)
