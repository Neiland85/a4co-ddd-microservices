export interface AnalyticsData {
  period: "day" | "week" | "month" | "year"
  data: DataPoint[]
}

export interface DataPoint {
  date: string
  value: number
  label?: string
}

export interface SalesData extends AnalyticsData {
  totalSales: number
  averageOrderValue: number
  conversionRate: number
}

export interface ProductAnalytics {
  productId: string
  productName: string
  totalSales: number
  totalRevenue: number
  viewsCount: number
  conversionRate: number
  category: string
}

export interface CategoryAnalytics {
  category: string
  totalProducts: number
  totalSales: number
  totalRevenue: number
  averagePrice: number
  topProduct: string
}

export interface CustomerAnalytics {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  averageOrderValue: number
  customerLifetimeValue: number
  topCustomers: TopCustomer[]
}

export interface TopCustomer {
  id: string
  name: string
  email: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: Date
}

export interface RevenueData {
  daily: DataPoint[]
  weekly: DataPoint[]
  monthly: DataPoint[]
  yearly: DataPoint[]
  totalRevenue: number
  projectedRevenue: number
  growthRate: number
}
