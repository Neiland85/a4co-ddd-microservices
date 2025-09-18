import type { DashboardMetrics } from '@/hooks/use-dashboard-metrics';

export interface AnimationParams {
  intensity: number;
  speed: number;
  opacity: number;
  scale: number;
  colors: string[];
  particleCount: number;
  pulseRate: number;
}

export function getMonitorAnimationParams(metrics: DashboardMetrics['monitor']): AnimationParams {
  const baseIntensity = metrics.activeUsers / 1000; // Normalizar usuarios activos
  const activityMultiplier = {
    low: 0.6,
    medium: 1.0,
    high: 1.4,
    critical: 1.8,
  }[metrics.activityLevel];

  const intensity = Math.min(2.5, baseIntensity * activityMultiplier);
  const speed = Math.max(4, 12 - metrics.clickRate * 2); // Más clics = más rápido
  const opacity = Math.min(0.25, 0.1 + metrics.conversionRate / 20);

  // Colores basados en el nivel de actividad
  const colorSets = {
    low: ['#64748b', '#94a3b8', '#cbd5e1'],
    medium: ['#3b82f6', '#06b6d4', '#8b5cf6'],
    high: ['#0ea5e9', '#06b6d4', '#3b82f6'],
    critical: ['#ef4444', '#f97316', '#eab308'],
  };

  return {
    intensity,
    speed,
    opacity,
    scale: 0.8 + intensity * 0.4,
    colors: colorSets[metrics.activityLevel],
    particleCount: Math.floor(6 + intensity * 4),
    pulseRate: Math.max(2, 8 - metrics.userGrowth / 5),
  };
}

export function getRecommendationsAnimationParams(
  metrics: DashboardMetrics['recommendations']
): AnimationParams {
  const campaignMultiplier = {
    inactive: 0.4,
    active: 1.0,
    high: 1.6,
    peak: 2.2,
  }[metrics.campaignActivity];

  const roiNormalized = Math.min(2, metrics.roi / 200); // Normalizar ROI
  const intensity = campaignMultiplier * roiNormalized;
  const speed = Math.max(3, 10 - metrics.sentOffers * 0.3);

  // Colores más intensos para mayor actividad de campaña
  const colorSets = {
    inactive: ['#f59e0b', '#d97706', '#92400e'],
    active: ['#f59e0b', '#d97706', '#fbbf24'],
    high: ['#f97316', '#ea580c', '#fb923c'],
    peak: ['#dc2626', '#ea580c', '#f59e0b'],
  };

  return {
    intensity,
    speed,
    opacity: Math.min(0.3, 0.12 + intensity * 0.08),
    scale: 0.9 + intensity * 0.3,
    colors: colorSets[metrics.campaignActivity],
    particleCount: Math.floor(4 + intensity * 6),
    pulseRate: Math.max(1.5, 6 - metrics.conversionRate / 4),
  };
}

export function getCommentsAnimationParams(metrics: DashboardMetrics['comments']): AnimationParams {
  const sentimentMultiplier = {
    negative: 0.3,
    neutral: 0.7,
    positive: 1.2,
    excellent: 1.8,
  }[metrics.sentiment];

  const engagementNormalized = metrics.engagementLevel / 100;
  const intensity = sentimentMultiplier * engagementNormalized;
  const speed = Math.max(5, 15 - metrics.averageRating * 2);

  // Colores basados en el sentimiento
  const colorSets = {
    negative: ['#ef4444', '#dc2626', '#b91c1c'],
    neutral: ['#6b7280', '#9ca3af', '#d1d5db'],
    positive: ['#ec4899', '#be185d', '#f472b6'],
    excellent: ['#10b981', '#059669', '#34d399'],
  };

  return {
    intensity,
    speed,
    opacity: Math.min(0.2, 0.08 + intensity * 0.06),
    scale: 0.7 + intensity * 0.5,
    colors: colorSets[metrics.sentiment],
    particleCount: Math.floor(3 + metrics.totalComments / 20),
    pulseRate: Math.max(3, 10 - metrics.averageRating * 1.5),
  };
}

export function getSettingsAnimationParams(metrics: DashboardMetrics['settings']): AnimationParams {
  const stabilityMultiplier = {
    unstable: 1.8,
    stable: 1.0,
    optimal: 0.6,
  }[metrics.stabilityIndex];

  const healthNormalized = metrics.systemHealth / 100;
  const intensity = (2 - healthNormalized) * stabilityMultiplier; // Menos salud = más movimiento
  const speed = Math.max(8, 20 - metrics.userSatisfaction / 5); // Más satisfacción = más lento

  // Colores basados en la estabilidad del sistema
  const colorSets = {
    unstable: ['#ef4444', '#f97316', '#eab308'],
    stable: ['#10b981', '#059669', '#34d399'],
    optimal: ['#06b6d4', '#0891b2', '#0e7490'],
  };

  return {
    intensity,
    speed,
    opacity: Math.min(0.15, 0.05 + intensity * 0.05),
    scale: 0.6 + intensity * 0.2,
    colors: colorSets[metrics.stabilityIndex],
    particleCount: Math.floor(2 + intensity * 3),
    pulseRate: Math.max(4, 12 - healthNormalized * 8),
  };
}
