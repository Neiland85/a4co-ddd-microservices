import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { verify, type JwtPayload as JsonWebTokenPayload } from 'jsonwebtoken';

export type JwtPayload = JsonWebTokenPayload & { sub: string; email?: string; role?: string };

const PUBLIC_PATHS = [
  '/api/v1/auth',
  '/api/v1/health',
  '/api/docs',
  '/api/v1/products',
];

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  private readonly jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET environment variable must be set');
    }
    this.jwtSecret = secret;
  }

  use(req: Request, _res: Response, next: NextFunction): void {
    if (PUBLIC_PATHS.some((path) => req.path.startsWith(path))) {
      return next();
    }

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    try {
      const decoded = verify(token, this.jwtSecret) as JwtPayload;

      (req as any).user = decoded;
      (req as any).userId = decoded.sub;
      req.headers['x-user-id'] = decoded.sub;
      req.headers['x-user-email'] = decoded.email ?? '';
      req.headers['x-user-role'] = decoded.role ?? '';
      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
