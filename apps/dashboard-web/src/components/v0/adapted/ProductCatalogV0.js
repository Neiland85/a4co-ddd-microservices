// 🔄 VERSIÓN ADAPTADA PARA INTEGRACIÓN LOCAL
// Conecta el componente v0 raw con datos y eventos locales
'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCatalogV0 = void 0;
exports.default = ProductCatalogV0Typed;
const jsx_runtime_1 = require("react/jsx-runtime");
const ProductCatalogV0Raw_1 = __importDefault(require("../raw/ProductCatalogV0Raw"));
const V0AdapterUtils_1 = require("../templates/V0AdapterUtils");
{
    dataMapping: {
        products: "products",
            loading;
        "loading",
            error;
        "error",
            searchQuery;
        "searchQuery",
            filters;
        "filters";
    }
    eventHandlers: {
        onProductClick: (product) => console.log("Product clicked:", product),
            onSearchChange;
        (query) => console.log("Search query:", query),
            onFilterChange;
        (filters) => console.log("Filters changed:", filters);
    }
    validation: {
        required: ["products"],
            optional;
        ["loading", "error", "searchQuery", "filters"];
    }
}
// Configuración del adaptador para ProductCatalog
const adapterConfig = ADAPTER_CONFIG;
// Crear el componente adaptado
exports.ProductCatalogV0 = (0, V0AdapterUtils_1.createV0Adapter)(ProductCatalogV0Raw_1.default, adapterConfig);
// Wrapper tipado del componente
function ProductCatalogV0Typed(props) {
    return (0, jsx_runtime_1.jsx)(exports.ProductCatalogV0, { ...props });
}
// Metadata del componente
ProductCatalogV0Typed.displayName = 'ProductCatalogV0';
//# sourceMappingURL=ProductCatalogV0.js.map