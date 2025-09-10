'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';
import Link from 'next/link';

export default function ArtisanalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    {
      name: 'Inicio',
      href: '/',
      icon: Sparkles,
      description: 'Página principal',
    },
    {
      name: 'Mapa',
      href: '/mapa',
      icon: MapPin,
      description: 'Explora productores locales',
    },
    {
      name: 'Productores',
      href: '/productores',
      icon: Users,
      description: 'Conoce a nuestros artesanos',
    },
    {
      name: 'Productos',
      href: '/productos',
      icon: Palette,
      description: 'Catálogo artesanal',
    },
    {
      name: 'Eventos',
      href: '/eventos',
      icon: Calendar,
      description: 'Talleres y festivales',
    },
    {
      name: 'Sobre Nosotros',
      href: '/sobre-nosotros',
      icon: Award,
      description: 'Nuestra historia',
    },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'border-b border-green-200/50 bg-white/95 shadow-xl backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 via-green-500 to-amber-500 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl sm:h-12 sm:w-12">
                <span className="text-lg font-bold text-white sm:text-xl">J</span>
              </div>
              <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="hidden sm:block">
              <span className="bg-gradient-to-r from-green-700 to-amber-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                Jaén Artesanal
              </span>
              <p className="-mt-1 text-xs text-gray-600">Tradición & Calidad</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 lg:flex">
            {navigation.map(item => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative rounded-xl px-4 py-2 font-medium text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>{item.name}</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transform bg-gradient-to-r from-green-600 to-amber-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-2 md:flex">
            <Button variant="ghost" size="sm" className="group relative">
              <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="sr-only">Buscar</span>
            </Button>
            <Button variant="ghost" size="sm" className="group relative">
              <Heart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full border-2 border-white bg-red-500 p-0 text-xs text-white">
                2
              </Badge>
              <span className="sr-only">Favoritos</span>
            </Button>
            <Button variant="ghost" size="sm" className="group relative">
              <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full border-2 border-white bg-green-600 p-0 text-xs text-white">
                3
              </Badge>
              <span className="sr-only">Carrito</span>
            </Button>
            <Link href="/auth">
              <Button
                variant="outline"
                size="sm"
                className="group border-green-200 bg-transparent transition-all duration-300 hover:border-green-300 hover:bg-green-50"
              >
                <User className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Acceder
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="group relative lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative h-5 w-5">
              <Menu
                className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                }`}
              />
              <X
                className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'
                }`}
              />
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`transition-all duration-500 ease-in-out lg:hidden ${
            isMenuOpen ? 'visible max-h-screen opacity-100' : 'invisible max-h-0 opacity-0'
          }`}
        >
          <div className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white/95 shadow-xl backdrop-blur-md">
            <div className="space-y-1 px-4 py-6">
              {navigation.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center space-x-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <IconComponent className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <div>
                      <span className="block">{item.name}</span>
                      <span className="text-xs text-gray-500 group-hover:text-green-500">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                );
              })}

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-green-200 bg-transparent hover:bg-green-50"
                  >
                    <User className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <span className="block">Acceder</span>
                      <span className="text-xs text-gray-500">Inicia sesión o regístrate</span>
                    </div>
                  </Button>
                </Link>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="ghost" size="sm" className="h-auto flex-col space-y-1 py-3">
                    <Search className="h-5 w-5" />
                    <span className="text-xs">Buscar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-auto flex-col space-y-1 py-3"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="text-xs">Favoritos</span>
                    <Badge className="absolute right-1 top-1 h-4 w-4 rounded-full bg-red-500 p-0 text-xs">
                      2
                    </Badge>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-auto flex-col space-y-1 py-3"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="text-xs">Carrito</span>
                    <Badge className="absolute right-1 top-1 h-4 w-4 rounded-full bg-green-600 p-0 text-xs">
                      3
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
