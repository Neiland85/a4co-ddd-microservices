'use client';

import React from 'react';
import AnimatedButton from '@/components/AnimatedButton';
import { useMicroAnimations } from '@/lib/useMicroAnimations';

export default function AnimationDemo() {
  const { animateLoading } = useMicroAnimations();
  const [isLoading, setIsLoading] = React.useState(false);
  const loadingButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleLoadingDemo = () => {
    if (!isLoading && loadingButtonRef.current) {
      setIsLoading(true);
      loadingButtonRef.current.id = 'loading-demo-btn';
      animateLoading('loading-demo-btn', { duration: 3000 });

      // Detener la animación después de 3 segundos
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🎭 Animaciones de Micro-Interacciones</h1>
        <p className="text-muted-foreground">
          Movimientos irregulares con alta precisión UX usando leyes de idempotencia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Hover Animation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🖱️ Hover Animation</h3>
          <p className="text-sm text-muted-foreground">Movimientos irregulares al pasar el mouse</p>
          <div className="space-y-2">
            <AnimatedButton animationIntensity="subtle" className="w-full">
              Subtle Hover
            </AnimatedButton>
            <AnimatedButton animationIntensity="medium" className="w-full">
              Medium Hover
            </AnimatedButton>
            <AnimatedButton animationIntensity="intense" className="w-full">
              Intense Hover
            </AnimatedButton>
          </div>
        </div>

        {/* Click Animation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">👆 Click Animation</h3>
          <p className="text-sm text-muted-foreground">
            Feedback táctil con movimientos irregulares
          </p>
          <div className="space-y-2">
            <AnimatedButton variant="secondary" animationIntensity="subtle" className="w-full">
              Subtle Click
            </AnimatedButton>
            <AnimatedButton variant="secondary" animationIntensity="medium" className="w-full">
              Medium Click
            </AnimatedButton>
            <AnimatedButton variant="secondary" animationIntensity="intense" className="w-full">
              Intense Click
            </AnimatedButton>
          </div>
        </div>

        {/* Focus Animation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🎯 Focus Animation</h3>
          <p className="text-sm text-muted-foreground">Pulso sutil para accesibilidad</p>
          <div className="space-y-2">
            <AnimatedButton variant="outline" animationIntensity="subtle" className="w-full">
              Subtle Focus
            </AnimatedButton>
            <AnimatedButton variant="outline" animationIntensity="medium" className="w-full">
              Medium Focus
            </AnimatedButton>
            <AnimatedButton variant="outline" animationIntensity="intense" className="w-full">
              Intense Focus
            </AnimatedButton>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">⏳ Loading Animation</h3>
          <p className="text-sm text-muted-foreground">Movimientos irregulares durante carga</p>
          <AnimatedButton
            ref={loadingButtonRef}
            variant="destructive"
            onClick={handleLoadingDemo}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Cargando...' : 'Iniciar Loading'}
          </AnimatedButton>
        </div>

        {/* Custom Animation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🎨 Custom Animation</h3>
          <p className="text-sm text-muted-foreground">Combinación de efectos</p>
          <AnimatedButton
            variant="ghost"
            animationIntensity="intense"
            className="w-full border-2 border-dashed"
          >
            ✨ Custom Effect
          </AnimatedButton>
        </div>

        {/* Disabled Animation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🚫 Disabled State</h3>
          <p className="text-sm text-muted-foreground">Sin animaciones cuando está deshabilitado</p>
          <AnimatedButton disabled className="w-full">
            Deshabilitado
          </AnimatedButton>
        </div>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-4">📚 Características Técnicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">🔄 Idempotencia</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Animaciones canceladas automáticamente</li>
              <li>• Estados de animación rastreados</li>
              <li>• Cleanup automático al desmontar</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🎲 Movimientos Controlados</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Funciones trigonométricas para naturalidad</li>
              <li>• Semillas aleatorias pero reproducibles</li>
              <li>• Amplitudes configurables</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">⚡ Performance</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Animaciones basadas en requestAnimationFrame</li>
              <li>• Optimización automática de Anime.js</li>
              <li>• Memoria gestionada eficientemente</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">♿ Accesibilidad</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Respeta preferencias de movimiento reducido</li>
              <li>• Funciona sin JavaScript habilitado</li>
              <li>• Animaciones opcionales por componente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
