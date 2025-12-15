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

### Services Not Ready

```bash
# Check service health
curl http://localhost:8081/health
curl http://localhost:3001

# Restart services
docker-compose -f ../../docker-compose.test.yml restart
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
