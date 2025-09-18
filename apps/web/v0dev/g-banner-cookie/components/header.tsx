import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, User, ShoppingBag } from 'lucide-react';

export default function Header() {
  return (
    <header className="shadow-natural-sm sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-24 drop-shadow-sm">
              <Image
                src="/images/logo-green.jpeg"
                alt="A4CO - Mercado Local de Jaén"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="/artesanos"
              className="hover:text-a4co-olive-600 text-sm font-medium text-gray-700 transition-colors"
            >
              Artesanos
            </Link>
            <Link
              href="/productos"
              className="hover:text-a4co-olive-600 text-sm font-medium text-gray-700 transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/sobre-nosotros"
              className="hover:text-a4co-olive-600 text-sm font-medium text-gray-700 transition-colors"
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/contacto"
              className="hover:text-a4co-olive-600 text-sm font-medium text-gray-700 transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="hover:shadow-natural-sm hidden transition-shadow sm:flex"
            >
              <User className="mr-2 h-4 w-4" />
              Iniciar Sesión
            </Button>
            <Button
              size="sm"
              className="from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 shadow-mixed hover:shadow-mixed-lg bg-gradient-to-r text-white transition-all duration-300"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Vender</span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="hover:shadow-natural-sm transition-shadow md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
