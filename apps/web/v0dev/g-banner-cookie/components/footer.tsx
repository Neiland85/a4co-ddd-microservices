import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="relative h-12 w-32">
              <Image
                src="/images/logo-green.jpeg"
                alt="A4CO"
                fill
                className="object-contain brightness-0 invert filter"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Plataforma dedicada por y para el pequeño comercio. Conectamos artesanos locales de
              Jaén con el mundo.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-a4co-olive-400 text-gray-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-a4co-olive-400 text-gray-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-a4co-olive-400 text-gray-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/artesanos"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Artesanos
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-nosotros"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/ayuda"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-privacidad"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Términos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="text-a4co-olive-400 h-4 w-4" />
                <span className="text-sm text-gray-400">Jaén, Andalucía</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-a4co-olive-400 h-4 w-4" />
                <span className="text-sm text-gray-400">info@a4co.es</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-a4co-olive-400 h-4 w-4" />
                <span className="text-sm text-gray-400">+34 953 XXX XXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-400">© 2024 A4CO. Todos los derechos reservados.</p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link
                href="/politica-privacidad"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
