export interface IconConfig {
  id: string
  name: string
  icon: string
  category: "navigation" | "social" | "utility" | "media" | "business"
  description: string
  color: string
  bgColor: string
  size: "sm" | "md" | "lg"
  isActive: boolean
  onClick?: () => void
}

export interface IconGridProps {
  icons: IconConfig[]
  columns?: number
  gap?: number
  showLabels?: boolean
  onIconClick?: (icon: IconConfig) => void
}

export interface IconItemProps {
  config: IconConfig
  onClick?: (config: IconConfig) => void
}
