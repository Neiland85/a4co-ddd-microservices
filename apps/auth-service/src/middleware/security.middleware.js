"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityLoggingMiddleware = exports.InputValidationMiddleware = exports.LoginRateLimitMiddleware = exports.SecurityMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const rateLimit = __importStar(require("express-rate-limit"));
const helmet = __importStar(require("helmet"));
const cors = __importStar(require("cors"));
let SecurityMiddleware = class SecurityMiddleware {
    rateLimiter;
    jwtService;
    configService;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        // Configurar rate limiting
        this.rateLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutos
            max: 100, // máximo 100 requests por ventana
            message: {
                error: 'Too many requests from this IP, please try again later.',
                retryAfter: '15 minutes',
            },
            standardHeaders: true,
            legacyHeaders: false,
            skipSuccessfulRequests: false,
            skipFailedRequests: false,
            keyGenerator: req => {
                // Usar IP + User ID si está autenticado
                return req.user?.id ? `${req.ip}-${req.user.id}` : req.ip;
            },
        });
    }
    use(req, res, next) {
        // Aplicar rate limiting
        this.rateLimiter(req, res, (err) => {
            if (err) {
                throw new common_1.HttpException('Rate limit exceeded', common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
        });
        // Configurar CORS
        const corsOptions = {
            origin: this.configService.get('CORS_ORIGINS', '*').split(','),
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            credentials: true,
            maxAge: 86400, // 24 horas
        };
        cors(corsOptions)(req, res, () => { });
        // Configurar Helmet para cabeceras de seguridad
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"],
                },
            },
            hsts: {
                maxAge: 31536000, // 1 año
                includeSubDomains: true,
                preload: true,
            },
            noSniff: true,
            referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        })(req, res, () => { });
        // Validar JWT si la ruta lo requiere
        if (this.requiresAuth(req.path)) {
            this.validateJWT(req, res, next);
        }
        else {
            next();
        }
    }
    requiresAuth(path) {
        // Rutas que requieren autenticación
        const protectedRoutes = [
            '/auth/profile',
            '/auth/change-password',
            '/auth/logout',
            '/auth/refresh',
        ];
        // Rutas que NO requieren autenticación
        const publicRoutes = [
            '/auth/login',
            '/auth/register',
            '/auth/forgot-password',
            '/auth/reset-password',
            '/health',
            '/metrics',
        ];
        // Verificar si la ruta está protegida
        return (protectedRoutes.some(route => path.startsWith(route)) ||
            !publicRoutes.some(route => path.startsWith(route)));
    }
    validateJWT(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new common_1.HttpException('Authorization header missing', common_1.HttpStatus.UNAUTHORIZED);
            }
            const [bearer, token] = authHeader.split(' ');
            if (bearer !== 'Bearer' || !token) {
                throw new common_1.HttpException('Invalid authorization header format', common_1.HttpStatus.UNAUTHORIZED);
            }
            // Verificar y decodificar JWT
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
                algorithms: ['HS256'],
            });
            // Agregar información del usuario al request
            req.user = payload;
            // Verificar si el token no ha expirado
            if (payload.exp && Date.now() >= payload.exp * 1000) {
                throw new common_1.HttpException('Token expired', common_1.HttpStatus.UNAUTHORIZED);
            }
            // Verificar si el usuario está activo
            if (payload.isActive === false) {
                throw new common_1.HttpException('User account is deactivated', common_1.HttpStatus.FORBIDDEN);
            }
            next();
        }
        catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw new common_1.HttpException('Invalid token', common_1.HttpStatus.UNAUTHORIZED);
            }
            else if (error.name === 'TokenExpiredError') {
                throw new common_1.HttpException('Token expired', common_1.HttpStatus.UNAUTHORIZED);
            }
            else if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                throw new common_1.HttpException('Authentication failed', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
    }
};
exports.SecurityMiddleware = SecurityMiddleware;
exports.SecurityMiddleware = SecurityMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService])
], SecurityMiddleware);
// Middleware específico para rate limiting de login
let LoginRateLimitMiddleware = class LoginRateLimitMiddleware {
    loginRateLimiter;
    constructor() {
        // Rate limiting más estricto para login
        this.loginRateLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutos
            max: 5, // máximo 5 intentos de login por IP
            message: {
                error: 'Too many login attempts, please try again later.',
                retryAfter: '15 minutes',
            },
            standardHeaders: true,
            legacyHeaders: false,
            skipSuccessfulRequests: true, // No contar logins exitosos
            keyGenerator: req => req.ip,
            handler: (req, res) => {
                res.status(429).json({
                    error: 'Too many login attempts',
                    retryAfter: '15 minutes',
                    timestamp: new Date().toISOString(),
                });
            },
        });
    }
    use(req, res, next) {
        if (req.path === '/auth/login' && req.method === 'POST') {
            this.loginRateLimiter(req, res, next);
        }
        else {
            next();
        }
    }
};
exports.LoginRateLimitMiddleware = LoginRateLimitMiddleware;
exports.LoginRateLimitMiddleware = LoginRateLimitMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoginRateLimitMiddleware);
// Middleware para validación de entrada
let InputValidationMiddleware = class InputValidationMiddleware {
    use(req, res, next) {
        // Sanitizar entrada
        this.sanitizeInput(req.body);
        this.sanitizeInput(req.query);
        this.sanitizeInput(req.params);
        // Validar tamaño de payload
        const contentLength = parseInt(req.headers['content-length'] || '0');
        const maxPayloadSize = 1024 * 1024; // 1MB
        if (contentLength > maxPayloadSize) {
            throw new common_1.HttpException('Payload too large', common_1.HttpStatus.PAYLOAD_TOO_LARGE);
        }
        next();
    }
    sanitizeInput(obj) {
        if (!obj || typeof obj !== 'object')
            return;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'string') {
                    // Remover caracteres peligrosos
                    obj[key] = obj[key]
                        .replace(/[<>]/g, '') // Remover < y >
                        .replace(/javascript:/gi, '') // Remover javascript:
                        .replace(/on\w+=/gi, '') // Remover event handlers
                        .trim();
                }
                else if (typeof obj[key] === 'object') {
                    this.sanitizeInput(obj[key]);
                }
            }
        }
    }
};
exports.InputValidationMiddleware = InputValidationMiddleware;
exports.InputValidationMiddleware = InputValidationMiddleware = __decorate([
    (0, common_1.Injectable)()
], InputValidationMiddleware);
// Middleware para logging de seguridad
let SecurityLoggingMiddleware = class SecurityLoggingMiddleware {
    use(req, res, next) {
        const startTime = Date.now();
        // Log de request
        console.log(`[SECURITY] ${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.headers['user-agent']}`);
        // Log de autenticación
        if (req.user) {
            console.log(`[SECURITY] Authenticated user: ${req.user.id} - Role: ${req.user.role}`);
        }
        // Interceptar response para logging
        const originalSend = res.send;
        res.send = function (data) {
            const duration = Date.now() - startTime;
            console.log(`[SECURITY] ${req.method} ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms`);
            // Log de errores de seguridad
            if (res.statusCode >= 400) {
                console.error(`[SECURITY] Error on ${req.method} ${req.path}: ${res.statusCode} - ${data}`);
            }
            return originalSend.call(this, data);
        };
        next();
    }
};
exports.SecurityLoggingMiddleware = SecurityLoggingMiddleware;
exports.SecurityLoggingMiddleware = SecurityLoggingMiddleware = __decorate([
    (0, common_1.Injectable)()
], SecurityLoggingMiddleware);
//# sourceMappingURL=security.middleware.js.map