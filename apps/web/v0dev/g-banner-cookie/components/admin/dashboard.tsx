"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Euro,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { DashboardStats } from "../../types/admin-types"

// Mock data
const mockStats: DashboardStats = {
  totalProducts: 45,
  totalOrders: 128,
  totalRevenue: 3420.5,
  pendingOrders: 5,
  lowStockProducts: 3,
  recentOrders: [
    {
      id: "ORD-001",
      customerName: "Ana Martínez",
      customerEmail: "ana@email.com",
      products: [{ productId: "1", productName: "Ochío Tradicional", quantity: 2, price: 3.5 }],
      total: 7.0,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "ORD-002",
      customerName: "Carlos López",
      customerEmail: "carlos@email.com",
      products: [{ productId: "2", productName: "Queso de Cabra", quantity: 1, price: 12.0 }],
      total: 12.0,
      status: "processing",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  topProducts: [
    { id: "1", name: "Ochío Tradicional", sales: 45, revenue: 157.5 },
    { id: "2", name: "Aceite de Oliva Virgen", sales: 32, revenue: 384.0 },
    { id: "3", name: "Queso Semicurado", sales: 28, revenue: 336.0 },
  ],
}

const statCards = [
  {
    title: "Productos Totales",
    value: mockStats.totalProducts,
    change: "+12%",
    trend: "up" as const,
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Pedidos Totales",
    value: mockStats.totalOrders,
    change: "+23%",
    trend: "up" as const,
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Ingresos Totales",
    value: `€${mockStats.totalRevenue.toFixed(2)}`,
    change: "+18%",
    trend: "up" as const,
    icon: Euro,
    color: "text-a4co-olive-600",
    bgColor: "bg-a4co-olive-50",
  },
  {
    title: "Stock Bajo",
    value: mockStats.lowStockProducts,
    change: "-2",
    trend: "down" as const,
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-purple-100 text-purple-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendiente"
    case "processing":
      return "Procesando"
    case "shipped":
      return "Enviado"
    case "delivered":
      return "Entregado"
    case "cancelled":
      return "Cancelado"
    default:
      return status
  }
}

export default function Dashboard() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [stats, setStats] = useState<DashboardStats>(mockStats)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen de tu negocio artesanal</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="bg-gradient-to-r from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 text-white shadow-mixed hover:shadow-mixed-lg transition-all duration-300 hover:scale-105">
            <Eye className="h-4 w-4 mr-2" />
            Ver Tienda
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          const isHovered = hoveredCard === index

          return (
            <Card
              key={card.title}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={cn(
                "transition-all duration-300 cursor-pointer border-0 shadow-natural hover:shadow-natural-xl",
                isHovered && "scale-105 -translate-y-2",
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                <div
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    card.bgColor,
                    isHovered && "scale-110 rotate-12",
                  )}
                >
                  <Icon className={cn("h-4 w-4", card.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
                <div className="flex items-center text-sm">
                  {card.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={cn("font-medium", card.trend === "up" ? "text-green-600" : "text-red-600")}>
                    {card.change}
                  </span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="shadow-natural-lg hover:shadow-natural-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Pedidos Recientes</CardTitle>
                <CardDescription>Últimos pedidos recibidos</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="hover:scale-110 transition-all duration-300">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-102 hover:shadow-natural-md cursor-pointer group"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium text-gray-900 group-hover:text-a4co-olive-600 transition-colors">
                        {order.id}
                      </div>
                      <Badge className={cn("text-xs", getStatusColor(order.status))}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {order.customerName} • €{order.total.toFixed(2)}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-a4co-olive-600 group-hover:scale-110 transition-all duration-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-natural-lg hover:shadow-natural-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Productos Más Vendidos</CardTitle>
                <CardDescription>Productos con mejor rendimiento</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="hover:scale-110 transition-all duration-300">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-102 hover:shadow-natural-md cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-a4co-olive-400 to-a4co-clay-400 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-all duration-300">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-a4co-olive-600 transition-colors">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-600">{product.sales} ventas</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">€{product.revenue.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">ingresos</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
