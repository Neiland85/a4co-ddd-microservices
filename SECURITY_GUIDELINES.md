# Security Guidelines

## 🔒 Environment Variables and Secrets Management

### Test Environment Variables

For testing purposes, use these environment variables instead of hardcoded credentials:

```bash
# Test credentials for unit tests
TEST_EMAIL=test@example.com
TEST_PASSWORD=TestPassword123

# Demo credentials for development
DEMO_EMAIL=test@example.com
DEMO_PASSWORD=password123

# Admin credentials for demo applications
ADMIN_EMAIL=admin@demo.com
ADMIN_PASSWORD=Admin123!
```

### Database URLs Security

**⚠️ CRITICAL: Never commit real database URLs with credentials**

```bash
# ✅ Good - Use environment variables
DATABASE_URL=postgresql://user:password@host:5432/database

# ❌ Bad - Never hardcode in source code
const dbUrl = 'postgresql://admin:EXAMPLE_PASSWORD@prod-db.com:5432/production_db';
```

**Safe patterns for tests and documentation:**

```bash
# ✅ Safe for tests - clearly marked as test data
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/test_db

# ✅ Safe for examples - generic placeholders
DATABASE_URL=postgresql://user:password@localhost:5432/database

# ❌ Dangerous - looks like real credentials
DATABASE_URL=postgresql://admin:MyCompanyPass2024@prod.company.com:5432/production
```

### Production Security

1. **Never commit real credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate secrets regularly** in production
4. **Use secure secret management** services (AWS Secrets Manager, Azure Key Vault, etc.)

## 🛡️ GitGuardian Integration

This project is integrated with GitGuardian to detect secrets in code. To avoid false positives:

### ✅ Good Practices

```typescript
// Use environment variables
const email = process.env.TEST_EMAIL || 'test@example.com';
const password = process.env.TEST_PASSWORD || 'TestPassword123';

// Use secure defaults for tests
const testCredentials = {
  email: process.env.TEST_EMAIL || 'test@example.com',
  password: process.env.TEST_PASSWORD || 'TestPassword123'
};

// Database connection - use environment variables
const dbUrl = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/db';
```

### ❌ Avoid These Patterns

```typescript
// Don't hardcode credentials
const email = 'admin@company.com';
const password = 'SuperSecretPassword123!';
const apiKey = 'sk-1234567890abcdef';

// Don't use real production data in tests
const productionDbUrl = 'postgresql://admin:RealPassword123@prod-db.com:5432/production_db';

// Don't use strong passwords in test data
const testDbUrl = 'postgresql://test:MyCompanyPass2024@localhost:5432/test_db';
```

## 🔍 Security Scanning

### GitGuardian Alerts

If GitGuardian detects secrets:

1. **Review the alert** - Check if it's a false positive
2. **Remove hardcoded secrets** - Replace with environment variables
3. **Update tests** - Use secure test credentials
4. **Document changes** - Update this file if needed

### PostgreSQL Database Security

**Specific rules for database URLs:**

- ✅ **Safe for tests**: `postgresql://test:test@localhost:5432/test_db`
- ✅ **Safe for examples**: `postgresql://user:password@localhost:5432/database`
- ❌ **Dangerous**: `postgresql://admin:MyCompanyPass2024@prod.company.com:5432/production`

**GitGuardian will detect:**
- URLs with strong passwords (8+ characters with special characters)
- URLs pointing to production hosts
- URLs with real company domains

### Regular Security Audits

```bash
# Run security audits
npm audit

# Check for vulnerabilities
npm audit --audit-level=moderate

# Fix automatically fixable issues
npm audit fix
```

## 📝 Testing Best Practices

### Unit Tests

```typescript
// ✅ Good: Use environment variables
describe('User Authentication', () => {
  it('should authenticate with valid credentials', () => {
    const email = process.env.TEST_EMAIL || 'test@example.com';
    const password = process.env.TEST_PASSWORD || 'TestPassword123';
    
    // Test logic here
  });
});
```

### Integration Tests

```typescript
// ✅ Good: Use test database
const testDbUrl = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

// ❌ Bad: Don't use production database
const prodDbUrl = 'postgresql://admin:RealPassword123@prod-db.com:5432/production_db';
```

## 🚨 Incident Response

If secrets are accidentally committed:

1. **Immediately revoke** the exposed credentials
2. **Rotate all related secrets**
3. **Update environment variables**
4. **Review GitGuardian alerts**
5. **Document the incident**

## 📚 Additional Resources

- [GitGuardian Documentation](https://docs.gitguardian.com/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [PostgreSQL Security Documentation](https://www.postgresql.org/docs/current/security.html)

---

**Last Updated**: August 2, 2025
**Status**: ✅ Active
**Next Review**: Monthly security audit