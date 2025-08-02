"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import type { DashboardMetrics } from "@/hooks/use-dashboard-metrics"
import type { AnimationParams } from "@/utils/metrics-to-animation"

interface SectionCirclesProps {
  section: string
  animationParams: AnimationParams
  metrics: Partial<DashboardMetrics>
}

export function SectionCircles({ section, animationParams, metrics }: SectionCirclesProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Obtener métricas específicas de la sección con valores por defecto
  const getSectionMetrics = () => {
    switch (section) {
      case "monitor":
        return {
          primary: metrics.monitor?.activeUsers || 1000,
          secondary: metrics.monitor?.clickRate || 3.0,
          tertiary: metrics.monitor?.conversionRate || 2.5,
        }
      case "recommendations":
        return {
          primary: metrics.recommendations?.sentOffers || 5,
          secondary: metrics.recommendations?.conversionRate || 12,
          tertiary: (metrics.recommendations?.roi || 300) / 10,
        }
      case "comments":
        return {
          primary: metrics.comments?.averageRating || 4.0,
          secondary: (metrics.comments?.engagementLevel || 75) / 10,
          tertiary: (metrics.comments?.totalComments || 100) / 10,
        }
      case "settings":
        return {
          primary: metrics.settings?.systemHealth || 90,
          secondary: metrics.settings?.userSatisfaction || 85,
          tertiary: metrics.settings?.activeConfigurations || 10,
        }
      default:
        return { primary: 50, secondary: 50, tertiary: 50 }
    }
  }

  const sectionMetrics = getSectionMetrics()

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Círculo principal que responde a la métrica principal */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{
          width: (200 + sectionMetrics.primary * 2) * animationParams.scale,
          height: (200 + sectionMetrics.primary * 2) * animationParams.scale,
          background: `radial-gradient(circle, ${animationParams.colors[0]}${Math.floor(animationParams.opacity * 255)
            .toString(16)
            .padStart(2, "0")}, transparent)`,
        }}
        animate={{
          x: ["-10%", "110%", "-10%"],
          y: ["-10%", "110%", "-10%"],
          scale: [
            animationParams.scale * 0.8,
            animationParams.scale * (1 + sectionMetrics.primary / 1000),
            animationParams.scale * 0.8,
          ],
        }}
        transition={{
          duration: animationParams.speed * (1 + sectionMetrics.primary / 1000),
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Círculo secundario que responde a la métrica secundaria */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: (150 + sectionMetrics.secondary * 3) * animationParams.scale,
          height: (150 + sectionMetrics.secondary * 3) * animationParams.scale,
          background: `radial-gradient(circle, ${animationParams.colors[1]}${Math.floor(
            animationParams.opacity * 0.8 * 255,
          )
            .toString(16)
            .padStart(2, "0")}, transparent)`,
          right: 0,
          top: "30%",
        }}
        animate={{
          x: ["10%", "-110%", "10%"],
          y: ["10%", "-10%", "10%"],
          scale: [1, 0.6 + sectionMetrics.secondary / 100, 1],
          rotate: [0, 360 * (sectionMetrics.secondary / 50), 720],
        }}
        transition={{
          duration: animationParams.speed * 0.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Círculo de acento que responde a la métrica terciaria */}
      <motion.div
        className="absolute rounded-full blur-xl"
        style={{
          width: (100 + sectionMetrics.tertiary * 2) * animationParams.scale,
          height: (100 + sectionMetrics.tertiary * 2) * animationParams.scale,
          background: `radial-gradient(circle, ${animationParams.colors[2]}${Math.floor(
            animationParams.opacity * 1.2 * 255,
          )
            .toString(16)
            .padStart(2, "0")}, transparent)`,
          bottom: "20%",
          left: "20%",
        }}
        animate={{
          x: ["0%", `${200 * (sectionMetrics.tertiary / 50)}%`, "0%"],
          y: ["0%", `${-100 * (sectionMetrics.tertiary / 50)}%`, "0%"],
          scale: [0.5, 1.5 * (sectionMetrics.tertiary / 50), 0.5],
          rotate: [0, 360, 720],
        }}
        transition={{
          duration: animationParams.speed * 1.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Partículas flotantes que responden a las métricas */}
      {Array.from({ length: Math.min(12, Math.floor(animationParams.particleCount * 1.5)) }).map((_, i) => {
        const metricInfluence = (sectionMetrics.primary + sectionMetrics.secondary + sectionMetrics.tertiary) / 300
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: (15 + i * 3 + metricInfluence * 10) * animationParams.scale,
              height: (15 + i * 3 + metricInfluence * 10) * animationParams.scale,
              background: `radial-gradient(circle, ${animationParams.colors[i % animationParams.colors.length]}${Math.floor(
                animationParams.opacity * 1.5 * 255,
              )
                .toString(16)
                .padStart(2, "0")}, transparent)`,
              left: `${10 + i * 8}%`,
              top: `${20 + i * 6}%`,
            }}
            animate={{
              y: [0, -30 * metricInfluence, 0],
              x: [0, Math.sin(i) * 20 * metricInfluence, 0],
              opacity: [
                animationParams.opacity * 0.3,
                animationParams.opacity * (0.8 + metricInfluence * 0.4),
                animationParams.opacity * 0.3,
              ],
              scale: [
                animationParams.scale * 0.8,
                animationParams.scale * (1.2 + metricInfluence * 0.3),
                animationParams.scale * 0.8,
              ],
            }}
            transition={{
              duration: (4 + i) * (1 + metricInfluence),
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        )
      })}

      {/* Indicadores de estado específicos por sección */}
      {section === "monitor" && metrics.monitor?.activityLevel === "critical" && (
        <motion.div
          className="absolute top-8 right-8 text-red-500 font-bold text-sm bg-red-50 px-2 py-1 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          Alta Actividad
        </motion.div>
      )}

      {section === "recommendations" && metrics.recommendations?.campaignActivity === "peak" && (
        <motion.div
          className="absolute top-8 right-8 text-orange-600 font-bold text-sm bg-orange-50 px-2 py-1 rounded-full"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          Campaña Pico
        </motion.div>
      )}

      {section === "comments" && metrics.comments?.sentiment === "excellent" && (
        <motion.div
          className="absolute top-8 right-8 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded-full"
          animate={{
            scale: [1, 1.03, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          Excelente
        </motion.div>
      )}

      {section === "settings" && metrics.settings?.stabilityIndex === "unstable" && (
        <motion.div
          className="absolute top-8 right-8 text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          Sistema Inestable
        </motion.div>
      )}
    </div>
  )
}
