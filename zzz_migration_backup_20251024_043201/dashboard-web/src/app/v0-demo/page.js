'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = V0DemoPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const separator_1 = require("@/components/ui/separator");
// Importar componentes v0
const ProductCatalogV0Raw_1 = __importDefault(require("@/components/v0/raw/ProductCatalogV0Raw"));
// Importar estilos v0
require("@/styles/v0/globals.css");
function V0DemoPage() {
    const [selectedComponent, setSelectedComponent] = react_1.default.useState('');
    // Lista de componentes v0 disponibles
    const v0Components = [
        {
            name: 'ProductCatalog',
            type: 'catalog',
            description: 'Catálogo de productos con filtros y búsqueda',
            status: 'ready',
            url: 'https://v0.dev/r/example-product-catalog',
        },
        {
            name: 'UserDashboard',
            type: 'dashboard',
            description: 'Dashboard de usuario con métricas y gráficos',
            status: 'ready',
            url: 'https://v0.dev/r/example-user-dashboard',
        },
        {
            name: 'ArtisanForm',
            type: 'form',
            description: 'Formulario de registro de artesanos',
            status: 'pending',
            url: null,
        },
        {
            name: 'SalesMetrics',
            type: 'dashboard',
            description: 'Métricas de ventas con visualizaciones',
            status: 'ready',
            url: 'https://v0.dev/r/example-sales-metrics',
        },
    ];
    const getStatusColor = (status) => {
        switch (status) {
            case 'ready':
                return 'bg-green-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'ready':
                return 'Listo';
            case 'pending':
                return 'Pendiente';
            case 'error':
                return 'Error';
            default:
                return 'Desconocido';
        }
    };
    // Funciones para contar componentes
    const readyComponentsCount = v0Components.filter(c => c.status === 'ready').length;
    const pendingComponentsCount = v0Components.filter(c => c.status === 'pending').length;
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-7xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-12 text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "mb-4 text-4xl font-bold text-gray-900", children: "\uD83C\uDFA8 Demo de Componentes V0.dev" }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto max-w-3xl text-xl text-gray-600", children: "Visualiza y prueba la integraci\u00F3n de componentes generados con v0.dev en tu proyecto Next.js con personalizaci\u00F3n avanzada." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-12 grid grid-cols-1 gap-6 md:grid-cols-4", children: [(0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-white/80 backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Componentes V0" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: v0Components.length })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFA8" }) })] }) }) }), (0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-white/80 backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Listos" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-green-600", children: readyComponentsCount })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-green-100", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u2705" }) })] }) }) }), (0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-white/80 backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Pendientes" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-yellow-600", children: pendingComponentsCount })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u23F3" }) })] }) }) }), (0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-white/80 backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Temas" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-purple-600", children: "3" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAD" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", children: v0Components.map(component => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: `cursor-pointer bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${selectedComponent === component.name ? 'ring-2 ring-blue-500' : ''}`, onClick: () => setSelectedComponent(component.name), children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: component.name }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: `${getStatusColor(component.status)} text-white`, children: getStatusText(component.status) })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: component.description })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-600", children: "Tipo:" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: component.type })] }), component.url && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-600", children: "V0.dev:" }), (0, jsx_runtime_1.jsx)("a", { href: component.url, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-blue-600 hover:underline", onClick: e => e.stopPropagation(), children: "Ver original" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: e => {
                                                        e.stopPropagation();
                                                        console.log(`Abriendo ejemplo de ${component.name}`);
                                                    }, children: "Ver Demo" }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: e => {
                                                        e.stopPropagation();
                                                        console.log(`Integrando ${component.name}`);
                                                    }, children: "Integrar" })] })] }) })] }, component.name))) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "\uD83D\uDE80 Acciones R\u00E1pidas" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Herramientas para integrar y personalizar componentes v0" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold", children: "\uD83D\uDCCB Integraci\u00F3n Manual" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", className: "w-full justify-start", onClick: () => {
                                                            console.log('Iniciando integración manual');
                                                        }, children: "\uD83D\uDD27 Crear Componente V0" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", className: "w-full justify-start", onClick: () => {
                                                            console.log('Configurando adaptador');
                                                        }, children: "\u2699\uFE0F Configurar Adaptador" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold", children: "\uD83C\uDFA8 Personalizaci\u00F3n" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", className: "w-full justify-start", onClick: () => {
                                                            console.log('Aplicando tema minimal');
                                                        }, children: "\uD83C\uDFAD Aplicar Tema Minimal" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", className: "w-full justify-start", onClick: () => {
                                                            console.log('Habilitando analytics');
                                                        }, children: "\uD83D\uDCCA Habilitar Analytics" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold", children: "\uD83D\uDEE0\uFE0F Herramientas" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", className: "w-full justify-start", onClick: () => {
                                                            console.log('Ejecutando script de integración');
                                                        }, children: "\u26A1 Ejecutar Script" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", className: "w-full justify-start", onClick: () => {
                                                            console.log('Abriendo documentación');
                                                        }, children: "\uD83D\uDCD6 Ver Documentaci\u00F3n" })] })] })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-12", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: ["\uD83E\uDED2 Demo: ProductCatalogV0Raw", (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "border-green-200 bg-green-50 text-green-700", children: "\u2705 Implementado" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Componente de cat\u00E1logo de productos funcional sin TODO tags. Incluye filtros, estados de carga, y datos de ejemplo del mercado local de Ja\u00E9n." })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(ProductCatalogV0Raw_1.default, { showFilters: true, maxItems: 6, onProductSelect: product => {
                                        console.log('Producto seleccionado:', product);
                                        alert(`Producto seleccionado: ${product.name} - ${product.price}€`);
                                    } }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-12 text-center", children: [(0, jsx_runtime_1.jsx)(separator_1.Separator, { className: "my-6" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["\uD83D\uDCA1 ", (0, jsx_runtime_1.jsx)("strong", { children: "Tip:" }), " Usa el script", ' ', (0, jsx_runtime_1.jsx)("code", { className: "rounded bg-gray-100 px-2 py-1", children: "./scripts/integrate-v0.sh" }), " para automatizar la integraci\u00F3n de nuevos componentes v0"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 space-x-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", children: "\uD83D\uDCDA Documentaci\u00F3n Completa" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", children: "\uD83C\uDFAF Ejemplos Pr\u00E1cticos" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", children: "\uD83D\uDD27 Configuraci\u00F3n Avanzada" })] })] })] }) }));
}
//# sourceMappingURL=page.js.map