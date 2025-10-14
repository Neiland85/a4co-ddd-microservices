'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Send, Target, TrendingUp, ShoppingCart } from 'lucide-react';
import { SectionCircles } from './section-circles';
import { getRecommendationsAnimationParams } from '@/utils/metrics-to-animation';
import type { DashboardMetrics } from '@/hooks/use-dashboard-metrics';

interface InteractiveRecommendationsProps {
  metrics: DashboardMetrics['recommendations'];
}

export function InteractiveRecommendations({ metrics }: InteractiveRecommendationsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sentOffers, setSentOffers] = useState(0);

  const recommendations = [
    {
      id: 1,
      title: 'Oferta Flash iPhone 15',
      description: 'Usuarios que vieron iPhone 14 en los últimos 7 días',
      targetUsers: 1247,
      estimatedConversion: 8.5,
      category: 'Tecnología',
      priority: 'Alta',
    },
    {
      id: 2,
      title: 'Descuento MacBook Pro',
      description: 'Usuarios con carrito abandonado de productos Apple',
      targetUsers: 892,
      estimatedConversion: 12.3,
      category: 'Computadoras',
      priority: 'Media',
    },
    {
      id: 3,
      title: 'Bundle AirPods + Funda',
      description: 'Compradores recientes de iPhone',
      targetUsers: 634,
      estimatedConversion: 15.7,
      category: 'Accesorios',
      priority: 'Alta',
    },
  ];

  const handleSendOffer = async (recommendationId: number) => {
    setIsLoading(true);

    // Simulación de envío de oferta
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSentOffers(prev => prev + 1);
    setIsLoading(false);
  };

  const handleSendAllOffers = async () => {
    setIsLoading(true);

    // Simulación de envío masivo
    await new Promise(resolve => setTimeout(resolve, 3000));

    setSentOffers(prev => prev + recommendations.length);
    setIsLoading(false);
  };

  const animationParams = getRecommendationsAnimationParams(metrics);

  return (
    <div className="relative space-y-6">
      {/* Círculos específicos de recomendaciones */}
      <SectionCircles
        section="recommendations"
        animationParams={animationParams}
        metrics={{ recommendations: metrics }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Recomendaciones Interactivas</h2>
        <p className="text-gray-600">
          Envía ofertas personalizadas basadas en el comportamiento de usuarios
        </p>
      </motion.div>

      {/* Estadísticas de campaña */}
      <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: 'Ofertas Enviadas', value: sentOffers, icon: Send, color: 'text-blue-600' },
          { label: 'Usuarios Objetivo', value: '2.8K', icon: Target, color: 'text-green-600' },
          { label: 'Tasa Conversión', value: '12.1%', icon: TrendingUp, color: 'text-purple-600' },
          { label: 'ROI Estimado', value: '340%', icon: ShoppingCart, color: 'text-orange-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                {/* Textura de fondo animada */}
                <div className="opacity-6 pointer-events-none absolute inset-0">
                  <motion.div
                    className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-amber-500/50 to-orange-400/30"
                    animate={{
                      x: ['-100%', '100%', '-100%'],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.5,
                    }}
                  />
                </div>
                <CardContent className="relative z-10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <motion.p
                        className="text-2xl font-bold"
                        key={stat.value}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Botón de envío masivo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <Card className="relative overflow-hidden border-orange-200/60 bg-gradient-to-r from-orange-50/80 via-yellow-50/30 to-amber-50/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          {/* Textura especial para campaña */}
          <div className="opacity-8 pointer-events-none absolute inset-0">
            <motion.div
              className="bg-gradient-radial absolute right-0 top-0 h-32 w-32 rounded-full from-yellow-500/40 via-orange-400/20 to-transparent blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 20, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
            <motion.div
              className="bg-gradient-radial absolute bottom-0 left-0 h-24 w-24 rounded-full from-amber-400/30 to-transparent blur-2xl"
              animate={{
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                delay: 2,
              }}
            />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="rounded-full bg-orange-100 p-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Zap className="h-6 w-6 text-orange-600" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold">Campaña Automática</h3>
                  <p className="text-gray-600">Enviar todas las ofertas recomendadas</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSendAllOffers}
                  disabled={isLoading}
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Todo'}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de recomendaciones */}
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              {/* Textura sutil animada */}
              <div className="opacity-4 pointer-events-none absolute inset-0">
                <motion.div
                  className="absolute right-0 top-0 h-8 w-8 rounded-full bg-gradient-to-bl from-amber-600/60 to-transparent"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.7,
                  }}
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <CardDescription className="mt-1">{rec.description}</CardDescription>
                  </div>
                  <Badge variant={rec.priority === 'Alta' ? 'destructive' : 'secondary'}>
                    {rec.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usuarios objetivo</span>
                    <span className="font-medium">{rec.targetUsers.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conversión estimada</span>
                    <span className="font-medium text-green-600">{rec.estimatedConversion}%</span>
                  </div>

                  <Progress value={rec.estimatedConversion} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline">{rec.category}</Badge>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={() => handleSendOffer(rec.id)} disabled={isLoading} size="sm">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Oferta
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
