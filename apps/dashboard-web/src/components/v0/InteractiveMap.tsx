'use client';

import { motion } from 'framer-motion';
import { Navigation, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Location {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  offers: number;
  rating: number;
}

const locations: Location[] = [
  {
    id: 1,
    name: 'Pizza Palace',
    type: 'restaurant',
    lat: 40.7128,
    lng: -74.006,
    offers: 3,
    rating: 4.8,
  },
  { id: 2, name: 'Spa Zen', type: 'wellness', lat: 40.7589, lng: -73.9851, offers: 2, rating: 4.9 },
  {
    id: 3,
    name: 'Adventure Park',
    type: 'entertainment',
    lat: 40.7505,
    lng: -73.9934,
    offers: 5,
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Tech Store',
    type: 'shopping',
    lat: 40.7282,
    lng: -73.9942,
    offers: 4,
    rating: 4.6,
  },
];

export default function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [pulsingLocations, setPulsingLocations] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const randomId = locations[Math.floor(Math.random() * locations.length)].id;
      setPulsingLocations(prev => ({
        ...prev,
        [randomId]: !prev[randomId],
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return '🍕';
      case 'wellness':
        return '🧘';
      case 'entertainment':
        return '🎢';
      case 'shopping':
        return '🛍️';
      default:
        return '📍';
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'from-orange-400 to-red-500';
      case 'wellness':
        return 'from-green-400 to-teal-500';
      case 'entertainment':
        return 'from-purple-400 to-pink-500';
      case 'shopping':
        return 'from-blue-400 to-indigo-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="rounded-3xl border-4 border-cyan-400 bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 p-6 shadow-2xl">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 flex items-center justify-between"
      >
        <h2 className="flex items-center text-3xl font-bold text-white">
          <Navigation className="mr-3 h-8 w-8 text-cyan-400" />
          Mapa de Aventuras
          <Zap className="ml-2 h-6 w-6 text-yellow-400" />
        </h2>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400"
        >
          <Navigation className="h-4 w-4 text-blue-900" />
        </motion.div>
      </motion.div>

      <div className="relative">
        {/* Simulated Map Background */}
        <div className="relative h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-green-200 via-blue-200 to-purple-200">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid h-full grid-cols-8 grid-rows-6">
              {[...Array(48)].map((_, i) => (
                <div key={i} className="border border-gray-400" />
              ))}
            </div>
          </div>

          {/* Animated Roads */}
          <motion.div
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="absolute left-0 top-1/2 h-1 w-full bg-yellow-400 opacity-60"
          />
          <motion.div
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
            className="absolute left-1/2 top-0 h-full w-1 bg-yellow-400 opacity-60"
          />

          {/* Location Markers */}
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              className="absolute cursor-pointer"
              style={{
                left: `${20 + index * 20}%`,
                top: `${30 + index * 15}%`,
              }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedLocation(location)}
              animate={
                pulsingLocations[location.id]
                  ? {
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0.7)',
                        '0 0 0 20px rgba(59, 130, 246, 0)',
                        '0 0 0 0 rgba(59, 130, 246, 0)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.5 }}
            >
              <div
                className={`h-12 w-12 bg-gradient-to-r ${getLocationColor(location.type)} flex items-center justify-center rounded-full border-2 border-white shadow-lg`}
              >
                <span className="text-xl">{getLocationIcon(location.type)}</span>
              </div>

              {/* Offers Badge */}
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
              >
                {location.offers}
              </motion.div>
            </motion.div>
          ))}

          {/* User Location */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0.7)',
                '0 0 0 15px rgba(34, 197, 94, 0)',
                '0 0 0 0 rgba(34, 197, 94, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-lg">
              <div className="h-3 w-3 rounded-full bg-white" />
            </div>
          </motion.div>
        </div>

        {/* Location Details Panel */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 rounded-2xl border-2 border-cyan-400 bg-white p-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center text-lg font-bold text-gray-800">
                  <span className="mr-2">{getLocationIcon(selectedLocation.type)}</span>
                  {selectedLocation.name}
                </h3>
                <p className="capitalize text-gray-600">{selectedLocation.type}</p>
                <div className="mt-2 flex items-center">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < Math.floor(selectedLocation.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{selectedLocation.rating}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-sm font-semibold text-white">
                  {selectedLocation.offers} ofertas
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => setSelectedLocation(null)}
                >
                  Cerrar
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
