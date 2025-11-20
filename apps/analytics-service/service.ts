import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly client: Client;

  constructor() {
    // Conexión readonly para analytics seguros
    this.client = new Client({
      connectionString: process.env.DATABASE_READONLY_URL,
    });

    this.client
      .connect()
      .then(() => this.logger.log('✅ Conectado a BD readonly para analytics'))
      .catch((err) => this.logger.error('❌ Error conectando a BD readonly:', err));
  }

  async getDashboardStats() {
    try {
      const query = `
        SELECT
          COUNT(*) as total_orders,
          AVG(amount) as avg_order_value,
          SUM(amount) as total_revenue,
          COUNT(DISTINCT user_id) as unique_customers
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '30 days'
      `;
      const result = await this.client.query(query);
      return result.rows[0];
    } catch (error) {
      this.logger.error('Error obteniendo estadísticas del dashboard:', error);
      return { error: 'No se pudieron obtener las estadísticas' };
    }
  }

  async getProductAnalytics() {
    try {
      const query = `
        SELECT
          p.name as product_name,
          COUNT(o.id) as total_orders,
          SUM(o.quantity) as total_quantity_sold,
          AVG(o.amount) as avg_order_value
        FROM products p
        LEFT JOIN orders o ON p.id = o.product_id
        GROUP BY p.id, p.name
        ORDER BY total_orders DESC
        LIMIT 10
      `;
      const result = await this.client.query(query);
      return result.rows;
    } catch (error) {
      this.logger.error('Error obteniendo analytics de productos:', error);
      return { error: 'No se pudieron obtener los analytics de productos' };
    }
  }

  async getUserActivity() {
    try {
      const query = `
        SELECT
          DATE(created_at) as date,
          COUNT(*) as daily_orders,
          COUNT(DISTINCT user_id) as active_users
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `;
      const result = await this.client.query(query);
      return result.rows;
    } catch (error) {
      this.logger.error('Error obteniendo actividad de usuarios:', error);
      return { error: 'No se pudo obtener la actividad de usuarios' };
    }
  }

  // Métodos legacy para compatibilidad
  generateReport(reportType: string): string {
    return `Reporte de tipo ${reportType} generado con datos readonly.`;
  }

  getStatistics(metric: string): string {
    return `Estadísticas para la métrica ${metric} obtenidas desde BD readonly.`;
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
