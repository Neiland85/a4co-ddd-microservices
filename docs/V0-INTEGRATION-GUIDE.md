# 🎨 Guía de Integración V0 - Mercado Local de Jaén

## 🏗️ **Especificaciones Técnicas del Proyecto**

### **Stack Tecnológico**


```typescript
// Framework: Next.js 15.4.1 + React 19
// Styling: Tailwind CSS 4
// UI Library: Radix UI components
// TypeScript: Strict mode habilitado
// Hooks: Custom hooks integrados

```


### **🎨 Paleta de Colores Oficial de Jaén**


```css
:root {
  /* Colores principales */
  --jaen-gold: #d4af37; /* Oro del aceite de oliva */
  --jaen-amber: #f59e0b; /* Ámbar */
  --jaen-olive: #8fbc8f; /* Verde oliva */
  --jaen-earth: #8b4513; /* Tierra andaluza */
  --jaen-cream: #fef3c7; /* Crema */

  /* Gradientes */
  --gradient-primary: from-amber-600 via-yellow-600 to-amber-600;
  --gradient-secondary: from-green-500 to-emerald-600;
  --gradient-background: from-amber-50 via-white to-amber-50;
}

```


### **📦 Tipos TypeScript Existentes**


```typescript
// Producto Local
interface LocalProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  producer: string;
  description: string;
  location: {
    municipality: string;
    coordinates: { lat: number; lng: number };
  };
  available: boolean;
  stock: number;
  seasonal: boolean;
  certifications: string[];
  harvestDate?: string;
  images?: string[];
}

// Artesano/Productor
interface LocalArtisan {
  id: string;
  name: string;
  business: string;
  speciality: string;
  location: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  coordinates: { lat: number; lng: number };
  verified: boolean;
  rating: number;
  products: string[];
  certifications: string[];
}

// Oportunidad de Venta
interface SalesOpportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  producer: string;
  priceRange: { min: number; max: number };
  quantity: string;
  harvestDate: string;
  location: string;
  status: 'active' | 'pending' | 'closed';
  tags: string[];
  contact: string;
}

```


### **🪝 Hooks Disponibles**


```typescript
// Hook de productos
const { products, loading, error, searchProducts, filterByCategory } = useProducts();

// Hook de artesanos
const { artisans, loading, searchArtisans, filterBySpeciality } = useArtisans();

// Hook de oportunidades
const { opportunities, loading, createOpportunity, updateStatus } = useSalesOpportunities();

// Hook de geolocalización
const { position, loading, getNearbyArtisans, calculateDistance } = useGeolocation();

```


### **🎯 APIs Disponibles**


```typescript
// Endpoints funcionales
GET /api/products?category=aceites&search=oliva&limit=10
GET /api/artisans?speciality=aceites&location=Jaén
GET /api/sales-opportunities?status=active&category=aceites


```


---

## 🎨 **PROMPTS PARA V0.DEV**

### **1. 🏠 ProductCatalog Mejorado**


````prompt
Crear un catálogo de productos premium para un mercado local de aceite de oliva de Jaén, España.

ESPECIFICACIONES:
- Framework: Next.js 15 + React 19 + TypeScript
- Styling: Tailwind CSS con colores: amber-600, yellow-600, emerald-600, stone-800
- Cards de productos con: imagen, título, productor, precio, ubicación, stock, certificaciones
- Grid responsivo: 1 col móvil, 2 tablet, 4 desktop
- Animaciones: hover effects, transform scale, sombras dinámicas
- Filtros: categoría (aceites, quesos, mieles), ubicación, disponibilidad
- Tema: Paleta dorada inspirada en aceite de oliva + iconografía española 🫒

PROPS INTERFACE:


```typescript
interface ProductCatalogProps {
  products: LocalProduct[];
  onProductSelect: (product: LocalProduct) => void;
  showFilters?: boolean;
  maxItems?: number;
  loading?: boolean;
}

interface LocalProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  producer: string;
  location: { municipality: string; };
  stock: number;
  certifications: string[];
  seasonal: boolean;
}


````

CARACTERÍSTICAS ESPECIALES:

- Header con gradiente dorado y título "Mercado Local de Jaén"
- Cards con efecto hover y gradientes por categoría
- Badges para productos de temporada y certificaciones ecológicas
- Loading skeleton con aceitunas animadas
- Responsive design con breakpoints de Tailwind


````

### **2. 🔍 ProductSearch Avanzado**



```prompt
Crear un componente de búsqueda avanzada para productos locales de Jaén con autocompletado y filtros inteligentes.

ESPECIFICACIONES:
- Input con debounce de 300ms y búsqueda instantánea
- Sugerencias dropdown con categorías y productos populares
- Filtros quick-access: "Solo disponibles", "De temporada", "Ecológicos"
- Resultados destacados con highlighting del término buscado
- Historial de búsquedas recientes (localStorage)
- Tema: Paleta amber/yellow con iconografía de Jaén

PROPS INTERFACE:


```typescript
interface ProductSearchProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  suggestions?: string[];
  placeholder?: string;
  showQuickFilters?: boolean;
  recentSearches?: string[];
}

interface SearchFilters {
  category?: string;
  available?: boolean;
  seasonal?: boolean;
  certified?: boolean;
}


````

CARACTERÍSTICAS:

- Diseño moderno con rounded-xl y sombras
- Iconos de búsqueda y filtros (🔍, 🫒, 🌿)
- Animaciones smooth para dropdown y resultados
- Keyboard navigation (arrow keys, enter, escape)
- Mobile-first design con gestos touch


````

### **3. 👥 ArtisanDirectory Premium**



```prompt
Diseñar un directorio elegante de artesanos y productores locales de Jaén con mapas integrados y perfiles detallados.

ESPECIFICACIONES:
- Cards de artesanos con foto, nombre, especialidad, ubicación, rating
- Vista lista y grid intercambiable
- Mapa interactivo con markers de ubicaciones
- Modal de perfil detallado con contacto y productos
- Filtros: especialidad, ubicación, rating mínimo, verificados
- Tema: Paleta earth tones + gold accents

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
  contact: { phone: string; email: string; };
}


````

CARACTERÍSTICAS:

- Header con toggle vista grid/lista
- Cards con rating de estrellas y badge "Verificado"
- Botones CTA: "Ver Perfil", "Contactar", "Ver Productos"
- Skeleton loading para cada card
- Responsive con masonry layout en desktop


````

### **4. 💼 SalesOpportunityBoard**



```prompt
Crear un tablero Kanban moderno para oportunidades de venta de productos locales de Jaén.

ESPECIFICACIONES:
- Columnas: "Activas", "En Proceso", "Cerradas"
- Cards arrastrables con drag & drop
- Información: título, categoría, precio, cantidad, fecha cosecha
- Filtros: categoría, rango precios, fecha, ubicación
- Botón FAB para crear nueva oportunidad
- Tema: Business colors con gold accents

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
  priceRange: { min: number; max: number; };
  quantity: string;
  status: 'active' | 'pending' | 'closed';
  harvestDate: string;
  location: string;
  producer: string;
}


````

CARACTERÍSTICAS:

- Columnas con scroll horizontal en móvil
- Cards con color-coding por categoría
- Indicadores de urgencia y prioridad
- Drag & drop con feedback visual
- Stats header con métricas clave


````

### **5. 🗺️ MarketplaceDashboard Principal**



```prompt
Diseñar un dashboard ejecutivo para el mercado local de Jaén con métricas, mapas y resumen de actividad.

ESPECIFICACIONES:
- Layout de 4 secciones: Stats, Mapa, Productos Trending, Artesanos Destacados
- Gráficos: ventas por categoría, productores por ubicación, tendencias temporales
- Mapa interactivo con clustered markers
- Cards de productos más vendidos y mejor valorados
- Panel de notificaciones y actividad reciente
- Tema: Executive dashboard con gold/amber palette

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


````

CARACTERÍSTICAS:

- Grid responsive con auto-fit columns
- Charts con animaciones de entrada
- Real-time updates con loading states
- Interactive tooltips y modals
- Export/share functionality


```



---

## 🔧 **GUÍA DE INTEGRACIÓN**

### **Método 1: Manual Copy-Paste (Recomendado)**

1. **Copia el código de V0** → `src/components/v0/`
2. **Adapta las props** según nuestros tipos TypeScript
3. **Conecta con hooks** existentes (useProducts, useArtisans, etc.)
4. **Ajusta styling** a nuestra paleta de Jaén
5. **Test & Deploy** 🚀

### **Método 2: V0 Extension para VS Code**

1. **Instala la extensión** V0 para VS Code
2. **Genera componente** directamente en el proyecto
3. **Auto-integración** con nuestros tipos y hooks
4. **Sync automático** con cambios en V0

### **📁 Estructura de Archivos Sugerida**



```


src/components/
├── market/ # Componentes actuales
│ ├── ProductCatalog.tsx
│ ├── ProductSearch.tsx
│ └── MarketplaceDashboard.tsx
├── v0/ # Componentes de V0
│ ├── ProductCatalogV0.tsx
│ ├── ProductSearchV0.tsx
│ ├── ArtisanDirectoryV0.tsx
│ ├── SalesOpportunityBoardV0.tsx
│ └── MarketplaceDashboardV0.tsx
└── ui/ # Componentes base Radix UI
├── button.tsx
├── card.tsx
└── input.tsx


```



### **🔗 Scripts de Integración**

Voy a crear scripts para facilitar la integración:


```

