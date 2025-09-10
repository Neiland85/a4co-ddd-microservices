# 🚀 PROMPTS ESPECÍFICOS PARA V0.DEV - MERCADO LOCAL DE JAÉN

## 📋 **PROMPT 1: ProductCatalog Premium**


````
Crear un catálogo de productos premium para mercado local de aceite de oliva de Jaén, España.

ESPECIFICACIONES TÉCNICAS:
- Next.js 15 + React 19 + TypeScript estricto
- Tailwind CSS 4 con colores: amber-600, yellow-600, emerald-600, stone-800
- Radix UI components para accesibilidad

CARACTERÍSTICAS DEL COMPONENTE:
- Grid responsivo: 1 col móvil → 2 tablet → 4 desktop
- Cards con hover effects y transform scale
- Filtros integrados: categoría, ubicación, disponibilidad, temporada
- Loading skeleton con animación de aceitunas
- Tema dorado/ámbar inspirado en aceite de oliva

DATOS DE EJEMPLO:

```typescript
const sampleProducts = [
  {
    id: "1",
    name: "Aceite de Oliva Virgen Extra Picual",
    category: "aceites",
    price: 12.50,
    unit: "500ml",
    producer: "Olivares del Guadalquivir",
    location: { municipality: "Úbeda" },
    stock: 25,
    available: true,
    seasonal: true,
    certifications: ["Ecológico", "DO Jaén", "Primera Cosecha"]
  }
];

````

PROPS INTERFACE:


```typescript
interface ProductCatalogProps {
  products: LocalProduct[];
  onProductSelect: (product: LocalProduct) => void;
  showFilters?: boolean;
  maxItems?: number;
  loading?: boolean;
}

```


DISEÑO VISUAL:

- Header con gradiente dorado: "🫒 Mercado Local de Jaén"
- Cards con gradientes específicos por categoría
- Badges para productos de temporada: 🌿
- Indicadores de stock y certificaciones
- Botones CTA: "👁️ Ver Detalles" con gradiente amber
- Responsive design mobile-first


```


---

## 📋 **PROMPT 2: ProductSearch Avanzado**


```


Crear buscador avanzado con autocompletado para productos locales de Jaén.

ESPECIFICACIONES:

- Input con debounce 300ms + búsqueda instantánea
- Dropdown de sugerencias con highlighting
- Quick filters: "Solo disponibles", "De temporada", "Ecológicos"
- Historial de búsquedas (localStorage)
- Keyboard navigation completa

PROPS INTERFACE:


```typescript
interface ProductSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  suggestions?: string[];
  placeholder?: string;
  showQuickFilters?: boolean;
}

interface SearchFilters {
  category?: string;
  available?: boolean;
  seasonal?: boolean;
  certified?: boolean;
}

```


CARACTERÍSTICAS VISUALES:

- Input rounded-xl con icono 🔍
- Dropdown con sombras y animaciones smooth
- Quick filters como chips clickeables
- Resultados destacados con iconos por categoría
- Tema amber/yellow con acentos verdes
- Loading state con spinner de aceitunas

DATOS DE EJEMPLO:


```typescript
const suggestions = [
  'Aceite de oliva virgen extra',
  'Queso de cabra artesano',
  'Miel de azahar',
  'Jamón ibérico de bellota',
];

```



```


---

## 📋 **PROMPT 3: ArtisanDirectory Premium**


```


Diseñar directorio elegante de artesanos/productores locales de Jaén con mapas.

ESPECIFICACIONES:

- Cards de artesanos con foto, rating, especialidad, ubicación
- Vista intercambiable: grid/lista
- Modal de perfil detallado
- Filtros: especialidad, ubicación, rating, verificados
- Integración con mapas (placeholder)

PROPS INTERFACE:


```typescript
interface ArtisanDirectoryProps {
  artisans: LocalArtisan[];
  onArtisanSelect: (artisan: LocalArtisan) => void;
  showMap?: boolean;
  viewMode?: 'grid' | 'list';
  sortBy?: 'name' | 'rating' | 'distance';
}

interface LocalArtisan {
  id: string;
  name: string;
  business: string;
  speciality: string;
  location: string;
  description: string;
  rating: number;
  verified: boolean;
  contact: { phone: string; email: string };
}

```


DISEÑO VISUAL:

- Header con toggle vista grid/lista
- Cards con rating de estrellas ⭐
- Badge "✓ Verificado" para artesanos certificados
- Botones: "Ver Perfil", "📞 Contactar", "🛍️ Ver Productos"
- Tema earth tones + gold accents
- Skeleton loading para cada card

DATOS DE EJEMPLO:


```typescript
const sampleArtisans = [
  {
    id: '1',
    name: 'María José Ruiz',
    business: 'Olivares del Guadalquivir',
    speciality: 'aceites',
    location: 'Úbeda, Jaén',
    rating: 4.8,
    verified: true,
    contact: { phone: '+34 953 123 456', email: 'maria@olivares.com' },
  },
];

```



```


---

## 📋 **PROMPT 4: SalesOpportunityBoard**


```


Crear tablero Kanban para oportunidades de venta de productos locales.

ESPECIFICACIONES:

- Columnas: "🔥 Activas", "⏳ En Proceso", "✅ Cerradas"
- Cards con drag & drop funcional
- Información: título, categoría, precio, cantidad, cosecha
- Filtros: categoría, rango precios, fechas
- FAB button para crear nueva oportunidad

PROPS INTERFACE:


```typescript
interface SalesOpportunityBoardProps {
  opportunities: SalesOpportunity[];
  onStatusChange: (id: string, status: string) => void;
  onCreateNew: () => void;
  allowDragDrop?: boolean;
}

interface SalesOpportunity {
  id: string;
  title: string;
  category: string;
  priceRange: { min: number; max: number };
  quantity: string;
  status: 'active' | 'pending' | 'closed';
  harvestDate: string;
  location: string;
  producer: string;
}

```


DISEÑO VISUAL:

- Columnas con scroll horizontal en móvil
- Cards con color-coding por categoría
- Drag & drop con feedback visual
- Stats header con métricas clave
- Tema business con gold accents
- FAB button con icono ➕

DATOS DE EJEMPLO:


```typescript
const sampleOpportunities = [
  {
    id: '1',
    title: 'Aceite Nuevo - Cosecha 2024',
    category: 'aceites',
    priceRange: { min: 10, max: 15 },
    quantity: '500 litros',
    status: 'active',
    harvestDate: '2024-11-15',
    producer: 'Olivares del Guadalquivir',
  },
];

```



```


---

## 📋 **PROMPT 5: MarketplaceDashboard Ejecutivo**


```


Diseñar dashboard ejecutivo para mercado local de Jaén con métricas y mapas.

ESPECIFICACIONES:

- Layout 4 secciones: Stats, Mapa, Trending, Destacados
- Gráficos: ventas por categoría, tendencias temporales
- Mapa con clustered markers
- Cards de productos trending y artesanos destacados
- Panel de notificaciones y actividad reciente

PROPS INTERFACE:


```typescript
interface MarketplaceDashboardProps {
  stats: DashboardStats;
  trendingProducts: LocalProduct[];
  featuredArtisans: LocalArtisan[];
  recentActivity: ActivityItem[];
  mapData: MapMarker[];
}

interface DashboardStats {
  totalProducts: number;
  activeArtisans: number;
  salesVolume: number;
  averageRating: number;
}

```


DISEÑO VISUAL:

- Grid responsive con auto-fit columns
- Stats cards con iconos y gradientes
- Charts con animaciones de entrada
- Real-time updates con loading states
- Tema executive: dark mode + gold accents
- Interactive tooltips y hover effects

DATOS DE EJEMPLO:


```typescript
const sampleStats = {
  totalProducts: 156,
  activeArtisans: 48,
  salesVolume: 25680,
  averageRating: 4.6,
};

```



```


---

## 🛠️ **INSTRUCCIONES DE INTEGRACIÓN**

### **Pasos para usar estos prompts:**

1. **Ve a V0.dev** → https://v0.vercel.app
2. **Copia un prompt completo** (incluye ESPECIFICACIONES + PROPS + DISEÑO + DATOS)
3. **Genera el componente** en V0
4. **Copia el código** generado
5. **Úsalo con nuestro script**: `./scripts/integrate-v0.sh`

### **Recomendaciones:**

✅ **Empieza con ProductCatalog** → Es el más visual
✅ **Usa la extensión de V0** para VS Code si está disponible
✅ **Prueba iterativamente** → Refina el prompt si es necesario
✅ **Mantén la consistencia** → Usa siempre la paleta de Jaén

### **Archivos de Referencia:**

- 📖 **Guía completa**: `docs/V0-INTEGRATION-GUIDE.md`
- 🛠️ **Script de integración**: `scripts/integrate-v0.sh`
- 📋 **Template de adaptación**: `src/components/v0/V0ComponentTemplate.tsx`

¡Listo para crear componentes increíbles en V0 y traerlos a nuestro proyecto! 🚀✨

```

