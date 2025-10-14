'use client';

import { AdminDashboard } from '@/components/admin/dashboard';
import type { DashboardStats } from '@/types/admin-types';

// Mock data
const mockStats: DashboardStats = {
  totalUsers: 1247,
  totalProducts: 89,
  totalOrders: 156,
  totalRevenue: 12450,
  monthlyGrowth: {
    users: 12.5,
    products: 8.3,
    orders: 15.7,
    revenue: 23.1,
  },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <AdminDashboard stats={mockStats} />
      </div>
    </div>
  );
}
