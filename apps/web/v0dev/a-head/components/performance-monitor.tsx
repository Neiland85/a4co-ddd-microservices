"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Monitor, AlertTriangle, CheckCircle, Activity, MemoryStick, Zap, Cpu, TestTube } from "lucide-react"
import { usePerformanceMonitor } from "../hooks/use-performance-monitor"

interface PerformanceMonitorProps {
  isVisible?: boolean
  onToggle?: () => void
}

export function PerformanceMonitor({ isVisible = false, onToggle }: PerformanceMonitorProps) {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false)
  const [showStressControls, setShowStressControls] = useState(false)

  const { metrics, getOptimizationSuggestions, setStressLevel, isMonitoring } = usePerformanceMonitor({
    enableMemoryMonitoring: true,
    fpsThreshold: 30,
    frameTimeThreshold: 33.33,
    stressTestMode: true,
  })

  // Check if we're in development mode
  useEffect(() => {
    setIsDeveloperMode(process.env.NODE_ENV === "development")
  }, [])

  // Auto-hide in production unless explicitly shown
  if (!isDeveloperMode && !isVisible) {
    return null
  }

  const suggestions = getOptimizationSuggestions()

  const getPerformanceStatus = () => {
    if (metrics.fps >= 50) return { status: "excellent", color: "green", icon: CheckCircle }
    if (metrics.fps >= 30) return { status: "good", color: "yellow", icon: Activity }
    if (metrics.fps >= 15) return { status: "poor", color: "orange", icon: AlertTriangle }
    return { status: "critical", color: "red", icon: AlertTriangle }
  }

  const performanceStatus = getPerformanceStatus()
  const StatusIcon = performanceStatus.icon

  const handleStressLevelChange = (value: number[]) => {
    setStressLevel(value[0])
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Performance Monitor
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStressControls(!showStressControls)}
                className="h-6 w-6 p-0"
                title="Toggle stress test controls"
              >
                <TestTube className="w-3 h-3" />
              </Button>
              {onToggle && (
                <Button variant="ghost" size="sm" onClick={onToggle} className="h-6 w-6 p-0">
                  ×
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Performance Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Status</span>
            <Badge
              variant={performanceStatus.color === "green" ? "default" : "destructive"}
              className={`text-xs ${
                performanceStatus.color === "yellow"
                  ? "bg-yellow-500"
                  : performanceStatus.color === "orange"
                    ? "bg-orange-500"
                    : ""
              }`}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {performanceStatus.status}
            </Badge>
          </div>

          {/* Stress Test Controls */}
          {showStressControls && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-800">
                <TestTube className="w-3 h-3" />
                FPS Stress Test
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-700">Stress Level</span>
                  <span className="font-mono text-blue-900">{metrics.stressLevel}/10</span>
                </div>
                <Slider
                  value={[metrics.stressLevel]}
                  onValueChange={handleStressLevelChange}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-blue-600">Simulates CPU load to test performance adaptations</p>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Activity
                  className={`w-3 h-3 ${
                    metrics.fps >= 50
                      ? "text-green-500"
                      : metrics.fps >= 30
                        ? "text-yellow-500"
                        : metrics.fps >= 15
                          ? "text-orange-500"
                          : "text-red-500"
                  }`}
                />
                <span className="text-gray-600">FPS</span>
              </div>
              <div
                className={`font-mono text-lg font-bold ${
                  metrics.fps >= 50
                    ? "text-green-600"
                    : metrics.fps >= 30
                      ? "text-yellow-600"
                      : metrics.fps >= 15
                        ? "text-orange-600"
                        : "text-red-600"
                }`}
              >
                {metrics.fps}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Zap
                  className={`w-3 h-3 ${
                    metrics.frameTime <= 16.67
                      ? "text-green-500"
                      : metrics.frameTime <= 33.33
                        ? "text-yellow-500"
                        : metrics.frameTime <= 66.67
                          ? "text-orange-500"
                          : "text-red-500"
                  }`}
                />
                <span className="text-gray-600">Frame Time</span>
              </div>
              <div
                className={`font-mono text-lg font-bold ${
                  metrics.frameTime <= 16.67
                    ? "text-green-600"
                    : metrics.frameTime <= 33.33
                      ? "text-yellow-600"
                      : metrics.frameTime <= 66.67
                        ? "text-orange-600"
                        : "text-red-600"
                }`}
              >
                {metrics.frameTime}ms
              </div>
            </div>

            {metrics.memoryUsage && (
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <MemoryStick
                    className={`w-3 h-3 ${
                      metrics.memoryUsage <= 50
                        ? "text-green-500"
                        : metrics.memoryUsage <= 100
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  />
                  <span className="text-gray-600">Memory</span>
                </div>
                <div
                  className={`font-mono text-lg font-bold ${
                    metrics.memoryUsage <= 50
                      ? "text-green-600"
                      : metrics.memoryUsage <= 100
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {metrics.memoryUsage}MB
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Monitor
                  className={`w-3 h-3 ${
                    metrics.animationCount <= 5
                      ? "text-green-500"
                      : metrics.animationCount <= 10
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                />
                <span className="text-gray-600">Animations</span>
              </div>
              <div
                className={`font-mono text-lg font-bold ${
                  metrics.animationCount <= 5
                    ? "text-green-600"
                    : metrics.animationCount <= 10
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {metrics.animationCount}
              </div>
            </div>

            {metrics.cpuUsage !== undefined && (
              <div className="space-y-1 col-span-2">
                <div className="flex items-center gap-1">
                  <Cpu
                    className={`w-3 h-3 ${
                      metrics.cpuUsage <= 30
                        ? "text-green-500"
                        : metrics.cpuUsage <= 70
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  />
                  <span className="text-gray-600">CPU Load Estimate</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metrics.cpuUsage <= 30 ? "bg-green-500" : metrics.cpuUsage <= 70 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, metrics.cpuUsage)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Performance Warnings */}
          {metrics.isLowPerformance && (
            <div
              className={`p-2 border rounded text-xs ${
                metrics.fps < 15 ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div
                className={`flex items-center gap-1 font-medium mb-1 ${
                  metrics.fps < 15 ? "text-red-800" : "text-yellow-800"
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                {metrics.fps < 15 ? "Critical Performance" : "Performance Warning"}
              </div>
              <p className={metrics.fps < 15 ? "text-red-700" : "text-yellow-700"}>
                {metrics.fps < 15
                  ? "Severe performance issues detected. Effects are being heavily reduced."
                  : "Low performance detected. Animation complexity is being reduced."}
              </p>
            </div>
          )}

          {/* Effect Reduction Indicator */}
          {metrics.isLowPerformance && (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <div className="flex items-center gap-1 text-blue-800 font-medium mb-1">
                <Zap className="w-3 h-3" />
                Active Optimizations
              </div>
              <ul className="text-blue-700 space-y-1">
                {metrics.fps < 15 && <li>• Fragments disabled</li>}
                {metrics.fps < 20 && <li>• Sparkle effects disabled</li>}
                {metrics.fps < 30 && <li>• Reduced fragment count</li>}
                {metrics.fps < 45 && <li>• Shorter animation durations</li>}
                {metrics.animationCount > 10 && <li>• Animation queue limited</li>}
              </ul>
            </div>
          )}

          {/* Optimization Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-700">Suggestions:</div>
              <ul className="text-xs text-gray-600 space-y-1">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Monitoring Status */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              {isMonitoring ? "Monitoring active" : "Monitoring paused"}
              {metrics.stressLevel > 0 && ` • Stress: ${metrics.stressLevel}/10`}
            </span>
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-green-500" : "bg-gray-400"}`} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
