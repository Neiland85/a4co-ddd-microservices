'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Star,
  Phone,
  Mail,
  Globe,
  Clock,
  ThumbsUp,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { featuredBusinesses } from '@/data/featured-businesses';

type CategoryFilter = 'all' | 'food' | 'ai';

export function FeaturedBusinessesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const filteredBusinesses = featuredBusinesses.filter(
    business => filter === 'all' || business.category === filter
  );

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % filteredBusinesses.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + filteredBusinesses.length) % filteredBusinesses.length);
  };

  const getCategoryIcon = (category: string) => {
    return category === 'food' ? '🍽️' : '🤖';
  };

  const getCategoryName = (category: string) => {
    return category === 'food' ? 'Productos Alimenticios' : 'Actividades con IA';
  };

  const getVisibleBusinesses = () => {
    const businesses = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % filteredBusinesses.length;
      businesses.push(filteredBusinesses[index]);
    }
    return businesses;
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h2
            className="mb-4 text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Negocios Destacados del Mes
          </motion.h2>
          <motion.p
            className="mb-8 text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Descubre los mejores negocios locales seleccionados por nuestra comunidad
          </motion.p>

          {/* Category Filters */}
          <div className="mb-8 flex justify-center gap-4">
            {[
              { key: 'all', label: 'Todos', icon: '🏆' },
              { key: 'food', label: 'Productos Alimenticios', icon: '🍽️' },
              { key: 'ai', label: 'Actividades con IA', icon: '🤖' },
            ].map(category => (
              <Button
                key={category.key}
                variant={filter === category.key ? 'default' : 'outline'}
                onClick={() => {
                  setFilter(category.key as CategoryFilter);
                  setCurrentIndex(0);
                }}
                className={`rounded-full px-6 py-3 transition-all duration-300 ${
                  filter === category.key
                    ? 'scale-105 bg-blue-600 text-white shadow-lg'
                    : 'hover:scale-105 hover:bg-blue-50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <motion.div className="rounded-lg bg-white p-6 shadow-md" whileHover={{ scale: 1.05 }}>
              <div className="text-3xl font-bold text-blue-600">
                {featuredBusinesses.filter(b => b.category === 'food').length}
              </div>
              <div className="text-gray-600">Productos Alimenticios</div>
            </motion.div>
            <motion.div className="rounded-lg bg-white p-6 shadow-md" whileHover={{ scale: 1.05 }}>
              <div className="text-3xl font-bold text-purple-600">
                {featuredBusinesses.filter(b => b.category === 'ai').length}
              </div>
              <div className="text-gray-600">Actividades con IA</div>
            </motion.div>
            <motion.div className="rounded-lg bg-white p-6 shadow-md" whileHover={{ scale: 1.05 }}>
              <div className="text-3xl font-bold text-green-600">
                {featuredBusinesses.reduce((sum, b) => sum + b.votes, 0)}
              </div>
              <div className="text-gray-600">Votos Totales</div>
            </motion.div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Business Cards */}
          <div className="grid grid-cols-1 gap-6 px-16 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="wait">
              {getVisibleBusinesses().map((business, index) => (
                <motion.div
                  key={`${business.id}-${currentIndex}-${index}`}
                  initial={{ opacity: 0, x: 100, rotateY: 90 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -100, rotateY: -90 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    z: 50,
                    transition: { duration: 0.3 },
                  }}
                  className="perspective-1000"
                >
                  <Card
                    className={`h-full overflow-hidden transition-all duration-300 ${
                      business.isWinner
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 shadow-2xl ring-4 ring-yellow-400'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    {business.isWinner && (
                      <div className="absolute right-4 top-4 z-10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'linear',
                          }}
                        >
                          <Badge className="bg-yellow-500 px-3 py-1 text-white">
                            <Trophy className="mr-1 h-4 w-4" />
                            Ganador del Mes
                          </Badge>
                        </motion.div>
                      </div>
                    )}

                    <div className="relative">
                      <img
                        src={business.image || '/placeholder.svg'}
                        alt={business.name}
                        className="h-48 w-full object-cover"
                      />
                      <div className="absolute left-4 top-4">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                          {getCategoryIcon(business.category)} {getCategoryName(business.category)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{business.rating}</span>
                        </div>
                      </div>

                      <p className="mb-4 line-clamp-2 text-gray-600">{business.description}</p>

                      {/* Stats */}
                      <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="mb-1 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="font-medium">{business.stats.responseTime}</div>
                          <div className="text-gray-500">Respuesta</div>
                        </div>
                        <div className="text-center">
                          <div className="mb-1 flex items-center justify-center">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="font-medium">{business.stats.satisfaction}%</div>
                          <div className="text-gray-500">Satisfacción</div>
                        </div>
                        <div className="text-center">
                          <div className="mb-1 flex items-center justify-center">
                            <ShoppingBag className="h-4 w-4 text-purple-500" />
                          </div>
                          <div className="font-medium">{business.stats.orders}</div>
                          <div className="text-gray-500">Pedidos</div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mb-4 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4" />
                          {business.contact.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          {business.contact.email}
                        </div>
                        <div className="flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          {business.contact.website}
                        </div>
                      </div>

                      {/* Votes */}
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-gray-600">{business.votes} votos</span>
                        <Badge variant="outline" className="text-xs">
                          €{business.monthlyPayment}/mes
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-blue-600 transition-all duration-300 hover:scale-105 hover:bg-blue-700"
                          size="sm"
                        >
                          Explorar Mapa
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent transition-all duration-300 hover:scale-105 hover:bg-gray-50"
                          size="sm"
                        >
                          Ver Productos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="mt-8 flex justify-center space-x-2">
            {filteredBusinesses.map((_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'scale-125 bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
