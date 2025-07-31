"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  X,
  User,
  ShoppingCart,
  Heart,
  Search,
  MapPin,
  Palette,
  Users,
  Calendar,
  Award,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function ArtisanalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    {
      name: "Inicio",
      href: "/",
      icon: Sparkles,
      description: "Página principal",
    },
    {
      name: "Mapa",
      href: "/mapa",
      icon: MapPin,
      description: "Explora productores locales",
    },
    {
      name: "Productores",
      href: "/productores",
      icon: Users,
      description: "Conoce a nuestros artesanos",
    },
    {
      name: "Productos",
      href: "/productos",
      icon: Palette,
      description: "Catálogo artesanal",
    },
    {
      name: "Eventos",
      href: "/eventos",
      icon: Calendar,
      description: "Talleres y festivales",
    },
    {
      name: "Sobre Nosotros",
      href: "/sobre-nosotros",
      icon: Award,
      description: "Nuestra historia",
    },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-green-200/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 via-green-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg sm:text-xl">J</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-amber-600 bg-clip-text text-transparent">
                Jaén Artesanal
              </span>
              <p className="text-xs text-gray-600 -mt-1">Tradición & Calidad</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative px-4 py-2 rounded-xl text-gray-700 hover:text-green-600 font-medium transition-all duration-300 hover:bg-green-50"
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>{item.name}</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-green-600 to-amber-500 group-hover:w-full transition-all duration-300" />
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative group">
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="sr-only">Buscar</span>
            </Button>
            <Button variant="ghost" size="sm" className="relative group">
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white border-2 border-white">
                2
              </Badge>
              <span className="sr-only">Favoritos</span>
            </Button>
            <Button variant="ghost" size="sm" className="relative group">
              <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-green-600 text-white border-2 border-white">
                3
              </Badge>
              <span className="sr-only">Carrito</span>
            </Button>
            <Link href="/auth">
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 group bg-transparent"
              >
                <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Acceder
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden relative group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative w-5 h-5">
              <Menu
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
                }`}
              />
              <X
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"
                }`}
              />
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100 visible" : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl">
            <div className="px-4 py-6 space-y-1">
              {navigation.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <span className="block">{item.name}</span>
                      <span className="text-xs text-gray-500 group-hover:text-green-500">{item.description}</span>
                    </div>
                  </Link>
                )
              })}

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-green-200 hover:bg-green-50"
                  >
                    <User className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <span className="block">Acceder</span>
                      <span className="text-xs text-gray-500">Inicia sesión o regístrate</span>
                    </div>
                  </Button>
                </Link>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="ghost" size="sm" className="flex-col h-auto py-3 space-y-1">
                    <Search className="w-5 h-5" />
                    <span className="text-xs">Buscar</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-col h-auto py-3 space-y-1 relative">
                    <Heart className="w-5 h-5" />
                    <span className="text-xs">Favoritos</span>
                    <Badge className="absolute top-1 right-1 h-4 w-4 rounded-full p-0 text-xs bg-red-500">2</Badge>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-col h-auto py-3 space-y-1 relative">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-xs">Carrito</span>
                    <Badge className="absolute top-1 right-1 h-4 w-4 rounded-full p-0 text-xs bg-green-600">3</Badge>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
