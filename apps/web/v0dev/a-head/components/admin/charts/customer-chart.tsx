"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, UserPlus, Repeat, DollarSign } from "lucide-react"
import type { CustomerAnalytics } from "@/types/analytics-types"

interface CustomerChartProps {
  data: CustomerAnalytics
}

export function CustomerChart({ data }: CustomerChartProps) {
  const returningPercentage = (data.returningCustomers / data.totalCustomers) * 100

  return (
    <div className="space-y-6">
      {/* Customer Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Clientes</p>
                <p className="text-xl font-bold">{data.totalCustomers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlus className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nuevos</p>
                <p className="text-xl font-bold">{data.newCustomers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Repeat className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recurrentes</p>
                <p className="text-xl font-bold">{returningPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Promedio</p>
                <p className="text-xl font-bold">€{data.averageOrderValue.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Mejores Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topCustomers.map((customer, index) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                    {index + 1}
                  </div>
                  <Avatar>
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">€{customer.totalSpent.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{customer.totalOrders} pedidos</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    Último: {customer.lastOrderDate.toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
