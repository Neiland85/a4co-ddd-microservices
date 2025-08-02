"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  Target,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import RevenueChart from "./charts/revenue-chart"
import ProductSalesChart from "./charts/product-sales-chart"
import CategoryChart from "./charts/category-chart"
import CustomerChart from "./charts/customer-chart"
import type {
  SalesData,
  ProductSalesData,
  CategoryData,
  CustomerData,
  AnalyticsFilters,
  AnalyticsSummary,
} from "../../types/analytics-types"
import RealTimeStatus from "./real-time-status"
import RealTimeActivity from "./real-time-activity"

// Mock data
const mockSalesData: SalesData[] = [
  { date: "01 Ene", revenue: 245.5, orders: 12, customers: 8 },
  { date: "02 Ene", revenue: 189.25, orders: 9, customers: 7 },
  { date: "03 Ene", revenue: 312.75, orders: 15, customers: 12 },
  { date: "04 Ene", revenue: 278.9, orders: 13, customers: 10 },
  { date: "05 Ene", revenue: 425.6, orders: 18, customers: 15 },
  { date: "06 Ene", revenue: 356.8, orders: 16, customers: 13 },
  { date: "07 Ene", revenue: 298.45, orders: 14, customers: 11 },
  { date: "08 Ene", revenue: 387.2, orders: 17, customers: 14 },
  { date: "09 Ene", revenue: 445.75, orders: 19, customers: 16 },
  { date: "10 Ene", revenue: 523.9, orders: 22, customers: 18 },
  { date: "11 Ene", revenue: 467.35, orders: 20, customers: 17 },
  { date: "12 Ene", revenue: 398.6, orders: 18, customers: 15 },
  { date: "13 Ene", revenue: 512.8, orders: 21, customers: 19 },
  { date: "14 Ene", revenue: 634.25, orders: 25, customers: 22 },
]

const mockProductSalesData: ProductSalesData[] = [
  { name: "Ochío Tradicional", sales: 45, revenue: 157.5, category: "panaderia", growth: 12.5 },
  { name: "Aceite de Oliva Virgen", sales: 32, revenue: 384.0, category: "aceite", growth: 8.3 },
  { name: "Queso Semicurado", sales: 28, revenue: 434.0, category: "queseria", growth: -2.1 },
  { name: "Miel de Azahar", sales: 24, revenue: 204.0, category: "miel", growth: 15.7 },
  { name: "Jamón Ibérico", sales: 18, revenue: 540.0, category: "embutidos", growth: 22.4 },
  { name: "Pan de Pueblo", sales: 35, revenue: 105.0, category: "panaderia", growth: 5.8 },
  { name: "Queso de Cabra", sales: 22, revenue: 264.0, category: "queseria", growth: -5.2 },
  { name: "Conserva de Tomate", sales: 16, revenue: 96.0, category: "conservas", growth: 18.9 },
  { name: "Vino Tinto Reserva", sales: 12, revenue: 360.0, category: "vinos", growth: 31.2 },
  { name: "Dulce de Membrillo", sales: 20, revenue: 140.0, category: "dulces", growth: 7.6 },
]

const mockCategoryData: CategoryData[] = [
  { category: "panaderia", value: 262.5, percentage: 25.2, color: "#b08968" },
  { category: "aceite", value: 384.0, percentage: 36.8, color: "#8a9b73" },
  { category: "queseria", value: 698.0, percentage: 18.5, color: "#f4d03f" },
  { category: "miel", value: 204.0, percentage: 8.7, color: "#f7dc6f" },
  { category: "embutidos", value: 540.0, percentage: 15.2, color: "#cd6155" },
  { category: "conservas", value: 96.0, percentage: 3.1, color: "#85c1e9" },
  { category: "vinos", value: 360.0, percentage: 12.8, color: "#8e44ad" },
  { category: "dulces", value: 140.0, percentage: 4.7, color: "#f1948a" },
]

const mockCustomerData: CustomerData[] = [
  { month: "Sep", newCustomers: 15, returningCustomers: 8, totalCustomers: 23 },
  { month: "Oct", newCustomers: 22, returningCustomers: 12, totalCustomers: 34 },
  { month: "Nov", newCustomers: 18, returningCustomers: 16, totalCustomers: 34 },
  { month: "Dec", newCustomers: 25, returningCustomers: 19, totalCustomers: 44 },
  { month: "Ene", newCustomers: 32, returningCustomers: 24, totalCustomers: 56 },
  { month: "Feb", newCustomers: 28, returningCustomers: 31, totalCustomers: 59 },
]

export default function Analytics() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: "30d",
    category: "all",
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate summary statistics
  const summary: AnalyticsSummary = useMemo(() => {
    const totalRevenue = mockSalesData.reduce((sum, item) => sum + item.revenue, 0)
    const totalOrders = mockSalesData.reduce((sum, item) => sum + item.orders, 0)
    const totalCustomers = mockSalesData.reduce((sum, item) => sum + item.customers, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Mock calculations for other metrics
    const conversionRate = 3.2
    const growthRate = 15.8
    const topProduct = mockProductSalesData[0]?.name || "N/A"
    const topCategory = mockCategoryData.toSorted((a, b) => b.value - a.value)[0]?.category || "N/A"

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      conversionRate,
      growthRate,
      topProduct,
      topCategory,
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const handleExport = () => {
    // Mock export functionality
    const data = {
      summary,
      salesData: mockSalesData,
      productSales: mockProductSalesData,
      categoryData: mockCategoryData,
      customerData: mockCustomerData,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `analytics-report-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Análisis detallado de ventas y tendencias</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Select
            value={filters.dateRange}
            onValueChange={(value: any) => setFilters((prev) => ({ ...prev, dateRange: value }))}
          >
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover:scale-105 transition-all duration-300 bg-transparent"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Actualizar
          </Button>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 text-white shadow-mixed hover:shadow-mixed-lg transition-all duration-300 hover:scale-105"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <RealTimeStatus />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Ingresos Totales",
            value: `€${summary.totalRevenue.toFixed(2)}`,
            change: `+${summary.growthRate.toFixed(1)}%`,
            trend: "up" as const,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
          },
          {
            title: "Pedidos Totales",
            value: summary.totalOrders.toString(),
            change: "+12.3%",
            trend: "up" as const,
            icon: ShoppingCart,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
          },
          {
            title: "Clientes Únicos",
            value: summary.totalCustomers.toString(),
            change: "+8.7%",
            trend: "up" as const,
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
          },
          {
            title: "Valor Promedio",
            value: `€${summary.averageOrderValue.toFixed(2)}`,
            change: "+5.2%",
            trend: "up" as const,
            icon: Target,
            color: "text-a4co-olive-600",
            bgColor: "bg-a4co-olive-50",
            borderColor: "border-a4co-olive-200",
          },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className={cn(
                "transition-all duration-300 hover:scale-105 hover:shadow-natural-lg cursor-pointer group border-2",
                stat.borderColor,
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={cn("text-sm font-medium", stat.trend === "up" ? "text-green-600" : "text-red-600")}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "p-3 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12",
                      stat.bgColor,
                    )}
                  >
                    <Icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Productos</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Categorías</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Tiempo Real</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={mockSalesData} />
            <CategoryChart data={mockCategoryData} />
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <ProductSalesChart data={mockProductSalesData} />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <CategoryChart data={mockCategoryData} />

            {/* Category Performance Table */}
            <Card className="shadow-natural-lg hover:shadow-natural-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>Rendimiento por Categoría</CardTitle>
                <CardDescription>Análisis detallado de cada categoría de productos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Categoría</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Ventas</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Porcentaje</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Tendencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockCategoryData
                        .toSorted((a, b) => b.value - a.value)
                        .map((category, index) => (
                          <tr
                            key={category.category}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-300"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                                <span className="font-medium text-gray-900">{category.category}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-gray-900">€{category.value.toFixed(2)}</span>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline" className="bg-gray-50">
                                {category.percentage.toFixed(1)}%
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center text-green-600">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                <span className="text-sm font-medium">+{(Math.random() * 20).toFixed(1)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <CustomerChart data={mockCustomerData} />
        </TabsContent>
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeActivity />
            <RealTimeStatus showDetails={true} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Key Insights */}
      <Card className="shadow-natural-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-a4co-olive-600" />
            Insights Clave
          </CardTitle>
          <CardDescription>Análisis automático de tendencias y oportunidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">Crecimiento Positivo</h4>
              </div>
              <p className="text-sm text-green-700">
                Los ingresos han crecido un {summary.growthRate.toFixed(1)}% comparado con el período anterior. El
                producto "{summary.topProduct}" lidera las ventas.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">Retención de Clientes</h4>
              </div>
              <p className="text-sm text-blue-700">
                La tasa de conversión actual es del {summary.conversionRate}%. Los clientes recurrentes representan el
                65% de las ventas totales.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-amber-600" />
                <h4 className="font-medium text-amber-800">Oportunidad</h4>
              </div>
              <p className="text-sm text-amber-700">
                La categoría "{summary.topCategory}" tiene el mayor potencial de crecimiento. Considera expandir el
                inventario en esta área.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
