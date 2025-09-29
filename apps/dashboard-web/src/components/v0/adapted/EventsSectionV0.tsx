// apps/dashboard-web/src/components/v0/adapted/EventsSectionV0.tsx
// Versión adaptada del EventsSection de v0.dev para eventos del mercado local
'use client';

import EventsSectionV0Raw from '../raw/EventsSection';

export default function EventsSectionV0() {
  // El componente raw usa datos hardcodeados sobre eventos culturales.
  // Por ahora mostramos la versión original pero con un wrapper que indica
  // que está adaptado para eventos del mercado local de Jaén

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 p-4 text-white">
        <h2 className="mb-2 text-xl font-bold">📅 Eventos del Mercado Local de Jaén</h2>
        <p className="text-sm opacity-90">
          Ferias, mercados y eventos gastronómicos de la provincia
        </p>
        <div className="mt-2 text-xs">🏛️ Próximos eventos locales y ferias agrícolas</div>
      </div>

      {/* Nota: El componente raw tiene datos hardcodeados. En una versión futura,
          podríamos modificar el componente raw para aceptar props dinámicas */}
      <div className="relative">
        <EventsSectionV0Raw />
        <div className="absolute right-4 top-4 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <h3 className="mb-2 text-sm font-semibold">Próximamente:</h3>
          <ul className="space-y-1 text-xs">
            <li>• Ferias agrícolas de Jaén</li>
            <li>• Mercados locales</li>
            <li>• Eventos gastronómicos</li>
            <li>• Talleres de productores</li>
            <li>• Catas y degustaciones</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
