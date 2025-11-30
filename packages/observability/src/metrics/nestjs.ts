/**
 * NestJS metrics module for automatic HTTP metrics collection
 * Provides a NestJS interceptor and module for seamless integration
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Module,
  DynamicModule,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  initializeStandardMetrics,
  getStandardMetrics,
  shutdownStandardMetrics,
  type StandardMetricsConfig,
} from './standardMetrics';

/**
 * NestJS interceptor for automatic HTTP metrics collection
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = process.hrtime.bigint();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    let metricsInstance;
    try {
      metricsInstance = getStandardMetrics();
    } catch {
      // Metrics not initialized, skip collection
      return next.handle();
    }

    // Increment active requests
    metricsInstance.httpActiveRequests.add(1);

    return next.handle().pipe(
      tap({
        next: () => {
          this.recordMetrics(request, response, startTime, metricsInstance);
        },
        error: () => {
          this.recordMetrics(request, response, startTime, metricsInstance);
        },
      })
    );
  }

  private recordMetrics(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: Record<string, unknown>,
    startTime: bigint,
    metricsInstance: ReturnType<typeof getStandardMetrics>
  ): void {
    const endTime = process.hrtime.bigint();
    const durationNanos = Number(endTime - startTime);
    const durationSeconds = durationNanos / 1e9;

    const method = (request.method as string) || 'UNKNOWN';
    const route = (request.route as { path?: string })?.path || (request.url as string) || 'unknown';
    const statusCode = (response.statusCode as number) || 500;

    const labels = {
      method,
      route,
      status_code: String(statusCode),
      status_class: `${Math.floor(statusCode / 100)}xx`,
    };

    metricsInstance.httpRequestsTotal.add(1, labels);
    metricsInstance.requestDurationSeconds.record(durationSeconds, labels);
    metricsInstance.httpActiveRequests.add(-1);
  }
}

/**
 * NestJS metrics service for programmatic access to metrics
 */
@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
  private config: StandardMetricsConfig;
  private initialized = false;

  constructor() {
    this.config = {
      serviceName: 'unknown-service',
    };
  }

  setConfig(config: StandardMetricsConfig): void {
    this.config = config;
  }

  onModuleInit(): void {
    if (!this.initialized) {
      try {
        initializeStandardMetrics(this.config);
        this.initialized = true;
      } catch (error) {
        console.warn('Failed to initialize metrics:', error);
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.initialized) {
      await shutdownStandardMetrics();
      this.initialized = false;
    }
  }

  /**
   * Record a commerce listing
   */
  recordCommerceListed(commerceType?: string): void {
    try {
      const metricsInstance = getStandardMetrics();
      metricsInstance.commerceListedTotal.add(1, { commerce_type: commerceType || 'unknown' });
    } catch {
      // Metrics not initialized
    }
  }

  /**
   * Record a nearby promo request
   */
  recordPromoNearbyRequest(promoType?: string): void {
    try {
      const metricsInstance = getStandardMetrics();
      metricsInstance.promoNearbyRequestTotal.add(1, { promo_type: promoType || 'unknown' });
    } catch {
      // Metrics not initialized
    }
  }

  /**
   * Record a database query
   */
  recordDbQuery(operation: string, table: string, durationSeconds: number, success: boolean): void {
    try {
      const metricsInstance = getStandardMetrics();
      const labels = {
        operation,
        table,
        success: String(success),
      };

      metricsInstance.dbQueryTotal.add(1, labels);
      metricsInstance.dbQueryDurationSeconds.record(durationSeconds, labels);

      if (!success) {
        metricsInstance.dbQueryErrors.add(1, labels);
      }
    } catch {
      // Metrics not initialized
    }
  }
}

/**
 * Module configuration options
 */
export interface MetricsModuleOptions extends StandardMetricsConfig {
  isGlobal?: boolean;
}

/**
 * NestJS metrics module
 */
@Module({})
export class MetricsModule {
  static forRoot(options: MetricsModuleOptions): DynamicModule {
    return {
      module: MetricsModule,
      global: options.isGlobal ?? true,
      providers: [
        {
          provide: 'METRICS_CONFIG',
          useValue: options,
        },
        {
          provide: MetricsService,
          useFactory: () => {
            const service = new MetricsService();
            service.setConfig(options);
            return service;
          },
        },
        MetricsInterceptor,
      ],
      exports: [MetricsService, MetricsInterceptor],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => MetricsModuleOptions | Promise<MetricsModuleOptions>;
    inject?: any[];
    isGlobal?: boolean;
  }): DynamicModule {
    return {
      module: MetricsModule,
      global: options.isGlobal ?? true,
      providers: [
        {
          provide: 'METRICS_CONFIG',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: MetricsService,
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            const service = new MetricsService();
            service.setConfig(config);
            return service;
          },
          inject: options.inject || [],
        },
        MetricsInterceptor,
      ],
      exports: [MetricsService, MetricsInterceptor],
    };
  }
}
