"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react"
import type { DashboardStats } from "@/types/admin-types"

interface AdminDashboardProps {
  stats: DashboardStats
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const statCards = [
    {
      title: "Total Usuarios",
      value: stats.totalUsers.toLocaleString(),
      change: stats.monthlyGrowth.users,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Productos",
      value: stats.totalProducts.toLocaleString(),
      change: stats.monthlyGrowth.products,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pedidos",
      value: stats.totalOrders.toLocaleString(),
      change: stats.monthlyGrowth.orders,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Ingresos",
      value: `€${stats.totalRevenue.toLocaleString()}`,
      change: stats.monthlyGrowth.revenue,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <Badge className="bg-green-100 text-green-800">
          <Activity className="w-3 h-3 mr-1" />
          Sistema Activo
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon
          const isPositive = stat.change >= 0

          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="flex items-center text-sm">
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                  )}
                  <span className={isPositive ? "text-green-600" : "text-red-600"}>{Math.abs(stat.change)}%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Nuevo usuario registrado", user: "María García", time: "Hace 5 min" },
                { action: "Producto actualizado", user: "Admin", time: "Hace 12 min" },
                { action: "Pedido completado", user: "Carlos López", time: "Hace 23 min" },
                { action: "Nueva reseña", user: "Ana Martín", time: "Hace 1 hora" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado del servidor</span>
                <Badge className="bg-green-100 text-green-800">Operativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base de datos</span>
                <Badge className="bg-green-100 text-green-800">Conectada</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última copia de seguridad</span>
                <span className="text-sm text-gray-900">Hace 2 horas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Versión del sistema</span>
                <span className="text-sm text-gray-900">v2.1.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
