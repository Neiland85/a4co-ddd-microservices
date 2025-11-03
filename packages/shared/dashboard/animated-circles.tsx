'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, useCallback } from 'react';
import type { DashboardMetrics } from '@/hooks/use-dashboard-metrics';
import {
  getMonitorAnimationParams,
  getRecommendationsAnimationParams,
  getCommentsAnimationParams,
  getSettingsAnimationParams,
  type AnimationParams,
} from '@/utils/metrics-to-animation';

interface AnimatedCirclesProps {
  activeSection: string;
  metrics: DashboardMetrics;
}

export function AnimatedCircles({ activeSection, metrics }: AnimatedCirclesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parámetros de animación memoizados para evitar recálculos
  const animationParams = useMemo(() => {
    switch (activeSection) {
      case 'monitor':
        return getMonitorAnimationParams(metrics.monitor);
      case 'recommendations':
        return getRecommendationsAnimationParams(metrics.recommendations);
      case 'comments':
        return getCommentsAnimationParams(metrics.comments);
      case 'settings':
        return getSettingsAnimationParams(metrics.settings);
      default:
        return getMonitorAnimationParams(metrics.monitor);
    }
  }, [activeSection, metrics]);

  // Círculos memoizados para evitar recreación en cada render
  const circles = useMemo(
    () =>
      Array.from({ length: animationParams.particleCount }, (_, i) => ({
        id: i,
        size: (Math.random() * 150 + 100) * animationParams.scale,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        color: animationParams.colors[i % animationParams.colors.length],
        delay: i * 0.3,
      })),
    [animationParams.particleCount, animationParams.scale, animationParams.colors],
    [animationParams.particleCount, animationParams.scale, animationParams.colors]
  );

  // Función de animación optimizada
  const getCircleAnimation = useCallback(
    (circle: (typeof circles)[0]) => ({
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
    }),
    [animationParams.intensity, animationParams.scale],
    [animationParams.intensity, animationParams.scale]
  );

  // Función de transición optimizada
  const getCircleTransition = useCallback(
    (circle: (typeof circles)[0]) => ({
      duration: animationParams.speed + circle.delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
      delay: circle.delay,
    }),
    [animationParams.speed],
    [animationParams.speed]
  );

  // Función para renderizar círculo individual
  const renderCircle = useCallback(
    (circle: (typeof circles)[0]) => (
      <motion.div
        key={`${activeSection}-${circle.id}-${animationParams.intensity}`}
        className="absolute rounded-full blur-3xl"
        style={{
          width: circle.size,
          height: circle.size,
          background: `radial-gradient(circle, ${circle.color}${Math.floor(
            animationParams.opacity * 255,
            animationParams.opacity * 255
          )
            .toString(16)
            .padStart(2, '0')}, transparent)`,
        }}
        initial={{
          x: `${circle.initialX}vw`,
          y: `${circle.initialY}vh`,
          scale: 0,
        }}
        animate={getCircleAnimation(circle)}
        transition={getCircleTransition(circle)}
      />
    ),
    [
      activeSection,
      animationParams.intensity,
      animationParams.opacity,
      getCircleAnimation,
      getCircleTransition,
    ],
    ]
  );

  // Función para renderizar indicadores de estado
  const renderStatusIndicators = useCallback(
    () => (
      <>
        {activeSection === 'monitor' && metrics.monitor.activityLevel === 'critical' && (
          <motion.div
            className="absolute right-4 top-4 h-4 w-4 rounded-full bg-red-500"
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

        {activeSection === 'recommendations' &&
          metrics.recommendations.campaignActivity === 'peak' && (
            <motion.div
              className="absolute right-4 top-4 h-4 w-4 rounded-full bg-orange-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          )}
      </>
    ),
    [activeSection, metrics.monitor.activityLevel, metrics.recommendations.campaignActivity],
    [activeSection, metrics.monitor.activityLevel, metrics.recommendations.campaignActivity]
  );

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Círculos animados optimizados */}
      {circles.map(renderCircle)}

      {/* Círculo de pulso central optimizado */}
      <motion.div
        className="absolute left-1/2 top-1/2 rounded-full blur-2xl"
        style={{
          width: 200 * animationParams.scale,
          height: 200 * animationParams.scale,
          background: `radial-gradient(circle, ${animationParams.colors[0]}${Math.floor(
            animationParams.opacity * 0.5 * 255,
            animationParams.opacity * 0.5 * 255
          )
            .toString(16)
            .padStart(2, '0')}, transparent)`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [
            animationParams.opacity * 0.3,
            animationParams.opacity * 0.8,
            animationParams.opacity * 0.3,
          ],
        }}
        transition={{
          duration: animationParams.pulseRate,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      {/* Indicadores de estado optimizados */}
      {renderStatusIndicators()}
    </div>
  );
}
