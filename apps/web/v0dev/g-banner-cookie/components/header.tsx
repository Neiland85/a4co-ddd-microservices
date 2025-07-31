import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User, ShoppingBag } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-natural-sm">
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
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/artesanos"
              className="text-sm font-medium text-gray-700 hover:text-a4co-olive-600 transition-colors"
            >
              Artesanos
            </Link>
            <Link
              href="/productos"
              className="text-sm font-medium text-gray-700 hover:text-a4co-olive-600 transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/sobre-nosotros"
              className="text-sm font-medium text-gray-700 hover:text-a4co-olive-600 transition-colors"
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/contacto"
              className="text-sm font-medium text-gray-700 hover:text-a4co-olive-600 transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex hover:shadow-natural-sm transition-shadow">
              <User className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 text-white shadow-mixed hover:shadow-mixed-lg transition-all duration-300"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Vender</span>
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden hover:shadow-natural-sm transition-shadow">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
