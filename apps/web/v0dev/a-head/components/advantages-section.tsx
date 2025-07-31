"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Leaf, MapPin, Users, Shield, Heart, Truck } from "lucide-react"

export default function AdvantagesSection() {
  const advantages = [
    {
      icon: Leaf,
      title: "Productos Ecológicos",
      description: "Alimentos cultivados de forma sostenible, respetando el medio ambiente y sin químicos dañinos.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: MapPin,
      title: "Origen Local",
      description: "Conoce exactamente de dónde vienen tus alimentos y apoya a los productores de tu región.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Forma parte de una red que conecta productores y consumidores conscientes.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Shield,
      title: "Calidad Garantizada",
      description: "Todos nuestros productores pasan por un proceso de verificación riguroso.",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Heart,
      title: "Tradición Familiar",
      description: "Preservamos las técnicas artesanales transmitidas de generación en generación.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Truck,
      title: "Entrega Directa",
      description: "Recibe productos frescos directamente del productor a tu mesa.",
      color: "from-indigo-500 to-blue-600",
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir{" "}
            <span className="bg-gradient-to-r from-green-600 to-amber-500 bg-clip-text text-transparent">
              Jaén Artesanal
            </span>
            ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre las ventajas de conectar directamente con los productores locales y formar parte de una comunidad
            comprometida con la calidad y la sostenibilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${advantage.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{advantage.title}</h3>

                  <p className="text-gray-600 leading-relaxed">{advantage.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
