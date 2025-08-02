"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Menu, X, LogOut, Bell } from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Productos",
    href: "/admin/products",
    icon: Package,
    badge: "89",
  },
  {
    name: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
    badge: "12",
  },
  {
    name: "Usuarios",
    href: "/admin/users",
    icon: Users,
    badge: null,
  },
  {
    name: "Análisis",
    href: "/admin/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    name: "Configuración",
    href: "/admin/settings",
    icon: Settings,
    badge: null,
  },
]

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300
        ${isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-64"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <span className="font-bold text-gray-900">Admin Panel</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="lg:hidden">
              {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium">{item.name}</span>
                        {item.badge && <Badge className="ml-auto bg-red-100 text-red-800 text-xs">{item.badge}</Badge>}
                      </>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
              <Bell className="w-4 h-4 mr-3" />
              {!isCollapsed && "Notificaciones"}
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-3" />
              {!isCollapsed && "Cerrar Sesión"}
            </Button>
          </div>
        </div>
      </div>

      {/* Toggle Button for Desktop */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex fixed top-4 left-4 z-40"
      >
        <Menu className="w-4 h-4" />
      </Button>
    </>
  )
}
