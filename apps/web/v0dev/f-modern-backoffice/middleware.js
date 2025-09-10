"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
const server_1 = require("next/server");
const rate_limiter_1 = require("@/lib/security/rate-limiter");
const intrusion_detection_1 = require("@/lib/security/intrusion-detection");
function middleware(request) {
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    // Verificar si la IP está bloqueada
    if (intrusion_detection_1.intrusionDetection.isIPBlocked(clientIP)) {
        return server_1.NextResponse.json({ error: 'IP bloqueada por actividad sospechosa' }, { status: 403 });
    }
    // Aplicar rate limiting a las APIs
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const rateLimitResult = rate_limiter_1.apiRateLimiter.checkLimit(clientIP);
        if (!rateLimitResult.allowed) {
            // Registrar exceso de rate limit
            intrusion_detection_1.intrusionDetection.logSecurityEvent({
                type: 'rate_limit_exceeded',
                severity: 'medium',
                source: clientIP,
                userAgent: request.headers.get('user-agent') || 'Unknown',
                details: {
                    endpoint: request.nextUrl.pathname,
                    method: request.method,
                },
            });
            const response = server_1.NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
            response.headers.set('X-RateLimit-Limit', '100');
            response.headers.set('X-RateLimit-Remaining', '0');
            response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
            return response;
        }
        // Agregar headers de rate limit
        const response = server_1.NextResponse.next();
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
        return response;
    }
    // Agregar headers de seguridad
    const response = server_1.NextResponse.next();
    // Headers de seguridad (similar a Helmet.js)
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    // CSP (Content Security Policy)
    // Removed 'unsafe-eval' from script-src for improved security
    const cspHeader = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
    ].join('; ') + ';';
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
}
exports.config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
//# sourceMappingURL=middleware.js.map