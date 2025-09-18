'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Home,
  Settings,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MainNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo y título */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">A4CO Dashboard</h1>
          </div>
        </div>

        {/* Navegación principal */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              className="flex items-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Marketplace</span>
              {isActive('/') && <Badge variant="secondary">Principal</Badge>}
            </Button>
          </Link>

          <Link href="/backoffice">
            <Button
              variant={isActive('/backoffice') ? 'default' : 'ghost'}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Backoffice</span>
              {isActive('/backoffice') && <Badge variant="secondary">Admin</Badge>}
            </Button>
          </Link>

          {/* Botón de configuración */}
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
