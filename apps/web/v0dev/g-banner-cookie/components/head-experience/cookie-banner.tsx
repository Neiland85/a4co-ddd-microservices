"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Shield, Settings, ExternalLink, Cookie } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSoundEffects } from "../../hooks/use-sound-effects"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

interface CookieBannerProps {
  companyName?: string
  privacyPolicyUrl?: string
  onPreferencesChange?: (preferences: CookiePreferences) => void
}

const COOKIE_CONSENT_KEY = "a4co-cookie-consent"

export function CookieBanner({
  companyName = "A4CO",
  privacyPolicyUrl = "/politica-privacidad",
  onPreferencesChange,
}: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  })
  const { playClick, playSuccess } = useSoundEffects()

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!savedConsent) {
      setIsVisible(true)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        preferences: prefs,
        timestamp: new Date().toISOString(),
      }),
    )
    setIsVisible(false)
    setShowPreferences(false)
    onPreferencesChange?.(prefs)
    playSuccess()
  }

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    savePreferences(allAccepted)
  }

  const handleRejectNonEssential = () => {
    const essentialOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
    savePreferences(essentialOnly)
  }

  const handleConfigurePreferences = () => {
    setShowPreferences(true)
    playClick()
  }

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleSavePreferences = () => {
    savePreferences(preferences)
  }

  if (!isVisible) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-40"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          role="dialog"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-description"
          aria-modal="true"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <Card className="mx-auto max-w-4xl border-a4co-olive-200 shadow-natural-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex-shrink-0 mt-1"
                  >
                    <Cookie className="h-6 w-6 text-a4co-clay-600 drop-shadow-sm" aria-hidden="true" />
                  </motion.div>

                  <div className="flex-1 space-y-2">
                    <h2 id="cookie-banner-title" className="text-lg font-semibold text-a4co-olive-700 drop-shadow-sm">
                      Valoramos tu Privacidad
                    </h2>

                    <p id="cookie-banner-description" className="text-sm text-gray-700 leading-relaxed">
                      {companyName} utiliza cookies y tecnologías similares para mejorar tu experiencia de navegación,
                      analizar el tráfico del sitio y personalizar el contenido. Puedes gestionar tus preferencias o
                      obtener más información en nuestra{" "}
                      <a
                        href={privacyPolicyUrl}
                        className="text-a4co-clay-600 hover:text-a4co-clay-700 underline inline-flex items-center gap-1 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Política de Privacidad (se abre en nueva pestaña)"
                      >
                        Política de Privacidad
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectNonEssential}
                    onMouseEnter={() => playClick({ volume: 0.3 })}
                    className="border-a4co-olive-600 text-a4co-olive-600 hover:bg-a4co-olive-50 text-xs sm:text-sm bg-transparent shadow-natural hover:shadow-natural-md transition-all duration-300"
                    aria-label="Rechazar cookies no esenciales"
                  >
                    <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      Rechazar No Esenciales
                    </motion.span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleConfigurePreferences}
                    className="border-a4co-clay-600 text-a4co-clay-600 hover:bg-a4co-clay-50 text-xs sm:text-sm inline-flex items-center gap-2 bg-transparent shadow-natural hover:shadow-natural-md transition-all duration-300"
                    aria-label="Configurar preferencias de cookies"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" aria-hidden="true" />
                      Configurar
                    </motion.div>
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-a4co-olive-600 to-a4co-clay-600 hover:from-a4co-olive-700 hover:to-a4co-clay-700 text-white text-xs sm:text-sm shadow-mixed hover:shadow-mixed-lg transition-all duration-300"
                    aria-label="Aceptar todas las cookies"
                  >
                    <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      Aceptar Todo
                    </motion.span>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Preferences Dialog */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border-a4co-olive-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-a4co-olive-700">
              <Shield className="h-5 w-5" />
              Configuración de Cookies
            </DialogTitle>
          </DialogHeader>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Cookies Necesarias</h3>
                  <p className="text-sm text-gray-600">Esenciales para el funcionamiento básico del sitio web.</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Cookies de Análisis</h3>
                  <p className="text-sm text-gray-600">Nos ayudan a entender cómo interactúas con nuestro sitio web.</p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Cookies de Marketing</h3>
                  <p className="text-sm text-gray-600">
                    Utilizadas para mostrar anuncios relevantes y medir su efectividad.
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Cookies Funcionales</h3>
                  <p className="text-sm text-gray-600">Permiten funcionalidades mejoradas y personalización.</p>
                </div>
                <Switch
                  checked={preferences.functional}
                  onCheckedChange={(checked) => handlePreferenceChange("functional", checked)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPreferences(false)} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="flex-1 bg-gradient-to-r from-a4co-olive-600 to-a4co-clay-600 hover:from-a4co-olive-700 hover:to-a4co-clay-700"
              >
                Guardar Preferencias
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
