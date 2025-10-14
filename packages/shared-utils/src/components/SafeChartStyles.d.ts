import React from 'react';
interface ChartStylesProps {
    id: string;
    colorConfig: Array<{
        theme: string;
        colors: Record<string, string>;
    }>;
}
/**
 * SafeChartStyles - Componente seguro para inyectar estilos de gráficos
 * Evita el uso de dangerouslySetInnerHTML detectado como Security Hotspot por SonarCloud
 */
export declare const SafeChartStyles: React.FC<ChartStylesProps>;
/**
 * Hook para generar estilos de chart de forma segura
 */
export declare function useChartStyles(id: string, colorConfig: Array<{
    theme: string;
    colors: Record<string, string>;
}>): {
    selector: string;
    styles: {};
}[] | null;
/**
 * Alternativa usando CSS Modules o styled-components
 */
export declare function createChartStyleSheet(id: string, colorConfig: Array<{
    theme: string;
    colors: Record<string, string>;
}>): string;
export {};
//# sourceMappingURL=SafeChartStyles.d.ts.map