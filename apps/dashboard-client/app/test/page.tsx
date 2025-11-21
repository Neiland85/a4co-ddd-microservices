'use client';

import { useAnime } from '@/hooks/useAnime';

export default function TestPage() {
  const testRef = useAnime({
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 1000,
    easing: 'easeOutCubic',
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Página de Prueba de Animaciones</h1>
      <div ref={testRef} className="bg-blue-500 text-white p-4 rounded-lg">
        Esta caja debería animarse al cargar la página
      </div>
    </div>
  );
}
