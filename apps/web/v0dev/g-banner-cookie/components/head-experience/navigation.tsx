"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Package, Map, Mail } from "lucide-react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { useSoundEffects } from "../../hooks/use-sound-effects"
import type { NavigationItem } from "../../types/head-experience-types"

interface NavigationProps {
  items: NavigationItem[]
  currentPath?: string
}

const defaultItems: NavigationItem[] = [
  { id: "home", label: "Inicio", href: "/", icon: Home },
  { id: "catalog", label: "Catálogo", href: "/catalogo", icon: Package },
  { id: "map", label: "Mapa", href: "/mapa", icon: Map },
  { id: "contact", label: "Contacto", href: "/contacto", icon: Mail },
]

export function Navigation({ items = defaultItems, currentPath = "/" }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { playClick, playHover, playMenuOpen, playMenuClose } = useSoundEffects()
  const dragControls = useDragControls()

  const handleMobileMenuToggle = (open: boolean) => {
    setIsMobileMenuOpen(open)
    if (open) {
      playMenuOpen()
    } else {
      playMenuClose()
    }
  }

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
    playClick()
  }

  return (
    <nav className="flex items-center" role="navigation" aria-label="Navegación principal">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-1">
        {items.map((item) => {
          const isActive = currentPath === item.href
          return (
            <Link key={item.id} href={item.href} passHref>
              <Button
                variant="ghost"
                size="sm"
                onMouseEnter={() => playHover()}
                onClick={() => playClick()}
                className={`h-9 px-4 transition-all duration-200 ${
                  isActive
                    ? "bg-a4co-olive-100 text-a4co-olive-700 font-medium"
                    : "hover:bg-a4co-olive-50 text-gray-700"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">{item.badge}</span>
                  )}
                </motion.div>
              </Button>
            </Link>
          )
        })}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={handleMobileMenuToggle}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-a4co-olive-50"
              aria-label="Abrir menú de navegación"
              onMouseEnter={() => playHover()}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Menu className="h-5 w-5 text-a4co-olive-600" />
              </motion.div>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="top"
            className="h-full bg-white/95 backdrop-blur-sm border-b-a4co-olive-200"
            onPointerDownOutside={() => handleMobileMenuToggle(false)}
          >
            <SheetHeader className="text-left">
              <SheetTitle className="text-a4co-olive-700">Navegación</SheetTitle>
            </SheetHeader>

            <motion.div
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, info) => {
                if (info.velocity.y < -500 || info.offset.y < -100) {
                  handleMobileMenuToggle(false)
                }
              }}
              className="mt-6 space-y-2"
            >
              <AnimatePresence>
                {items.map((item, index) => {
                  const isActive = currentPath === item.href
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={item.href} passHref>
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={handleLinkClick}
                          onMouseEnter={() => playHover()}
                          className={`w-full justify-start h-12 px-4 transition-all duration-200 ${
                            isActive
                              ? "bg-a4co-olive-100 text-a4co-olive-700 font-medium"
                              : "hover:bg-a4co-olive-50 text-gray-700"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 w-full">
                            {item.icon && <item.icon className="h-5 w-5" />}
                            <span className="text-base">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </motion.div>
                        </Button>
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Drag indicator */}
              <motion.div
                className="flex justify-center pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
                <p className="text-xs text-gray-500 mt-2">Desliza hacia arriba para cerrar</p>
              </motion.div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
