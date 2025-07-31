"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, TrendingDown, Eye, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductAnalytics } from "../../../types/analytics-types"

interface ProductSalesChartProps {
  data: ProductAnalytics[]
  className?: string
}

const categoryColors = {
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
            <span className="text-sm font-semibold text-gray-900">{data.totalSales}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Ingresos:</span>
            <span className="text-sm font-semibold text-gray-900">€{data.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Conversión:</span>
            <span
              className={cn(
                "text-sm font-semibold flex items-center",
                data.conversionRate >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {data.conversionRate >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(data.conversionRate).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Vistas:</span>
            <span className="text-sm font-semibold text-gray-900">{data.viewsCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function ProductSalesChart({ data, className }: ProductSalesChartProps) {
  const [sortBy, setSortBy] = useState<"totalSales" | "totalRevenue">("totalSales")
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  const sortedData = [...data].sort((a, b) => b[sortBy] - a[sortBy])
  const topProducts = sortedData.slice(0, 5)

  return (
    <Card className={cn("shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Productos Más Vendidos
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={sortBy === "totalSales" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("totalSales")}
              className="hover:scale-105 transition-all duration-300"
            >
              Por Ventas
            </Button>
            <Button
              variant={sortBy === "totalRevenue" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("totalRevenue")}
              className="hover:scale-105 transition-all duration-300"
            >
              Por Ingresos
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Top 5 Products Summary */}
        <div className="space-y-4 mb-6">
          {topProducts.map((product, index) => (
            <div
              key={product.productId}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{product.productName}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      {product.viewsCount.toLocaleString()} vistas
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-gray-900">{product.totalSales}</span>
                </div>
                <div className="text-sm text-gray-600">€{product.totalRevenue.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {product.conversionRate.toFixed(1)}% conversión
                </div>
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
              onMouseMove={(e) => setHoveredBar(e?.activeTooltipIndex || null)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => (sortBy === "totalRevenue" ? `€${value}` : value.toString())}
              />
              <YAxis
                type="category"
                dataKey="productName"
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
                key={product.productId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-102 cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-a4co-olive-400 to-a4co-clay-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-a4co-olive-600 transition-colors">
                      {product.productName}
                    </div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingCart className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-900">{product.totalSales} ventas</span>
                    </div>
                    <div className="text-sm text-gray-600">€{product.totalRevenue.toLocaleString()}</div>
                  </div>
                  <div
                    className={cn(
                      "flex items-center text-sm font-medium",
                      product.conversionRate >= 0 ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {product.conversionRate >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(product.conversionRate).toFixed(1)}% conversión
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
