"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"
import type { RevenueData } from "@/types/analytics-types"

interface RevenueChartProps {
  data: RevenueData
}

export function RevenueChart({ data }: RevenueChartProps) {
  const isPositiveGrowth = data.growthRate >= 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Análisis de Ingresos
          </CardTitle>
          <Badge className={isPositiveGrowth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {isPositiveGrowth ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(data.growthRate).toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Revenue Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-900">
                €{data.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Proyección</p>
              <p className="text-2xl font-bold text-blue-900">
                €{data.projectedRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Crecimiento</p>
              <p className={`text-2xl font-bold ${isPositiveGrowth ? 'text-green-900' : 'text-red-900'}`}>
                {data.growthRate > 0 ? '+' : ''}{data.growthRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Revenue Charts */}
          <Tabs defaultValue="monthly" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="daily">Diario</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
              <TabsTrigger value="yearly">Anual</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Gráfico de ingresos diarios</p>
                  <p className="text-sm text-gray-500">
                    {data.daily.length} puntos de datos
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Gráfico de ingresos semanales</p>
                  <p className="text-sm text-gray-500">
                    {data.weekly.length} puntos de datos
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Gráfico de ingresos mensuales</p>
                  <p className="text-sm text-gray-500">
                    {data.monthly.length} puntos de datos
                  </p>
                </div>
              </div>
              
              {/* Monthly Data Table */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Datos Mensuales</h4>
                <div className="space-y-1">
                  {data.monthly.slice(0, 6).map((point\
