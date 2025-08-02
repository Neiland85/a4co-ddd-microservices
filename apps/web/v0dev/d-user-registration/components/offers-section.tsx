"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Gift, Zap, Star } from "lucide-react"

interface Offer {
  id: number
  title: string
  description: string
  discount: string
  icon: React.ReactNode
  color: string
  bgGradient: string
}

export function OffersSection() {
  const offers: Offer[] = [
    {
      id: 1,
      title: "¡Bienvenida Especial!",
      description: "Obtén 30% de descuento en tu primera compra",
      discount: "30% OFF",
      icon: <Gift className="w-6 h-6" />,
      color: "text-pink-600",
      bgGradient: "from-pink-500 to-rose-500",
    },
    {
      id: 2,
      title: "Evento Flash",
      description: "Solo por hoy: Envío gratis en todos los pedidos",
      discount: "GRATIS",
      icon: <Zap className="w-6 h-6" />,
      color: "text-yellow-600",
      bgGradient: "from-yellow-500 to-orange-500",
    },
    {
      id: 3,
      title: "Miembro Premium",
      description: "Únete y obtén beneficios exclusivos",
      discount: "VIP",
      icon: <Star className="w-6 h-6" />,
      color: "text-purple-600",
      bgGradient: "from-purple-500 to-indigo-500",
    },
  ]

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-bold text-gray-900">Ofertas Especiales</h3>
      </motion.div>

      <div className="space-y-3">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="p-4 border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${offer.bgGradient} text-white`}>{offer.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {offer.title}
                    </h4>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`bg-gradient-to-r ${offer.bgGradient} text-white border-0 mb-2`}>
                    {offer.discount}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="block border-purple-200 hover:bg-purple-50 text-xs bg-transparent"
                  >
                    Reclamar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
