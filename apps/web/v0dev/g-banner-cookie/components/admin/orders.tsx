"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Clock, Euro, User, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Order } from "../../types/admin-types"

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Ana Martínez",
    customerEmail: "ana@email.com",
    products: [
      { productId: "1", productName: "Ochío Tradicional", quantity: 2, price: 3.5 },
      { productId: "2", productName: "Miel de Azahar", quantity: 1, price: 8.5 },
    ],
    total: 15.5,
    status: "pending",
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "ORD-002",
    customerName: "Carlos López",
    customerEmail: "carlos@email.com",
    products: [{ productId: "3", productName: "Aceite de Oliva Virgen", quantity: 1, price: 12.0 }],
    total: 12.0,
    status: "processing",
    createdAt: new Date("2024-01-21"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "ORD-003",
    customerName: "María García",
    customerEmail: "maria@email.com",
    products: [{ productId: "4", productName: "Queso Semicurado", quantity: 1, price: 15.5 }],
    total: 15.5,
    status: "shipped",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "ORD-004",
    customerName: "José Ruiz",
    customerEmail: "jose@email.com",
    products: [
      { productId: "1", productName: "Ochío Tradicional", quantity: 3, price: 3.5 },
      { productId: "2", productName: "Miel de Azahar", quantity: 2, price: 8.5 },
    ],
    total: 27.5,
    status: "delivered",
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-20"),
  },
]

const statusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return Clock
    case "processing":
      return Package
    case "shipped":
      return Truck
    case "delivered":
      return CheckCircle
    case "cancelled":
      return XCircle
    default:
      return Clock
  }
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-1">Gestiona todos los pedidos de tu tienda</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Package, color: "text-gray-600", bgColor: "bg-gray-50" },
          { label: "Pendientes", value: stats.pending, icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50" },
          {
            label: "Procesando",
            value: stats.processing,
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          { label: "Enviados", value: stats.shipped, icon: Truck, color: "text-purple-600", bgColor: "bg-purple-50" },
          {
            label: "Entregados",
            value: stats.delivered,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            label: "Ingresos",
            value: `€${stats.totalRevenue.toFixed(2)}`,
            icon: Euro,
            color: "text-a4co-olive-600",
            bgColor: "bg-a4co-olive-50",
          },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className="transition-all duration-300 hover:scale-105 hover:shadow-natural-lg cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12",
                      stat.bgColor,
                    )}
                  >
                    <Icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="shadow-natural-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por ID, cliente o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="shadow-natural-lg">
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            Mostrando {paginatedOrders.length} de {filteredOrders.length} pedidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ID Pedido</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Productos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  return (
                    <tr
                      key={order.id}
                      onMouseEnter={() => setHoveredRow(order.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={cn(
                        "border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 cursor-pointer",
                        hoveredRow === order.id && "scale-[1.02] shadow-natural-md bg-a4co-olive-50/30",
                      )}
                    >
                      <td className="py-4 px-4">
                        <div className="font-mono font-medium text-gray-900">{order.id}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          {order.products.length} producto{order.products.length > 1 ? "s" : ""}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.products
                            .slice(0, 2)
                            .map((p) => p.productName)
                            .join(", ")}
                          {order.products.length > 2 && "..."}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">€{order.total.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={cn("text-xs border", getStatusColor(order.status))}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusLabels[order.status]}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="hover:scale-110 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles del Pedido {order.id}</DialogTitle>
                              <DialogDescription>Información completa del pedido</DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <span className="font-medium">Cliente</span>
                                    </div>
                                    <p className="text-gray-900">{selectedOrder.customerName}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4 text-gray-500" />
                                      <span className="font-medium">Email</span>
                                    </div>
                                    <p className="text-gray-900">{selectedOrder.customerEmail}</p>
                                  </div>
                                </div>

                                {/* Order Status */}
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Package className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Estado del Pedido</span>
                                  </div>
                                  <Badge className={cn("text-sm", getStatusColor(selectedOrder.status))}>
                                    <StatusIcon className="h-4 w-4 mr-2" />
                                    {statusLabels[selectedOrder.status]}
                                  </Badge>
                                </div>

                                {/* Products */}
                                <div className="space-y-2">
                                  <span className="font-medium">Productos</span>
                                  <div className="space-y-2">
                                    {selectedOrder.products.map((product, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                      >
                                        <div>
                                          <div className="font-medium">{product.productName}</div>
                                          <div className="text-sm text-gray-500">Cantidad: {product.quantity}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-semibold">
                                            €{(product.price * product.quantity).toFixed(2)}
                                          </div>
                                          <div className="text-sm text-gray-500">€{product.price.toFixed(2)} c/u</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Total */}
                                <div className="border-t pt-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span className="text-xl font-bold text-a4co-olive-600">
                                      €{selectedOrder.total.toFixed(2)}
                                    </span>
                                  </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-500">Fecha de pedido:</span>
                                    <p>{formatDate(selectedOrder.createdAt)}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-500">Última actualización:</span>
                                    <p>{formatDate(selectedOrder.updatedAt)}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredOrders.length)} de{" "}
                {filteredOrders.length} pedidos
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="hover:scale-105 transition-all duration-300"
                >
                  Anterior
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "hover:scale-110 transition-all duration-300",
                      currentPage === page && "bg-gradient-to-r from-a4co-olive-500 to-a4co-clay-500",
                    )}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="hover:scale-105 transition-all duration-300"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
