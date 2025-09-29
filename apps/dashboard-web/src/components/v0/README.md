# 🎨 Componentes V0.dev - Mercado Local de Jaén

## 📁 Estructura de Integración

```
apps/dashboard-web/src/components/v0/
├── raw/                     # 🔒 Código puro de v0.dev (NO MODIFICAR)
│   ├── InteractiveMap.tsx
│   ├── OffersCarousel.tsx
│   ├── ActivityBars.tsx
│   └── EventsSection.tsx
├── adapted/                 # 🔄 Versiones adaptadas con hooks locales
│   ├── InteractiveMapV0.tsx    # ✅ COMPLETADO
│   ├── OffersCarouselV0.tsx    # ✅ COMPLETADO
│   ├── ActivityBarsV0.tsx      # ✅ COMPLETADO
│   ├── EventsSectionV0.tsx     # ✅ COMPLETADO
│   └── index.ts                # Exportaciones centralizadas
├── templates/               # 🧩 Utilidades y adaptadores
│   └── V0ComponentTemplate.tsx
└── README.md                # Esta documentación
```

## ✅ Estado de Integración

### Componentes Adaptados Completados

| Componente         | Estado            | Descripción                          |
| ------------------ | ----------------- | ------------------------------------ |
| `InteractiveMapV0` | ✅ **Completado** | Mapa interactivo con geolocalización |
| `OffersCarouselV0` | ✅ **Completado** | Carrusel de ofertas destacadas       |
| `ActivityBarsV0`   | ✅ **Completado** | Gráfico de actividad del mercado     |
| `EventsSectionV0`  | ✅ **Completado** | Sección de eventos locales           |

### Características Implementadas

- ✅ Integración completa con hooks del proyecto
- ✅ Branding específico del Mercado Local de Jaén
- ✅ Estados de carga personalizados
- ✅ TypeScript completamente tipado
- ✅ Tests unitarios con Vitest
- ✅ Documentación completa
- ✅ Página de demo funcional

## 🚀 Proceso de Integración

### Paso 1: Colocar Componentes V0.dev

**Arrastra tus componentes generados en v0.dev a la carpeta `raw/`**

- NO modifiques el código original
- Mantén los nombres descriptivos
- Incluye el sufijo `Raw` (ej: `ProductCatalogV0Raw.tsx`)

### Paso 2: Crear Versiones Adaptadas

En la carpeta `adapted/`, crea componentes que:

- Importen el componente raw
- Conecten con hooks locales (`useProducts`, `useSalesOpportunities`, etc.)
- Adapte props al formato esperado por v0.dev

### Paso 3: Usar en Páginas

Importa las versiones adaptadas en tus páginas del dashboard.

## 📋 Ejemplo de Adaptación

```tsx
// adapted/ProductCatalogV0.tsx
import ProductCatalogV0Raw from '../raw/ProductCatalogV0Raw';
import { useProducts } from '../../../hooks/useProducts';

export default function ProductCatalogV0() {
  const { products, loading, error } = useProducts();

  return (
    <ProductCatalogV0Raw
      products={products}
      loading={loading}
      onProductSelect={product => console.log('Selected:', product)}
    />
  );
}
```

## 🎯 Componentes Adaptados Detallados

### InteractiveMapV0

**Ubicación**: `adapted/InteractiveMapV0.tsx`

**Descripción**: Mapa interactivo que muestra la ubicación de comercios locales en Jaén con geolocalización.

**Props**:

```tsx
interface InteractiveMapV0Props {
  className?: string;
  height?: string;
  showControls?: boolean;
}
```

**Uso**:

```tsx
import { InteractiveMapV0 } from '@/components/v0/adapted';

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <h1>Comercios Locales de Jaén</h1>
      <InteractiveMapV0 height="400px" showControls />
    </div>
  );
}
```

### OffersCarouselV0

**Ubicación**: `adapted/OffersCarouselV0.tsx`

**Descripción**: Carrusel horizontal de ofertas destacadas del mercado local.

**Props**:

```tsx
interface OffersCarouselV0Props {
  className?: string;
  autoPlay?: boolean;
  showIndicators?: boolean;
}
```

**Uso**:

```tsx
import { OffersCarouselV0 } from '@/components/v0/adapted';

export default function HomePage() {
  return (
    <section className="py-8">
      <h2>Ofertas Destacadas</h2>
      <OffersCarouselV0 autoPlay showIndicators />
    </section>
  );
}
```

### ActivityBarsV0

**Ubicación**: `adapted/ActivityBarsV0.tsx`

**Descripción**: Gráfico de barras que muestra la actividad del mercado por horas/días.

**Props**:

```tsx
interface ActivityBarsV0Props {
  className?: string;
  period?: 'day' | 'week' | 'month';
  showLegend?: boolean;
}
```

**Uso**:

```tsx
import { ActivityBarsV0 } from '@/components/v0/adapted';

export default function AnalyticsPage() {
  return (
    <div className="grid gap-6">
      <ActivityBarsV0 period="week" showLegend />
    </div>
  );
}
```

### EventsSectionV0

**Ubicación**: `adapted/EventsSectionV0.tsx`

**Descripción**: Sección que muestra eventos locales del mercado (ferias, promociones, etc.).

**Props**:

```tsx
interface EventsSectionV0Props {
  className?: string;
  limit?: number;
  showFilters?: boolean;
}
```

**Uso**:

```tsx
import { EventsSectionV0 } from '@/components/v0/adapted';

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <h1>Eventos Locales</h1>
      <EventsSectionV0 limit={10} showFilters />
    </div>
  );
}
```

## 🧪 Testing

### Configuración de Tests

Los componentes incluyen tests unitarios con Vitest y Testing Library:

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Ejecutar tests con coverage
pnpm test:coverage
```

### Ejemplo de Test

```tsx
// InteractiveMapV0.test.tsx
import { render, screen } from '@testing-library/react';
import { InteractiveMapV0 } from './InteractiveMapV0';

describe('InteractiveMapV0', () => {
  it('renders with A4CO branding', () => {
    render(<InteractiveMapV0 />);
    expect(screen.getByText('Mercado Local de Jaén')).toBeInTheDocument();
  });
});
```

## 🎨 Página de Demo

Visita `/v0-demo` para ver todos los componentes en funcionamiento:

```tsx
// apps/dashboard-web/src/app/v0-demo/page.tsx
import {
  InteractiveMapV0,
  OffersCarouselV0,
  ActivityBarsV0,
  EventsSectionV0,
} from '@/components/v0/adapted';

export default function V0DemoPage() {
  return (
    <div className="container mx-auto space-y-12 p-6">
      <h1 className="text-3xl font-bold">Demo de Componentes V0.dev</h1>

      <section>
        <h2 className="mb-4 text-2xl">Mapa Interactivo</h2>
        <InteractiveMapV0 height="400px" />
      </section>

      <section>
        <h2 className="mb-4 text-2xl">Ofertas Destacadas</h2>
        <OffersCarouselV0 autoPlay />
      </section>

      <section>
        <h2 className="mb-4 text-2xl">Actividad del Mercado</h2>
        <ActivityBarsV0 period="week" />
      </section>

      <section>
        <h2 className="mb-4 text-2xl">Eventos Locales</h2>
        <EventsSectionV0 limit={5} />
      </section>
    </div>
  );
}
```

## 🛠️ Utilidades Disponibles

- `V0AdapterUtils.tsx`: Funciones helper para adaptar props y eventos
- `V0BaseTemplate.tsx`: Template base para nuevos componentes v0

## 📚 Referencias

- [Guía Completa de Integración](../GUIA_INTEGRACION_V0_COMPONENTES.md)
- [Prompts para V0.dev](../../docs/V0-PROMPTS.md)
- [Guía de Integración Técnica](../../docs/V0-INTEGRATION-GUIDE.md)</content>
  <parameter name="filePath">/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices/apps/dashboard-web/src/components/v0/README.md
