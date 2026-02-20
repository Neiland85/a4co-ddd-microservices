import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { TenantValidationMiddleware } from './tenant-validation.middleware';

describe('TenantValidationMiddleware', () => {
  const middleware = new TenantValidationMiddleware();

  it('should attach tenantId when tenant headers match', () => {
    const req = {
      header: (name: string) => (name === 'x-tenant-id' || name === 'x-user-tenant-id' ? 'tenant-1' : undefined),
      tenantId: undefined as string | undefined,
    };
    const next = jest.fn();

    middleware.use(req as any, {} as any, next);

    expect(req.tenantId).toBe('tenant-1');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should throw UnauthorizedException when tenant headers are missing', () => {
    const req = { header: () => undefined };

    expect(() => middleware.use(req as any, {} as any, jest.fn())).toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException when tenant headers do not match', () => {
    const req = {
      header: (name: string) => (name === 'x-tenant-id' ? 'tenant-a' : name === 'x-user-tenant-id' ? 'tenant-b' : undefined),
    };

    expect(() => middleware.use(req as any, {} as any, jest.fn())).toThrow(ForbiddenException);
  });
});
