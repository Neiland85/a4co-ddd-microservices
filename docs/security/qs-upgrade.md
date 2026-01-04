# Security Mitigation: qs Package DoS Vulnerability

## Vulnerability Summary

- **CVE**: CVE-2025-15284
- **Package**: `qs` (Query String parser for Node.js)
- **Severity**: High (Denial of Service)
- **GHSA**: GHSA-6rw7-vpxm-498p

## Description

The `qs` package versions prior to 6.14.1 are vulnerable to a Denial of Service
(DoS) attack via the `arrayLimit` bypass in bracket notation.

The vulnerability allows an attacker to bypass the `arrayLimit` protection when
using bracket notation (`a[]=...`) instead of indexed arrays (`a[0]=...`). This
can lead to unbounded array creation, causing memory exhaustion and potential
server crashes.

### Attack Vector

A malicious actor can craft HTTP requests with query strings using bracket
notation to create extremely large arrays, bypassing the intended `arrayLimit`
protection:

```text
# This was limited by arrayLimit
?a[0]=1&a[1]=2&a[2]=3...

# This bypassed the limit (vulnerable)
?a[]=1&a[]=2&a[]=3... (unlimited)
```

## Affected Components

The following dependencies in this monorepo used `qs` indirectly:

- `express` via `body-parser`
- `@nestjs/platform-express` via `express`
- `@nestjs/swagger` via `@nestjs/core`

## Mitigation Applied

### Solution

Added `pnpm.overrides` in the root `package.json` to force all `qs` dependencies
to use version >= 6.14.1:

```json
{
  "pnpm": {
    "overrides": {
      "qs": ">=6.14.1"
    }
  }
}
```

### Verification

After applying the fix, run:

```bash
pnpm why qs
```

Expected output should show only `qs@6.14.1` or higher versions.

### Files Modified

- `package.json`: Added `pnpm.overrides` section
- `pnpm-lock.yaml`: Regenerated with updated `qs` resolution

## Timeline

- **Vulnerability Disclosed**: 2025
- **Fix Applied**: 2026-01-04
- **Method**: pnpm overrides

## References

- [GitHub Advisory GHSA-6rw7-vpxm-498p](https://github.com/advisories/GHSA-6rw7-vpxm-498p)
- [NVD CVE-2025-15284](https://nvd.nist.gov/vuln/detail/CVE-2025-15284)
- [qs npm package](https://www.npmjs.com/package/qs)
- [Fix commit in qs](https://github.com/ljharb/qs/commit/3086902ecf7f088d0d1803887643ac6c03d415b9)

## Additional Security Recommendations

1. **Regular Dependency Audits**: Run `pnpm audit` regularly to identify new
   vulnerabilities
2. **Automated Scanning**: Enable Dependabot or similar tools for automatic
   security updates
3. **Version Pinning**: Consider pinning critical security dependencies to
   specific versions
