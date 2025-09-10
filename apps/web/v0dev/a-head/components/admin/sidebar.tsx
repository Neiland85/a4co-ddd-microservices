'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Productos',
    href: '/admin/products',
    icon: Package,
    badge: '89',
  },
  {
    name: 'Pedidos',
    href: '/admin/orders',
    icon: ShoppingCart,
    badge: '12',
  },
  {
    name: 'Usuarios',
    href: '/admin/users',
    icon: Users,
    badge: null,
  },
  {
    name: 'Análisis',
    href: '/admin/analytics',
    icon: BarChart3,
    badge: null,
  },
  {
    name: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
    badge: null,
  },
];

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 z-50 h-full border-r border-gray-200 bg-white transition-all duration-300
        ${isCollapsed ? '-translate-x-full lg:w-16 lg:translate-x-0' : 'w-64'}
      `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-amber-500">
                  <span className="text-sm font-bold text-white">J</span>
                </div>
                <span className="font-bold text-gray-900">Admin Panel</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigationItems.map(item => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 transition-colors
                    ${
                      isActive
                        ? 'border border-green-200 bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  >
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium">{item.name}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-red-100 text-xs text-red-800">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="space-y-2 border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <Bell className="mr-3 h-4 w-4" />
              {!isCollapsed && 'Notificaciones'}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="mr-3 h-4 w-4" />
              {!isCollapsed && 'Cerrar Sesión'}
            </Button>
          </div>
        </div>
      </div>

      {/* Toggle Button for Desktop */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed left-4 top-4 z-40 hidden lg:flex"
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
}
