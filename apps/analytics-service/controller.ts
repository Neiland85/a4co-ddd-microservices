import { AnalyticsService } from './service';

export class AnalyticsController {
  private analyticsService = new AnalyticsService();

  generateReport(reportType: string): string {
    return this.analyticsService.generateReport(reportType);
  }

  getStatistics(metric: string): string {
    return this.analyticsService.getStatistics(metric);
  }
}
