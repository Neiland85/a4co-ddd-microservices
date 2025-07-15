export class AnalyticsService {
  generateReport(reportType: string): string {
    return `Reporte de tipo ${reportType} generado.`;
  }

  getStatistics(metric: string): string {
    return `Estadísticas para la métrica ${metric} obtenidas.`;
  }
}
