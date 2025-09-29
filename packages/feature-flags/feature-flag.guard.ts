import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProductionFeatureFlagService } from './production-feature-flag.service';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private featureFlagService: ProductionFeatureFlagService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFlag = this.reflector.get<string>('featureFlag', context.getHandler());

    if (!requiredFlag) {
      return true; // No flag required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || request.headers['x-user-id'];

    const isEnabled = await this.featureFlagService.isEnabled(requiredFlag, userId);

    if (!isEnabled) {
      // Log access attempt for disabled feature
      console.log(`🚫 Access denied to feature '${requiredFlag}' for user ${userId || 'anonymous'}`);
    }

    return isEnabled;
  }
}

// Decorador para usar en controladores
export const FeatureFlag = (flagName: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('featureFlag', flagName, descriptor.value);
  };
};
