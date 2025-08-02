"use client"

import { useState } from "react"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, UserCheck, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CustomerData } from "../../../types/analytics-types"

interface CustomerChartProps {
  data: CustomerData[]
  className?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-natural-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-gray-600">{entry.name}:</span>
            <span className="text-sm font-semibold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function CustomerChart({ data, className }: CustomerChartProps) {
  const [chartType, setChartType] = useState<"composed" | "bar">("composed")
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  const totalNewCustomers = data.reduce((sum, item) => sum + item.newCustomers, 0)
  const totalReturningCustomers = data.reduce((sum, item) => sum + item.returningCustomers, 0)
  const totalCustomers = data.reduce((sum, item) => sum + item.totalCustomers, 0)
  const retentionRate = totalCustomers > 0 ? (totalReturningCustomers / totalCustomers) * 100 : 0

  return (
    <Card className={cn("shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-a4co-olive-600" />
              Análisis de Clientes
            </CardTitle>
            <CardDescription>Evolución de clientes nuevos y recurrentes</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === "composed" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("composed")}
              className="hover:scale-105 transition-all duration-300"
            >
              Combinado
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="hover:scale-105 transition-all duration-300"
            >
              Barras
            </Button>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Nuevos</p>
                <p className="text-2xl font-bold text-blue-700">{totalNewCustomers}</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Recurrentes</p>
                <p className="text-2xl font-bold text-green-700">{totalReturningCustomers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-a4co-olive-50 to-a4co-clay-50 p-4 rounded-lg border border-a4co-olive-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-a4co-olive-700">{totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-a4co-olive-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Retención</p>
                <p className="text-2xl font-bold text-purple-700 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-1" />
                  {retentionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              onMouseMove={(e) => setHoveredPoint(e?.activeTooltipIndex || null)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {chartType === "composed" ? (
                <>
                  <Bar dataKey="newCustomers" name="Clientes Nuevos" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="returningCustomers" name="Clientes Recurrentes" fill="#10b981" radius={[2, 2, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="totalCustomers"
                    name="Total Clientes"
                    stroke="#8a9b73"
                    strokeWidth={3}
                    dot={{ fill: "#8a9b73", strokeWidth: 2, r: 4 }}
                    activeDot={{
                      r: 6,
                      fill: "#8a9b73",
                      strokeWidth: 2,
                      stroke: "#fff",
                      style: { filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" },
                    }}
                  />
                </>
              ) : (
                <>
                  <Bar dataKey="newCustomers" name="Clientes Nuevos" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="returningCustomers" name="Clientes Recurrentes" fill="#10b981" radius={[2, 2, 0, 0]} />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Tendencias de Adquisición</h4>
            <div className="space-y-2">
              {data.slice(-3).map((month, index) => (
                <div key={month.month} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{month.month}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      +{month.newCustomers}
                    </Badge>
                    <span className="text-sm text-gray-500">nuevos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Retención por Mes</h4>
            <div className="space-y-2">
              {data.slice(-3).map((month, index) => {
                const monthRetention =
                  month.totalCustomers > 0 ? (month.returningCustomers / month.totalCustomers) * 100 : 0
                return (
                  <div key={month.month} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-green-200",
                          monthRetention >= 50 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700",
                        )}
                      >
                        {monthRetention.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
