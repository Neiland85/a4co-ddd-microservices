"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const auth_1 = require("@/lib/security/auth");
const rate_limiter_1 = require("@/lib/security/rate-limiter");
const intrusion_detection_1 = require("@/lib/security/intrusion-detection");
const validator_1 = require("@/lib/security/validator");
async function POST(request) {
    try {
        const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        // Verificar rate limiting
        const rateLimitResult = rate_limiter_1.loginRateLimiter.checkLimit(clientIP);
        if (!rateLimitResult.allowed) {
            // Registrar intento de fuerza bruta
            intrusion_detection_1.intrusionDetection.logSecurityEvent({
                type: 'login_attempt',
                severity: 'high',
                source: clientIP,
                userAgent,
                details: {
                    reason: 'rate_limit_exceeded',
                    attempts: 'exceeded',
                },
            });
            return server_1.NextResponse.json({
                error: 'Demasiados intentos de login',
                resetTime: rateLimitResult.resetTime,
            }, { status: 429 });
        }
        const body = await request.json();
        // Validar entrada
        const validatedData = auth_1.loginSchema.parse(body);
        // Detectar patrones sospechosos
        const suspiciousPatterns = validator_1.InputValidator.detectSuspiciousPatterns(JSON.stringify(validatedData));
        if (suspiciousPatterns.length > 0) {
            intrusion_detection_1.intrusionDetection.logSecurityEvent({
                type: 'suspicious_activity',
                severity: 'medium',
                source: clientIP,
                userAgent,
                details: {
                    patterns: suspiciousPatterns,
                    endpoint: '/api/auth/login',
                },
            });
        }
        // Simular autenticación
        if (validatedData.email === 'admin@demo.com' && validatedData.password === 'Admin123!') {
            const token = auth_1.authService.generateToken({
                userId: '1',
                email: validatedData.email,
                role: 'admin',
                sessionId: crypto.randomUUID(),
            });
            // Registrar login exitoso
            intrusion_detection_1.intrusionDetection.logSecurityEvent({
                type: 'login_attempt',
                severity: 'low',
                source: clientIP,
                userAgent,
                userId: '1',
                details: {
                    success: true,
                    email: validatedData.email,
                },
            });
            return server_1.NextResponse.json({
                success: true,
                token,
                user: {
                    id: '1',
                    email: validatedData.email,
                    name: 'Administrador Demo',
                    role: 'admin',
                },
            });
        }
        else {
            // Registrar intento fallido
            intrusion_detection_1.intrusionDetection.logSecurityEvent({
                type: 'login_attempt',
                severity: 'medium',
                source: clientIP,
                userAgent,
                details: {
                    success: false,
                    email: validatedData.email,
                    reason: 'invalid_credentials',
                },
            });
            return server_1.NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }
    }
    catch (error) {
        console.error('Error en login:', error);
        return server_1.NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map