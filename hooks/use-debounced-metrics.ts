'use client';

import { useState, useEffect, useMemo } from 'react';
import type { DashboardMetrics } from './types';

/**
 * Hook para debounce de métricas del dashboard
 * Evita actualizaciones excesivas de animaciones basadas en métricas
 * @param metrics - Métricas actuales del dashboard
 * @param delay - Delay en milisegundos (default: 100ms)
 * @returns Métricas debounced para uso en animaciones
 */
export function useDebouncedMetrics(
  metrics: DashboardMetrics,
  delay: number = 100,
): DashboardMetrics {
  const [debouncedMetrics, setDebouncedMetrics] = useState<DashboardMetrics>(metrics);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMetrics(metrics);
    }, delay);

    return () => clearTimeout(timer);
  }, [metrics, delay]);

  // Memoización para evitar re-renderizados innecesarios
  return useMemo(() => debouncedMetrics, [debouncedMetrics]);
}

/**
 * Hook para métricas con throttling
 * Útil para animaciones que necesitan actualizaciones más frecuentes
 * @param metrics - Métricas actuales del dashboard
 * @param interval - Intervalo mínimo entre actualizaciones (default: 50ms)
 * @returns Métricas throttled para uso en animaciones
 */
export function useThrottledMetrics(
  metrics: DashboardMetrics,
  interval: number = 50,
): DashboardMetrics {
  const [throttledMetrics, setThrottledMetrics] = useState<DashboardMetrics>(metrics);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdate >= interval) {
      setThrottledMetrics(metrics);
      setLastUpdate(now);
    }
  }, [metrics, interval, lastUpdate]);

  return useMemo(() => throttledMetrics, [throttledMetrics]);
}

/**
 * Hook para métricas con interpolación suave
 * Crea transiciones suaves entre valores de métricas
 * @param metrics - Métricas actuales del dashboard
 * @param smoothing - Factor de suavizado (0-1, default: 0.1)
 * @returns Métricas interpoladas para animaciones suaves
 */
export function useSmoothMetrics(
  metrics: DashboardMetrics,
  smoothing: number = 0.1,
): DashboardMetrics {
  const [smoothMetrics, setSmoothMetrics] = useState<DashboardMetrics>(metrics);

  useEffect(() => {
    setSmoothMetrics(prev => ({
      monitor: {
        activeUsers:
          prev.monitor.activeUsers +
          (metrics.monitor.activeUsers - prev.monitor.activeUsers) * smoothing,
        totalVisits:
          prev.monitor.totalVisits +
          (metrics.monitor.totalVisits - prev.monitor.totalVisits) * smoothing,
        clickRate:
          prev.monitor.clickRate + (metrics.monitor.clickRate - prev.monitor.clickRate) * smoothing,
        conversionRate:
          prev.monitor.conversionRate +
          (metrics.monitor.conversionRate - prev.monitor.conversionRate) * smoothing,
        userGrowth:
          prev.monitor.userGrowth +
          (metrics.monitor.userGrowth - prev.monitor.userGrowth) * smoothing,
        activityLevel: metrics.monitor.activityLevel, // No interpolar enums
      },
      recommendations: {
        sentOffers:
          prev.recommendations.sentOffers +
          (metrics.recommendations.sentOffers - prev.recommendations.sentOffers) * smoothing,
        targetUsers:
          prev.recommendations.targetUsers +
          (metrics.recommendations.targetUsers - prev.recommendations.targetUsers) * smoothing,
        conversionRate:
          prev.recommendations.conversionRate +
          (metrics.recommendations.conversionRate - prev.recommendations.conversionRate) *
            smoothing,
        roi:
          prev.recommendations.roi +
          (metrics.recommendations.roi - prev.recommendations.roi) * smoothing,
        campaignActivity: metrics.recommendations.campaignActivity, // No interpolar enums
      },
      comments: {
        averageRating:
          prev.comments.averageRating +
          (metrics.comments.averageRating - prev.comments.averageRating) * smoothing,
        totalComments:
          prev.comments.totalComments +
          (metrics.comments.totalComments - prev.comments.totalComments) * smoothing,
        verifiedComments:
          prev.comments.verifiedComments +
          (metrics.comments.verifiedComments - prev.comments.verifiedComments) * smoothing,
        sentiment: metrics.comments.sentiment, // No interpolar enums
        engagementLevel:
          prev.comments.engagementLevel +
          (metrics.comments.engagementLevel - prev.comments.engagementLevel) * smoothing,
      },
      settings: {
        activeConfigurations:
          prev.settings.activeConfigurations +
          (metrics.settings.activeConfigurations - prev.settings.activeConfigurations) * smoothing,
        systemHealth:
          prev.settings.systemHealth +
          (metrics.settings.systemHealth - prev.settings.systemHealth) * smoothing,
        userSatisfaction:
          prev.settings.userSatisfaction +
          (metrics.settings.userSatisfaction - prev.settings.userSatisfaction) * smoothing,
        stabilityIndex: metrics.settings.stabilityIndex, // No interpolar enums
      },
    }));
  }, [metrics, smoothing]);

  return useMemo(() => smoothMetrics, [smoothMetrics]);
}
