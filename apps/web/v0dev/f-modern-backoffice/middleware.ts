import { type NextRequest, NextResponse } from "next/server"
import { apiRateLimiter } from "@/lib/security/rate-limiter"
import { intrusionDetection } from "@/lib/security/intrusion-detection"

export function middleware(request: NextRequest) {
  const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

  // Verificar si la IP está bloqueada
  if (intrusionDetection.isIPBlocked(clientIP)) {
    return NextResponse.json({ error: "IP bloqueada por actividad sospechosa" }, { status: 403 })
  }

  // Aplicar rate limiting a las APIs
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const rateLimitResult = apiRateLimiter.checkLimit(clientIP)

    if (!rateLimitResult.allowed) {
      // Registrar exceso de rate limit
      intrusionDetection.logSecurityEvent({
        type: "rate_limit_exceeded",
        severity: "medium",
        source: clientIP,
        userAgent: request.headers.get("user-agent") || "Unknown",
        details: {
          endpoint: request.nextUrl.pathname,
          method: request.method,
        },
      })

      const response = NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

      response.headers.set("X-RateLimit-Limit", "100")
      response.headers.set("X-RateLimit-Remaining", "0")
      response.headers.set("X-RateLimit-Reset", rateLimitResult.resetTime.toString())

      return response
    }

    // Agregar headers de rate limit
    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", "100")
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString())
    response.headers.set("X-RateLimit-Reset", rateLimitResult.resetTime.toString())

    return response
  }

  // Agregar headers de seguridad
  const response = NextResponse.next()

  // Headers de seguridad (similar a Helmet.js)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // CSP (Content Security Policy)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
  )

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
