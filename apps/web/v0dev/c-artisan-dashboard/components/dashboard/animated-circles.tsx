"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import type { DashboardMetrics } from "@/hooks/use-dashboard-metrics"
import {
  getMonitorAnimationParams,
  getRecommendationsAnimationParams,
  getCommentsAnimationParams,
  getSettingsAnimationParams,
  type AnimationParams,
} from "@/utils/metrics-to-animation"

interface AnimatedCirclesProps {
  activeSection: string
  metrics: DashboardMetrics
}

export function AnimatedCircles({ activeSection, metrics }: AnimatedCirclesProps) {
  const [mounted, setMounted] = useState(false)
  const [animationParams, setAnimationParams] = useState<AnimationParams>({
    intensity: 1,
    speed: 8,
    opacity: 0.15,
    scale: 1,
    colors: ["#3b82f6", "#06b6d4", "#8b5cf6"],
    particleCount: 6,
    pulseRate: 4,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let params: AnimationParams

    switch (activeSection) {
      case "monitor":
        params = getMonitorAnimationParams(metrics.monitor)
        break
      case "recommendations":
        params = getRecommendationsAnimationParams(metrics.recommendations)
        break
      case "comments":
        params = getCommentsAnimationParams(metrics.comments)
        break
      case "settings":
        params = getSettingsAnimationParams(metrics.settings)
        break
      default:
        params = getMonitorAnimationParams(metrics.monitor)
    }

    setAnimationParams(params)
  }, [activeSection, metrics])

  if (!mounted) return null

  const circles = Array.from({ length: animationParams.particleCount }, (_, i) => ({
    id: i,
    size: (Math.random() * 150 + 100) * animationParams.scale,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    color: animationParams.colors[i % animationParams.colors.length],
    delay: i * 0.3,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {circles.map((circle) => (
        <motion.div
          key={`${activeSection}-${circle.id}-${animationParams.intensity}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: circle.size,
            height: circle.size,
            background: `radial-gradient(circle, ${circle.color}${Math.floor(animationParams.opacity * 255)
              .toString(16)
              .padStart(2, "0")}, transparent)`,
          }}
          initial={{
            x: `${circle.initialX}vw`,
            y: `${circle.initialY}vh`,
            scale: 0,
          }}
          animate={{
            x: [
              `${circle.initialX}vw`,
              `${(circle.initialX + 30 * animationParams.intensity) % 100}vw`,
              `${(circle.initialX + 60 * animationParams.intensity) % 100}vw`,
              `${circle.initialX}vw`,
            ],
            y: [
              `${circle.initialY}vh`,
              `${(circle.initialY + 20 * animationParams.intensity) % 100}vh`,
              `${(circle.initialY + 40 * animationParams.intensity) % 100}vh`,
              `${circle.initialY}vh`,
            ],
            scale: [0, animationParams.scale, animationParams.scale * 0.8, animationParams.scale],
            rotate: [0, 180 * animationParams.intensity, 360 * animationParams.intensity],
          }}
          transition={{
            duration: animationParams.speed + circle.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: circle.delay,
          }}
        />
      ))}

      {/* Círculo de pulso central basado en métricas */}
      <motion.div
        className="absolute top-1/2 left-1/2 rounded-full blur-2xl"
        style={{
          width: 200 * animationParams.scale,
          height: 200 * animationParams.scale,
          background: `radial-gradient(circle, ${animationParams.colors[0]}${Math.floor(
            animationParams.opacity * 0.5 * 255,
          )
            .toString(16)
            .padStart(2, "0")}, transparent)`,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [animationParams.opacity * 0.3, animationParams.opacity * 0.8, animationParams.opacity * 0.3],
        }}
        transition={{
          duration: animationParams.pulseRate,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Indicador visual de métricas críticas */}
      {activeSection === "monitor" && metrics.monitor.activityLevel === "critical" && (
        <motion.div
          className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      )}

      {activeSection === "recommendations" && metrics.recommendations.campaignActivity === "peak" && (
        <motion.div
          className="absolute top-4 right-4 w-4 h-4 bg-orange-500 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      )}
    </div>
  )
}
