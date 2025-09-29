# Micromatch ReDoS Security Mitigation Guide

## Overview

This document outlines comprehensive security mitigations for the **micromatch — ReDoS (Moderate)** vulnerability. The vulnerability allows CPU exhaustion through complex regex patterns that can cause exponential backtracking in micromatch operations.

## Risk Assessment

### Vulnerability Details
- **CVE**: Moderate severity ReDoS in micromatch
- **Impact**: CPU exhaustion through malicious regex patterns
- **Attack Vector**: Complex glob patterns with excessive wildcards, alternations, and nested groups
- **Affected Operations**: `match()`, `isMatch()`, `makeRe()`, and other pattern matching functions

### Risk Levels
- **Low**: Simple patterns like `*.js`
- **Medium**: Patterns with moderate complexity (score 50-74)
- **High**: Complex patterns with multiple wildcards/alternations (score 75-89)
- **Critical**: Patterns exceeding complexity threshold (score ≥90)

## Security Components

### 1. MicromatchPatternValidator

Validates patterns for ReDoS vulnerabilities before execution.

```typescript
import { MicromatchPatternValidator } from '@a4co/shared-utils/security/validators/micromatch-pattern.validator';

// Validate a single pattern
const result = MicromatchPatternValidator.validatePattern('**/*/**/*');
console.log(result.riskLevel); // 'high'
console.log(result.issues);    // ['Excessive wildcard usage...']

// Validate multiple patterns
const results = MicromatchPatternValidator.validatePatterns(['*.js', '**/*']);
```

#### Key Features
- **Complexity Analysis**: Calculates pattern complexity scores
- **Risk Assessment**: Categorizes patterns as low/medium/high/critical risk
- **Issue Detection**: Identifies specific dangerous pattern elements
- **Sanitization**: Provides safe alternatives for risky patterns

### 2. MicromatchReDoSProtector

Provides runtime protection with timeouts and circuit breakers.

```typescript
import { MicromatchReDoSProtector } from '@a4co/shared-utils/security/middleware/micromatch-redos-protector';

const protector = new MicromatchReDoSProtector();

// Safe pattern matching with protection
const result = await protector.safeMatch(
  () => micromatch.match(files, patterns),
  patterns,
  { timeout: 1000, context: 'file-filtering' }
);

if (result.success) {
  console.log('Matches:', result.result);
} else {
  console.error('Operation failed:', result.error);
}
```

#### Key Features
- **Timeout Protection**: Prevents long-running operations
- **Circuit Breaker**: Stops operations after repeated failures
- **Pattern Validation**: Integrates with pattern validator
- **Statistics Tracking**: Monitors performance and failure rates

### 3. SafeMicromatch Wrapper

Drop-in replacement for micromatch with built-in security.

```typescript
import { SafeMicromatch, safeMatch, safeIsMatch } from '@a4co/shared-utils/security/utils/safe-micromatch';

// Class-based usage
const safe = new SafeMicromatch();
const matches = await safe.match(files, ['src/**/*.js']);

// Functional usage
const matches = await safeMatch(files, ['src/**/*.js']);
const isMatch = await safeIsMatch('file.js', '*.js');
```

#### Key Features
- **Drop-in Replacement**: Same API as micromatch
- **Automatic Protection**: All operations are automatically protected
- **Error Handling**: Graceful degradation on failures
- **Statistics**: Operation monitoring and reporting

## ESLint Rules

### Installation

Add to your ESLint configuration:

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['@a4co/eslint-plugin-micromatch-security'],
  rules: {
    '@a4co/micromatch-security/no-dangerous-micromatch-patterns': ['error', {
      allowRiskyPatterns: false,
      maxComplexity: 50
    }]
  }
};
```

### Detected Issues

The ESLint rule detects:
- **Excessive wildcards**: Patterns with >15 asterisks
- **Nested groups**: Patterns with deeply nested parentheses
- **Multiple alternations**: Patterns with >5 pipe characters
- **High complexity**: Patterns exceeding configurable complexity threshold

## Usage Guidelines

### 1. Pattern Validation

Always validate patterns before use:

```typescript
// ✅ Good: Validate before using
const validation = MicromatchPatternValidator.validatePattern(userPattern);
if (!validation.isValid) {
  throw new Error(`Unsafe pattern: ${validation.issues.join(', ')}`);
}

// ❌ Bad: Direct usage without validation
const matches = micromatch.match(files, userPattern);
```

### 2. Safe Operations

Use protected operations for user input:

```typescript
// ✅ Good: Use safe wrapper
const safe = new SafeMicromatch();
const matches = await safe.match(files, userPatterns);

// ❌ Bad: Direct micromatch usage
const matches = micromatch.match(files, userPatterns);
```

### 3. Timeout Configuration

Configure appropriate timeouts based on your use case:

```typescript
const protector = new MicromatchReDoSProtector();

// Fast operations (file filtering)
await protector.safeMatch(operation, patterns, { timeout: 100 });

// Complex operations (large datasets)
await protector.safeMatch(operation, patterns, { timeout: 5000 });
```

## Monitoring and Alerting

### Statistics Tracking

Monitor operation statistics:

```typescript
const stats = protector.getStats();
console.log(`Total operations: ${stats.totalOperations}`);
console.log(`Failure rate: ${(stats.failureRate * 100).toFixed(2)}%`);
console.log(`Average execution time: ${stats.averageExecutionTime}ms`);
```

### Circuit Breaker Monitoring

Track circuit breaker state:

```typescript
const stats = protector.getStats();
if (stats.circuitBreaker.state === 'open') {
  // Alert: Circuit breaker is open
  console.error('Micromatch operations are failing repeatedly');
}
```

## Testing

### Unit Tests

Run the comprehensive test suite:

```bash
# Run all micromatch security tests
pnpm run test:micromatch-security

# Run specific test file
pnpm run test packages/shared-utils/src/security/__tests__/micromatch-redos.test.ts
```

### Security Validation Script

Validate security implementation:

```bash
# Run security checks
pnpm run check:micromatch-security
```

## Migration Guide

### From Direct Micromatch Usage

```typescript
// Before (vulnerable)
import micromatch from 'micromatch';
const matches = micromatch.match(files, patterns);

// After (secure)
import { safeMatch } from '@a4co/shared-utils/security/utils/safe-micromatch';
const matches = await safeMatch(files, patterns);
```

### From Unprotected Operations

```typescript
// Before (risky)
const result = micromatch.isMatch(filename, pattern);

// After (protected)
const safe = new SafeMicromatch();
const result = await safe.isMatch(filename, pattern);
```

## Performance Considerations

### Timeout Settings
- **Fast operations** (< 100ms): 500-1000ms timeout
- **Complex operations**: 2000-5000ms timeout
- **Batch operations**: 10000ms timeout

### Circuit Breaker Configuration
- **Failure threshold**: 5 consecutive failures
- **Recovery timeout**: 60 seconds
- **Monitoring**: Track failure rates > 10%

## Troubleshooting

### Common Issues

1. **Timeout Errors**
   - Increase timeout for complex patterns
   - Validate patterns before execution
   - Consider using simpler patterns

2. **Circuit Breaker Open**
   - Check for malicious input patterns
   - Review recent failure logs
   - Reset circuit breaker after fixing issues

3. **High Complexity Warnings**
   - Simplify patterns where possible
   - Use multiple simple patterns instead of one complex one
   - Pre-validate patterns in development

### Debug Logging

Enable detailed logging:

```typescript
import { logger } from '@a4co/observability';

// Enable debug logging for security operations
logger.level = 'debug';
```

## Security Best Practices

1. **Input Validation**: Always validate user-provided patterns
2. **Timeout Protection**: Set appropriate timeouts for all operations
3. **Circuit Breakers**: Implement failure protection
4. **Monitoring**: Track operation statistics and failure rates
5. **Testing**: Include security tests in CI/CD pipeline
6. **Updates**: Keep micromatch and security libraries updated

## References

- [OWASP ReDoS Prevention](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)
- [Micromatch Documentation](https://github.com/micromatch/micromatch)
- [ReDoS Complexity Analysis](https://en.wikipedia.org/wiki/ReDoS)

---

*This mitigation framework provides comprehensive protection against micromatch ReDoS vulnerabilities while maintaining compatibility with existing code.*