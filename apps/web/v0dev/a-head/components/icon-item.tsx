"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { IconConfig } from "@/types/icon-grid-types"
import * as LucideIcons from "lucide-react"

interface IconItemProps {
  config: IconConfig
  onClick?: (config: IconConfig) => void
}

export function IconItem({ config, onClick }: IconItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as any)[config.icon] || LucideIcons.HelpCircle

  const handleClick = () => {
    if (config.onClick) {
      config.onClick()
    }
    if (onClick) {
      onClick(config)
    }
  }

  const getSizeClasses = () => {
    switch (config.size) {
      case "sm":
        return "w-8 h-8"
      case "lg":
        return "w-12 h-12"
      default:
        return "w-10 h-10"
    }
  }

  const getCardSize = () => {
    switch (config.size) {
      case "sm":
        return "p-3"
      case "lg":
        return "p-6"
      default:
        return "p-4"
    }
  }

  return (
    <Card
      className={`
        cursor-pointer transition-all duration-300 hover:shadow-lg
        ${config.isActive ? "ring-2 ring-blue-500 shadow-md" : ""}
        ${isHovered ? "scale-105 shadow-xl" : ""}
      `}
      style={{ backgroundColor: config.bgColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <CardContent className={`flex flex-col items-center justify-center space-y-2 ${getCardSize()}`}>
        <div className="relative">
          <IconComponent
            className={`${getSizeClasses()} transition-all duration-300`}
            style={{ color: config.color }}
          />
          {config.isActive && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-medium text-sm text-gray-900 truncate max-w-full">{config.name}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{config.description}</p>
          <Badge
            variant="secondary"
            className="text-xs"
            style={{
              backgroundColor: `${config.color}20`,
              color: config.color,
              borderColor: `${config.color}40`,
            }}
          >
            {config.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
