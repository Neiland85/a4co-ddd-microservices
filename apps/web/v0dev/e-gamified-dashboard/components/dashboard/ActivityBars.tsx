"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Utensils, Brain, TrendingUp } from "lucide-react"

interface ActivityData {
  id: string
  name: string
  value: number
  maxValue: number
  color: string
  icon: React.ReactNode
  temperature: number
}

export default function ActivityBars() {
  const [activities, setActivities] = useState<ActivityData[]>([
    {
      id: "food",
      name: "Actividades Alimenticias",
      value: 75,
      maxValue: 100,
      color: "from-orange-400 to-red-500",
      icon: <Utensils className="w-6 h-6" />,
      temperature: 75,
    },
    {
      id: "ai",
      name: "Actividades con IA",
      value: 60,
      maxValue: 100,
      color: "from-blue-400 to-purple-500",
      icon: <Brain className="w-6 h-6" />,
      temperature: 60,
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities((prev) =>
        prev.map((activity) => ({
          ...activity,
          value: Math.max(0, Math.min(100, activity.value + (Math.random() - 0.5) * 10)),
          temperature: Math.max(0, Math.min(100, activity.temperature + (Math.random() - 0.5) * 5)),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getTemperatureColor = (temp: number) => {
    if (temp < 30) return "from-blue-400 to-cyan-500"
    if (temp < 60) return "from-yellow-400 to-orange-500"
    return "from-orange-500 to-red-600"
  }

  const getTemperatureEmoji = (temp: number) => {
    if (temp < 30) return "🧊"
    if (temp < 60) return "🌡️"
    return "🔥"
  }

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 shadow-2xl border-4 border-emerald-400">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <TrendingUp className="w-8 h-8 text-emerald-400 mr-3" />
          Barras de Actividad
        </h2>
        <p className="text-emerald-200 mt-2">Termómetros gamificados de progreso</p>
      </motion.div>

      <div className="space-y-8">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                  className="text-white"
                >
                  {activity.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white">{activity.name}</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{Math.round(activity.value)}%</div>
                <div className="text-sm text-emerald-200">Completado</div>
              </div>
            </div>

            {/* Thermometer Container */}
            <div className="flex items-center space-x-4">
              {/* Thermometer */}
              <div className="relative">
                <div className="w-8 h-48 bg-gray-300 rounded-full relative overflow-hidden">
                  {/* Thermometer Background */}
                  <div className="absolute bottom-0 w-full bg-gray-400 rounded-full" style={{ height: "100%" }} />

                  {/* Temperature Fill */}
                  <motion.div
                    className={`absolute bottom-0 w-full bg-gradient-to-t ${getTemperatureColor(activity.temperature)} rounded-full`}
                    initial={{ height: 0 }}
                    animate={{ height: `${activity.temperature}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />

                  {/* Thermometer Bulb */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full border-4 border-white shadow-lg" />

                  {/* Temperature Marks */}
                  {[25, 50, 75].map((mark) => (
                    <div key={mark} className="absolute right-0 w-2 h-0.5 bg-white" style={{ bottom: `${mark}%` }} />
                  ))}
                </div>

                {/* Temperature Display */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -right-16 top-1/2 transform -translate-y-1/2 bg-white rounded-lg px-3 py-2 shadow-lg"
                >
                  <div className="text-center">
                    <div className="text-2xl">{getTemperatureEmoji(activity.temperature)}</div>
                    <div className="text-lg font-bold text-gray-800">{Math.round(activity.temperature)}°</div>
                  </div>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="flex-1">
                <div className="mb-2">
                  <div className="flex justify-between text-white text-sm">
                    <span>Progreso</span>
                    <span>
                      {Math.round(activity.value)}/{activity.maxValue}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-white/20 rounded-full h-6 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${activity.color} relative`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(activity.value / activity.maxValue) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    {/* Animated Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                    />
                  </motion.div>
                </div>

                {/* Activity Stats */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{Math.round(activity.value * 0.8)}</div>
                    <div className="text-xs text-emerald-200">Puntos ganados</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{Math.round(activity.value * 0.3)}</div>
                    <div className="text-xs text-emerald-200">Logros desbloqueados</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
