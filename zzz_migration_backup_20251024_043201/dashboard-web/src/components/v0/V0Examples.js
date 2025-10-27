"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingStateExample = exports.AdvancedV0Example = exports.ProductModalExample = exports.ProductDisplayExample = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// 📚 Ejemplo de uso del V0ComponentTemplate
// Demostrando cómo usar el template base para componentes V0
const react_1 = require("react");
const V0ComponentTemplate_1 = __importStar(require("./V0ComponentTemplate"));
const useProducts_1 = require("../../hooks/useProducts");
// 🎨 Ejemplo 1: Componente básico con template
const ProductDisplayExample = () => {
    const { products, loading, error } = (0, useProducts_1.useProducts)();
    return ((0, jsx_runtime_1.jsxs)(V0ComponentTemplate_1.default, { title: "Productos Locales", description: "Cat\u00E1logo de productos artesanales de Ja\u00E9n", variant: "primary", size: "md", loading: loading, onAction: () => console.log('Acción ejecutada'), onCancel: () => console.log('Operación cancelada'), children: [error && (0, jsx_runtime_1.jsx)(V0ComponentTemplate_1.ErrorMessage, { message: error }), products.length === 0 && !loading && ((0, jsx_runtime_1.jsx)(V0ComponentTemplate_1.EmptyState, { title: "No hay productos", description: "No se encontraron productos disponibles", icon: "\uD83D\uDED2" })), (0, jsx_runtime_1.jsx)("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: products.map(product => ((0, jsx_runtime_1.jsx)(V0ComponentTemplate_1.V0CardTemplate, { title: product.name, content: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "mb-3 text-sm text-gray-600", children: product.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-lg font-bold text-green-600", children: ["\u20AC", product.price] }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500", children: product.producer })] })] }), footer: (0, jsx_runtime_1.jsx)("button", { className: "w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700", children: "Ver Detalles" }) }, product.id))) })] }));
};
exports.ProductDisplayExample = ProductDisplayExample;
// 🎨 Ejemplo 2: Modal con template
const ProductModalExample = () => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { value: selectedProduct } = (0, V0ComponentTemplate_1.useV0State)(null);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(true), className: "rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700", children: "Abrir Modal de Producto" }), (0, jsx_runtime_1.jsx)(V0ComponentTemplate_1.V0ModalTemplate, { isOpen: isOpen, onClose: () => setIsOpen(false), title: "Detalles del Producto", size: "lg", children: (0, jsx_runtime_1.jsx)(V0ComponentTemplate_1.default, { title: selectedProduct?.name || 'Producto', description: "Informaci\u00F3n detallada del producto seleccionado", variant: "default", size: "sm", children: selectedProduct ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Descripci\u00F3n" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: selectedProduct.description })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Productor" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: selectedProduct.producer })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Precio" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-bold text-green-600", children: ["\u20AC", selectedProduct.price] })] })] })) : ((0, jsx_runtime_1.jsx)(V0ComponentTemplate_1.EmptyState, { title: "Selecciona un producto", description: "Elige un producto para ver sus detalles", icon: "\uD83D\uDCE6" })) }) })] }));
};
exports.ProductModalExample = ProductModalExample;
// 🎨 Ejemplo 3: Componente con estado avanzado
const AdvancedV0Example = () => {
    const { value: formData, updateValue: setFormData, isLoading, error, } = (0, V0ComponentTemplate_1.useV0State)({
        name: '',
        email: '',
        message: '',
    });
    const handleSubmit = async () => {
        // Simular envío de formulario
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Formulario enviado:', formData);
    };
    return ((0, jsx_runtime_1.jsxs)(V0ComponentTemplate_1.default, { title: "Contacto con Productores", description: "Env\u00EDa un mensaje directo a los productores locales", variant: "accent", size: "lg", loading: isLoading, onAction: handleSubmit, onCancel: () => setFormData({ name: '', email: '', message: '' }), children: [error && (0, jsx_runtime_1.jsx)(V0ComponentTemplate_1.ErrorMessage, { message: error }), (0, jsx_runtime_1.jsxs)("form", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "name", className: "mb-1 block text-sm font-medium text-gray-700", children: "Nombre" }), (0, jsx_runtime_1.jsx)("input", { id: "name", type: "text", value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }), className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500", placeholder: "Tu nombre completo" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "mb-1 block text-sm font-medium text-gray-700", children: "Email" }), (0, jsx_runtime_1.jsx)("input", { id: "email", type: "email", value: formData.email, onChange: e => setFormData({ ...formData, email: e.target.value }), className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500", placeholder: "tu@email.com" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "message", className: "mb-1 block text-sm font-medium text-gray-700", children: "Mensaje" }), (0, jsx_runtime_1.jsx)("textarea", { id: "message", value: formData.message, onChange: e => setFormData({ ...formData, message: e.target.value }), rows: 4, className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500", placeholder: "Escribe tu mensaje aqu\u00ED..." })] })] })] }));
};
exports.AdvancedV0Example = AdvancedV0Example;
// 🎨 Ejemplo 4: Lista con loading states
const LoadingStateExample = () => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [data, setData] = (0, react_1.useState)([]);
    const loadData = async () => {
        setIsLoading(true);
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 2000));
        setData(['Elemento 1', 'Elemento 2', 'Elemento 3']);
        setIsLoading(false);
    };
    return ((0, jsx_runtime_1.jsxs)(V0ComponentTemplate_1.default, { title: "Estados de Carga", description: "Ejemplo de manejo de estados de loading", variant: "secondary", onAction: loadData, children: [isLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-8", children: [(0, jsx_runtime_1.jsx)(V0ComponentTemplate_1.LoadingSpinner, { size: "lg" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Cargando datos..." })] })), !isLoading && data.length === 0 && ((0, jsx_runtime_1.jsx)(V0ComponentTemplate_1.EmptyState, { title: "No hay datos", description: "Haz clic en 'Acci\u00F3n' para cargar datos", icon: "\uD83D\uDCCA" })), !isLoading && data.length > 0 && ((0, jsx_runtime_1.jsx)("ul", { className: "space-y-2", children: data.map(item => ((0, jsx_runtime_1.jsx)("li", { className: "rounded border bg-gray-50 p-3", children: item }, `item-${item}`))) }))] }));
};
exports.LoadingStateExample = LoadingStateExample;
//# sourceMappingURL=V0Examples.js.map