// 🔄 VERSIÓN ADAPTADA PARA INTEGRACIÓN LOCAL
// Conecta el componente v0 raw con datos y eventos locales

'use client';

import ProductCatalogV0Raw from '../raw/ProductCatalogV0Raw';
import { createV0Adapter } from '../templates/V0AdapterUtils';

// Definir tipos específicos
interface Product {
  id: string;
  name: string;
  price: number;
  [key: string]: unknown;
}

interface Filters {
  category?: string;
  priceRange?: [number, number];
  [key: string]: unknown;
}

const ADAPTER_CONFIG = {
  dataMapping: {
    products: "products",
    loading: "loading",
    error: "error",
    searchQuery: "searchQuery",
    filters: "filters"
  },
  eventHandlers: {
    onProductClick: (product: Product) => logMessage("Product clicked:", product),
    onSearchChange: (query: string) => logMessage("Search query:", query),
    onFilterChange: (filters: Filters) => logMessage("Filters changed:", filters)
  },
  validation: {
    required: ["products"],
    optional: ["loading", "error", "searchQuery", "filters"]
  }
};

// Función de registro personalizada con mejor tipado
const logMessage = (message: string, data?: unknown): void => {
  if (typeof window !== 'undefined' && typeof globalThis.console !== 'undefined') {
    globalThis.console.log(message, data);
  }
};

// Configuración del adaptador para ProductCatalog
const adapterConfig = ADAPTER_CONFIG;

// Crear el componente adaptado
export const ProductCatalogV0 = createV0Adapter(
  ProductCatalogV0Raw,
  adapterConfig
);

// Definir un tipo específico para los datos del evento
type CustomEventData = Record<string, unknown>;

// Configuración de tipos para TypeScript
export interface ProductCatalogV0Props {
  // Props específicas del componente
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';

  // Datos personalizados
  customData?: {
    // Definir estructura de datos esperada
    [key: string]: unknown;
  };

  // Eventos personalizados
  onCustomEvent?: (event: string, data: CustomEventData) => void;
}

// Wrapper tipado del componente
export default function ProductCatalogV0Typed(props: ProductCatalogV0Props) {
  return <ProductCatalogV0 {...props} />;
}

// Metadata del componente
ProductCatalogV0Typed.displayName = 'ProductCatalogV0';
