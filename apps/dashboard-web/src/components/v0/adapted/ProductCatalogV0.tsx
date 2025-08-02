// 🔄 VERSIÓN ADAPTADA PARA INTEGRACIÓN LOCAL
// Conecta el componente v0 raw con datos y eventos locales

'use client';

import React from 'react';
import ProductCatalogV0Raw from '../raw/ProductCatalogV0Raw';
import { createV0Adapter, adapterPresets } from '../templates/V0AdapterUtils';
  {
    dataMapping: {
      products: "products",
      loading: "loading",
      error: "error",
      searchQuery: "searchQuery",
      filters: "filters"
    },
    eventHandlers: {
      onProductClick: (product) => console.log("Product clicked:", product),
      onSearchChange: (query) => console.log("Search query:", query),
      onFilterChange: (filters) => console.log("Filters changed:", filters)
    },
    validation: {
      required: ["products"],
      optional: ["loading", "error", "searchQuery", "filters"]
    }
  }

// Configuración del adaptador para ProductCatalog
const adapterConfig = ADAPTER_CONFIG;

// Crear el componente adaptado
export const ProductCatalogV0 = createV0Adapter(
  ProductCatalogV0Raw,
  adapterConfig
);

// Configuración de tipos para TypeScript
export interface ProductCatalogV0Props {
  // Props específicas del componente
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  
  // Datos personalizados
  customData?: {
    // Definir estructura de datos esperada
    [key: string]: any;
  };
  
  // Eventos personalizados
  onCustomEvent?: (event: string, data: any) => void;
}

// Wrapper tipado del componente
export default function ProductCatalogV0Typed(props: ProductCatalogV0Props) {
  return <ProductCatalogV0 {...props} />;
}

// Metadata del componente
ProductCatalogV0Typed.displayName = 'ProductCatalogV0';
