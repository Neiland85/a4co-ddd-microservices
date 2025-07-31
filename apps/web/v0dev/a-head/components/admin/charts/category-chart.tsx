"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, Progress } from "@/components/ui"
import { PieChartIcon, BarChart3, Palette, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CategoryAnalytics } from "../../../types/analytics-types"

interface CategoryChartProps {
  data: CategoryAnalytics[]
  className?: string
}

const categoryLabels = {
  panaderia: "Panadería",
  queseria: "Quesería",
  aceite: "Aceite",
  embutidos: "Embutidos",
  miel: "Miel",
  conservas: "Conservas",
  vinos: "Vinos",
  dulces: "Dulces",
  artesania: "Artesanía",
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-natural-lg">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-medium text-gray-900">{categoryLabels[data.category] || data.category}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Ventas:</span>
            <span className="text-sm font-semibold text-gray-900">€{data.value.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Porcentaje:</span>
            <span className="text-sm font-semibold text-gray-900">{data.percentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percentage < 5) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
      style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
    >
      {`${percentage.toFixed(0)}%`}
    </text>
  )
}

export default function CategoryChart({ data, className }: CategoryChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart")
  const maxRevenue = Math.max(...data.map((cat) => cat.totalRevenue))

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  const totalValue = data.reduce((sum, item) => sum + item.totalRevenue, 0)

  return (
    <Card className={cn("shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Rendimiento por Categoría
            </CardTitle>
            <CardDescription>Distribución de ventas por tipo de producto</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "chart" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("chart")}
              className="hover:scale-105 transition-all duration-300"
            >
              <PieChartIcon className="h-4 w-4 mr-1" />
              Gráfico
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="hover:scale-105 transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Lista
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {viewMode === "chart" ? (
          <div className="space-y-6">
            {/* Pie Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="totalRevenue"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={activeIndex === index ? "#fff" : "none"}
                        strokeWidth={activeIndex === index ? 3 : 0}
                        style={{
                          filter:
                            activeIndex === index ? "brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2))" : "none",
                          transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                          transformOrigin: "center",
                          transition: "all 0.3s ease",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.map((item, index) => {
                const revenuePercentage = (item.totalRevenue / maxRevenue) * 100

                return (
                  <div
                    key={item.category}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-natural-md",
                      activeIndex === index ? "bg-gray-50 border-gray-300 scale-105" : "bg-white border-gray-200",
                    )}
                  >
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {categoryLabels[item.category] || item.category}
                      </div>
                      <div className="text-xs text-gray-500">
                        €{item.totalRevenue.toLocaleString()} ({item.percentage.toFixed(1)}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">€{item.totalRevenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{item.totalSales} ventas</div>
                    </div>
                    <Progress value={revenuePercentage} className="h-2 mt-2" />
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-4">
                        <span>Precio promedio: €{item.averagePrice.toFixed(2)}</span>
                        <span>Top: {item.topProduct}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        {revenuePercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {data
              .sort((a, b) => b.totalRevenue - a.totalRevenue)
              .map((category, index) => {
                const revenuePercentage = (category.totalRevenue / maxRevenue) * 100

                return (
                  <div
                    key={category.category}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-102 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-a4co-olive-400 to-a4co-clay-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-a4co-olive-600 transition-colors">
                            {categoryLabels[category.category] || category.category}
                          </div>
                          <div className="text-sm text-gray-500">{category.percentage.toFixed(1)}% del total</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">€{category.totalRevenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{category.totalSales} ventas</div>
                    </div>
                    <Progress value={revenuePercentage} className="h-2 mt-2" />
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-4">
                        <span>Precio promedio: €{category.averagePrice.toFixed(2)}</span>
                        <span>Top: {category.topProduct}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        {revenuePercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-a4co-olive-50 to-a4co-clay-50 rounded-lg border border-a4co-olive-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Total de Ventas</h4>
              <p className="text-sm text-gray-600">{data.length} categorías activas</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-a4co-olive-700">€{totalValue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Ingresos totales</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
