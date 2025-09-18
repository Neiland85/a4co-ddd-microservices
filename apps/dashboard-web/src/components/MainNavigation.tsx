'use client';

import { Settings, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">A4CO Dashboard</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/marketplace"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname?.startsWith('/marketplace')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <ShoppingBag size={16} />
              <span>Marketplace</span>
            </Link>

            <Link
              href="/backoffice"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname?.startsWith('/backoffice')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <Settings size={16} />
              <span>Backoffice</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
