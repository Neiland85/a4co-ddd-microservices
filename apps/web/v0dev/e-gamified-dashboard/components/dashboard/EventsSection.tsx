'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Star, Ticket } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  rating: number;
  category: string;
  image: string;
  price: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Festival de Música Electrónica',
    description: 'Los mejores DJs internacionales en una noche épica',
    date: '2024-02-15',
    time: '20:00',
    location: 'Estadio Central',
    attendees: 5000,
    rating: 4.9,
    category: 'Música',
    image: '/placeholder.svg?height=150&width=200',
    price: 'Gratis',
  },
  {
    id: 2,
    title: 'Exposición de Arte Digital',
    description: 'Arte interactivo con realidad aumentada',
    date: '2024-02-18',
    time: '10:00',
    location: 'Museo de Arte Moderno',
    attendees: 300,
    rating: 4.7,
    category: 'Arte',
    image: '/placeholder.svg?height=150&width=200',
    price: '$15',
  },
  {
    id: 3,
    title: 'Workshop de Cocina Molecular',
    description: 'Aprende técnicas culinarias del futuro',
    date: '2024-02-20',
    time: '14:00',
    location: 'Centro Gastronómico',
    attendees: 50,
    rating: 4.8,
    category: 'Gastronomía',
    image: '/placeholder.svg?height=150&width=200',
    price: '$45',
  },
];

export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Música':
        return 'from-purple-500 to-pink-500';
      case 'Arte':
        return 'from-blue-500 to-teal-500';
      case 'Gastronomía':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'Música':
        return '🎵';
      case 'Arte':
        return '🎨';
      case 'Gastronomía':
        return '👨‍🍳';
      default:
        return '📅';
    }
  };

  return (
    <div className="rounded-3xl border-4 border-violet-400 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-6 shadow-2xl">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
        <h2 className="flex items-center text-3xl font-bold text-white">
          <Calendar className="mr-3 h-8 w-8 text-violet-400" />
          Eventos Épicos
          <Star className="ml-2 h-6 w-6 text-yellow-400" />
        </h2>
        <p className="mt-2 text-violet-200">Próximas aventuras culturales</p>
      </motion.div>

      <div className="custom-scrollbar max-h-96 space-y-4 overflow-y-auto">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, rotateY: 2 }}
            onClick={() => setSelectedEvent(event)}
            className="cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <div className="flex space-x-4">
              <div className="relative">
                <img
                  src={event.image || '/placeholder.svg'}
                  alt={event.title}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                  className="absolute -right-2 -top-2 text-2xl"
                >
                  {getCategoryEmoji(event.category)}
                </motion.div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-lg font-bold leading-tight text-white">{event.title}</h3>
                  <div
                    className={`bg-gradient-to-r ${getCategoryColor(event.category)} rounded-full px-2 py-1 text-xs font-semibold text-white`}
                  >
                    {event.price}
                  </div>
                </div>

                <p className="mb-3 line-clamp-2 text-sm text-violet-200">{event.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center text-violet-200">
                    <Clock className="mr-1 h-3 w-3" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-violet-200">
                    <MapPin className="mr-1 h-3 w-3" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-violet-200">
                    <Users className="mr-1 h-3 w-3" />
                    {event.attendees} asistentes
                  </div>
                  <div className="flex items-center text-violet-200">
                    <Star className="mr-1 h-3 w-3 text-yellow-400" />
                    {event.rating}
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mt-3 flex items-center justify-between"
            >
              <div className="font-semibold text-white">
                {new Date(event.date).toLocaleDateString('es-ES', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-sm font-semibold text-white"
              >
                <Ticket className="mr-1 h-4 w-4" />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl bg-white p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 text-center">
              <div className="mb-2 text-4xl">{getCategoryEmoji(selectedEvent.category)}</div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedEvent.title}</h3>
              <p className="mt-2 text-gray-600">{selectedEvent.description}</p>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-semibold">
                  {new Date(selectedEvent.date).toLocaleDateString('es-ES')}
                </span>
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
                className="flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-800"
              >
                Cerrar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 bg-gradient-to-r ${getCategoryColor(selectedEvent.category)} rounded-xl py-3 font-semibold text-white`}
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
  );
}
