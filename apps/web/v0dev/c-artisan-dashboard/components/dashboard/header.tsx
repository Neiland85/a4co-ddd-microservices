"use client"

import { motion } from "framer-motion"
import { Bell, Settings, BarChart3, MessageSquare, Zap, AlertTriangle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { DashboardMetrics } from "@/hooks/use-dashboard-metrics"

interface HeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
  metrics: DashboardMetrics
}

export function Header({ activeSection, setActiveSection, metrics }: HeaderProps) {
  const navItems = [
    {
      id: "monitor",
      label: "Monitor",
      icon: BarChart3,
      status: metrics.monitor.activityLevel,
      indicator:
        metrics.monitor.activityLevel === "critical"
          ? "critical"
          : metrics.monitor.activityLevel === "high"
            ? "high"
            : "normal",
    },
    {
      id: "settings",
      label: "Configuración",
      icon: Settings,
      status: metrics.settings.stabilityIndex,
      indicator:
        metrics.settings.stabilityIndex === "unstable"
          ? "critical"
          : metrics.settings.stabilityIndex === "stable"
            ? "normal"
            : "optimal",
    },
    {
      id: "recommendations",
      label: "Recomendaciones",
      icon: Zap,
      status: metrics.recommendations.campaignActivity,
      indicator:
        metrics.recommendations.campaignActivity === "peak"
          ? "high"
          : metrics.recommendations.campaignActivity === "high"
            ? "normal"
            : "low",
    },
    {
      id: "comments",
      label: "Comentarios",
      icon: MessageSquare,
      status: metrics.comments.sentiment,
      indicator:
        metrics.comments.sentiment === "excellent"
          ? "optimal"
          : metrics.comments.sentiment === "positive"
            ? "normal"
            : metrics.comments.sentiment === "negative"
              ? "critical"
              : "low",
    },
  ]

  const getIndicatorColor = (indicator: string) => {
    switch (indicator) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "normal":
        return "bg-blue-500"
      case "optimal":
        return "bg-green-500"
      case "low":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getTotalNotifications = () => {
    let count = 0
    if (metrics.monitor.activityLevel === "critical") count++
    if (metrics.recommendations.campaignActivity === "peak") count++
    if (metrics.comments.sentiment === "negative") count++
    if (metrics.settings.stabilityIndex === "unstable") count++
    return Math.max(3, count) // Mínimo 3 para demo
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 relative overflow-hidden"
    >
      {/* Texturas decorativas en el header que responden a métricas */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-600/40 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1 + metrics.monitor.activeUsers / 5000, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-fuchsia-500/30 to-transparent"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold relative"
            >
              A4CO Dashboard
              {/* Indicador de actividad general */}
              <motion.div
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                  metrics.monitor.activityLevel === "critical"
                    ? "bg-red-500"
                    : metrics.monitor.activityLevel === "high"
                      ? "bg-orange-500"
                      : "bg-green-500"
                }`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </motion.div>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.div key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={activeSection === item.id ? "default" : "ghost"}
                    onClick={() => setActiveSection(item.id)}
                    className="flex items-center space-x-2 relative"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {/* Indicador de estado por sección */}
                    <motion.div
                      className={`w-2 h-2 rounded-full ${getIndicatorColor(item.indicator)}`}
                      animate={{
                        scale: item.indicator === "critical" ? [1, 1.5, 1] : [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: item.indicator === "critical" ? 1 : 3,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  </Button>
                </motion.div>
              )
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Indicadores de métricas críticas */}
            {metrics.monitor.activityLevel === "critical" && (
              <motion.div
                className="flex items-center space-x-1 text-red-600 text-sm"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{metrics.monitor.activeUsers}</span>
              </motion.div>
            )}

            {metrics.recommendations.campaignActivity === "peak" && (
              <motion.div
                className="flex items-center space-x-1 text-orange-600 text-sm"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{metrics.recommendations.sentOffers}</span>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.1 }}>
              <Button variant="outline" size="icon" className="relative bg-transparent">
                <Bell className="w-4 h-4" />
                <motion.div
                  key={getTotalNotifications()}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Badge className="absolute -top-2 -right-2 px-1 min-w-5 h-5">{getTotalNotifications()}</Badge>
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
