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
const SafeChartStyles = ({ id, colorConfig }) => {
    if (!colorConfig.length) {
        return null;
    }
    const styles = colorConfig.map(({ theme, colors }) => {
        const cssVariables = Object.entries(colors)
            .map(([key, value]) => `--color-${key}: ${value};`)
            .join('\n  ');
        return `
${theme} [data-chart="${id}"] {
  ${cssVariables}
}`;
    }).join('\n\n');
    const styleId = `chart-styles-${id}`;
    return ((0, jsx_runtime_1.jsx)("style", { id: styleId, type: "text/css", children: styles }));
};
exports.SafeChartStyles = SafeChartStyles;
function useChartStyles(id, colorConfig) {
    return react_1.default.useMemo(() => {
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
function createChartStyleSheet(id, colorConfig) {
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
//# sourceMappingURL=SafeChartStyles.js.map