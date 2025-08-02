"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  loadTime: number
  renderTime: number
  isOptimal: boolean
}

export function usePerformanceMonitor(
  options: {
    enableAutoStart?: boolean
    sampleInterval?: number
    memoryThreshold?: number
    fpsThreshold?: number
  } = {},
) {
  const { enableAutoStart = true, sampleInterval = 1000, memoryThreshold = 50, fpsThreshold = 30 } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    isOptimal: true,
  })

  const [isMonitoring, setIsMonitoring] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())

  const measurePerformance = useCallback(() => {
    const now = performance.now()
    const deltaTime = now - lastTimeRef.current

    if (deltaTime >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime)

      // Get memory usage if available
      const memoryInfo = (performance as any).memory
      const memoryUsage = memoryInfo ? Math.round((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100) : 0

      const newMetrics: PerformanceMetrics = {
        fps,
        memoryUsage,
        loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 0,
        renderTime: deltaTime,
        isOptimal: fps >= fpsThreshold && memoryUsage <= memoryThreshold,
      }

      setMetrics(newMetrics)

      frameCountRef.current = 0
      lastTimeRef.current = now
    }

    frameCountRef.current++
  }, [fpsThreshold, memoryThreshold])

  const startMonitoring = useCallback(() => {
    if (!isMonitoring) {
      setIsMonitoring(true)
      intervalRef.current = setInterval(measurePerformance, sampleInterval)
    }
  }, [isMonitoring, measurePerformance, sampleInterval])

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsMonitoring(false)
  }, [])

  useEffect(() => {
    if (enableAutoStart) {
      startMonitoring()
    }

    return () => {
      stopMonitoring()
    }
  }, []) // Empty dependency array to run only once

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
  }
}
