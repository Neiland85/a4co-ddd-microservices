"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Users,
  Shield,
  Tag,
  Home,
  Activity,
  UserCheck,
  Store,
  Settings,
  Bell,
  TrendingUp,
  Database,
  Lock,
  Eye,
  Zap,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard Principal",
    icon: Home,
    badge: null,
  },
  {
    id: "performance",
    label: "Monitoreo de Rendimiento",
    icon: BarChart3,
    badge: "Live",
    children: [
      { id: "performance-metrics", label: "Métricas del Sistema", icon: Activity },
      { id: "performance-analytics", label: "Análisis de Rendimiento", icon: TrendingUp },
      { id: "performance-database", label: "Base de Datos", icon: Database },
    ],
  },
  {
    id: "users",
    label: "Gestión de Usuarios",
    icon: Users,
    badge: "2,847",
    children: [
      { id: "users-businesses", label: "Negocios y Artesanos", icon: Store },
      { id: "users-customers", label: "Usuarios Principales", icon: UserCheck },
      { id: "users-analytics", label: "Análisis de Usuarios", icon: BarChart3 },
    ],
  },
  {
    id: "security",
    label: "Ciberseguridad",
    icon: Shield,
    badge: "3",
    badgeVariant: "destructive" as const,
    children: [
      { id: "security-monitoring", label: "Monitoreo en Tiempo Real", icon: Eye },
      { id: "security-threats", label: "Detección de Amenazas", icon: Lock },
      { id: "security-firewall", label: "Firewall y Protección", icon: Zap },
    ],
  },
  {
    id: "offers",
    label: "Ofertas y Destacados",
    icon: Tag,
    badge: "12",
    children: [
      { id: "offers-featured", label: "Puestos Destacados", icon: Crown },
      { id: "offers-promotions", label: "Promociones Activas", icon: Tag },
      { id: "offers-analytics", label: "Análisis de Ofertas", icon: TrendingUp },
    ],
  },
  {
    id: "settings",
    label: "Configuración",
    icon: Settings,
    badge: null,
  },
  {
    id: "notifications",
    label: "Notificaciones",
    icon: Bell,
    badge: "5",
  },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["performance", "users", "security", "offers"])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const isExpanded = (itemId: string) => expandedItems.includes(itemId)

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-80"
      } transition-all duration-300 bg-background border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-lg font-bold">Backoffice Pro</h1>
                <p className="text-xs text-muted-foreground">Panel de Control</p>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Button
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${collapsed ? "px-2" : "px-3"} h-10`}
                onClick={() => {
                  if (item.children) {
                    toggleExpanded(item.id)
                  } else {
                    onSectionChange(item.id)
                  }
                }}
              >
                <item.icon className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge && (
                      <Badge variant={item.badgeVariant || "secondary"} className="ml-2 text-xs px-1.5 py-0.5 h-5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>

              {/* Submenu */}
              {!collapsed && item.children && isExpanded(item.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Button
                      key={child.id}
                      variant={activeSection === child.id ? "secondary" : "ghost"}
                      className="w-full justify-start px-3 h-8 text-xs"
                      onClick={() => onSectionChange(child.id)}
                    >
                      <child.icon className="h-3 w-3 mr-2" />
                      {child.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span>Sistema Online</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Última actualización: {new Date().toLocaleTimeString("es-ES")}
          </div>
        </div>
      )}
    </div>
  )
}
