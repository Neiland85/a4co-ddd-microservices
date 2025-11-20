"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPRangeBlocker = exports.URLValidator = void 0;
exports.validateRedirectURL = validateRedirectURL;
exports.validateHost = validateHost;
exports.validateQueryParams = validateQueryParams;
exports.generateSafeMiddlewareCode = generateSafeMiddlewareCode;
const url_validator_1 = require("../validators/url.validator");
Object.defineProperty(exports, "URLValidator", { enumerable: true, get: function () { return url_validator_1.URLValidator; } });
const ip_range_blocker_1 = require("../utils/ip-range-blocker");
Object.defineProperty(exports, "IPRangeBlocker", { enumerable: true, get: function () { return ip_range_blocker_1.IPRangeBlocker; } });
function validateRedirectURL(url) {
    if (!url) {
        return { isValid: true, violations: [] };
    }
    return url_validator_1.URLValidator.validateURL(url);
}
function validateHost(host) {
    if (!host) {
        return { isValid: true, violations: [] };
    }
    if (ip_range_blocker_1.IPRangeBlocker.isBlockedIP(host)) {
        return {
            isValid: false,
            violations: [`Blocked host: ${host}`]
        };
    }
    return { isValid: true, violations: [] };
}
function validateQueryParams(params) {
    const violations = [];
    for (const [param, value] of Object.entries(params)) {
        try {
            new URL(value);
            const validation = url_validator_1.URLValidator.validateURL(value);
            if (!validation.isValid) {
                violations.push(`Parameter '${param}': ${validation.violations.join(', ')}`);
            }
        }
        catch {
        }
    }
    return {
        isValid: violations.length === 0,
        violations
    };
}
function generateSafeMiddlewareCode() {
    return `import { NextRequest, NextResponse } from 'next/server';
import { validateRedirectURL, validateHost, validateQueryParams } from '@a4co/shared-utils';

export function middleware(request: NextRequest) {
  // Validar URL de redirección si existe
  const redirectUrl = request.nextUrl.searchParams.get('redirect');
  const redirectValidation = validateRedirectURL(redirectUrl);
  if (!redirectValidation.isValid) {
    return new NextResponse(
      JSON.stringify({
        error: 'Invalid redirect URL',
        violations: redirectValidation.violations
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Validar headers de host
  const host = request.headers.get('host');
  const hostValidation = validateHost(host);
  if (!hostValidation.isValid) {
    return new NextResponse(
      JSON.stringify({ error: 'Blocked host' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Validar todos los parámetros de query que parezcan URLs
  const queryParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const paramsValidation = validateQueryParams(queryParams);
  if (!paramsValidation.isValid) {
    return new NextResponse(
      JSON.stringify({
        error: 'Invalid URL parameters',
        violations: paramsValidation.violations
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  return NextResponse.next();
}`;
}
//# sourceMappingURL=nextjs-ssrf-protector.js.map