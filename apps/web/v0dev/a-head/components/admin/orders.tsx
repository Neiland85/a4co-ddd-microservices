"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Filter, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import type { Order } from "@/types/admin-types"

interface AdminOrdersProps {
  orders: Order[]
  onView?: (order: Order) => void
  onUpdateStatus?: (orderId: string, status: Order["status"]) => void
}

export function AdminOrders({ orders, onView, onUpdateStatus }: AdminOrdersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Order["status"]>("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Order["status"]) => {
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

  const getStatusLabel = (status: Order["status"]) => {
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

  const getStatusIcon = (status: Order["status"]) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Lista de Pedidos</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Pedido</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  return (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">#{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-500">{order.items.length} productos</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">€{order.total.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{order.createdAt.toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onView?.(order)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateStatus?.(order.id, "processing")}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Procesar
                            </Button>
                          )}
                          {order.status === "processing" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateStatus?.(order.id, "shipped")}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              Enviar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Intenta cambiar los filtros de búsqueda"
                  : "Los pedidos aparecerán aquí cuando los clientes realicen compras"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
