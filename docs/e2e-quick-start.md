# E2E Tests - Quick Start Guide

## 🚀 Running Tests in 3 Steps

### Step 1: Prerequisites

Ensure you have:
- Docker and Docker Compose installed
- Node.js 22+ and pnpm 10.14.0+
- At least 8GB of RAM

### Step 2: Run the Test Script

```bash
# From project root
./scripts/run-e2e-tests.sh
```

That's it! The script will:
1. ✅ Check prerequisites
2. ✅ Start Docker services
3. ✅ Install Playwright browsers (if needed)
4. ✅ Run all E2E tests
5. ✅ Cleanup services
6. ✅ Show results

### Step 3: View Results

```bash
# Open HTML report
cd apps/dashboard-client
pnpm run test:e2e:report
```

## 🎮 Advanced Usage

### Run with Different Modes

```bash
# Interactive UI mode (recommended for debugging)
./scripts/run-e2e-tests.sh --ui

# Headed mode (see browser)
./scripts/run-e2e-tests.sh --headed

# Debug mode
./scripts/run-e2e-tests.sh --debug

# Keep services running after tests
./scripts/run-e2e-tests.sh --no-cleanup

# Show report after tests
./scripts/run-e2e-tests.sh --report
```

### Run Specific Tests

```bash
cd apps/dashboard-client

# Run specific test file
pnpm exec playwright test order-flow.spec.ts

# Run specific test case
pnpm exec playwright test -g "should authenticate user"

# Run tests matching pattern
pnpm exec playwright test -g "Authentication"
```

### Manual Setup

If you prefer manual control:

```bash
# 1. Start services
docker compose -f docker-compose.test.yml up -d

# 2. Wait for services to be ready
sleep 30

# 3. Run tests
cd apps/dashboard-client
pnpm run test:e2e

# 4. View report
pnpm run test:e2e:report

# 5. Cleanup
cd ../..
docker compose -f docker-compose.test.yml down -v
```

## 📊 Understanding Test Results

### Successful Run

```
✅ Tests completed successfully!

╔════════════════════════════════════════════════════════════╗
║  E2E Tests Completed Successfully! ✅                      ║
╚════════════════════════════════════════════════════════════╝
```

### Failed Run

```
❌ Tests failed with exit code 1

╔════════════════════════════════════════════════════════════╗
║  E2E Tests Failed ❌                                       ║
╚════════════════════════════════════════════════════════════╝

View detailed report: pnpm run test:e2e:report
View logs: docker compose -f docker-compose.test.yml logs
```

## 🐛 Quick Troubleshooting

### Services Not Starting

```bash
# Check Docker
docker ps

# Check ports
lsof -i :8081  # Gateway
lsof -i :3001  # Dashboard

# Restart services
docker compose -f docker-compose.test.yml restart
```

### Tests Timing Out

```bash
# Increase timeout
cd apps/dashboard-client
TEST_TIMEOUT=120000 pnpm run test:e2e
```

### See Service Logs

```bash
# All services
docker compose -f docker-compose.test.yml logs -f

# Specific service
docker compose -f docker-compose.test.yml logs gateway-test
docker compose -f docker-compose.test.yml logs order-service-test
```

## 📝 Test Coverage

The E2E suite includes **14 tests** covering:

1. ✅ User Authentication (2 tests)
2. ✅ Product Catalog (2 tests)
3. ✅ Order Creation (2 tests)
4. ✅ Payment Processing (2 tests)
5. ✅ Order Confirmation (1 test)
6. ✅ Happy Path Flow (1 test)
7. ✅ Saga Rollback (2 tests)
8. ✅ Event Traceability (2 tests)

## 🔗 More Resources

- [Complete E2E Testing Guide](./e2e-tests.md)
- [Dashboard Client E2E README](../apps/dashboard-client/e2e/README.md)
- [Playwright Documentation](https://playwright.dev/)

## 💡 Tips

1. **First Run**: May take longer due to Docker image downloads
2. **CI/CD**: Tests run automatically on PRs to main/develop
3. **Development**: Use `--ui` mode for interactive debugging
4. **Speed**: Use `--no-cleanup` when running multiple times
5. **Reports**: HTML reports include screenshots and traces

---

**Need Help?** See the [troubleshooting section](./e2e-tests.md#troubleshooting) in the complete guide.
