'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '../../types/admin-types';

interface SidebarProps {
  readonly className?: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    badge: 0,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/admin/analytics',
  },
  {
    id: 'products',
    label: 'Productos',
    icon: Package,
    href: '/admin/products',
    badge: 3, // Low stock items
  },
  {
    id: 'orders',
    label: 'Pedidos',
    icon: ShoppingCart,
    href: '/admin/orders',
    badge: 5, // Pending orders
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    href: '/admin/settings',
  },
];

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-pointer border-none bg-black/50 p-0 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Cerrar menú móvil"
        />
      )}

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMobile}
        className="shadow-natural-lg hover:shadow-natural-xl fixed left-4 top-4 z-50 bg-white transition-all duration-300 hover:scale-110 lg:hidden"
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'shadow-natural-lg fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="from-a4co-olive-500 to-a4co-clay-500 shadow-mixed flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
                <span className="text-sm font-bold text-white">A4</span>
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
            className="hidden transition-all duration-300 hover:rotate-180 hover:scale-110 hover:bg-gray-100 lg:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User Profile */}
        <div className="border-b border-gray-200 p-4">
          <div
            className={cn(
              'from-a4co-olive-50 to-a4co-clay-50 border-a4co-olive-200 hover:shadow-natural-md flex cursor-pointer items-center space-x-3 rounded-lg border bg-gradient-to-r p-3 transition-all duration-300 hover:scale-105',
              isCollapsed && 'justify-center'
            )}
          >
            <div className="relative">
              <div className="from-a4co-olive-400 to-a4co-clay-400 shadow-mixed flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-500"></div>
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">María García</p>
                <p className="truncate text-sm text-gray-500">Panadería El Ochío</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isHovered = hoveredItem === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  'group relative flex items-center space-x-3 overflow-hidden rounded-lg px-3 py-3 transition-all duration-300',
                  isActive
                    ? 'from-a4co-olive-500 to-a4co-clay-500 shadow-mixed-lg bg-gradient-to-r text-white'
                    : 'hover:text-a4co-olive-600 hover:shadow-natural-md text-gray-700 hover:bg-gray-100',
                  isHovered && 'translate-x-2 scale-105',
                  isCollapsed && 'justify-center'
                )}
              >
                {/* Background Animation */}
                <div
                  className={cn(
                    'from-a4co-olive-100 to-a4co-clay-100 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300',
                    isHovered && !isActive && 'opacity-50'
                  )}
                />

                {/* Icon with Special Animation for Products */}
                <div className="relative z-10">
                  {item.id === 'products' ? (
                    <div className="relative">
                      <Package
                        className={cn(
                          'h-5 w-5 transition-all duration-300',
                          isHovered && 'animate-spin',
                          isActive && 'text-white'
                        )}
                      />
                      {/* Olive Oil Spinning Animation */}
                      <div
                        className={cn(
                          'border-a4co-olive-400 absolute inset-0 h-5 w-5 animate-spin rounded-full border-2',
                          isActive ? 'border-white/30' : 'border-a4co-olive-400/30'
                        )}
                        style={{
                          animation: 'spin 2s linear infinite',
                        }}
                      />
                    </div>
                  ) : item.id === 'analytics' ? (
                    <BarChart3
                      className={cn(
                        'h-5 w-5 transition-all duration-300',
                        isHovered && 'scale-110 animate-pulse',
                        isActive && 'text-white'
                      )}
                    />
                  ) : (
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-all duration-300',
                        isHovered && 'scale-110',
                        isActive && 'text-white'
                      )}
                    />
                  )}
                </div>

                {!isCollapsed && (
                  <>
                    <span className="relative z-10 flex-1 font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant={isActive ? 'secondary' : 'default'}
                        className={cn(
                          'relative z-10 transition-all duration-300',
                          isActive
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-a4co-olive-500 hover:bg-a4co-olive-600',
                          isHovered && 'scale-110 animate-pulse'
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
                    'from-a4co-olive-500 to-a4co-clay-500 absolute left-0 top-0 h-full w-1 transform bg-gradient-to-b transition-transform duration-300',
                    isHovered ? 'scale-y-100' : 'scale-y-0'
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* Footer Actions */}
        <div className="space-y-2 p-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            className={cn(
              'hover:shadow-natural-md group w-full justify-start transition-all duration-300 hover:scale-105',
              isCollapsed && 'justify-center'
            )}
          >
            <div className="relative">
              <Bell className="h-4 w-4 transition-all duration-300 group-hover:animate-bounce" />
              <div className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
            </div>
            {!isCollapsed && <span className="ml-3">Notificaciones</span>}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            className={cn(
              'hover:shadow-natural-md group w-full justify-start text-red-600 transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:text-red-700',
              isCollapsed && 'justify-center'
            )}
          >
            <LogOut className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
            {!isCollapsed && <span className="ml-3">Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
