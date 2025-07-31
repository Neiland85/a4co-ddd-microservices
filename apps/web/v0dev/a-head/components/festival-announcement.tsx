"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, Star, Ticket, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { festivalEvent } from "@/data/featured-businesses"

export function FestivalAnnouncement() {
  const floatingElements = Array.from({ length: 8 }, (_, i) => i)

  return (
    <section className="py-16 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        {floatingElements.map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-xl"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}

        {/* Music Notes */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`note-${i}`}
            className="absolute text-white/10 text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          >
            ♪
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            ¡Festival de Música Electrónica!
          </motion.h2>
          <motion.p
            className="text-xl text-purple-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            El evento más esperado del año está aquí
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/30 overflow-hidden">
              <div className="relative">
                <img
                  src={festivalEvent.image || "/placeholder.svg"}
                  alt={festivalEvent.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Floating Badge */}
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 text-lg">
                    <Music className="w-5 h-5 mr-2" />
                    FESTIVAL 2024
                  </Badge>
                </motion.div>
              </div>

              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Event Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">{festivalEvent.title}</h3>
                      <p className="text-purple-200">{festivalEvent.description}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-white">
                        <Calendar className="w-5 h-5 mr-3 text-pink-400" />
                        <span className="text-lg">{festivalEvent.date}</span>
                      </div>
                      <div className="flex items-center text-white">
                        <MapPin className="w-5 h-5 mr-3 text-pink-400" />
                        <span className="text-lg">{festivalEvent.location}</span>
                      </div>
                      <div className="flex items-center text-white">
                        <Clock className="w-5 h-5 mr-3 text-pink-400" />
                        <span className="text-lg">{festivalEvent.duration}</span>
                      </div>
                      <div className="flex items-center text-white">
                        <Ticket className="w-5 h-5 mr-3 text-pink-400" />
                        <span className="text-lg">Desde €{festivalEvent.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Artists Lineup */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-4">Lineup</h4>

                      {/* Headliner */}
                      <motion.div
                        className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-4 mb-4 border border-pink-500/30"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black mb-2">
                              HEADLINER
                            </Badge>
                            <h5 className="text-2xl font-bold text-white">{festivalEvent.headliner}</h5>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* Supporting Acts */}
                      <div className="space-y-2">
                        {festivalEvent.supportingActs.map((artist, index) => (
                          <motion.div
                            key={artist}
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">{artist}</span>
                              <div className="flex">
                                {[...Array(4)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl border-0 relative overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10 flex items-center justify-center">
                          <Ticket className="w-6 h-6 mr-2" />
                          Comprar Entradas
                        </span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
