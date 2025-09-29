import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductionFeatureFlagService } from './production-feature-flag.service';

@Injectable()
export class FeatureFlagInterceptor implements NestInterceptor {
  constructor(private featureFlagService: ProductionFeatureFlagService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const userId = request.user?.id || request.headers['x-user-id'];

    return next.handle().pipe(
      tap(async (data) => {
        // Agregar headers de feature flags activas
        const allFlags = await this.featureFlagService.getAllFlags();
        response.header('X-Feature-Flags', JSON.stringify(allFlags));

        // Log de uso de features
        const handler = context.getHandler();
        const featureFlag = Reflect.getMetadata('featureFlag', handler);
        if (featureFlag && userId) {
          console.log(`✅ Feature '${featureFlag}' used by user ${userId}`);
        }
      }),
    );
  }
}
