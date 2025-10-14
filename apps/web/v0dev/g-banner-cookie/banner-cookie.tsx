'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Settings,
  ExternalLink,
  Cookie,
  Lock,
  Eye,
  Users,
  Sparkles,
  X,
} from 'lucide-react';
import { CookiePreferencesDialog } from './components/cookie-preferences-dialog';
import type { BannerCookieProps, CookiePreferences, CookieConsent } from './types/cookie-types';

const COOKIE_CONSENT_KEY = 'a4co-cookie-consent-v2';
const CONSENT_VERSION = '2.1';

export default function BannerCookie({
  companyName = 'A4CO',
  privacyPolicyUrl = '/privacy-policy',
  cookiePolicyUrl = '/cookie-policy',
  contactEmail = 'privacy@a4co.com',
  onPreferencesChange,
  position = 'bottom',
  theme = 'auto',
}: BannerCookieProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice with current version
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      try {
        const consent: CookieConsent = JSON.parse(savedConsent);
        // Show banner again if version changed or consent is older than 13 months
        const consentDate = new Date(consent.timestamp);
        const thirteenMonthsAgo = new Date();
        thirteenMonthsAgo.setMonth(thirteenMonthsAgo.getMonth() - 13);

        if (consent.version !== CONSENT_VERSION || consentDate < thirteenMonthsAgo) {
          setIsVisible(true);
        }
      } catch {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, []);

  const savePreferences = (preferences: CookiePreferences) => {
    const consent: CookieConsent = {
      preferences,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
      userAgent: navigator.userAgent,
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setIsVisible(false);
    setShowPreferences(false);
    onPreferencesChange?.(preferences);

    // Dispatch custom event for other parts of the app
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }));
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      personalization: true,
      social: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      personalization: false,
      social: false,
    };
    savePreferences(essentialOnly);
  };

  const handleConfigurePreferences = () => {
    setShowPreferences(true);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) {
    return null;
  }

  const positionClasses = {
    bottom: 'bottom-0 left-0 right-0',
    top: 'top-0 left-0 right-0',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Cookie Banner */}
      <div
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
        aria-modal="true"
        className={`fixed ${positionClasses[position]} z-50 p-4 transition-all duration-500 ease-out sm:p-6 ${
          isMinimized ? 'translate-y-2 transform' : ''
        }`}
      >
        <Card className="mx-auto max-w-5xl overflow-hidden border-0 bg-gradient-to-br from-white via-green-50/50 to-amber-50/30 shadow-2xl backdrop-blur-xl">
          {/* Header with minimize button */}
          <div className="flex items-center justify-between p-4 pb-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Cookie className="h-8 w-8 text-amber-600 drop-shadow-sm" />
                <Sparkles className="absolute -right-1 -top-1 h-4 w-4 animate-pulse text-green-600" />
              </div>
              <div>
                <h2
                  id="cookie-banner-title"
                  className="text-xl font-bold text-green-800 drop-shadow-sm"
                >
                  🍪 Gestión de Cookies y Privacidad
                </h2>
                <Badge
                  variant="outline"
                  className="border-green-300 bg-green-50/50 text-xs text-green-700"
                >
                  RGPD Compliant • Versión {CONSENT_VERSION}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimize}
              className="text-gray-500 hover:bg-gray-100/50 hover:text-gray-700"
              aria-label={isMinimized ? 'Expandir banner' : 'Minimizar banner'}
            >
              {isMinimized ? <Eye className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>

          <CardContent
            className={`transition-all duration-300 ${isMinimized ? 'p-4 pt-2' : 'p-6 pt-4'}`}
          >
            {!isMinimized && (
              <>
                {/* Main Content */}
                <div className="space-y-6">
                  {/* Description */}
                  <div className="space-y-3">
                    <p
                      id="cookie-banner-description"
                      className="text-sm leading-relaxed text-gray-700"
                    >
                      En <strong>{companyName}</strong>, respetamos tu privacidad y cumplimos
                      estrictamente con el
                      <strong> Reglamento General de Protección de Datos (RGPD)</strong>. Utilizamos
                      cookies y tecnologías similares para mejorar tu experiencia, analizar el uso
                      del sitio y personalizar contenido.
                    </p>

                    <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
                      <div className="flex items-start gap-2 rounded-lg border border-green-200/50 bg-green-50/50 p-3">
                        <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-800">Transparencia Total</p>
                          <p className="text-green-700">
                            Control completo sobre tus datos personales
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-lg border border-amber-200/50 bg-amber-50/50 p-3">
                        <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                        <div>
                          <p className="font-semibold text-amber-800">Seguridad Garantizada</p>
                          <p className="text-amber-700">Encriptación y protección de datos</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-lg border border-blue-200/50 bg-blue-50/50 p-3">
                        <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-800">Tus Derechos</p>
                          <p className="text-blue-700">Acceso, rectificación y eliminación</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legal Links */}
                  <div className="flex flex-wrap gap-4 text-xs">
                    <a
                      href={privacyPolicyUrl}
                      className="inline-flex items-center gap-1 text-green-600 underline transition-colors hover:text-green-700"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Política de Privacidad (se abre en nueva pestaña)"
                    >
                      <Shield className="h-3 w-3" />
                      Política de Privacidad
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href={cookiePolicyUrl}
                      className="inline-flex items-center gap-1 text-amber-600 underline transition-colors hover:text-amber-700"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Política de Cookies (se abre en nueva pestaña)"
                    >
                      <Cookie className="h-3 w-3" />
                      Política de Cookies
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="inline-flex items-center gap-1 text-blue-600 underline transition-colors hover:text-blue-700"
                      aria-label="Contactar sobre privacidad"
                    >
                      <Users className="h-3 w-3" />
                      Contacto Privacidad
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 border-t border-gray-200/50 pt-4 sm:flex-row">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRejectNonEssential}
                      className="flex-1 border-red-300 bg-white/50 text-red-700 shadow-sm transition-all duration-300 hover:bg-red-50 hover:shadow-md sm:flex-none"
                      aria-label="Rechazar cookies no esenciales"
                    >
                      ❌ Rechazar No Esenciales
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleConfigurePreferences}
                      className="inline-flex flex-1 items-center gap-2 border-blue-300 bg-white/50 text-blue-700 shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md sm:flex-none"
                      aria-label="Configurar preferencias de cookies"
                    >
                      <Settings className="h-4 w-4" />
                      ⚙️ Configurar Preferencias
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleAcceptAll}
                      className="flex-1 bg-gradient-to-r from-green-600 via-green-500 to-amber-500 text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:via-green-600 hover:to-amber-600 hover:shadow-xl sm:flex-none"
                      aria-label="Aceptar todas las cookies"
                    >
                      ✅ Aceptar Todo
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Minimized View */}
            {isMinimized && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  🍪 Gestión de cookies - Haz clic para expandir
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleRejectNonEssential}>
                    Rechazar
                  </Button>
                  <Button size="sm" onClick={handleAcceptAll}>
                    Aceptar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CookiePreferencesDialog
        open={showPreferences}
        onOpenChange={setShowPreferences}
        onSave={savePreferences}
        onAcceptAll={handleAcceptAll}
        onRejectAll={handleRejectNonEssential}
        companyName={companyName}
        contactEmail={contactEmail}
      />
    </>
  );
}
