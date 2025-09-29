'use client';

import {
  BarChart3,
  HelpCircle,
  Home,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { Button } from './Button';

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Productos', href: '/products', icon: Package },
  { name: 'Pedidos', href: '/orders', icon: ShoppingCart },
  { name: 'Marketplace', href: '/marketplace', icon: TrendingUp },
  { name: 'Colaboraciones', href: '/collaborations', icon: Users },
  { name: 'Configuración', href: '/settings', icon: Settings },
  { name: 'Soporte', href: '/support', icon: HelpCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted =
        now.toLocaleDateString('es-ES') +
        ', ' +
        now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      setCurrentTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">📊 A4CO Monitoring Dashboard</h1>
            <span className="ml-4 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              Phase 2 - 25% External Beta
            </span>
          </div>
          <div className="text-sm text-gray-500">Última actualización: {currentTime}</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between">
            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navigation.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                        isActive
                          ? 'bg-green-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-white hover:text-gray-900'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
