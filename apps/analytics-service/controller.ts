import { Controller, Get, Logger } from '@nestjs/common';
import { AnalyticsService } from './service';

@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard-stats')
  async getDashboardStats() {
    this.logger.log('📊 Obteniendo estadísticas del dashboard');
    return await this.analyticsService.getDashboardStats();
  }

  @Get('product-analytics')
  async getProductAnalytics() {
    this.logger.log('📈 Obteniendo analytics de productos');
    return await this.analyticsService.getProductAnalytics();
  }

  @Get('user-activity')
  async getUserActivity() {
    this.logger.log('👥 Obteniendo actividad de usuarios');
    return await this.analyticsService.getUserActivity();
  }

  // Endpoints legacy para compatibilidad
  @Get('report/:type')
  generateReport(reportType: string): string {
    return this.analyticsService.generateReport(reportType);
  }

  @Get('stats/:metric')
  getStatistics(metric: string): string {
    return this.analyticsService.getStatistics(metric);
  }
}
