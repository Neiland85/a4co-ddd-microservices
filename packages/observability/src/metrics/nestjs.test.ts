import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { MetricsModule, MetricsService, MetricsInterceptor } from './nestjs';
import { initializeStandardMetrics, shutdownStandardMetrics, getStandardMetrics } from './standardMetrics';

describe('NestJS Metrics Module', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    // Clean up metrics between tests
    try {
      await shutdownStandardMetrics();
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('MetricsModule.forRoot', () => {
    it('should create a valid DynamicModule with default config', () => {
      const moduleConfig = MetricsModule.forRoot({
        serviceName: 'test-service',
      });

      expect(moduleConfig).toBeDefined();
      expect(moduleConfig.module).toBe(MetricsModule);
      expect(moduleConfig.global).toBe(true);
      expect(moduleConfig.providers).toBeDefined();
      expect(moduleConfig.exports).toContain(MetricsService);
      expect(moduleConfig.exports).toContain(MetricsInterceptor);
    });

    it('should support isGlobal option', () => {
      const moduleConfig = MetricsModule.forRoot({
        serviceName: 'test-service',
        isGlobal: false,
      });

      expect(moduleConfig.global).toBe(false);
    });

    it('should include MetricsInterceptor in providers', () => {
      const moduleConfig = MetricsModule.forRoot({
        serviceName: 'test-service',
      });

      expect(moduleConfig.providers).toContainEqual(MetricsInterceptor);
    });
  });

  describe('MetricsService', () => {
    it('should initialize with default config', () => {
      const service = new MetricsService();
      expect(service).toBeDefined();
    });

    it('should allow setting custom config', () => {
      const service = new MetricsService();
      service.setConfig({
        serviceName: 'custom-service',
        prometheusPort: 9999,
      });
      // Service should not throw when config is set
      expect(service).toBeDefined();
    });

    it('should handle recordCommerceListed gracefully when metrics not initialized', () => {
      const service = new MetricsService();
      // Should not throw even if metrics not initialized
      expect(() => service.recordCommerceListed('retail')).not.toThrow();
    });

    it('should handle recordPromoNearbyRequest gracefully when metrics not initialized', () => {
      const service = new MetricsService();
      // Should not throw even if metrics not initialized
      expect(() => service.recordPromoNearbyRequest('discount')).not.toThrow();
    });

    it('should handle recordDbQuery gracefully when metrics not initialized', () => {
      const service = new MetricsService();
      // Should not throw even if metrics not initialized
      expect(() => service.recordDbQuery('SELECT', 'users', 0.05, true)).not.toThrow();
    });
  });

  describe('Standard Metrics Export', () => {
    it('should initialize standard metrics with service name', () => {
      const exporter = initializeStandardMetrics({
        serviceName: 'test-export-service',
        prometheusPort: 9465, // Use different port to avoid conflicts
      });

      expect(exporter).toBeDefined();
    });

    it('should export default metrics counters and histograms', () => {
      initializeStandardMetrics({
        serviceName: 'test-metrics-service',
        prometheusPort: 9466,
      });

      const metrics = getStandardMetrics();

      // Verify all expected metrics are created
      expect(metrics.httpRequestsTotal).toBeDefined();
      expect(metrics.requestDurationSeconds).toBeDefined();
      expect(metrics.httpActiveRequests).toBeDefined();
      expect(metrics.dbQueryTotal).toBeDefined();
      expect(metrics.dbQueryDurationSeconds).toBeDefined();
      expect(metrics.dbQueryErrors).toBeDefined();
      expect(metrics.commerceListedTotal).toBeDefined();
      expect(metrics.promoNearbyRequestTotal).toBeDefined();
      expect(metrics.memoryUsageBytes).toBeDefined();
      expect(metrics.cpuUsagePercent).toBeDefined();
    });

    it('should throw error when getStandardMetrics called before initialization', async () => {
      // Ensure metrics are shutdown first
      await shutdownStandardMetrics();
      
      expect(() => getStandardMetrics()).toThrow('Standard metrics not initialized');
    });
  });

  describe('MetricsInterceptor', () => {
    it('should be instantiable', () => {
      const interceptor = new MetricsInterceptor();
      expect(interceptor).toBeDefined();
    });
  });
});
