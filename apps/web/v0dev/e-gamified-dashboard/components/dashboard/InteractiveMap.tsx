"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Navigation, Zap } from "lucide-react"

interface Location {
  id: number
  name: string
  type: string
  lat: number
  lng: number
  offers: number
  rating: number
}

const locations: Location[] = [
  { id: 1, name: "Pizza Palace", type: "restaurant", lat: 40.7128, lng: -74.006, offers: 3, rating: 4.8 },
  { id: 2, name: "Spa Zen", type: "wellness", lat: 40.7589, lng: -73.9851, offers: 2, rating: 4.9 },
  { id: 3, name: "Adventure Park", type: "entertainment", lat: 40.7505, lng: -73.9934, offers: 5, rating: 4.7 },
  { id: 4, name: "Tech Store", type: "shopping", lat: 40.7282, lng: -73.9942, offers: 4, rating: 4.6 },
]

export default function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [pulsingLocations, setPulsingLocations] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const interval = setInterval(() => {
      const randomId = locations[Math.floor(Math.random() * locations.length)].id
      setPulsingLocations((prev) => ({
        ...prev,
        [randomId]: !prev[randomId],
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return "🍕"
      case "wellness":
        return "🧘"
      case "entertainment":
        return "🎢"
      case "shopping":
        return "🛍️"
      default:
        return "📍"
    }
  }

  const getLocationColor = (type: string) => {
    switch (type) {
      case "restaurant":
        return "from-orange-400 to-red-500"
      case "wellness":
        return "from-green-400 to-teal-500"
      case "entertainment":
        return "from-purple-400 to-pink-500"
      case "shopping":
        return "from-blue-400 to-indigo-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  return (
    <div className="bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 rounded-3xl p-6 shadow-2xl border-4 border-cyan-400">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Navigation className="w-8 h-8 text-cyan-400 mr-3" />
          Mapa de Aventuras
          <Zap className="w-6 h-6 text-yellow-400 ml-2" />
        </h2>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
        >
          <Navigation className="w-4 h-4 text-blue-900" />
        </motion.div>
      </motion.div>

      <div className="relative">
        {/* Simulated Map Background */}
        <div className="bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 rounded-2xl h-96 relative overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-6 h-full">
              {[...Array(48)].map((_, i) => (
                <div key={i} className="border border-gray-400" />
              ))}
            </div>
          </div>

          {/* Animated Roads */}
          <motion.div
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 opacity-60"
          />
          <motion.div
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
            className="absolute top-0 left-1/2 w-1 h-full bg-yellow-400 opacity-60"
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
                        "0 0 0 0 rgba(59, 130, 246, 0.7)",
                        "0 0 0 20px rgba(59, 130, 246, 0)",
                        "0 0 0 0 rgba(59, 130, 246, 0)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.5 }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${getLocationColor(location.type)} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}
              >
                <span className="text-xl">{getLocationIcon(location.type)}</span>
              </div>

              {/* Offers Badge */}
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
              >
                {location.offers}
              </motion.div>
            </motion.div>
          ))}

          {/* User Location */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 rgba(34, 197, 94, 0.7)",
                "0 0 0 15px rgba(34, 197, 94, 0)",
                "0 0 0 0 rgba(34, 197, 94, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Location Details Panel */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl border-2 border-cyan-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-800 flex items-center">
                  <span className="mr-2">{getLocationIcon(selectedLocation.type)}</span>
                  {selectedLocation.name}
                </h3>
                <p className="text-gray-600 capitalize">{selectedLocation.type}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < Math.floor(selectedLocation.rating) ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{selectedLocation.rating}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedLocation.offers} ofertas
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
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
  )
}
