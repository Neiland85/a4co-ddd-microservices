import type { DashboardMetrics } from "@/hooks/use-dashboard-metrics"

export interface AnimationParams {
  intensity: number
  speed: number
  opacity: number
  scale: number
  colors: string[]
  particleCount: number
  pulseRate: number
}

// Constantes optimizadas para multiplicadores de actividad
const ACTIVITY_MULTIPLIERS = {
  low: 0.6,
  medium: 1.0,
  high: 1.4,
  critical: 1.8,
} as const

// Conjuntos de colores optimizados por nivel de actividad
const MONITOR_COLOR_SETS = {
  low: ["#64748b", "#94a3b8", "#cbd5e1"],
  medium: ["#3b82f6", "#06b6d4", "#8b5cf6"],
  high: ["#0ea5e9", "#06b6d4", "#3b82f6"],
  critical: ["#ef4444", "#f97316", "#eab308"],
} as const

// Conjuntos de colores para recomendaciones
const RECOMMENDATIONS_COLOR_SETS = {
  inactive: ["#f59e0b", "#d97706", "#92400e"],
  active: ["#f59e0b", "#d97706", "#fbbf24"],
  high: ["#f97316", "#ea580c", "#fb923c"],
  peak: ["#dc2626", "#ea580c", "#f59e0b"],
} as const

// Conjuntos de colores para comentarios
const COMMENTS_COLOR_SETS = {
  negative: ["#ef4444", "#dc2626", "#b91c1c"],
  neutral: ["#6b7280", "#9ca3af", "#d1d5db"],
  positive: ["#ec4899", "#be185d", "#f472b6"],
  excellent: ["#10b981", "#059669", "#34d399"],
} as const

// Conjuntos de colores para configuración
const SETTINGS_COLOR_SETS = {
  unstable: ["#ef4444", "#f97316", "#eab308"],
  stable: ["#10b981", "#059669", "#34d399"],
  optimal: ["#06b6d4", "#0891b2", "#0e7490"],
} as const

// Función de interpolación lineal optimizada
function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress
}

// Función de interpolación de colores
function interpolateColor(fromColor: string, toColor: string, progress: number): string {
  // Convertir colores hex a RGB
  const fromRgb = hexToRgb(fromColor)
  const toRgb = hexToRgb(toColor)
  
  if (!fromRgb || !toRgb) return fromColor
  
  const r = Math.round(lerp(fromRgb.r, toRgb.r, progress))
  const g = Math.round(lerp(fromRgb.g, toRgb.g, progress))
  const b = Math.round(lerp(fromRgb.b, toRgb.b, progress))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Función auxiliar para convertir hex a RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Función de interpolación de arrays de colores
function interpolateColors(fromColors: string[], toColors: string[], progress: number): string[] {
  return fromColors.map((fromColor, index) => {
    const toColor = toColors[index] || fromColor
    return interpolateColor(fromColor, toColor, progress)
  })
}

export function getMonitorAnimationParams(metrics: DashboardMetrics["monitor"]): AnimationParams {
  const baseIntensity = Math.min(2.5, (metrics.activeUsers / 1000) * ACTIVITY_MULTIPLIERS[metrics.activityLevel])
  const speed = Math.max(4, 12 - metrics.clickRate * 2)
  const opacity = Math.min(0.25, 0.1 + metrics.conversionRate / 20)

  return {
    intensity: baseIntensity,
    speed,
    opacity,
    scale: 0.8 + baseIntensity * 0.4,
    colors: MONITOR_COLOR_SETS[metrics.activityLevel],
    particleCount: Math.floor(6 + baseIntensity * 4),
    pulseRate: Math.max(2, 8 - metrics.userGrowth / 5),
  }
}

export function getRecommendationsAnimationParams(metrics: DashboardMetrics["recommendations"]): AnimationParams {
  const campaignMultiplier = {
    inactive: 0.4,
    active: 1.0,
    high: 1.6,
    peak: 2.2,
  }[metrics.campaignActivity]

  const roiNormalized = Math.min(2, metrics.roi / 200)
  const intensity = campaignMultiplier * roiNormalized
  const speed = Math.max(3, 10 - metrics.sentOffers * 0.3)

  return {
    intensity,
    speed,
    opacity: Math.min(0.3, 0.12 + intensity * 0.08),
    scale: 0.9 + intensity * 0.3,
    colors: RECOMMENDATIONS_COLOR_SETS[metrics.campaignActivity],
    particleCount: Math.floor(4 + intensity * 6),
    pulseRate: Math.max(1.5, 6 - metrics.conversionRate / 4),
  }
}

export function getCommentsAnimationParams(metrics: DashboardMetrics["comments"]): AnimationParams {
  const sentimentMultiplier = {
    negative: 0.3,
    neutral: 0.7,
    positive: 1.2,
    excellent: 1.8,
  }[metrics.sentiment]

  const engagementNormalized = metrics.engagementLevel / 100
  const intensity = sentimentMultiplier * engagementNormalized
  const speed = Math.max(5, 15 - metrics.averageRating * 2)

  return {
    intensity,
    speed,
    opacity: Math.min(0.2, 0.08 + intensity * 0.06),
    scale: 0.7 + intensity * 0.5,
    colors: COMMENTS_COLOR_SETS[metrics.sentiment],
    particleCount: Math.floor(3 + metrics.totalComments / 20),
    pulseRate: Math.max(3, 10 - metrics.averageRating * 1.5),
  }
}

export function getSettingsAnimationParams(metrics: DashboardMetrics["settings"]): AnimationParams {
  const stabilityMultiplier = {
    unstable: 1.8,
    stable: 1.0,
    optimal: 0.6,
  }[metrics.stabilityIndex]

  const healthNormalized = metrics.systemHealth / 100
  const intensity = (2 - healthNormalized) * stabilityMultiplier
  const speed = Math.max(8, 20 - metrics.userSatisfaction / 5)

  return {
    intensity,
    speed,
    opacity: Math.min(0.15, 0.05 + intensity * 0.05),
    scale: 0.6 + intensity * 0.2,
    colors: SETTINGS_COLOR_SETS[metrics.stabilityIndex],
    particleCount: Math.floor(2 + intensity * 3),
    pulseRate: Math.max(4, 12 - healthNormalized * 8),
  }
}

// Nueva función para transiciones suaves entre secciones
export function getTransitionAnimationParams(
  fromSection: string,
  toSection: string,
  progress: number,
  metrics: DashboardMetrics
): AnimationParams {
  let fromParams: AnimationParams
  let toParams: AnimationParams

  // Obtener parámetros de la sección origen
  switch (fromSection) {
    case "monitor":
      fromParams = getMonitorAnimationParams(metrics.monitor)
      break
    case "recommendations":
      fromParams = getRecommendationsAnimationParams(metrics.recommendations)
      break
    case "comments":
      fromParams = getCommentsAnimationParams(metrics.comments)
      break
    case "settings":
      fromParams = getSettingsAnimationParams(metrics.settings)
      break
    default:
      fromParams = getMonitorAnimationParams(metrics.monitor)
  }

  // Obtener parámetros de la sección destino
  switch (toSection) {
    case "monitor":
      toParams = getMonitorAnimationParams(metrics.monitor)
      break
    case "recommendations":
      toParams = getRecommendationsAnimationParams(metrics.recommendations)
      break
    case "comments":
      toParams = getCommentsAnimationParams(metrics.comments)
      break
    case "settings":
      toParams = getSettingsAnimationParams(metrics.settings)
      break
    default:
      toParams = getMonitorAnimationParams(metrics.monitor)
  }

  return {
    intensity: lerp(fromParams.intensity, toParams.intensity, progress),
    speed: lerp(fromParams.speed, toParams.speed, progress),
    opacity: lerp(fromParams.opacity, toParams.opacity, progress),
    scale: lerp(fromParams.scale, toParams.scale, progress),
    colors: interpolateColors(fromParams.colors, toParams.colors, progress),
    particleCount: Math.floor(lerp(fromParams.particleCount, toParams.particleCount, progress)),
    pulseRate: lerp(fromParams.pulseRate, toParams.pulseRate, progress),
  }
}

// Función auxiliar para obtener parámetros de cualquier sección
export function getSectionAnimationParams(section: string, metrics: DashboardMetrics): AnimationParams {
  switch (section) {
    case "monitor":
      return getMonitorAnimationParams(metrics.monitor)
    case "recommendations":
      return getRecommendationsAnimationParams(metrics.recommendations)
    case "comments":
      return getCommentsAnimationParams(metrics.comments)
    case "settings":
      return getSettingsAnimationParams(metrics.settings)
    default:
      return getMonitorAnimationParams(metrics.monitor)
  }
}
