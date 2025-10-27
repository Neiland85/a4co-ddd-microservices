'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IconosPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const tabs_1 = require("@/components/ui/tabs");
const slider_1 = require("@/components/ui/slider");
const label_1 = require("@/components/ui/label");
const switch_1 = require("@/components/ui/switch");
const use_toast_1 = require("@/components/ui/use-toast");
const lucide_react_1 = require("lucide-react");
const icon_grid_1 = __importDefault(require("../../components/icon-grid"));
const icon_item_1 = __importDefault(require("../../components/icon-item"));
const icon_configs_1 = require("../../data/icon-configs");
function IconosPage() {
    const [selectedIcon, setSelectedIcon] = (0, react_1.useState)(null);
    const [iconSize, setIconSize] = (0, react_1.useState)(24);
    const [strokeWidth, setStrokeWidth] = (0, react_1.useState)(2);
    const [showLabels, setShowLabels] = (0, react_1.useState)(true);
    const [gridVariant, setGridVariant] = (0, react_1.useState)('default');
    const [copiedCode, setCopiedCode] = (0, react_1.useState)(null);
    const handleIconClick = (config) => {
        setSelectedIcon(config);
        (0, use_toast_1.toast)({
            title: 'Icono seleccionado',
            description: `Has seleccionado: ${config.label}`,
        });
    };
    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(type);
        setTimeout(() => setCopiedCode(null), 2000);
        (0, use_toast_1.toast)({
            title: 'Código copiado',
            description: 'El código ha sido copiado al portapapeles',
        });
    };
    const generateImportCode = (config) => {
        return `import { ${config.icon.name} } from "lucide-react"`;
    };
    const generateUsageCode = (config) => {
        return `<${config.icon.name} 
  size={${iconSize}} 
  strokeWidth={${strokeWidth}} 
  className="text-a4co-olive-600"
/>`;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [(0, jsx_runtime_1.jsx)("div", { className: "shadow-natural-sm border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4 py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100", children: "Biblioteca de Iconos A4CO" }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto mb-6 max-w-3xl text-xl text-gray-600 dark:text-gray-400", children: "Colecci\u00F3n completa de iconos Lucide React con componentes reutilizables y configurables" }), (0, jsx_runtime_1.jsxs)("div", { className: "inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Code, { className: "mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" }), (0, jsx_runtime_1.jsx)("code", { className: "font-mono text-sm text-gray-800 dark:text-gray-200", children: "pnpm install lucide-react" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => copyToClipboard('pnpm install lucide-react', 'install'), className: "ml-2 h-6 w-6 p-0", children: copiedCode === 'install' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-3 w-3 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "h-3 w-3" })) })] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4 py-8", children: (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "grid", className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-3", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "grid", children: "Cuadr\u00EDcula de Iconos" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "playground", children: "Playground" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "documentation", children: "Documentaci\u00F3n" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsContent, { value: "grid", className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "mr-2 h-5 w-5" }), "Configuraci\u00F3n de la Cuadr\u00EDcula"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Personaliza la apariencia y comportamiento de los iconos" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(label_1.Label, { children: ["Tama\u00F1o del icono: ", iconSize, "px"] }), (0, jsx_runtime_1.jsx)(slider_1.Slider, { value: [iconSize], onValueChange: value => setIconSize(value[0]), max: 48, min: 16, step: 2, className: "w-full" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(label_1.Label, { children: ["Grosor del trazo: ", strokeWidth] }), (0, jsx_runtime_1.jsx)(slider_1.Slider, { value: [strokeWidth], onValueChange: value => setStrokeWidth(value[0]), max: 4, min: 1, step: 0.5, className: "w-full" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Variante" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: ['default', 'outline', 'ghost', 'secondary'].map(variant => ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: gridVariant === variant ? 'default' : 'outline', size: "sm", onClick: () => setGridVariant(variant), className: "text-xs", children: variant }, variant))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "show-labels", checked: showLabels, onCheckedChange: setShowLabels }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "show-labels", children: "Mostrar etiquetas" })] }) })] }) })] }), (0, jsx_runtime_1.jsx)(icon_grid_1.default, { icons: icon_configs_1.iconConfigs, size: iconSize, strokeWidth: strokeWidth, variant: gridVariant, showLabels: showLabels, onIconClick: handleIconClick, columns: {
                                        mobile: 2,
                                        tablet: 4,
                                        desktop: 6,
                                    } })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "playground", className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-8 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Palette, { className: "mr-2 h-5 w-5" }), "Vista Previa"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: selectedIcon
                                                            ? `Previsualizando: ${selectedIcon.label}`
                                                            : 'Selecciona un icono para previsualizar' })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: selectedIcon ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center rounded-lg bg-gray-50 p-8 dark:bg-gray-800", children: (0, jsx_runtime_1.jsx)(icon_item_1.default, { config: selectedIcon, size: iconSize * 2, strokeWidth: strokeWidth, variant: gridVariant }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Nombre:" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", children: selectedIcon.label })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "ID:" }), (0, jsx_runtime_1.jsx)("code", { className: "rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800", children: selectedIcon.id })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Categor\u00EDa:" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: selectedIcon.category })] }), selectedIcon.description && ((0, jsx_runtime_1.jsxs)("div", { className: "pt-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Descripci\u00F3n:" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: selectedIcon.description })] }))] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Palette, { className: "h-8 w-8 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Selecciona un icono de la cuadr\u00EDcula para ver la vista previa" })] })) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Code, { className: "mr-2 h-5 w-5" }), "C\u00F3digo de Ejemplo"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Copia y pega estos ejemplos en tu proyecto" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: selectedIcon ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-sm font-medium", children: "Importaci\u00F3n" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => copyToClipboard(generateImportCode(selectedIcon), 'import'), children: copiedCode === 'import' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-4 w-4 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "h-4 w-4" })) })] }), (0, jsx_runtime_1.jsx)("pre", { className: "overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800", children: (0, jsx_runtime_1.jsx)("code", { children: generateImportCode(selectedIcon) }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-sm font-medium", children: "Uso" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => copyToClipboard(generateUsageCode(selectedIcon), 'usage'), children: copiedCode === 'usage' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-4 w-4 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "h-4 w-4" })) })] }), (0, jsx_runtime_1.jsx)("pre", { className: "overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800", children: (0, jsx_runtime_1.jsx)("code", { children: generateUsageCode(selectedIcon) }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-sm font-medium", children: "Componente IconItem" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => copyToClipboard(`<IconItem
  config={{
    id: "${selectedIcon.id}",
    icon: ${selectedIcon.icon.name},
    label: "${selectedIcon.label}",
    description: "${selectedIcon.description}",
    category: "${selectedIcon.category}",
    onClick: () => console.log("Clicked!")
  }}
  size={${iconSize}}
  strokeWidth={${strokeWidth}}
  variant="${gridVariant}"
/>`, 'component'), children: copiedCode === 'component' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-4 w-4 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "h-4 w-4" })) })] }), (0, jsx_runtime_1.jsx)("pre", { className: "overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800", children: (0, jsx_runtime_1.jsx)("code", { children: `<IconItem
  config={{
    id: "${selectedIcon.id}",
    icon: ${selectedIcon.icon.name},
    label: "${selectedIcon.label}",
    description: "${selectedIcon.description}",
    category: "${selectedIcon.category}",
    onClick: () => console.log("Clicked!")
  }}
  size={${iconSize}}
  strokeWidth={${strokeWidth}}
  variant="${gridVariant}"
/>` }) })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "py-8 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Code, { className: "mx-auto mb-4 h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Selecciona un icono para ver ejemplos de c\u00F3digo" })] })) })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "documentation", className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Componente IconGrid" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Cuadr\u00EDcula responsiva para mostrar colecciones de iconos" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: "Props principales:" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-1 text-sm text-gray-600 dark:text-gray-400", children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "icons" }), ": Array de configuraciones de iconos"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "columns" }), ": Configuraci\u00F3n responsiva de columnas"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "size" }), ": Tama\u00F1o por defecto de los iconos (24px)"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "strokeWidth" }), ": Grosor del trazo (2)"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "variant" }), ": Estilo de los botones"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "onIconClick" }), ": Callback al hacer clic en un icono"] })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Componente IconItem" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Bot\u00F3n individual con icono, tooltip y efectos de hover" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: "Props principales:" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-1 text-sm text-gray-600 dark:text-gray-400", children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "config" }), ": Configuraci\u00F3n del icono (id, icon, label, etc.)"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "size" }), ": Tama\u00F1o del icono en p\u00EDxeles"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "color" }), ": Color del icono"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "strokeWidth" }), ": Grosor del trazo"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("code", { children: "variant" }), ": Variante del bot\u00F3n (default, outline, ghost, secondary)"] })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Ejemplos de Uso" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Casos de uso comunes y mejores pr\u00E1cticas" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 font-medium", children: "Uso b\u00E1sico:" }), (0, jsx_runtime_1.jsx)("pre", { className: "overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800", children: (0, jsx_runtime_1.jsx)("code", { children: `import IconGrid from './components/icon-grid'
import { iconConfigs } from './data/icon-configs'

<IconGrid 
  icons={iconConfigs}
  onIconClick={(config) => console.log(config.label)}
/>` }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 font-medium", children: "Configuraci\u00F3n personalizada:" }), (0, jsx_runtime_1.jsx)("pre", { className: "overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800", children: (0, jsx_runtime_1.jsx)("code", { children: `<IconGrid 
  icons={iconConfigs}
  size={32}
  strokeWidth={1.5}
  variant="outline"
  columns={{ mobile: 3, tablet: 5, desktop: 8 }}
  onIconClick={handleIconClick}
/>` }) })] })] }) })] })] }) })] }) })] }));
}
//# sourceMappingURL=page.js.map