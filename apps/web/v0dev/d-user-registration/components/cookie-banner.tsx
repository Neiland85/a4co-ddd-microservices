'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie, Settings, Check, X } from 'lucide-react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    setPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    });
    localStorage.setItem(
      'cookie-consent',
      JSON.stringify({
        ...preferences,
        analytics: true,
        marketing: true,
        personalization: true,
      })
    );
    setShowBanner(false);
  };

  const acceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowBanner(false);
  };

  const rejectAll = () => {
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    });
    localStorage.setItem(
      'cookie-consent',
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        personalization: false,
      })
    );
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
        >
          <Card className="border-2 border-purple-200 bg-white/95 p-6 shadow-2xl backdrop-blur-lg">
            <div className="mb-4 flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-purple-600"
              >
                <Cookie size={24} />
              </motion.div>
              <div>
                <h3 className="mb-2 font-bold text-gray-900">🍪 ¡Cookies Deliciosas!</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Usamos cookies para mejorar tu experiencia. ¿Nos permites usar algunas cookies
                  opcionales para personalizar tu experiencia?
                </p>
              </div>
            </div>

            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mb-4 space-y-3"
              >
                {Object.entries({
                  necessary: 'Necesarias (Requeridas)',
                  analytics: 'Analíticas',
                  marketing: 'Marketing',
                  personalization: 'Personalización',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{label}</span>
                    <button
                      onClick={() =>
                        key !== 'necessary' &&
                        setPreferences(prev => ({
                          ...prev,
                          [key]: !prev[key as keyof typeof prev],
                        }))
                      }
                      disabled={key === 'necessary'}
                      className={`h-6 w-12 rounded-full transition-colors ${
                        preferences[key as keyof typeof preferences]
                          ? 'bg-purple-600'
                          : 'bg-gray-300'
                      } ${key === 'necessary' ? 'opacity-50' : ''}`}
                    >
                      <motion.div
                        animate={{
                          x: preferences[key as keyof typeof preferences] ? 24 : 2,
                        }}
                        className="h-5 w-5 rounded-full bg-white shadow-md"
                      />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  onClick={acceptAll}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Check size={16} className="mr-1" />
                  Aceptar Todo
                </Button>
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  variant="outline"
                  size="icon"
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <Settings size={16} />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={acceptSelected}
                  variant="outline"
                  className="flex-1 border-purple-200 bg-transparent hover:bg-purple-50"
                >
                  Guardar Preferencias
                </Button>
                <Button
                  onClick={rejectAll}
                  variant="outline"
                  size="icon"
                  className="border-red-200 bg-transparent text-red-600 hover:bg-red-50"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
