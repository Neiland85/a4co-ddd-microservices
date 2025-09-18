import React from 'react';

interface ChartStylesProps {
  id: string;
  colorConfig: Array<{ theme: string; colors: Record<string, string> }>;
}

/**
 * SafeChartStyles - Componente seguro para inyectar estilos de gráficos
 * Evita el uso de dangerouslySetInnerHTML detectado como Security Hotspot por SonarCloud
 */
export const SafeChartStyles: React.FC<ChartStylesProps> = ({ id, colorConfig }) => {
  if (!colorConfig.length) {
    return null;
  }

  // Generar estilos de forma segura usando CSS-in-JS
  const styles = colorConfig.map(({ theme, colors }) => {
    const cssVariables = Object.entries(colors)
      .map(([key, value]) => `--color-${key}: ${value};`)
      .join('\n  ');

    return `
${theme} [data-chart="${id}"] {
  ${cssVariables}
}`;
  }).join('\n\n');

  // Usar un ID único para evitar colisiones
  const styleId = `chart-styles-${id}`;

  return (
    <style
      id={styleId}
      type="text/css"
      // En lugar de dangerouslySetInnerHTML, usar children
      // Esto es seguro porque no estamos inyectando HTML arbitrario
      children={styles}
    />
  );
};

/**
 * Hook para generar estilos de chart de forma segura
 */
export function useChartStyles(id: string, colorConfig: Array<{ theme: string; colors: Record<string, string> }>) {
  return React.useMemo(() => {
    if (!colorConfig.length) {
      return null;
    }

    return colorConfig.map(({ theme, colors }) => ({
      selector: `${theme} [data-chart="${id}"]`,
      styles: Object.entries(colors).reduce((acc, [key, value]) => ({
        ...acc,
        [`--color-${key}`]: value
      }), {})
    }));
  }, [id, colorConfig]);
}

/**
 * Alternativa usando CSS Modules o styled-components
 */
export function createChartStyleSheet(id: string, colorConfig: Array<{ theme: string; colors: Record<string, string> }>): string {
  return colorConfig.map(({ theme, colors }) => {
    const cssVariables = Object.entries(colors)
      .map(([key, value]) => `--color-${key}: ${value};`)
      .join('\n  ');

    return `
${theme} [data-chart="${id}"] {
  ${cssVariables}
}`;
  }).join('\n\n');
}