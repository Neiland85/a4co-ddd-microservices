"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const footerLinks = {
    company: [
      { name: "Sobre Nosotros", href: "/sobre-nosotros" },
      { name: "Nuestra Misión", href: "/mision" },
      { name: "Equipo", href: "/equipo" },
      { name: "Contacto", href: "/contacto" },
    ],
    products: [
      { name: "Aceite de Oliva", href: "/productos/aceite" },
      { name: "Productos Ecológicos", href: "/productos/ecologicos" },
      { name: "Conservas", href: "/productos/conservas" },
      { name: "Artesanías", href: "/productos/artesanias" },
    ],
    support: [
      { name: "Centro de Ayuda", href: "/ayuda" },
      { name: "Términos de Servicio", href: "/terminos" },
      { name: "Política de Privacidad", href: "/privacidad" },
      { name: "Cookies", href: "/cookies" },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">J</span>
              </div>
              <span className="text-xl font-bold">Jaén Artesanal</span>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Conectamos productores locales con consumidores conscientes, promoviendo la economía local y los productos
              artesanales de Jaén.
            </p>

            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Productos</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">Recibe las últimas noticias y ofertas especiales.</p>

            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Tu email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-gradient-to-r from-green-600 to-amber-500 hover:from-green-700 hover:to-amber-600">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-green-500" />
              <span className="text-gray-400">info@jaenartesanal.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-green-500" />
              <span className="text-gray-400">+34 953 123 456</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-green-500" />
              <span className="text-gray-400">Jaén, Andalucía, España</span>
            </div>
          </div>
        </div>

        {/* Support Links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">© 2024 Jaén Artesanal. Todos los derechos reservados.</p>

            <div className="flex space-x-6">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
