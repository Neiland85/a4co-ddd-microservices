// lib/readonly-db.ts
import { Client } from 'pg';

class ReadonlyDatabase {
  private client: Client | null = null;

  private async getClient(): Promise<Client> {
    if (!this.client) {
      this.client = new Client({
        connectionString: process.env.DATABASE_READONLY_URL,
      });
      await this.client.connect();
    }
    return this.client;
  }

  async query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]> {
    const client = await this.getClient();
    try {
      const result = await client.query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('Error en consulta readonly:', error);
      throw error;
    }
  }

  async getDashboardStats() {
    return this.query(`
      SELECT
        COUNT(*) as total_orders,
        COALESCE(AVG(amount), 0) as avg_order_value,
        COALESCE(SUM(amount), 0) as total_revenue,
        COUNT(DISTINCT user_id) as unique_customers
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);
  }

  async getRecentOrders(limit = 10) {
    return this.query(
      `
      SELECT
        id,
        user_id,
        amount,
        status,
        created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT $1
    `,
      [limit],
    );
  }

  async getTopProducts(limit = 5) {
    return this.query(
      `
      SELECT
        p.name as product_name,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.quantity), 0) as total_quantity
      FROM products p
      LEFT JOIN orders o ON p.id = o.product_id
      GROUP BY p.id, p.name
      ORDER BY total_orders DESC
      LIMIT $1
    `,
      [limit],
    );
  }

  async disconnect() {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }
}

export const readonlyDb = new ReadonlyDatabase();

// Cleanup on process exit
process.on('exit', () => readonlyDb.disconnect());
process.on('SIGINT', () => readonlyDb.disconnect());
process.on('SIGTERM', () => readonlyDb.disconnect());
