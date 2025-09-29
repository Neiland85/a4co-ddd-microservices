/**
 * Utilidades de protección SSRF para Next.js
 * Proporciona validadores y generadores de código seguro
 */

import { URLValidator } from '../validators/url.validator';
import { IPRangeBlocker } from '../utils/ip-range-blocker';

// Re-exportar validadores para uso directo
export { URLValidator, IPRangeBlocker };

/**
 * Valida una URL de redirección para uso en middleware Next.js
 */
export function validateRedirectURL(url: string | null): { isValid: boolean; violations: string[] } {
  if (!url) {
    return { isValid: true, violations: [] };
  }

  return URLValidator.validateURL(url);
}

/**
 * Valida un host para verificar que no sea una IP bloqueada
 */
export function validateHost(host: string | null): { isValid: boolean; violations: string[] } {
  if (!host) {
    return { isValid: true, violations: [] };
  }

  if (IPRangeBlocker.isBlockedIP(host)) {
    return {
      isValid: false,
      violations: [`Blocked host: ${host}`]
    };
  }

  return { isValid: true, violations: [] };
}

/**
 * Valida parámetros de query que contengan URLs
 */
export function validateQueryParams(params: Record<string, string>): { isValid: boolean; violations: string[] } {
  const violations: string[] = [];

  for (const [param, value] of Object.entries(params)) {
    // Verificar si el valor parece una URL
    try {
      new URL(value);
      const validation = URLValidator.validateURL(value);
      if (!validation.isValid) {
        violations.push(`Parameter '${param}': ${validation.violations.join(', ')}`);
      }
    } catch {
      // No es una URL, continuar
    }
  }

  return {
    isValid: violations.length === 0,
    violations
  };
}

/**
 * Genera código de middleware Next.js seguro contra SSRF
 * Este código debe copiarse a un archivo middleware.ts en aplicaciones Next.js
 */
export function generateSafeMiddlewareCode(): string {
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
