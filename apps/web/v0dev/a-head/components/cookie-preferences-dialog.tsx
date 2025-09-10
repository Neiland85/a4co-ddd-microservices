'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { X, Shield, BarChart3, Target, Zap } from 'lucide-react';
import type { CookiePreferences } from '../types/cookie-types';

interface CookiePreferencesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
  currentPreferences: CookiePreferences;
}

export function CookiePreferencesDialog({
  isOpen,
  onClose,
  onSave,
  currentPreferences,
}: CookiePreferencesDialogProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(currentPreferences);

  const handleSave = () => {
    onSave(preferences);
  };

  const cookieCategories = [
    {
      key: 'necessary' as keyof CookiePreferences,
      title: 'Cookies Necesarias',
      description:
        'Esenciales para el funcionamiento básico del sitio web. No se pueden desactivar.',
      icon: Shield,
      color: 'text-green-600',
      disabled: true,
    },
    {
      key: 'functional' as keyof CookiePreferences,
      title: 'Cookies Funcionales',
      description:
        'Permiten funcionalidades mejoradas y personalización, como recordar tus preferencias.',
      icon: Zap,
      color: 'text-blue-600',
      disabled: false,
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Cookies de Análisis',
      description: 'Nos ayudan a entender cómo los visitantes interactúan con el sitio web.',
      icon: BarChart3,
      color: 'text-purple-600',
      disabled: false,
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Cookies de Marketing',
      description:
        'Se utilizan para mostrar anuncios relevantes y medir la efectividad de las campañas.',
      icon: Target,
      color: 'text-orange-600',
      disabled: false,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Preferencias de Cookies
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <p className="text-sm leading-relaxed text-gray-600">
            Gestiona tus preferencias de cookies. Puedes activar o desactivar diferentes tipos de
            cookies según tus necesidades. Las cookies necesarias siempre están activas para
            garantizar el funcionamiento básico del sitio.
          </p>

          <div className="space-y-4">
            {cookieCategories.map(category => {
              const Icon = category.icon;
              return (
                <div
                  key={category.key}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300"
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 ${category.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{category.title}</h4>
                      <Switch
                        checked={preferences[category.key]}
                        onCheckedChange={checked =>
                          setPreferences(prev => ({ ...prev, [category.key]: checked }))
                        }
                        disabled={category.disabled}
                      />
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">{category.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
            >
              Guardar Preferencias
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
