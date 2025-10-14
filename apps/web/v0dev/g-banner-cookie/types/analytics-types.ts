export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface ProductSalesData {
  name: string;
  sales: number;
  revenue: number;
  category: string;
  growth: number;
}

export interface CategoryData {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

export interface TimeSeriesData {
  period: string;
  value: number;
  previousValue?: number;
  growth?: number;
}

export interface CustomerData {
  month: string;
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
}

export interface RegionalData {
  region: string;
  sales: number;
  orders: number;
  customers: number;
}

export interface AnalyticsFilters {
  dateRange: '7d' | '30d' | '90d' | '1y' | 'custom';
  startDate?: Date;
  endDate?: Date;
  category?: string;
  region?: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  growthRate: number;
  topProduct: string;
  topCategory: string;
}
