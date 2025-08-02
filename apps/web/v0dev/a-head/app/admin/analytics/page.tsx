"use client"

import { ProductSalesChart } from "@/components/admin/charts/product-sales-chart"
import { CategoryChart } from "@/components/admin/charts/category-chart"
import { CustomerChart } from "@/components/admin/charts/customer-chart"
import type { ProductAnalytics, CategoryAnalytics, CustomerAnalytics } from "@/types/analytics-types"

// Mock data
const mockProductAnalytics: ProductAnalytics[] = [
  {
    productId: "1",
    productName: "Aceite de Oliva Virgen Extra",
    totalSales: 156,
    totalRevenue: 3899.44,
    viewsCount: 2340,
    conversionRate: 6.7,
    category: "Alimentación",
  },
  {
    productId: "2",
    productName: "Cerámica Artesanal",
    totalSales: 89,
    totalRevenue: 3159.5,
    viewsCount: 1876,
    conversionRate: 4.7,
    category: "Artesanía",
  },
  {
    productId: "3",
    productName: "Miel de Azahar",
    totalSales: 134,
    totalRevenue: 2512.5,
    viewsCount: 1654,
    conversionRate: 8.1,
    category: "Alimentación",
  },
]

const mockCategoryAnalytics: CategoryAnalytics[] = [
  {
    category: "Alimentación",
    totalProducts: 45,
    totalSales: 290,
    totalRevenue: 6411.94,
    averagePrice: 22.11,
    topProduct: "Aceite de Oliva Virgen Extra",
  },
  {
    category: "Artesanía",
    totalProducts: 32,
    totalSales: 156,
    totalRevenue: 5234.8,
    averagePrice: 33.56,
    topProduct: "Cerámica Artesanal",
  },
  {
    category: "Textiles",
    totalProducts: 28,
    totalSales: 98,
    totalRevenue: 2876.4,
    averagePrice: 29.35,
    topProduct: "Mantas de Lana",
  },
]

const mockCustomerAnalytics: CustomerAnalytics = {
  totalCustomers: 1247,
  newCustomers: 156,
  returningCustomers: 1091,
  averageOrderValue: 45.67,
  customerLifetimeValue: 234.5,
  topCustomers: [
    {
      id: "1",
      name: "María García",
      email: "maria@example.com",
      totalOrders: 12,
      totalSpent: 567.89,
      lastOrderDate: new Date("2024-01-18"),
    },
    {
      id: "2",
      name: "Carlos López",
      email: "carlos@example.com",
      totalOrders: 8,
      totalSpent: 423.45,
      lastOrderDate: new Date("2024-01-15"),
    },
    {
      id: "3",
      name: "Ana Martín",
      email: "ana@example.com",
      totalOrders: 15,
      totalSpent: 789.12,
      lastOrderDate: new Date("2024-01-20"),
    },
  ],
}

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Análisis y Estadísticas</h1>
          <p className="text-gray-600 mt-2">Información detallada sobre el rendimiento de tu plataforma</p>
        </div>

        <div className="space-y-8">
          {/* Customer Analytics */}
          <CustomerChart data={mockCustomerAnalytics} />

          {/* Product and Category Analytics */}
          <div className="grid lg:grid-cols-2 gap-8">
            <ProductSalesChart data={mockProductAnalytics} />
            <CategoryChart data={mockCategoryAnalytics} />
          </div>
        </div>
      </div>
    </div>
  )
}
