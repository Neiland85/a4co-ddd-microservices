/**
 * Artisan Dashboard Layout
 * Main layout for artisan-specific pages
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {
  User,
  Package,
  Image as ImageIcon,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArtisanLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    name: 'Mi Perfil',
    href: '/artisan/profile',
    icon: User,
  },
  {
    name: 'Productos',
    href: '/artisan/products',
    icon: Package,
  },
  {
    name: 'Galería',
    href: '/artisan/gallery',
    icon: ImageIcon,
  },
  {
    name: 'Analíticas',
    href: '/artisan/analytics',
    icon: BarChart3,
  },
  {
    name: 'Configuración',
    href: '/artisan/settings',
    icon: Settings,
  },
];

export default function ArtisanLayout({ children }: ArtisanLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-slate-200 p-6">
            <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
              Panel Artesano
            </h1>
            <p className="mt-1 text-sm text-slate-600">Gestiona tu negocio</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-slate-100'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-8">{children}</div>
      </main>
    </div>
  );
}
