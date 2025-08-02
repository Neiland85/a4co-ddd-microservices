import { authService, loginSchema } from "@/lib/security/auth";
import { loginRateLimiter } from "@/lib/security/rate-limiter";
import { intrusionDetection } from "@/lib/security/intrusion-detection";
import { InputValidator } from "@/lib/security/validator";

export async function POST(request: Request) {
  try {
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = request.headers.get("user-agent") || "Unknown"

    // Verificar limitación de tasa (rate limiting)
    const rateLimitResult = loginRateLimiter.checkLimit(
      Array.isArray(clientIP) ? clientIP[0] : clientIP
    )
    if (!rateLimitResult.allowed) {
      // Registrar intento de fuerza bruta
      intrusionDetection.logSecurityEvent({
        type: "login_attempt",
        severity: "high",
        source: clientIP,
        userAgent,
        details: {
          reason: "rate_limit_exceeded",
          attempts: "exceeded",
        },
      })

      return new Response(
        JSON.stringify({
          error: "Demasiados intentos de login",
          resetTime: rateLimitResult.resetTime,
        }),
        { status: 429 },
      )
    }

    const body = await request.json()

    // Validar entrada
    const validatedData = loginSchema.parse(body)

    // Detectar patrones sospechosos
    const suspiciousPatterns = InputValidator.detectSuspiciousPatterns(JSON.stringify(validatedData))

    if (suspiciousPatterns.length > 0) {
      intrusionDetection.logSecurityEvent({
        type: "suspicious_activity",
        severity: "medium",
        source: clientIP,
        userAgent,
        details: {
          patterns: suspiciousPatterns,
          endpoint: "/api/auth/login",
        },
      })
    }

    // Simular autenticación
    if (validatedData.email === process.env.ADMIN_EMAIL && validatedData.password === process.env.ADMIN_PASSWORD) {
      const token = authService.generateToken({
        userId: "1",
        email: validatedData.email,
        role: "admin",
        sessionId: crypto.randomUUID(),
      })

      // Registrar login exitoso
      intrusionDetection.logSecurityEvent({
        type: "login_attempt",
        severity: "low",
        source: clientIP,
        userAgent,
        userId: "1",
        details: {
          success: true,
          email: validatedData.email,
        },
      })

      return new Response(
        JSON.stringify({
          success: true,
          token,
          user: {
            id: "1",
            email: validatedData.email,
            name: "Administrador Demo",
            role: "admin",
          },
        }),
        { status: 200 },
      )
    } else {
      // Registrar intento fallido
      intrusionDetection.logSecurityEvent({
        type: "login_attempt",
        severity: "medium",
        source: clientIP,
        userAgent,
        details: {
          success: false,
          email: validatedData.email,
          reason: "invalid_credentials",
        },
      })

      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Error en login:", error)
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 },
    )
  }
}
