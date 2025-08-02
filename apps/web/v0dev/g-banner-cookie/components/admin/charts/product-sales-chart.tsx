"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductSalesData } from "../../../types/analytics-types"

interface ProductSalesChartProps {
  readonly data: ProductSalesData[]
  readonly className?: string
}

const categoryColors: Record<string, string> = {
  panaderia: "#b08968",
  queseria: "#f4d03f",
  aceite: "#8a9b73",
  embutidos: "#cd6155",
  miel: "#f7dc6f",
  conservas: "#85c1e9",
  vinos: "#8e44ad",
  dulces: "#f1948a",
  artesania: "#82e0aa",
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-natural-lg min-w-48">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Ventas:</span>
            <span className="text-sm font-semibold text-gray-900">{data.sales}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Ingresos:</span>
            <span className="text-sm font-semibold text-gray-900">€{data.revenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Crecimiento:</span>
            <span
              className={cn(
                "text-sm font-semibold flex items-center",
                data.growth >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {data.growth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(data.growth).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function ProductSalesChart({ data, className }: ProductSalesChartProps) {
  const [sortBy, setSortBy] = useState<"sales" | "revenue">("sales")
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  const sortedData = [...data].sort((a, b) => b[sortBy] - a[sortBy])
  const topProducts = sortedData.slice(0, 10)

  return (
    <Card className={cn("shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-a4co-olive-600" />
              Productos Más Vendidos
            </CardTitle>
            <CardDescription>Top 10 productos por ventas e ingresos</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={sortBy === "sales" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("sales")}
              className="hover:scale-105 transition-all duration-300"
            >
              Por Ventas
            </Button>
            <Button
              variant={sortBy === "revenue" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("revenue")}
              className="hover:scale-105 transition-all duration-300"
            >
              Por Ingresos
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Top 3 Products Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {topProducts.slice(0, 3).map((product, index) => (
            <div
              key={product.name}
              className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border hover:shadow-natural-md transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-a4co-olive-400 to-a4co-clay-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: `${categoryColors[product.category]}20`,
                    borderColor: categoryColors[product.category],
                    color: categoryColors[product.category],
                  }}
                >
                  {product.category}
                </Badge>
              </div>
              <h4 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ventas: {product.sales}</span>
                <span className="font-semibold text-gray-900">€{product.revenue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              layout="horizontal"
              onMouseMove={(e) => setHoveredBar(typeof e?.activeTooltipIndex === 'number' ? e.activeTooltipIndex : null)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => (sortBy === "revenue" ? `€${value}` : value.toString())}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={120}
                tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={sortBy} radius={[0, 4, 4, 0]}>
                {topProducts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={categoryColors[entry.category] || "#8a9b73"}
                    style={{
                      filter: hoveredBar === index ? "brightness(1.1)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product List */}
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">Lista Completa de Productos</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {sortedData.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-102 cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-a4co-olive-400 to-a4co-clay-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-a4co-olive-600 transition-colors">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{product.sales} ventas</div>
                    <div className="text-sm text-gray-600">€{product.revenue.toFixed(2)}</div>
                  </div>
                  <div
                    className={cn(
                      "flex items-center text-sm font-medium",
                      product.growth >= 0 ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {product.growth >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(product.growth).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
