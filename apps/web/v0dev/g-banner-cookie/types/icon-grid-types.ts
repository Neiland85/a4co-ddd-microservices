import type { LucideIcon } from "lucide-react"

export interface IconConfig {
  id: string
  icon: LucideIcon
  label: string
  description?: string
  category?: string
  onClick?: () => void
}

export interface IconItemProps {
  config: IconConfig
  size?: number
  color?: string
  strokeWidth?: number
  variant?: "default" | "outline" | "ghost" | "secondary"
  className?: string
}

export interface IconGridProps {
  icons: IconConfig[]
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  size?: number
  color?: string
  strokeWidth?: number
  variant?: "default" | "outline" | "ghost" | "secondary"
  showLabels?: boolean
  className?: string
  onIconClick?: (config: IconConfig) => void
}

export type IconCategory = "navigation" | "commerce" | "social" | "ui" | "media" | "communication"
