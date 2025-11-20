// pages/api/dashboard/stats.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { readonlyDb } from '../../../lib/readonly-db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [stats] = await readonlyDb.getDashboardStats();
    const recentOrders = await readonlyDb.getRecentOrders(5);
    const topProducts = await readonlyDb.getTopProducts(5);

    res.status(200).json({
      stats,
      recentOrders,
      topProducts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      error: 'Error fetching dashboard data',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
}
