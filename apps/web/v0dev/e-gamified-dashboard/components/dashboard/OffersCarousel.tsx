"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Heart, Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Offer {
  id: number
  title: string
  description: string
  discount: string
  image: string
  category: string
  isFavorite: boolean
}

const offers: Offer[] = [
  {
    id: 1,
    title: "Pizza Suprema",
    description: "La mejor pizza de la ciudad con ingredientes premium",
    discount: "50%",
    image: "/placeholder.svg?height=200&width=300",
    category: "Comida",
    isFavorite: true,
  },
  {
    id: 2,
    title: "Spa Relajante",
    description: "Masajes y tratamientos de lujo para tu bienestar",
    discount: "30%",
    image: "/placeholder.svg?height=200&width=300",
    category: "Bienestar",
    isFavorite: true,
  },
  {
    id: 3,
    title: "Aventura Extrema",
    description: "Deportes de aventura y experiencias únicas",
    discount: "40%",
    image: "/placeholder.svg?height=200&width=300",
    category: "Aventura",
    isFavorite: false,
  },
  {
    id: 4,
    title: "Cine Premium",
    description: "Películas en 4D con asientos VIP",
    discount: "25%",
    image: "/placeholder.svg?height=200&width=300",
    category: "Entretenimiento",
    isFavorite: true,
  },
]

interface OffersCarouselProps {
  onOfferExplosion: (x: number, y: number) => void
}

export default function OffersCarousel({ onOfferExplosion }: OffersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [heartbeats, setHeartbeats] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const interval = setInterval(() => {
      offers.forEach((offer) => {
        if (offer.isFavorite) {
          setHeartbeats((prev) => ({
            ...prev,
            [offer.id]: !prev[offer.id],
          }))
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length)
  }

  const handleOfferClick = (event: React.MouseEvent, offer: Offer) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    onOfferExplosion(x, y)
  }

  return (
    <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl p-6 shadow-2xl border-4 border-yellow-400">
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Heart className="w-8 h-8 text-red-400 mr-3" />
          Ofertas Favoritas
          <Sparkles className="w-6 h-6 text-yellow-400 ml-2" />
        </h2>

        <div className="flex space-x-2">
          <Button
            onClick={prevSlide}
            variant="outline"
            size="icon"
            className="bg-white/20 border-white/30 hover:bg-white/30"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </Button>
          <Button
            onClick={nextSlide}
            variant="outline"
            size="icon"
            className="bg-white/20 border-white/30 hover:bg-white/30"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </Button>
        </div>
      </motion.div>

      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {offers.slice(currentIndex, currentIndex + 2).map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleOfferClick(e, offer)}
                className="relative bg-white rounded-2xl p-4 cursor-pointer shadow-xl overflow-hidden"
                animate={
                  offer.isFavorite && heartbeats[offer.id]
                    ? {
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(255, 0, 0, 0.7)",
                          "0 0 0 10px rgba(255, 0, 0, 0)",
                          "0 0 0 0 rgba(255, 0, 0, 0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.6 }}
              >
                {/* Discount Badge */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-lg z-10"
                >
                  -{offer.discount}
                </motion.div>

                {/* Favorite Heart */}
                {offer.isFavorite && (
                  <motion.div
                    animate={
                      heartbeats[offer.id]
                        ? {
                            scale: [1, 1.3, 1],
                            color: ["#ef4444", "#dc2626", "#ef4444"],
                          }
                        : {}
                    }
                    transition={{ duration: 0.6 }}
                    className="absolute top-2 left-2 z-10"
                  >
                    <Heart className="w-6 h-6 text-red-500 fill-current" />
                  </motion.div>
                )}

                <img
                  src={offer.image || "/placeholder.svg"}
                  alt={offer.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800">{offer.title}</h3>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {offer.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{offer.description}</p>

                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold text-sm"
                    >
                      ¡Explotar!
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {offers.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-yellow-400" : "bg-white/50"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
    </div>
  )
}
