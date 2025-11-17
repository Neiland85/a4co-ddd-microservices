import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

// Extender la interfaz Request para incluir la propiedad user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role?: string;
      };
    }
  }
}

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private rateLimiter: any;
  private jwtService: JwtService;
  private configService: ConfigService;

  constructor(jwtService: JwtService, configService: ConfigService) {
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
        return req.user?.id ? `${req.ip || 'unknown'}-${req.user.id}` : req.ip || 'unknown';
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Aplicar rate limiting
    this.rateLimiter(req, res, (err: any) => {
      if (err) {
        throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
      }
    });

    // Validar JWT si la ruta lo requiere
    if (this.requiresAuth(req.path)) {
      this.validateJWT(req, res, next);
    } else {
      next();
    }
  }

  private requiresAuth(path: string): boolean {
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
    return (
      protectedRoutes.some(route => path.startsWith(route)) ||
      !publicRoutes.some(route => path.startsWith(route))
    );
  }

  private validateJWT(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new HttpException('Authorization header missing', HttpStatus.UNAUTHORIZED);
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new HttpException('Invalid authorization header format', HttpStatus.UNAUTHORIZED);
      }

      // Verificar y decodificar JWT
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        algorithms: ['HS256'],
      });

      // Agregar información del usuario al request
      req.user = payload;

      // Verificar si el token no ha expirado
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
      }

      // Verificar si el usuario está activo
      if (payload.isActive === false) {
        throw new HttpException('User account is deactivated', HttpStatus.FORBIDDEN);
      }

      next();
    } catch (error) {
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      } else if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
      } else if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}

// Middleware específico para rate limiting de login
@Injectable()
export class LoginRateLimitMiddleware implements NestMiddleware {
  private loginRateLimiter: any;

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
      keyGenerator: req => req.ip || 'unknown',
      handler: (req, res) => {
        res.status(429).json({
          error: 'Too many login attempts',
          retryAfter: '15 minutes',
          timestamp: new Date().toISOString(),
        });
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/auth/login' && req.method === 'POST') {
      this.loginRateLimiter(req, res, next);
    } else {
      next();
    }
  }
}

// Middleware para validación de entrada
@Injectable()
export class InputValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Sanitizar entrada
    this.sanitizeInput(req.body);
    this.sanitizeInput(req.query);
    this.sanitizeInput(req.params);

    // Validar tamaño de payload
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxPayloadSize = 1024 * 1024; // 1MB

    if (contentLength > maxPayloadSize) {
      throw new HttpException('Payload too large', HttpStatus.PAYLOAD_TOO_LARGE);
    }

    next();
  }

  private sanitizeInput(obj: any) {
    if (!obj || typeof obj !== 'object') return;

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          // Remover caracteres peligrosos
          obj[key] = obj[key]
            .replace(/[<>]/g, '') // Remover < y >
            .replace(/javascript:/gi, '') // Remover javascript:
            .replace(/on\w+=/gi, '') // Remover event handlers
            .trim();
        } else if (typeof obj[key] === 'object') {
          this.sanitizeInput(obj[key]);
        }
      }
    }
  }
}

// Middleware para logging de seguridad
@Injectable()
export class SecurityLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // Log de request
    console.log(
      `[SECURITY] ${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.headers['user-agent']}`
    );

    // Log de autenticación
    if (req.user) {
      console.log(`[SECURITY] Authenticated user: ${req.user.id} - Role: ${req.user.role}`);
    }

    // Interceptar response para logging
    const originalSend = res.send;
    res.send = function (data) {
      const duration = Date.now() - startTime;
      console.log(
        `[SECURITY] ${req.method} ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms`
      );

      // Log de errores de seguridad
      if (res.statusCode >= 400) {
        console.error(`[SECURITY] Error on ${req.method} ${req.path}: ${res.statusCode} - ${data}`);
      }

      return originalSend.call(this, data);
    };

    next();
  }
}
