import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SagaMetricsService } from '../../infrastructure/metrics/saga-metrics.service';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: SagaMetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4')
  @ApiOperation({ summary: 'Obtiene métricas de Prometheus' })
  @ApiResponse({
    status: 200,
    description: 'Métricas en formato Prometheus',
    type: String,
  })
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check del servicio de métricas' })
  @ApiResponse({
    status: 200,
    description: 'Servicio de métricas operativo',
  })
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      metricsEnabled: true,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtiene estadísticas resumidas de sagas' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de sagas',
  })
  async getStats() {
    const successRate = this.metricsService.calculateSuccessRate();

    return {
      successRate: `${successRate.toFixed(2)}%`,
      timestamp: new Date().toISOString(),
      message: 'Use /metrics para ver todas las métricas en formato Prometheus',
    };
  }
}
