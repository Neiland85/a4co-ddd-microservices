"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeChartStyles = void 0;
exports.useChartStyles = useChartStyles;
exports.createChartStyleSheet = createChartStyleSheet;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
/**
 * SafeChartStyles - Componente seguro para inyectar estilos de gráficos
 * Evita el uso de dangerouslySetInnerHTML detectado como Security Hotspot por SonarCloud
 */
const SafeChartStyles = ({ id, colorConfig }) => {
    if (!colorConfig.length) {
        return null;
    }
    // Generar estilos de forma segura usando CSS-in-JS
    const styles = colorConfig
        .map(({ theme, colors }) => {
        const cssVariables = Object.entries(colors)
            .map(([key, value]) => `--color-${key}: ${value};`)
            .join('\n  ');
        return `
${theme} [data-chart="${id}"] {
  ${cssVariables}
}`;
    })
        .join('\n\n');
    // Usar un ID único para evitar colisiones
    const styleId = `chart-styles-${id}`;
    return ((0, jsx_runtime_1.jsx)("style", { id: styleId, type: "text/css", 
        // En lugar de dangerouslySetInnerHTML, usar children
        // Esto es seguro porque no estamos inyectando HTML arbitrario
        children: styles }));
};
exports.SafeChartStyles = SafeChartStyles;
/**
 * Hook para generar estilos de chart de forma segura
 */
function useChartStyles(id, colorConfig) {
    return react_1.default.useMemo(() => {
        if (!colorConfig.length) {
            return null;
        }
        return colorConfig.map(({ theme, colors }) => ({
            selector: `${theme} [data-chart="${id}"]`,
            styles: Object.entries(colors).reduce((acc, [key, value]) => ({
                ...acc,
                [`--color-${key}`]: value,
            }), {}),
        }));
    }, [id, colorConfig]);
}
/**
 * Alternativa usando CSS Modules o styled-components
 */
function createChartStyleSheet(id, colorConfig) {
    return colorConfig
        .map(({ theme, colors }) => {
        const cssVariables = Object.entries(colors)
            .map(([key, value]) => `--color-${key}: ${value};`)
            .join('\n  ');
        return `
${theme} [data-chart="${id}"] {
  ${cssVariables}
}`;
    })
        .join('\n\n');
}
//# sourceMappingURL=SafeChartStyles.js.map