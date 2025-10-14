'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, MapPin, MousePointer, TrendingUp } from 'lucide-react';
import { SectionCircles } from './section-circles';
import { getMonitorAnimationParams } from '@/utils/metrics-to-animation';
import type { DashboardMetrics } from '@/hooks/use-dashboard-metrics';

interface ActivityMonitorProps {
  metrics: DashboardMetrics['monitor'];
}

export function ActivityMonitor({ metrics }: ActivityMonitorProps) {
  // Datos para gráficos
  const visitorData = [
    { time: '00:00', users: 120 },
    { time: '04:00', users: 89 },
    { time: '08:00', users: 234 },
    { time: '12:00', users: 456 },
    { time: '16:00', users: 378 },
    { time: '20:00', users: 289 },
  ];

  const locationData = [
    { country: 'España', users: 450, color: '#3b82f6' },
    { country: 'México', users: 320, color: '#8b5cf6' },
    { country: 'Argentina', users: 280, color: '#06b6d4' },
    { country: 'Colombia', users: 197, color: '#10b981' },
  ];

  const productData = [
    { product: 'iPhone 15', clicks: 1234 },
    { product: 'MacBook Pro', clicks: 987 },
    { product: 'iPad Air', clicks: 756 },
    { product: 'Apple Watch', clicks: 543 },
    { product: 'AirPods Pro', clicks: 432 },
  ];

  const statsCards = [
    {
      title: 'Usuarios Activos',
      value: metrics.activeUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Visitas Totales',
      value: metrics.totalVisits.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Tasa de Clics',
      value: `${metrics.clickRate.toFixed(1)}%`,
      icon: MousePointer,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Conversión',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: MapPin,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const animationParams = getMonitorAnimationParams(metrics);

  return (
    <div className="relative space-y-6">
      {/* Círculos específicos de la sección */}
      <SectionCircles
        section="monitor"
        animationParams={animationParams}
        metrics={{ monitor: metrics }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex items-center space-x-2">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Monitor de Actividad</h2>
          <Badge
            variant={
              metrics.activityLevel === 'critical'
                ? 'destructive'
                : metrics.activityLevel === 'high'
                  ? 'secondary'
                  : 'outline'
            }
          >
            {metrics.activityLevel === 'critical'
              ? 'Crítico'
              : metrics.activityLevel === 'high'
                ? 'Alto'
                : metrics.activityLevel === 'medium'
                  ? 'Medio'
                  : 'Bajo'}
          </Badge>
        </div>
        <p className="text-gray-600">Estadísticas en tiempo real de tu plataforma</p>
      </motion.div>

      {/* Tarjetas de estadísticas con animación mejorada */}
      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                {/* Textura de fondo para cada card */}
                <div className="pointer-events-none absolute inset-0 opacity-5">
                  <motion.div
                    className="absolute right-0 top-0 h-16 w-16 rounded-full bg-gradient-to-bl from-blue-500/60 to-transparent"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.5,
                    }}
                  />
                </div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <motion.p
                        className="text-2xl font-bold text-gray-900"
                        key={stat.value}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      className={`rounded-full p-3 ${stat.bgColor}`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Gráficos con animaciones mejoradas */}
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de visitantes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            {/* Textura sutil para gráficos */}
            <div className="opacity-3 pointer-events-none absolute inset-0">
              <motion.div
                className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-blue-600/30 via-transparent to-cyan-500/20"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </div>
            <CardHeader>
              <CardTitle>Visitantes por Hora</CardTitle>
              <CardDescription>Actividad de usuarios durante el día</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: {
                    label: 'Usuarios',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="var(--color-users)"
                      fill="var(--color-users)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráfico de ubicaciones */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            {/* Textura sutil para gráficos */}
            <div className="opacity-3 pointer-events-none absolute inset-0">
              <motion.div
                className="absolute bottom-0 right-0 h-2 w-full bg-gradient-to-l from-purple-500/25 via-transparent to-pink-400/15"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 2,
                }}
              />
            </div>
            <CardHeader>
              <CardTitle>Usuarios por Ubicación</CardTitle>
              <CardDescription>Distribución geográfica de visitantes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: {
                    label: 'Usuarios',
                    color: 'hsl(var(--chart-2))',
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="users"
                      label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Productos más clicados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
        className="relative z-10"
      >
        <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          {/* Textura sutil para gráficos */}
          <div className="opacity-3 pointer-events-none absolute inset-0">
            <motion.div
              className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-cyan-600/30 via-transparent to-blue-500/20"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                x: ['-100%', '100%', '-100%'],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </div>
          <CardHeader>
            <CardTitle>Productos Más Clicados</CardTitle>
            <CardDescription>Ranking de productos por número de clics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                clicks: {
                  label: 'Clics',
                  color: 'hsl(var(--chart-3))',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="product" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="clicks" fill="var(--color-clicks)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
