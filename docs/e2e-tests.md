# E2E Testing Guide - A4CO DDD Microservices

## 📋 Overview

This guide covers the End-to-End (E2E) testing suite for the A4CO DDD Microservices platform. The E2E tests validate the complete order flow, including user authentication, product browsing, order creation, payment processing, NATS event handling, and saga rollback scenarios.

## 🏗️ Architecture

### Test Stack

- **Playwright**: Browser automation and E2E testing framework
- **Testcontainers**: Isolated Docker containers for test services
- **Docker Compose**: Orchestration of test infrastructure
- **NATS**: Event-driven messaging for saga pattern testing
- **PostgreSQL**: Isolated test databases
- **Redis**: Caching and session management

### Test Infrastructure

```
┌─────────────────────────────────────────────────────────┐
│                    E2E Test Suite                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Playwright │  │ Testcontainers│  │     NATS     │ │
│  │    Tests     │  │   (Docker)   │  │   Monitor    │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│              Test Services (Docker Compose)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │ Gateway  │  │  Order   │  │ Payment  │  │Inventory││
│  │  (8081)  │  │ (3100)   │  │ (3101)   │  │ (3102)  ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘│
│       │             │              │              │     │
│       └─────────────┴──────────────┴──────────────┘     │
│                          │                              │
│     ┌────────────────────┴────────────────────┐         │
│     │                                         │         │
│  ┌──▼──────┐  ┌──────────┐  ┌──────────────┐ │         │
│  │PostgreSQL│  │   NATS   │  │    Redis     │ │         │
│  │  (5433) │  │  (4223)  │  │   (6380)     │ │         │
│  └─────────┘  └──────────┘  └──────────────┘ │         │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10.14.0+
- Docker and Docker Compose
- 8GB+ RAM recommended

### Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
cd apps/dashboard-client
pnpm exec playwright install chromium
```

### Running Tests Locally

#### Option 1: Automated (Recommended)

```bash
# From dashboard-client directory
cd apps/dashboard-client

# Run all E2E tests
pnpm run test:e2e

# Run with UI mode (interactive)
pnpm run test:e2e:ui

# Run in headed mode (see browser)
pnpm run test:e2e:headed

# Run specific test file
pnpm exec playwright test order-flow.spec.ts

# Debug mode
pnpm run test:e2e:debug
```

#### Option 2: Manual Setup

```bash
# 1. Start test infrastructure
docker-compose -f docker-compose.test.yml up -d

# 2. Wait for services to be ready (~30 seconds)
# Check health: http://localhost:8223/healthz (NATS)
#              http://localhost:8081/health (Gateway)

# 3. Run tests
cd apps/dashboard-client
pnpm run test:e2e

# 4. Cleanup
docker-compose -f docker-compose.test.yml down -v
```

### Viewing Test Reports

```bash
# Open HTML report
cd apps/dashboard-client
pnpm run test:e2e:report

# Report location: apps/dashboard-client/playwright-report/index.html
```

## 📝 Test Coverage

### 1. User Authentication Tests

**Objective**: Validate JWT-based authentication

- ✅ API-based login
- ✅ UI-based login
- ✅ Token storage and retrieval
- ✅ Token validation
- ✅ Logout functionality

**Test Files**: `e2e/order-flow.spec.ts` - "User Authentication"

### 2. Product Catalog Tests

**Objective**: Verify product browsing via Gateway

- ✅ Fetch products from API
- ✅ Display products in UI
- ✅ Product data structure validation
- ✅ Empty state handling

**Test Files**: `e2e/order-flow.spec.ts` - "Product Catalog Visualization"

### 3. Order Creation Tests

**Objective**: Test order creation through Gateway

- ✅ Valid order creation
- ✅ Order validation
- ✅ Invalid data rejection
- ✅ Order status tracking

**Test Files**: `e2e/order-flow.spec.ts` - "Order Creation from Dashboard"

### 4. Payment Processing Tests

**Objective**: Validate payment flow and NATS events

- ✅ Payment initiation
- ✅ Payment success handling
- ✅ Payment failure handling
- ✅ NATS event emission
- ✅ Event correlation

**Test Files**: `e2e/order-flow.spec.ts` - "Payment Processing and NATS Events"

### 5. Order Confirmation Tests

**Objective**: Verify order reaches final state

- ✅ Order status progression
- ✅ Final state validation
- ✅ Payment linkage
- ✅ Delivery confirmation

**Test Files**: `e2e/order-flow.spec.ts` - "Order Delivery Confirmation"

### 6. Happy Path Tests

**Objective**: Complete successful order flow

- ✅ End-to-end order creation
- ✅ Payment success
- ✅ Order confirmation
- ✅ Event sequence validation

**Test Files**: `e2e/order-flow.spec.ts` - "Successful Order Flow (Happy Path)"

### 7. Saga Rollback Tests

**Objective**: Test compensation logic on failures

- ✅ Payment failure handling
- ✅ Inventory release on failure
- ✅ Order cancellation
- ✅ Compensation event emission
- ✅ Saga state tracking

**Test Files**: `e2e/order-flow.spec.ts` - "Failed Order Flow with Saga Rollback"

### 8. Event Traceability Tests

**Objective**: Validate NATS event correlation

- ✅ Event correlation IDs
- ✅ Event sequence tracking
- ✅ Event statistics
- ✅ Cross-service tracing

**Test Files**: `e2e/order-flow.spec.ts` - "NATS Event Traceability"

## 🔧 Configuration

### Playwright Configuration

**File**: `apps/dashboard-client/playwright.config.ts`

Key settings:

```typescript
{
  timeout: 60000,              // 60 seconds per test
  retries: 2,                  // Retry failed tests in CI
  workers: 1,                  // Sequential execution
  baseURL: 'http://localhost:3001',
  reporter: ['html', 'json', 'junit', 'list']
}
```

### Environment Variables

```bash
# Gateway URL
GATEWAY_URL=http://localhost:8081

# Dashboard URL
DASHBOARD_URL=http://localhost:3001

# Test user credentials
TEST_USER_EMAIL=test@a4co.com
TEST_USER_PASSWORD=TestPassword123!

# CI mode
CI=true
```

### Docker Compose Test Configuration

**File**: `docker-compose.test.yml`

Key features:

- Isolated PostgreSQL database (port 5433)
- NATS with JetStream (port 4223)
- Redis for caching (port 6380)
- All microservices with test configuration
- Healthcheck for all services
- Tmpfs volumes for faster tests

## 🔍 Test Helpers

### Authentication Helper

**File**: `e2e/helpers/auth.helper.ts`

```typescript
// API-based login
const tokens = await loginViaAPI(credentials, GATEWAY_URL);

// UI-based login
await loginViaUI(page, credentials);

// Token management
await setAuthToken(page, tokens);
const token = await getAuthToken(page);
await logout(page);
```

### API Helper

**File**: `e2e/helpers/api.helper.ts`

```typescript
// Products
const products = await getProducts(token);

// Orders
const order = await createOrder(orderRequest, token);
const orderDetails = await getOrder(orderId, token);
await waitForOrderStatus(orderId, 'CONFIRMED', token);

// Payments
const payment = await getPaymentByOrderId(orderId, token);
await waitForPaymentStatus(orderId, 'SUCCEEDED', token);
```

### NATS Event Monitor

**File**: `e2e/helpers/nats.helper.ts`

```typescript
// Initialize monitor
const monitor = new NATSEventMonitor();
await monitor.startMonitoring();

// Record events
monitor.recordEvent({
  subject: 'order.created.v1',
  data: orderData,
  correlationId: orderId
});

// Query events
const events = monitor.findEventsByCorrelationId(orderId);
const stats = monitor.getStatistics();
```

## 🤖 CI/CD Integration

### GitHub Actions Workflow

**File**: `.github/workflows/e2e.yml`

Triggered on:
- Pull requests to `main` or `develop`
- Pushes to `main`
- Manual workflow dispatch

### Workflow Steps

1. **Setup**: Install Node.js, pnpm, dependencies
2. **Build**: Generate Prisma clients, build services
3. **Test Services**: Start Docker Compose infrastructure
4. **Run Tests**: Execute Playwright E2E tests
5. **Artifacts**: Upload reports, videos, screenshots
6. **Gate**: Block PR merge on test failure

### Artifacts Generated

- **HTML Report**: Complete test results with traces
- **Videos**: Screen recordings of failed tests
- **Screenshots**: Failure screenshots
- **JSON Report**: Machine-readable results
- **JUnit XML**: CI integration format

### Accessing Reports

1. Navigate to GitHub Actions run
2. Click on "E2E Tests" job
3. Scroll to "Artifacts" section
4. Download `playwright-report.zip`
5. Extract and open `index.html`

## 🐛 Troubleshooting

### Prerequisites and Requirements

**Before running E2E tests**, ensure you have:

1. **Docker and Docker Compose**
   ```bash
   docker --version  # Should be 20.10+
   docker compose version  # Should be v2.0+
   ```

2. **Required Ports Available**
   - 8081 (Gateway)
   - 3001 (Dashboard)
   - 4223 (NATS client)
   - 8222 (NATS monitoring)
   - 5433 (PostgreSQL)
   - 6380 (Redis)

3. **Node.js and pnpm**
   ```bash
   node --version  # Should be 22+
   pnpm --version  # Should be 10.14.0+
   ```

4. **docker-compose.test.yml File**
   - Must be present in project root
   - Contains all required services (postgres, nats, redis, gateway, services)
   - Properly configured healthchecks

### Missing Artifact Directories

**Problem**: CI fails with "path not found" for playwright-report or test-results

**Root Cause**: Playwright doesn't create directories if no tests run or if tests fail before completion.

**Solutions**:

**For Local Development**:
```bash
# Create directories manually before running tests
cd apps/dashboard-client
mkdir -p playwright-report test-results
pnpm run test:e2e
```

**For CI/CD**:
The workflow now automatically creates these directories in the "Prepare test artifact directories" step.

**To Generate Artifacts Locally for Debugging**:
```bash
# Run tests and force report generation
cd apps/dashboard-client
pnpm exec playwright test --reporter=html

# Open the report
pnpm exec playwright show-report

# For videos and screenshots (only on failure)
pnpm exec playwright test --video=on --screenshot=on
```

### Services Not Starting

**Problem**: Docker services fail to start

**Solutions**:
```bash
# Check Docker is running
docker ps

# Check port conflicts
lsof -i :8081  # Gateway
lsof -i :3001  # Dashboard
lsof -i :5433  # PostgreSQL

# Clean up old containers
docker-compose -f docker-compose.test.yml down -v
docker system prune -f

# Restart services
docker-compose -f docker-compose.test.yml up -d --force-recreate
```

### Tests Timing Out

**Problem**: Tests exceed timeout

**Solutions**:
```typescript
// Increase timeout in test
test('should create order', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
  // ...
});

// Increase global timeout in playwright.config.ts
timeout: 120 * 1000
```

### Authentication Failures

**Problem**: Login tests fail

**Solutions**:
```bash
# Verify auth service is running
curl http://localhost:4001/health

# Check credentials
echo $TEST_USER_EMAIL
echo $TEST_USER_PASSWORD

# Test login directly
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@a4co.com","password":"TestPassword123!"}'
```

### NATS Healthcheck Failures

**Problem**: NATS service fails healthcheck in CI or locally

**Root Cause**: The NATS monitoring endpoint needs to be accessible and the healthcheck command must be compatible with the alpine image.

**Solutions**:
```bash
# Verify NATS is running and monitoring port is accessible
curl http://localhost:8222/healthz

# Check NATS monitoring dashboard
curl http://localhost:8222/

# View NATS logs
docker compose -f docker-compose.test.yml logs nats-test

# Restart NATS if needed
docker compose -f docker-compose.test.yml restart nats-test

# Check if monitoring port is properly mapped (should be 8222)
docker compose -f docker-compose.test.yml ps | grep nats
```

**Configuration Notes**:
- NATS monitoring port is **8222** (standard), not 8223
- Healthcheck uses `wget -qO-` which works in alpine images
- Client port is **4223** (mapped from container's 4222)
- Healthcheck retries increased to 10 for slower CI environments

### NATS Events Not Captured

**Problem**: Event monitoring not working

**Solutions**:
```bash
# Verify NATS is running (updated port)
curl http://localhost:8222/healthz

# Check NATS monitoring
curl http://localhost:8222/varz

# Test NATS connectivity
docker exec -it nats-test nats-cli stream list
```

### Playwright Browser Issues

**Problem**: Browser not found or crashes

**Solutions**:
```bash
# Reinstall browsers
pnpm exec playwright install --with-deps chromium

# Update Playwright
pnpm update @playwright/test

# Check system dependencies (Linux)
npx playwright install-deps
```

### Database Connection Errors

**Problem**: Services can't connect to PostgreSQL

**Solutions**:
```bash
# Check PostgreSQL is healthy
docker-compose -f docker-compose.test.yml ps postgres-test

# Test connection
docker exec -it postgres-test psql -U test_user -d test_db -c "SELECT 1;"

# Check logs
docker-compose -f docker-compose.test.yml logs postgres-test
```

## 📊 Test Metrics

### Performance Targets

- **Test Suite Duration**: < 5 minutes
- **Individual Test**: < 60 seconds
- **Service Startup**: < 30 seconds
- **Order Processing**: < 10 seconds

### Success Criteria

- All tests pass in CI
- No flaky tests (consistent results)
- 100% event correlation
- All saga rollbacks successful

## 🔐 Security Considerations

### Test Data

- Use dedicated test databases
- Never use production credentials
- Clean up test data after runs
- Isolated network for test services

### Secrets Management

```bash
# Never commit secrets
# Use environment variables
export TEST_USER_EMAIL=test@example.com
export TEST_USER_PASSWORD=SecurePassword123!

# Or use .env.test (gitignored)
echo "TEST_USER_EMAIL=test@example.com" > .env.test
echo "TEST_USER_PASSWORD=SecurePassword123!" >> .env.test
```

## 📚 Additional Resources

### Documentation

- [Playwright Docs](https://playwright.dev/)
- [Testcontainers](https://testcontainers.com/)
- [NATS Documentation](https://docs.nats.io/)
- [Docker Compose](https://docs.docker.com/compose/)

### Internal Links

- [Main README](../README.md)
- [Architecture Overview](./architecture.md)
- [API Documentation](./api-docs.md)
- [Deployment Guide](./deployment.md)

## 🤝 Contributing

### Adding New Tests

1. Create test file in `apps/dashboard-client/e2e/`
2. Use existing helpers for common operations
3. Follow naming convention: `feature-name.spec.ts`
4. Add test to documentation

### Best Practices

- ✅ Use descriptive test names
- ✅ Isolate tests (no dependencies between tests)
- ✅ Clean up after each test
- ✅ Use helpers for repeated operations
- ✅ Add assertions for all important states
- ✅ Handle async operations properly
- ✅ Use `test.setTimeout()` for long operations
- ❌ Don't rely on test execution order
- ❌ Don't use hard-coded delays
- ❌ Don't skip cleanup steps

## 📞 Support

For issues or questions:

1. Check this documentation
2. Review troubleshooting section
3. Check GitHub Issues
4. Contact the development team

---

**Last Updated**: 2025-12-15
**Maintainer**: A4CO Development Team
**Version**: 1.0.0
