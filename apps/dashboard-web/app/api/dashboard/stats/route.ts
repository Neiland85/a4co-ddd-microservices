// app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readonlyDb } from '../../../../lib/readonly-db';

export async function GET(_request: NextRequest) {
  try {
    const [stats] = await readonlyDb.getDashboardStats();
    const recentOrders = await readonlyDb.getRecentOrders(5);
    const topProducts = await readonlyDb.getTopProducts(5);

    return NextResponse.json({
      stats,
      recentOrders,
      topProducts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      {
        error: 'Error fetching dashboard data',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 },
    );
  }
}
