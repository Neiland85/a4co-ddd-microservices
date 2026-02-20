import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantValidationMiddleware implements NestMiddleware {
  use(req: Request & { tenantId?: string }, _res: Response, next: NextFunction): void {
    const tenantId = req.header('x-tenant-id');
    const userTenantId = req.header('x-user-tenant-id');

    if (!tenantId || !userTenantId) {
      throw new UnauthorizedException('Tenant headers are required');
    }

    if (tenantId !== userTenantId) {
      throw new ForbiddenException('User cannot access a different tenant');
    }

    req.tenantId = tenantId;
    next();
  }
}
