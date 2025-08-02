"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Calendar, Clock, MapPin, Users, Star, Ticket } from "lucide-react"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  attendees: number
  rating: number
  category: string
  image: string
  price: string
}

const events: Event[] = [
  {
    id: 1,
    title: "Festival de Música Electrónica",
    description: "Los mejores DJs internacionales en una noche épica",
    date: "2024-02-15",
    time: "20:00",
    location: "Estadio Central",
    attendees: 5000,
    rating: 4.9,
    category: "Música",
    image: "/placeholder.svg?height=150&width=200",
    price: "Gratis",
  },
  {
    id: 2,
    title: "Exposición de Arte Digital",
    description: "Arte interactivo con realidad aumentada",
    date: "2024-02-18",
    time: "10:00",
    location: "Museo de Arte Moderno",
    attendees: 300,
    rating: 4.7,
    category: "Arte",
    image: "/placeholder.svg?height=150&width=200",
    price: "$15",
  },
  {
    id: 3,
    title: "Workshop de Cocina Molecular",
    description: "Aprende técnicas culinarias del futuro",
    date: "2024-02-20",
    time: "14:00",
    location: "Centro Gastronómico",
    attendees: 50,
    rating: 4.8,
    category: "Gastronomía",
    image: "/placeholder.svg?height=150&width=200",
    price: "$45",
  },
]

export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Música":
        return "from-purple-500 to-pink-500"
      case "Arte":
        return "from-blue-500 to-teal-500"
      case "Gastronomía":
        return "from-orange-500 to-red-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "Música":
        return "🎵"
      case "Arte":
        return "🎨"
      case "Gastronomía":
        return "👨‍🍳"
      default:
        return "📅"
    }
  }

  return (
    <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-6 shadow-2xl border-4 border-violet-400">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Calendar className="w-8 h-8 text-violet-400 mr-3" />
          Eventos Épicos
          <Star className="w-6 h-6 text-yellow-400 ml-2" />
        </h2>
        <p className="text-violet-200 mt-2">Próximas aventuras culturales</p>
      </motion.div>

      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, rotateY: 2 }}
            onClick={() => setSelectedEvent(event)}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 cursor-pointer hover:bg-white/20 transition-all"
          >
            <div className="flex space-x-4">
              <div className="relative">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                  className="absolute -top-2 -right-2 text-2xl"
                >
                  {getCategoryEmoji(event.category)}
                </motion.div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white text-lg leading-tight">{event.title}</h3>
                  <div
                    className={`bg-gradient-to-r ${getCategoryColor(event.category)} text-white px-2 py-1 rounded-full text-xs font-semibold`}
                  >
                    {event.price}
                  </div>
                </div>

                <p className="text-violet-200 text-sm mb-3 line-clamp-2">{event.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center text-violet-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-violet-200">
                    <MapPin className="w-3 h-3 mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-violet-200">
                    <Users className="w-3 h-3 mr-1" />
                    {event.attendees} asistentes
                  </div>
                  <div className="flex items-center text-violet-200">
                    <Star className="w-3 h-3 mr-1 text-yellow-400" />
                    {event.rating}
                  </div>
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} className="mt-3 flex justify-between items-center">
              <div className="text-white font-semibold">
                {new Date(event.date).toLocaleDateString("es-ES", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center"
              >
                <Ticket className="w-4 h-4 mr-1" />
                Reservar
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{getCategoryEmoji(selectedEvent.category)}</div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedEvent.title}</h3>
              <p className="text-gray-600 mt-2">{selectedEvent.description}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-semibold">{new Date(selectedEvent.date).toLocaleDateString("es-ES")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Hora:</span>
                <span className="font-semibold">{selectedEvent.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ubicación:</span>
                <span className="font-semibold">{selectedEvent.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Precio:</span>
                <span className="font-semibold text-green-600">{selectedEvent.price}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedEvent(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
              >
                Cerrar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 bg-gradient-to-r ${getCategoryColor(selectedEvent.category)} text-white py-3 rounded-xl font-semibold`}
              >
                ¡Reservar Ahora!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}
