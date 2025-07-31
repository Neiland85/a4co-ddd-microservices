"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/dashboard/header"
import { UserSettings } from "@/components/dashboard/user-settings"
import { ActivityMonitor } from "@/components/dashboard/activity-monitor"
import { InteractiveRecommendations } from "@/components/dashboard/interactive-recommendations"
import { CommentsAndRatings } from "@/components/dashboard/comments-and-ratings"
import { Footer } from "@/components/dashboard/footer"
import { NotificationSystem } from "@/components/dashboard/notification-system"
import { AnimatedCircles } from "@/components/dashboard/animated-circles"
import { useSectionTransition } from "@/hooks/use-section-transition"
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("monitor")
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: "info" | "success" | "warning" }>
  >([])

  const { isTransitioning } = useSectionTransition(activeSection)
  const metrics = useDashboardMetrics()

  // Simulación de notificaciones basadas en métricas
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = []

      // Notificaciones basadas en métricas del monitor
      if (metrics.monitor.activityLevel === "critical") {
        messages.push({
          message: `¡Actividad crítica! ${metrics.monitor.activeUsers} usuarios activos`,
          type: "warning" as const,
        })
      }

      // Notificaciones basadas en recomendaciones
      if (metrics.recommendations.campaignActivity === "peak") {
        messages.push({
          message: `Campaña en pico: ${metrics.recommendations.sentOffers} ofertas enviadas`,
          type: "success" as const,
        })
      }

      // Notificaciones basadas en comentarios
      if (metrics.comments.sentiment === "excellent") {
        messages.push({
          message: `Excelente feedback: ${metrics.comments.averageRating.toFixed(1)} estrellas promedio`,
          type: "success" as const,
        })
      } else if (metrics.comments.sentiment === "negative") {
        messages.push({
          message: `Atención: Rating bajo ${metrics.comments.averageRating.toFixed(1)} estrellas`,
          type: "warning" as const,
        })
      }

      // Notificaciones basadas en configuración del sistema
      if (metrics.settings.stabilityIndex === "unstable") {
        messages.push({
          message: `Sistema inestable: ${metrics.settings.systemHealth}% de salud`,
          type: "warning" as const,
        })
      }

      if (messages.length > 0) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            ...randomMessage,
          },
        ])
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [metrics])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Círculos animados basados en métricas */}
      <AnimatedCircles activeSection={activeSection} metrics={metrics} />

      {/* Overlay de transición con intensidad basada en métricas */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none z-5"
          />
        )}
      </AnimatePresence>

      <Header activeSection={activeSection} setActiveSection={setActiveSection} metrics={metrics} />

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              scale: { duration: 0.4 },
            }}
            className="space-y-8"
          >
            {activeSection === "settings" && <UserSettings metrics={metrics.settings} />}
            {activeSection === "monitor" && <ActivityMonitor metrics={metrics.monitor} />}
            {activeSection === "recommendations" && <InteractiveRecommendations metrics={metrics.recommendations} />}
            {activeSection === "comments" && <CommentsAndRatings metrics={metrics.comments} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <NotificationSystem notifications={notifications} onRemove={removeNotification} />
    </div>
  )
}
