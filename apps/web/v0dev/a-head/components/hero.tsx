"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Users, Star, TrendingUp, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePerformanceMonitor } from "../hooks/use-performance-monitor"
import { PerformanceMonitor } from "./performance-monitor"

interface FragmentButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "default" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  href?: string
  imageUrl?: string
  disabled?: boolean
}

function FragmentButton({
  children,
  onClick,
  variant = "default",
  size = "md",
  className = "",
  href,
  imageUrl = "/placeholder.svg?height=200&width=200&text=Fragment",
  disabled = false,
}: FragmentButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [fragments, setFragments] = useState<
    Array<{ id: number; x: number; y: number; rotation: number; scale: number; delay: number }>
  >([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastClickTime = useRef<number>(0)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [performanceMode, setPerformanceMode] = useState<"normal" | "reduced" | "minimal" | "disabled">("normal")

  // Performance monitoring
  const { metrics, incrementAnimationCount, decrementAnimationCount } = usePerformanceMonitor({
    enableMemoryMonitoring: true,
    fpsThreshold: 30,
    stressTestMode: true,
  })

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
    }
    checkTouchDevice()
    window.addEventListener("resize", checkTouchDevice)
    return () => window.removeEventListener("resize", checkTouchDevice)
  }, [])

  // Monitor performance and adjust animations dynamically
  useEffect(() => {
    let newMode: "normal" | "reduced" | "minimal" | "disabled" = "normal"

    // Critical performance - disable all effects
    if (metrics.fps < 15 || metrics.frameTime > 66.67) {
      newMode = "disabled"
    }
    // Poor performance - minimal effects only
    else if (metrics.fps < 20 || metrics.frameTime > 50) {
      newMode = "minimal"
    }
    // Low performance - reduced effects
    else if (metrics.fps < 30 || metrics.frameTime > 33.33 || metrics.animationCount > 8) {
      newMode = "reduced"
    }
    // Mobile devices get reduced effects by default
    else if (isTouchDevice && window.innerWidth < 768) {
      newMode = "reduced"
    }

    setPerformanceMode(newMode)
  }, [metrics, isTouchDevice])

  const createFragments = useCallback(() => {
    if (disabled || performanceMode === "disabled") return

    const now = Date.now()
    const timeSinceLastClick = now - lastClickTime.current

    // Prevent rapid clicking spam
    if (timeSinceLastClick < 100) return

    lastClickTime.current = now

    // Track animation start
    incrementAnimationCount()

    const newFragments = []

    // Adjust fragment count based on performance mode
    let fragmentCount = 8
    switch (performanceMode) {
      case "disabled":
        fragmentCount = 0
        break
      case "minimal":
        fragmentCount = 2
        break
      case "reduced":
        fragmentCount = 4
        break
      case "normal":
        fragmentCount = window.innerWidth < 768 ? 6 : Math.min(16, 8 + clickCount * 2)
        break
    }

    const intensity = Math.min(
      clickCount + 1,
      performanceMode === "minimal" ? 1 : performanceMode === "reduced" ? 2 : 3,
    )

    for (let i = 0; i < fragmentCount; i++) {
      const angle = (i / fragmentCount) * Math.PI * 2
      const distance = (50 + Math.random() * 100) * intensity
      const x = Math.cos(angle) * distance + (Math.random() - 0.5) * 50
      const y = Math.sin(angle) * distance + (Math.random() - 0.5) * 50

      newFragments.push({
        id: i,
        x: window.innerWidth < 768 ? x * 0.7 : x,
        y: window.innerWidth < 768 ? y * 0.7 : y,
        rotation:
          Math.random() * (performanceMode === "minimal" ? 180 : performanceMode === "reduced" ? 360 : 720) * intensity,
        scale: 0.2 + Math.random() * 0.3,
        delay: Math.random() * (performanceMode === "minimal" ? 50 : performanceMode === "reduced" ? 100 : 200),
      })
    }

    setFragments(newFragments)
    setIsPressed(true)
    setClickCount((prev) => prev + 1)

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Reset after animation with performance-adjusted timing
    const animationDuration =
      performanceMode === "minimal" ? 400 : performanceMode === "reduced" ? 600 : 800 + intensity * 200

    timeoutRef.current = setTimeout(() => {
      setIsPressed(false)
      setFragments([])
      setClickCount(0)
      decrementAnimationCount()
    }, animationDuration)
  }, [disabled, clickCount, performanceMode, incrementAnimationCount, decrementAnimationCount])

  const handleClick = useCallback(() => {
    createFragments()
    if (onClick) {
      const delay = performanceMode === "minimal" ? 100 : performanceMode === "reduced" ? 200 : 300
      setTimeout(onClick, delay)
    }
  }, [createFragments, onClick, performanceMode])

  // Touch-optimized event handlers
  const handleTouchStart = useCallback(() => {
    if (!disabled) {
      setIsTouched(true)
      setIsHovered(true)
    }
  }, [disabled])

  const handleTouchEnd = useCallback(() => {
    setIsTouched(false)
    setTimeout(() => setIsHovered(false), 150)
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (!disabled && !isTouchDevice) {
      setIsHovered(true)
    }
  }, [disabled, isTouchDevice])

  const handleMouseLeave = useCallback(() => {
    if (!isTouchDevice) {
      setIsHovered(false)
    }
  }, [isTouchDevice])

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2 text-sm min-h-[44px]"
      case "lg":
        return "px-8 py-4 text-lg min-h-[48px]"
      default:
        return "px-6 py-3 text-base min-h-[44px]"
    }
  }

  const getVariantClasses = () => {
    if (disabled) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed"
    }

    const transitionDuration =
      performanceMode === "minimal" ? "duration-150" : performanceMode === "reduced" ? "duration-200" : "duration-300"

    const baseClasses = `transition-all ${transitionDuration} transform`
    const hoverScale = isHovered && !disabled && performanceMode !== "disabled" ? "scale-105" : ""
    const touchScale = isTouched ? "scale-95" : ""
    const pressedScale = isPressed && performanceMode !== "disabled" ? "animate-pulse" : ""

    if (variant === "outline") {
      return `${baseClasses} border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent hover:shadow-lg active:shadow-md ${hoverScale} ${touchScale} ${pressedScale}`
    }

    return `${baseClasses} bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-xl active:shadow-lg ${hoverScale} ${touchScale} ${pressedScale}`
  }

  const buttonContent = (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
      className={`
        relative overflow-hidden group
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-xl shadow-lg
        ${className}
      `}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Background Image with Performance-Adjusted Effects */}
      <div
        className={`absolute inset-0 transition-all ${
          performanceMode === "minimal"
            ? "duration-200"
            : performanceMode === "reduced"
              ? "duration-300"
              : "duration-500"
        } ${(isHovered || isTouched) && performanceMode !== "disabled" ? "opacity-30 scale-110" : "opacity-10"}`}
      >
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Button background"
          fill
          className={`object-cover transition-transform ${
            performanceMode === "minimal"
              ? "duration-200"
              : performanceMode === "reduced"
                ? "duration-300"
                : "duration-500"
          }`}
        />
      </div>

      {/* Hover/Touch Glow Effect - Disabled in minimal/disabled modes */}
      {(isHovered || isTouched) && !disabled && performanceMode === "normal" && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse" />
      )}

      {/* Fragment Effect Container */}
      <div className="absolute inset-0 pointer-events-none">
        {fragments.map((fragment) => (
          <div
            key={fragment.id}
            className={`absolute inset-0 transition-all ${
              performanceMode === "minimal"
                ? "duration-500"
                : performanceMode === "reduced"
                  ? "duration-700"
                  : "duration-1000"
            } ease-out ${isPressed ? "opacity-0" : "opacity-100"}`}
            style={{
              transform: isPressed
                ? `translate(${fragment.x}px, ${fragment.y}px) rotate(${fragment.rotation}deg) scale(${fragment.scale})`
                : "translate(0, 0) rotate(0deg) scale(1)",
              transitionDelay: `${fragment.delay}ms`,
            }}
          >
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover opacity-80"
              style={{
                clipPath: `polygon(
                  ${(fragment.id % 4) * 25}% ${Math.floor(fragment.id / 4) * 25}%,
                  ${((fragment.id % 4) + 1) * 25}% ${Math.floor(fragment.id / 4) * 25}%,
                  ${((fragment.id % 4) + 1) * 25}% ${(Math.floor(fragment.id / 4) + 1) * 25}%,
                  ${(fragment.id % 4) * 25}% ${(Math.floor(fragment.id / 4) + 1) * 25}%
                )`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 transition-transform duration-200">
        {children}
      </span>

      {/* Sparkle Effects - Only in normal mode */}
      {isPressed && performanceMode === "normal" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(Math.min(clickCount * 2 + 4, 8))].map((_, i) => (
            <Sparkles
              key={i}
              className={`absolute w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-ping`}
              style={{
                left: `${10 + ((i * 15) % 80)}%`,
                top: `${20 + ((i * 13) % 60)}%`,
                animationDelay: `${i * 50}ms`,
                animationDuration: `${600 + Math.random() * 200}ms`,
              }}
            />
          ))}

          {clickCount > 2 && (
            <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-yellow-300 animate-pulse" />
          )}
        </div>
      )}

      {/* Hover/Touch Particles - Reduced based on performance */}
      {(isHovered || isTouched) && !disabled && performanceMode !== "disabled" && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            ...Array(performanceMode === "minimal" ? 1 : performanceMode === "reduced" ? 2 : isTouchDevice ? 2 : 3),
          ].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-ping"
              style={{
                left: `${25 + i * 25}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Touch Ripple Effect - Only on touch devices and not in disabled mode */}
      {isTouched && isTouchDevice && performanceMode !== "disabled" && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white/20 rounded-full animate-ping"
            style={{ animation: "ping 0.6s cubic-bezier(0, 0, 0.2, 1)" }}
          />
        </div>
      )}

      {/* Performance Mode Indicator (Development Only) */}
      {process.env.NODE_ENV === "development" && performanceMode !== "normal" && (
        <div
          className={`absolute top-0 right-0 w-2 h-2 rounded-full opacity-75 ${
            performanceMode === "disabled"
              ? "bg-red-500"
              : performanceMode === "minimal"
                ? "bg-orange-500"
                : "bg-yellow-500"
          }`}
        />
      )}
    </button>
  )

  if (href && !disabled) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)

  // Show performance monitor in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setShowPerformanceMonitor(true)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/mapa?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const stats = [
    {
      icon: Users,
      label: "Productores",
      value: "150+",
      color: "from-blue-500 to-cyan-500",
      image: "/placeholder.svg?height=100&width=100&text=Productores",
    },
    {
      icon: MapPin,
      label: "Ubicaciones",
      value: "45",
      color: "from-green-500 to-emerald-500",
      image: "/placeholder.svg?height=100&width=100&text=Ubicaciones",
    },
    {
      icon: Star,
      label: "Valoración",
      value: "4.8",
      color: "from-yellow-500 to-orange-500",
      image: "/placeholder.svg?height=100&width=100&text=Valoracion",
    },
    {
      icon: TrendingUp,
      label: "Crecimiento",
      value: "+25%",
      color: "from-purple-500 to-pink-500",
      image: "/placeholder.svg?height=100&width=100&text=Crecimiento",
    },
  ]

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-amber-50 pt-20 pb-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Descubre los{" "}
              <span className="bg-gradient-to-r from-green-600 to-amber-500 bg-clip-text text-transparent">
                Sabores Auténticos
              </span>{" "}
              de Jaén
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Conecta directamente con productores locales, descubre productos artesanales únicos y apoya la economía
              local de nuestra hermosa provincia.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 px-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Buscar productores, productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-lg border-2 border-gray-200 rounded-full focus:border-green-500 focus:ring-green-500 shadow-lg"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-amber-500 hover:from-green-700 hover:to-amber-600 text-white rounded-full px-4 sm:px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                >
                  Buscar
                </Button>
              </div>
            </form>

            {/* CTA Buttons with Adaptive Performance */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
              <FragmentButton
                size="lg"
                href="/mapa"
                imageUrl="/placeholder.svg?height=200&width=300&text=Mapa+Interactivo"
                className="w-full sm:w-auto"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                Explorar Mapa
              </FragmentButton>

              <FragmentButton
                variant="outline"
                size="lg"
                href="/productores"
                imageUrl="/placeholder.svg?height=200&width=300&text=Productores+Locales"
                className="w-full sm:w-auto"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                Ver Productores
              </FragmentButton>
            </div>

            {/* Stats Grid with Performance-Adaptive Effects */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <FragmentButton
                    key={index}
                    size="sm"
                    variant="outline"
                    imageUrl={stat.image}
                    className="!bg-white/80 !backdrop-blur-sm !border-gray-200 hover:!border-green-300 !text-gray-900 hover:!text-green-700 !shadow-lg hover:!shadow-xl !transition-all !duration-300 p-4 sm:p-6 h-auto flex-col gap-3"
                  >
                    <div
                      className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-2 sm:mb-4 mx-auto`}
                    >
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm font-medium">{stat.label}</div>
                  </FragmentButton>
                )
              })}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-4 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-4 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-10 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-4 sm:left-20 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-10 animate-pulse delay-500" />
      </section>

      {/* Performance Monitor with Stress Testing */}
      <PerformanceMonitor
        isVisible={showPerformanceMonitor}
        onToggle={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
      />
    </>
  )
}
