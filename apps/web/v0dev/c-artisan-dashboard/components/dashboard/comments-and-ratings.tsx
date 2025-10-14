'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';
import { SectionCircles } from './section-circles';
import { getCommentsAnimationParams } from '@/utils/metrics-to-animation';
import type { DashboardMetrics } from '@/hooks/use-dashboard-metrics';

interface CommentsAndRatingsProps {
  metrics: DashboardMetrics['comments'];
}

export function CommentsAndRatings({ metrics }: CommentsAndRatingsProps) {
  const [filter, setFilter] = useState('all');

  const comments = [
    {
      id: 1,
      user: 'María González',
      avatar: '/placeholder.svg?height=40&width=40',
      rating: 5,
      comment:
        'Excelente servicio, muy rápida la entrega y el producto llegó en perfectas condiciones.',
      product: 'iPhone 15 Pro',
      date: '2024-01-15',
      likes: 12,
      dislikes: 0,
      verified: true,
    },
    {
      id: 2,
      user: 'Carlos Ruiz',
      avatar: '/placeholder.svg?height=40&width=40',
      rating: 4,
      comment: 'Buen producto, aunque el precio podría ser más competitivo. La calidad es buena.',
      product: 'MacBook Air M2',
      date: '2024-01-14',
      likes: 8,
      dislikes: 2,
      verified: true,
    },
    {
      id: 3,
      user: 'Ana Martín',
      avatar: '/placeholder.svg?height=40&width=40',
      rating: 3,
      comment:
        'El producto está bien pero tardó más de lo esperado en llegar. El empaque podría mejorar.',
      product: 'AirPods Pro',
      date: '2024-01-13',
      likes: 5,
      dislikes: 3,
      verified: false,
    },
    {
      id: 4,
      user: 'Luis Fernández',
      avatar: '/placeholder.svg?height=40&width=40',
      rating: 5,
      comment: 'Increíble calidad y atención al cliente. Definitivamente recomiendo esta tienda.',
      product: 'iPad Pro',
      date: '2024-01-12',
      likes: 15,
      dislikes: 0,
      verified: true,
    },
  ];

  const averageRating =
    comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length;
  const totalComments = comments.length;
  const verifiedComments = comments.filter(c => c.verified).length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const animationParams = getCommentsAnimationParams(metrics);

  return (
    <div className="relative space-y-6">
      {/* Círculos específicos de comentarios */}
      <SectionCircles
        section="comments"
        animationParams={animationParams}
        metrics={{ comments: metrics }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Comentarios y Puntuaciones</h2>
        <p className="text-gray-600">Gestiona las reseñas y feedback de tus usuarios</p>
      </motion.div>

      {/* Estadísticas generales */}
      <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            {/* Textura minimalista animada */}
            <div className="pointer-events-none absolute inset-0 opacity-5">
              <motion.div
                className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-pink-600/60 via-transparent to-fuchsia-500/40"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </div>
            <CardContent className="relative z-10 p-4">
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <Star className="h-5 w-5 text-yellow-400" />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-600">Puntuación Media</p>
                  <motion.p
                    className="text-2xl font-bold"
                    key={averageRating}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {averageRating.toFixed(1)}
                  </motion.p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <div className="pointer-events-none absolute inset-0 opacity-5">
              <motion.div
                className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-pink-600/60 via-transparent to-fuchsia-500/40"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 0.5,
                }}
              />
            </div>
            <CardContent className="relative z-10 p-4">
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-600">Total Comentarios</p>
                  <p className="text-2xl font-bold">{totalComments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <div className="pointer-events-none absolute inset-0 opacity-5">
              <motion.div
                className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-pink-600/60 via-transparent to-fuchsia-500/40"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 1,
                }}
              />
            </div>
            <CardContent className="relative z-10 p-4">
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-600">Verificados</p>
                  <p className="text-2xl font-bold">{verifiedComments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <div className="pointer-events-none absolute inset-0 opacity-5">
              <motion.div
                className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-pink-600/60 via-transparent to-fuchsia-500/40"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 1.5,
                }}
              />
            </div>
            <CardContent className="relative z-10 p-4">
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                  <Filter className="h-5 w-5 text-purple-600" />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10"
      >
        <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          {/* Textura de filtros animada */}
          <div className="opacity-6 pointer-events-none absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-50/50 via-transparent to-fuchsia-50/30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </div>
          <CardContent className="relative z-10 p-4">
            <div className="flex flex-wrap gap-2">
              {['all', 'verified', 'high', 'low'].map((filterType, index) => (
                <motion.div
                  key={filterType}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={filter === filterType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(filterType)}
                  >
                    {filterType === 'all' && 'Todos'}
                    {filterType === 'verified' && 'Verificados'}
                    {filterType === 'high' && '5 Estrellas'}
                    {filterType === 'low' && '1-3 Estrellas'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de comentarios */}
      <div className="relative z-10 space-y-4">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              {/* Textura para comentarios animada */}
              <div className="opacity-3 pointer-events-none absolute inset-0">
                <motion.div
                  className="bg-gradient-radial absolute right-0 top-0 h-12 w-12 rounded-full from-pink-500/50 to-transparent blur-lg"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.8,
                  }}
                />
                <motion.div
                  className="bg-gradient-radial absolute bottom-0 left-0 h-8 w-8 rounded-full from-fuchsia-400/40 to-transparent blur-lg"
                  animate={{
                    x: [0, 10, 0],
                    y: [0, -5, 0],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.5,
                  }}
                />
              </div>
              <CardContent className="relative z-10 p-6">
                <div className="flex items-start space-x-4">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                    <Avatar>
                      <AvatarImage src={comment.avatar || '/placeholder.svg'} />
                      <AvatarFallback>
                        {comment.user
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{comment.user}</h4>
                        {comment.verified && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Badge variant="secondary" className="text-xs">
                              Verificado
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(comment.rating)}
                      </div>
                    </div>

                    <p className="text-gray-700">{comment.comment}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Producto: {comment.product}</span>
                        <span>{comment.date}</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <motion.button
                          className="flex items-center space-x-1 transition-colors hover:text-green-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes}</span>
                        </motion.button>
                        <motion.button
                          className="flex items-center space-x-1 transition-colors hover:text-red-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span>{comment.dislikes}</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
