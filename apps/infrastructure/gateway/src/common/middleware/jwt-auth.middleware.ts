import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify, type JwtPayload as JsonWebTokenPayload } from 'jsonwebtoken';

export type JwtPayload = JsonWebTokenPayload & { sub: string };

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    try {
      const decoded = verify(
        token,
        process.env.JWT_SECRET || 'dev-secret',
      ) as JwtPayload;

      (req as any).user = decoded;
      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
