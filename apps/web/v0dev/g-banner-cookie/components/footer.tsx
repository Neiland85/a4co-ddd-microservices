import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="relative h-12 w-32">
              <Image
                src="/images/logo-green.jpeg"
                alt="A4CO"
                fill
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Plataforma dedicada por y para el pequeño comercio. Conectamos artesanos locales de Jaén con el mundo.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-a4co-olive-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-a4co-olive-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-a4co-olive-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/artesanos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Artesanos
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ayuda" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Términos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-a4co-olive-400" />
                <span className="text-gray-400 text-sm">Jaén, Andalucía</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-a4co-olive-400" />
                <span className="text-gray-400 text-sm">info@a4co.es</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-a4co-olive-400" />
                <span className="text-gray-400 text-sm">+34 953 XXX XXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 A4CO. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/politica-privacidad" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
