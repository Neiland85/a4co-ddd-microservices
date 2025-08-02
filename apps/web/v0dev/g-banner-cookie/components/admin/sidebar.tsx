"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { NavItem } from "../../types/admin-types"

interface SidebarProps {
  readonly className?: string
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    badge: 0,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    id: "products",
    label: "Productos",
    icon: Package,
    href: "/admin/products",
    badge: 3, // Low stock items
  },
  {
    id: "orders",
    label: "Pedidos",
    icon: ShoppingCart,
    href: "/admin/orders",
    badge: 5, // Pending orders
  },
  {
    id: "settings",
    label: "Configuración",
    icon: Settings,
    href: "/admin/settings",
  },
]

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const pathname = usePathname()

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <button
          className="fixed inset-0 bg-black/50 z-40 lg:hidden border-none p-0 cursor-pointer"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Cerrar menú móvil"
        />
      )}

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-natural-lg hover:shadow-natural-xl transition-all duration-300 hover:scale-110"
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-natural-lg",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-a4co-olive-500 to-a4co-clay-500 rounded-lg flex items-center justify-center shadow-mixed">
                <span className="text-white font-bold text-sm">A4</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Panel Admin</h2>
                <p className="text-xs text-gray-500">Artesano</p>
              </div>
            </div>
          )}

          {/* Collapse Toggle - Desktop Only */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="hidden lg:flex hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:rotate-180"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div
            className={cn(
              "flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-a4co-olive-50 to-a4co-clay-50 border border-a4co-olive-200 transition-all duration-300 hover:shadow-natural-md hover:scale-105 cursor-pointer",
              isCollapsed && "justify-center",
            )}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-a4co-olive-400 to-a4co-clay-400 rounded-full flex items-center justify-center shadow-mixed">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">María García</p>
                <p className="text-sm text-gray-500 truncate">Panadería El Ochío</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const isHovered = hoveredItem === item.id

            return (
              <Link
                key={item.id}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-a4co-olive-500 to-a4co-clay-500 text-white shadow-mixed-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-a4co-olive-600 hover:shadow-natural-md",
                  isHovered && "scale-105 translate-x-2",
                  isCollapsed && "justify-center",
                )}
              >
                {/* Background Animation */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-a4co-olive-100 to-a4co-clay-100 opacity-0 transition-opacity duration-300",
                    isHovered && !isActive && "opacity-50",
                  )}
                />

                {/* Icon with Special Animation for Products */}
                <div className="relative z-10">
                  {item.id === "products" ? (
                    <div className="relative">
                      <Package
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isHovered && "animate-spin",
                          isActive && "text-white",
                        )}
                      />
                      {/* Olive Oil Spinning Animation */}
                      <div
                        className={cn(
                          "absolute inset-0 w-5 h-5 rounded-full border-2 border-a4co-olive-400 animate-spin",
                          isActive ? "border-white/30" : "border-a4co-olive-400/30",
                        )}
                        style={{
                          animation: "spin 2s linear infinite",
                        }}
                      />
                    </div>
                  ) : item.id === "analytics" ? (
                    <BarChart3
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        isHovered && "scale-110 animate-pulse",
                        isActive && "text-white",
                      )}
                    />
                  ) : (
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        isHovered && "scale-110",
                        isActive && "text-white",
                      )}
                    />
                  )}
                </div>

                {!isCollapsed && (
                  <>
                    <span className="font-medium flex-1 relative z-10">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant={isActive ? "secondary" : "default"}
                        className={cn(
                          "relative z-10 transition-all duration-300",
                          isActive
                            ? "bg-white/20 text-white hover:bg-white/30"
                            : "bg-a4co-olive-500 hover:bg-a4co-olive-600",
                          isHovered && "scale-110 animate-pulse",
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}

                {/* Hover Effect Line */}
                <div
                  className={cn(
                    "absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-a4co-olive-500 to-a4co-clay-500 transform transition-transform duration-300",
                    isHovered ? "scale-y-100" : "scale-y-0",
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <Separator />

        {/* Footer Actions */}
        <div className="p-4 space-y-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-all duration-300 hover:scale-105 hover:shadow-natural-md group",
              isCollapsed && "justify-center",
            )}
          >
            <div className="relative">
              <Bell className="h-4 w-4 transition-all duration-300 group-hover:animate-bounce" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            {!isCollapsed && <span className="ml-3">Notificaciones</span>}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 hover:scale-105 hover:shadow-natural-md group",
              isCollapsed && "justify-center",
            )}
          >
            <LogOut className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
            {!isCollapsed && <span className="ml-3">Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
