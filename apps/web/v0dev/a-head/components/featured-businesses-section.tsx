"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Trophy, Star, Phone, Mail, Globe, Clock, ThumbsUp, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { featuredBusinesses } from "@/data/featured-businesses"

type CategoryFilter = "all" | "food" | "ai"

export function FeaturedBusinessesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState<CategoryFilter>("all")

  const filteredBusinesses = featuredBusinesses.filter((business) => filter === "all" || business.category === filter)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredBusinesses.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredBusinesses.length) % filteredBusinesses.length)
  }

  const getCategoryIcon = (category: string) => {
    return category === "food" ? "🍽️" : "🤖"
  }

  const getCategoryName = (category: string) => {
    return category === "food" ? "Productos Alimenticios" : "Actividades con IA"
  }

  const getVisibleBusinesses = () => {
    const businesses = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % filteredBusinesses.length
      businesses.push(filteredBusinesses[index])
    }
    return businesses
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Negocios Destacados del Mes
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Descubre los mejores negocios locales seleccionados por nuestra comunidad
          </motion.p>

          {/* Category Filters */}
          <div className="flex justify-center gap-4 mb-8">
            {[
              { key: "all", label: "Todos", icon: "🏆" },
              { key: "food", label: "Productos Alimenticios", icon: "🍽️" },
              { key: "ai", label: "Actividades con IA", icon: "🤖" },
            ].map((category) => (
              <Button
                key={category.key}
                variant={filter === category.key ? "default" : "outline"}
                onClick={() => {
                  setFilter(category.key as CategoryFilter)
                  setCurrentIndex(0)
                }}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  filter === category.key
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "hover:bg-blue-50 hover:scale-105"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div className="bg-white rounded-lg p-6 shadow-md" whileHover={{ scale: 1.05 }}>
              <div className="text-3xl font-bold text-blue-600">
                {featuredBusinesses.filter((b) => b.category === "food").length}
              </div>
              <div className="text-gray-600">Productos Alimenticios</div>
            </motion.div>
            <motion.div className="bg-white rounded-lg p-6 shadow-md" whileHover={{ scale: 1.05 }}>
              <div className="text-3xl font-bold text-purple-600">
                {featuredBusinesses.filter((b) => b.category === "ai").length}
              </div>
              <div className="text-gray-600">Actividades con IA</div>
            </motion.div>
            <motion.div className="bg-white rounded-lg p-6 shadow-md" whileHover={{ scale: 1.05 }}>
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Business Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-16">
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
                    type: "spring",
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
                    className={`overflow-hidden h-full transition-all duration-300 ${
                      business.isWinner
                        ? "ring-4 ring-yellow-400 shadow-2xl bg-gradient-to-br from-yellow-50 to-amber-50"
                        : "hover:shadow-xl"
                    }`}
                  >
                    {business.isWinner && (
                      <div className="absolute top-4 right-4 z-10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Badge className="bg-yellow-500 text-white px-3 py-1">
                            <Trophy className="w-4 h-4 mr-1" />
                            Ganador del Mes
                          </Badge>
                        </motion.div>
                      </div>
                    )}

                    <div className="relative">
                      <img
                        src={business.image || "/placeholder.svg"}
                        alt={business.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                          {getCategoryIcon(business.category)} {getCategoryName(business.category)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{business.rating}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{business.description}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="font-medium">{business.stats.responseTime}</div>
                          <div className="text-gray-500">Respuesta</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <ThumbsUp className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="font-medium">{business.stats.satisfaction}%</div>
                          <div className="text-gray-500">Satisfacción</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <ShoppingBag className="w-4 h-4 text-purple-500" />
                          </div>
                          <div className="font-medium">{business.stats.orders}</div>
                          <div className="text-gray-500">Pedidos</div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {business.contact.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {business.contact.email}
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          {business.contact.website}
                        </div>
                      </div>

                      {/* Votes */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">{business.votes} votos</span>
                        <Badge variant="outline" className="text-xs">
                          €{business.monthlyPayment}/mes
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                          size="sm"
                        >
                          Explorar Mapa
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 hover:bg-gray-50 transition-all duration-300 hover:scale-105 bg-transparent"
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
          <div className="flex justify-center mt-8 space-x-2">
            {filteredBusinesses.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
