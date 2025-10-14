'use client';

import BannerCookie from '../banner-cookie';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-8 text-center">
          <h1 className="text-4xl font-bold text-green-800">🍪 Banner de Cookies Moderno RGPD</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-700">
            Un banner de cookies completamente moderno y conforme al RGPD con opciones detalladas,
            explicaciones claras y un diseño atractivo.
          </p>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-white/50 p-6 shadow-lg">
              <h3 className="mb-2 font-semibold text-green-800">✅ RGPD Compliant</h3>
              <p className="text-sm text-gray-600">
                Cumple completamente con todas las regulaciones del RGPD
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white/50 p-6 shadow-lg">
              <h3 className="mb-2 font-semibold text-amber-800">🎨 Diseño Moderno</h3>
              <p className="text-sm text-gray-600">
                Interfaz atractiva con gradientes y efectos visuales
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-white/50 p-6 shadow-lg">
              <h3 className="mb-2 font-semibold text-blue-800">⚙️ Configuración Granular</h3>
              <p className="text-sm text-gray-600">
                Control detallado sobre cada categoría de cookies
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>Recarga la página para ver el banner de cookies en acción</p>
            <p className="mt-2">
              <button
                onClick={() => {
                  localStorage.removeItem('a4co-cookie-consent-v2');
                  window.location.reload();
                }}
                className="text-blue-600 underline hover:text-blue-700"
              >
                Borrar cookies y mostrar banner
              </button>
            </p>
          </div>
        </div>
      </div>

      <BannerCookie
        companyName="A4CO"
        privacyPolicyUrl="/privacy-policy"
        cookiePolicyUrl="/cookie-policy"
        contactEmail="privacy@a4co.com"
        position="bottom"
        theme="auto"
        onPreferencesChange={preferences => {
          console.log('Preferencias actualizadas:', preferences);
        }}
      />
    </div>
  );
}
