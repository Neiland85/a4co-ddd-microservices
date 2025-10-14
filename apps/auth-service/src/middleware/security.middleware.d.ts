import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class SecurityMiddleware implements NestMiddleware {
    private rateLimiter;
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    use(req: Request, res: Response, next: NextFunction): void;
    private requiresAuth;
    private validateJWT;
}
export declare class LoginRateLimitMiddleware implements NestMiddleware {
    private loginRateLimiter;
    constructor();
    use(req: Request, res: Response, next: NextFunction): void;
}
export declare class InputValidationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
    private sanitizeInput;
}
export declare class SecurityLoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
//# sourceMappingURL=security.middleware.d.ts.map