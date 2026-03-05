import { Injectable, InternalServerErrorException, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

export type AuthenticatedUser = JwtPayload;

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

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT secret is not configured');
    }

    try {
      const decoded = verify(token, jwtSecret) as AuthenticatedUser;

      (req as any).user = decoded;
      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
