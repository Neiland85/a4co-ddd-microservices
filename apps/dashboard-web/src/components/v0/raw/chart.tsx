'use client';

import * as React from 'react';

// Componente chart temporal para evitar errores de compilación
// TODO: Actualizar a una versión compatible de recharts

export const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
        <span className="text-gray-500">📊 Gráfico no disponible</span>
      </div>
    </div>
  )
);
Chart.displayName = 'Chart';

// Componentes básicos para compatibilidad
export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
ChartContainer.displayName = 'ChartContainer';

export const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
ChartTooltip.displayName = 'ChartTooltip';

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} {...props} />);
ChartTooltipContent.displayName = 'ChartTooltipContent';

export const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
ChartLegend.displayName = 'ChartLegend';

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} {...props} />);
ChartLegendContent.displayName = 'ChartLegendContent';

// Tipos básicos
export type ChartConfig = Record<string, any>;
