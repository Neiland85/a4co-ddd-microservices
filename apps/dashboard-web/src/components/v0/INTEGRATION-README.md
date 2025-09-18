# 🎨 Configuración de Integración V0 → Dashboard Jaén

## 📁 Estructura de Archivos V0


```bash
apps/dashboard-web/src/components/v0/
├── ProductCatalogV0.tsx     # Componente de V0 → ProductCatalog
├── ProductSearchV0.tsx      # Componente de V0 → ProductSearch
├── ArtisanDirectoryV0.tsx   # Componente de V0 → ArtisanDirectory
├── SalesOpportunityV0.tsx   # Componente de V0 → SalesOpportunityBoard
└── MarketplaceDashboardV0.tsx # Componente de V0 → MarketplaceDashboard


```


## 🔗 Pasos de Integración Rápida

### 1. Generar en V0.dev

- Usar prompts de `docs/V0-PROMPTS.md`
- Copiar código generado

### 2. Integración Manual


```bash
# Crear archivo del componente
touch src/components/v0/ProductCatalogV0.tsx

# Pegar código de V0 y ajustar imports
# import { useProducts } from '../../hooks/useProducts';
# import type { LocalProduct } from '../../app/api/sales-opportunities/route';


```


### 3. Ajustes Necesarios

#### Imports típicos a cambiar


```typescript
// V0 genera esto:
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Cambiar por:
import { Button } from '../ui/button';
import { Card } from '../ui/card';

```


#### Conectar con nuestros hooks


```typescript
// Agregar al inicio del componente V0:
export default function ProductCatalogV0() {
  const { products, loading, error } = useProducts();

  // Resto del código de V0...
}

```


## 🎯 URLs de Prueba

- Página principal: http://localhost:3001
- Página de testing: http://localhost:3001/test-integrations

## ✅ Checklist de Integración

- [ ] Código copiado de V0.dev
- [ ] Imports ajustados a rutas locales
- [ ] Hooks conectados (useProducts, useArtisans, etc.)
- [ ] Tipos TypeScript correctos
- [ ] Componente renderiza sin errores
- [ ] Funcionalidad probada en navegador
