"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cookie, Settings, X } from "lucide-react"
import { CookiePreferencesDialog } from "./components/cookie-preferences-dialog"
import type { CookieConsentState, CookiePreferences } from "./types/cookie-types"
import { DEFAULT_COOKIE_PREFERENCES, COOKIE_CONSENT_KEY, COOKIE_CONSENT_VERSION } from "./types/cookie-types"

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [consentState, setConsentState] = useState<CookieConsentState>({
    hasConsented: false,
    preferences: DEFAULT_COOKIE_PREFERENCES,
    version: COOKIE_CONSENT_VERSION,
  })

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (savedConsent) {
      try {
        const parsed: CookieConsentState = JSON.parse(savedConsent)
        if (parsed.version === COOKIE_CONSENT_VERSION) {
          setConsentState(parsed)
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
      } catch {
        setIsVisible(true)
      }
    } else {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const newState: CookieConsentState = {
      hasConsented: true,
      preferences: {
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true,
      },
      consentDate: new Date(),
      version: COOKIE_CONSENT_VERSION,
    }

    setConsentState(newState)
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newState))
    setIsVisible(false)
  }

  const handleAcceptNecessary = () => {
    const newState: CookieConsentState = {
      hasConsented: true,
      preferences: DEFAULT_COOKIE_PREFERENCES,
      consentDate: new Date(),
      version: COOKIE_CONSENT_VERSION,
    }

    setConsentState(newState)
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newState))
    setIsVisible(false)
  }

  const handleSavePreferences = (preferences: CookiePreferences) => {
    const newState: CookieConsentState = {
      hasConsented: true,
      preferences,
      consentDate: new Date(),
      version: COOKIE_CONSENT_VERSION,
    }

    setConsentState(newState)
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newState))
    setIsVisible(false)
    setShowPreferences(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border shadow-2xl pointer-events-auto">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Respetamos tu privacidad</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el
                  contenido. Puedes elegir qué tipos de cookies aceptar.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Aceptar todas
                  </Button>

                  <Button
                    onClick={handleAcceptNecessary}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Solo necesarias
                  </Button>

                  <Button
                    onClick={() => setShowPreferences(true)}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Personalizar
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CookiePreferencesDialog
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSave={handleSavePreferences}
        currentPreferences={consentState.preferences}
      />
    </>
  )
}
