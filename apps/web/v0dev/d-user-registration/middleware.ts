import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security Middleware - CVE-2025-29927 Protection
 * Blocks x-middleware-subrequest header to prevent authorization bypass
 */
export function middleware(request: NextRequest) {
  // Block CVE-2025-29927 exploit attempts
  if (request.headers.get('x-middleware-subrequest')) {
    console.warn('🚨 SECURITY: Blocked CVE-2025-29927 exploit attempt from:', 
      request.ip || 'unknown');
    
    // Log security event
    console.error('🚨 SECURITY EVENT:', {
      type: 'CVE-2025-29927_BLOCKED',
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
      url: request.url,
      timestamp: new Date().toISOString()
    });
    
    return new NextResponse('Security violation detected', { status: 403 });
  }

  // Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
