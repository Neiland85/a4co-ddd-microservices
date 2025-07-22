import { AnalyticsService } from './service';

describe('AnalyticsService', () => {
  const analyticsService = new AnalyticsService();

  it('should generate a report', () => {
    const result = analyticsService.generateReport('sales');
    expect(result).toBe('Reporte de tipo sales generado.');
  });

  it('should get statistics', () => {
    const result = analyticsService.getStatistics('revenue');
    expect(result).toBe('Estadísticas para la métrica revenue obtenidas.');
  });
});
