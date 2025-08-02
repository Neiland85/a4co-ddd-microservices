"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Trophy, Flame } from "lucide-react"
import OffersCarousel from "@/components/dashboard/OffersCarousel"
import InteractiveMap from "@/components/dashboard/InteractiveMap"
import EventsSection from "@/components/dashboard/EventsSection"
import ActivityBars from "@/components/dashboard/ActivityBars"
import ExplosionEffect from "@/components/dashboard/ExplosionEffect"
import FlamencoPlayer from "@/components/FlamencoPlayer"

export default function GamifiedDashboard() {
  const [explosions, setExplosions] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [userStats, setUserStats] = useState({
    level: 12,
    xp: 2450,
    maxXp: 3000,
    streak: 7,
    achievements: 23,
  })

  const handleOfferExplosion = (x: number, y: number) => {
    const newExplosion = { id: Date.now(), x, y }
    setExplosions((prev) => [...prev, newExplosion])

    // Remove explosion after animation
    setTimeout(() => {
      setExplosions((prev) => prev.filter((exp) => exp.id !== newExplosion.id))
    }, 2000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hypnotic Black and White Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Main Hypnotic Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {/* Concentric Hypnotic Rings */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: `${(i + 1) * 50}px`,
                  height: `${(i + 1) * 50}px`,
                  left: `${-(i + 1) * 25}px`,
                  top: `${-(i + 1) * 25}px`,
                  borderColor: i % 2 === 0 ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)",
                  borderWidth: `${Math.max(1, 3 - i * 0.1)}px`,
                  backgroundColor: i % 3 === 0 ? "rgba(255,255,255,0.05)" : "transparent",
                }}
                animate={{
                  opacity: [0.1, 0.7, 0.1],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 4 + i * 0.15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Multiple Hypnotic Circles */}
        {[
          { x: "15%", y: "25%", size: 200, speed: 8 },
          { x: "85%", y: "75%", size: 300, speed: 12 },
          { x: "10%", y: "85%", size: 150, speed: 6 },
          { x: "90%", y: "15%", size: 250, speed: 10 },
          { x: "50%", y: "10%", size: 180, speed: 7 },
          { x: "30%", y: "90%", size: 220, speed: 9 },
        ].map((circle, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: circle.x, top: circle.y }}
            animate={{ rotate: index % 2 === 0 ? -360 : 360 }}
            transition={{
              duration: circle.speed,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: `${(i + 1) * (circle.size / 10)}px`,
                  height: `${(i + 1) * (circle.size / 10)}px`,
                  left: `${-(i + 1) * (circle.size / 20)}px`,
                  top: `${-(i + 1) * (circle.size / 20)}px`,
                  borderColor: i % 2 === 0 ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.25)",
                  borderWidth: "1px",
                }}
                animate={{
                  opacity: [0.05, 0.5, 0.05],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{
                  duration: 5 + i * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.3 + i * 0.1,
                }}
              />
            ))}
          </motion.div>
        ))}

        {/* Morphing Background Shapes */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 500 - 250, 0],
              y: [0, Math.random() * 500 - 250, 0],
              scale: [0.3, 2.5, 0.3],
              opacity: [0.02, 0.3, 0.02],
              rotate: [0, 720],
              borderRadius: ["0%", "50%", "25%", "0%"],
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: Math.random() * 8,
            }}
          >
            {i % 5 === 0 ? (
              <div className="w-24 h-24 bg-white/8" />
            ) : i % 5 === 1 ? (
              <div className="w-20 h-20 bg-black/15 rounded-full" />
            ) : i % 5 === 2 ? (
              <div className="w-16 h-32 bg-white/12 transform rotate-45" />
            ) : i % 5 === 3 ? (
              <div className="w-32 h-16 bg-black/8 rounded-full" />
            ) : (
              <div className="w-20 h-20 bg-white/10 transform rotate-12" />
            )}
          </motion.div>
        ))}

        {/* Dynamic Pulsating Overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.4) 40%, rgba(255,255,255,0.03) 100%)",
              "radial-gradient(circle at 20% 80%, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.12) 40%, rgba(0,0,0,0.5) 100%)",
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.25) 40%, rgba(255,255,255,0.06) 100%)",
              "radial-gradient(circle at 60% 40%, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.08) 40%, rgba(0,0,0,0.3) 100%)",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Explosion Effects */}
      {explosions.map((explosion) => (
        <ExplosionEffect key={explosion.id} x={explosion.x} y={explosion.y} />
      ))}

      <div className="relative z-10 p-6">
        {/* Header with User Stats */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <div className="bg-black/30 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl"
                >
                  <Trophy className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">¡Navegador Épico!</h1>
                  <p className="text-yellow-200">
                    Nivel {userStats.level} • {userStats.achievements} Logros
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <motion.div whileHover={{ scale: 1.1 }} className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{userStats.streak}</div>
                  <div className="text-sm text-white">Días seguidos</div>
                  <Flame className="w-6 h-6 text-orange-400 mx-auto mt-1" />
                </motion.div>

                <div className="w-48">
                  <div className="flex justify-between text-white text-sm mb-1">
                    <span>XP</span>
                    <span>
                      {userStats.xp}/{userStats.maxXp}
                    </span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-3 backdrop-blur-sm">
                    <motion.div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(userStats.xp / userStats.maxXp) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Offers Carousel */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <OffersCarousel onOfferExplosion={handleOfferExplosion} />
            </motion.div>

            {/* Interactive Map */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <InteractiveMap />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Activity Bars */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <ActivityBars />
            </motion.div>

            {/* Events Section */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <EventsSection />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reproductor de Música Flamenca */}
      <FlamencoPlayer />
    </div>
  )
}
