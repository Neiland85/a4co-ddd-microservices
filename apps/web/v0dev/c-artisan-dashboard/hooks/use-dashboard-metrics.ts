"use client"

import { useState, useEffect } from "react"
import type { DashboardMetrics } from "./types" // Added import for DashboardMetrics type

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    monitor: {
      activeUsers: 1247,
      totalVisits: 8934,
      clickRate: 3.2,
      conversionRate: 2.8,
      userGrowth: 15.3,
      activityLevel: "high",
    },
    recommendations: {
      sentOffers: 0,
      targetUsers: 2800,
      conversionRate: 12.1,
      roi: 340,
      campaignActivity: "active",
    },
    comments: {
      averageRating: 4.2,
      totalComments: 156,
      verifiedComments: 89,
      sentiment: "positive",
      engagementLevel: 78,
    },
    settings: {
      activeConfigurations: 12,
      systemHealth: 95,
      userSatisfaction: 87,
      stabilityIndex: "optimal",
    },
  })

  // Simulación de métricas en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const newActiveUsers = Math.max(800, prev.monitor.activeUsers + Math.floor(Math.random() * 20 - 10))
        const newTotalVisits = prev.monitor.totalVisits + Math.floor(Math.random() * 8)
        const newClickRate = Math.max(1, prev.monitor.clickRate + (Math.random() * 0.4 - 0.2))
        const newConversionRate = Math.max(1, prev.monitor.conversionRate + (Math.random() * 0.2 - 0.1))

        // Determinar nivel de actividad basado en usuarios activos
        let activityLevel: "low" | "medium" | "high" | "critical" = "medium"
        if (newActiveUsers > 1500) activityLevel = "critical"
        else if (newActiveUsers > 1200) activityLevel = "high"
        else if (newActiveUsers > 900) activityLevel = "medium"
        else activityLevel = "low"

        // Determinar actividad de campaña basada en ofertas enviadas
        let campaignActivity: "inactive" | "active" | "high" | "peak" = "active"
        if (prev.recommendations.sentOffers > 15) campaignActivity = "peak"
        else if (prev.recommendations.sentOffers > 8) campaignActivity = "high"
        else if (prev.recommendations.sentOffers > 3) campaignActivity = "active"
        else campaignActivity = "inactive"

        // Determinar sentimiento basado en rating promedio
        let sentiment: "negative" | "neutral" | "positive" | "excellent" = "neutral"
        if (prev.comments.averageRating >= 4.5) sentiment = "excellent"
        else if (prev.comments.averageRating >= 3.5) sentiment = "positive"
        else if (prev.comments.averageRating >= 2.5) sentiment = "neutral"
        else sentiment = "negative"

        return {
          monitor: {
            ...prev.monitor,
            activeUsers: newActiveUsers,
            totalVisits: newTotalVisits,
            clickRate: newClickRate,
            conversionRate: newConversionRate,
            userGrowth: Math.max(0, prev.monitor.userGrowth + (Math.random() * 2 - 1)),
            activityLevel,
          },
          recommendations: {
            ...prev.recommendations,
            campaignActivity,
            conversionRate: Math.max(5, prev.recommendations.conversionRate + (Math.random() * 1 - 0.5)),
            roi: Math.max(200, prev.recommendations.roi + Math.floor(Math.random() * 20 - 10)),
          },
          comments: {
            ...prev.comments,
            averageRating: Math.max(1, Math.min(5, prev.comments.averageRating + (Math.random() * 0.2 - 0.1))),
            sentiment,
            engagementLevel: Math.max(
              0,
              Math.min(100, prev.comments.engagementLevel + Math.floor(Math.random() * 6 - 3)),
            ),
          },
          settings: {
            ...prev.settings,
            systemHealth: Math.max(70, Math.min(100, prev.settings.systemHealth + Math.floor(Math.random() * 4 - 2))),
            userSatisfaction: Math.max(
              60,
              Math.min(100, prev.settings.userSatisfaction + Math.floor(Math.random() * 4 - 2)),
            ),
            stabilityIndex:
              prev.settings.systemHealth > 90 ? "optimal" : prev.settings.systemHealth > 80 ? "stable" : "unstable",
          },
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return metrics
}
