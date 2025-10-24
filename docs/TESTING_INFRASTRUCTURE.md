# Testing Infrastructure

This document describes the testing infrastructure implemented for the A4CO DDD Microservices platform.

## Overview

The testing strategy includes:

- **Unit Tests**: For domain objects, value objects, and business logic
- **Integration Tests**: For service interactions and infrastructure concerns
- **E2E Tests**: For complete user journey validation

## Test Structure

```
test/
├── e2e/                          # End-to-End tests
│   └── auth-purchase-flow.e2e-spec.ts
├── unit/                         # Unit tests (organized by service)
│   ├── product-service/
│   └── order-service/
apps/
├── *-service/
│   └── test/                     # Service-specific unit tests
│       └── *.spec.ts
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
pnpm run test

# Run unit tests for specific service
pnpm run test -- --testPathPattern=product-service

# Run with coverage
pnpm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
pnpm run test:e2e

# Run specific E2E test
pnpm run test:e2e -- --testPathPattern=auth-purchase-flow
```

## Test Categories

### Unit Tests Implemented

#### Product Service Domain Objects

- `ProductId` value object validation
- `ProductName` value object validation
- `ProductDescription` value object validation
- `Price` value object validation

#### Order Service Domain Objects

- `OrderId` value object validation
- `OrderItem` aggregate validation
- `OrderStatus` enum validation
- `OrderCreatedEvent` domain event validation

### E2E Tests Implemented

#### Basic API Connectivity Test

- Service health checks
- API contract validation
- Error handling validation

## Testing Frameworks

- **Jest**: Test runner and assertion library
- **Supertest**: HTTP endpoint testing for E2E tests
- **@nestjs/testing**: NestJS testing utilities
- **ts-jest**: TypeScript support for Jest

## Configuration

### Jest Configuration

- Root config: `jest.config.js` (monorepo setup)
- E2E config: `test/jest-e2e.config.js`
- Service configs: `apps/*/jest.config.js`

### Coverage

- Coverage reports generated in `coverage/` directory
- Minimum coverage thresholds can be configured per service

## Observability Integration

All tests include observability validation:

- Pino structured logging integration
- OpenTelemetry tracing setup
- Error handling and logging verification

## Future Enhancements

1. **Complete E2E Flow**: Implement full login → purchase → payment flow
2. **Integration Tests**: Add database and external service integration tests
3. **Performance Tests**: Add load testing and performance benchmarks
4. **Visual Regression**: Add component visual testing for design system
5. **Contract Tests**: Add API contract validation between services

## Running Tests in CI/CD

The testing infrastructure is designed to work with the existing CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Run Tests
  run: |
    pnpm install
    pnpm run test:coverage
    pnpm run test:e2e
```

## Test Data Management

- Use factories for test data creation
- Avoid database state leakage between tests
- Use in-memory databases for unit tests where possible
- Clean up test data after each test run

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Use clear, descriptive test names
3. **Arrange-Act-Assert**: Follow AAA pattern in tests
4. **Mock External Dependencies**: Use mocks for external services
5. **Test Edge Cases**: Include boundary and error conditions
6. **Maintain Test Readability**: Keep tests simple and focused
