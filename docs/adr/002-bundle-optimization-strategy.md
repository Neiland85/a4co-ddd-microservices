# ADR-002: Estrategia de Optimización de Bundle Size

**Fecha**: 2025-01-03  
**Estado**: Propuesto  
**Deciders**: Frontend Lead, Tech Lead, DevOps  
**Tags**: `performance`, `bundle-size`, `webpack`, `next.js`

## Contexto y Problema

El análisis inicial del bundle de `dashboard-web` revela:

- Sin configuración de code splitting optimizada
- Dependencias de vendor en un único chunk
- Posibles módulos duplicados entre chunks
- Sin lazy loading implementado
- Bundle total potencialmente > 1MB

Esto impacta directamente en:

- **Time to Interactive (TTI)**: Usuario espera más para interactuar
- **First Contentful Paint (FCP)**: Contenido tarda en aparecer
- **Costos de bandwidth**: Especialmente en móviles
- **Core Web Vitals**: Afecta SEO y ranking

## Decisión

Implementaremos una estrategia de optimización de bundle en 3 niveles:

### Nivel 1: Code Splitting Agresivo

```javascript
// next.config.js
splitChunks: {
  chunks: 'all',
  cacheGroups: {
    framework: {
      test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
      name: 'framework',
      priority: 40,
      enforce: true
    },
    lib: {
      test: /[\\/]node_modules[\\/]/,
      name(module) {
        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([[\\/]|$)/)[1];
        return `lib-${packageName.replace('@', '')}`;
      },
      priority: 30,
      minChunks: 1,
      reuseExistingChunk: true
    },
    commons: {
      minChunks: 2,
      priority: 20
    },
    shared: {
      test: /[\\/]packages[\\/]shared/,
      name: 'shared',
      priority: 10,
      reuseExistingChunk: true
    }
  }
}


```

### Nivel 2: Dynamic Imports y Lazy Loading

```typescript
// Rutas pesadas
const HeavyDashboard = dynamic(() => import('./HeavyDashboard'), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

// Componentes no críticos
const Analytics = dynamic(() => import('./Analytics'), {
  loading: () => <p>Cargando analíticas...</p>
});

// Modales y overlays
const Modal = dynamic(() => import('./Modal'));


```

### Nivel 3: Tree Shaking y Optimizaciones

- Imports específicos: `import { debounce } from 'lodash-es'`
- Eliminar polyfills innecesarios
- Configurar `sideEffects: false` en package.json
- Usar `optimizePackageImports` para librerías grandes

## Drivers de la Decisión

1. **Performance Budget**: First Load JS < 100KB
2. **Prioridad Mobile**: 60% usuarios en móvil
3. **SEO Critical**: Core Web Vitals afecta ranking
4. **DX Balance**: No complicar excesivamente el desarrollo

## Opciones Consideradas

### Opción 1: Micro-frontends

- ✅ Máxima separación
- ❌ Complejidad arquitectural alta
- ❌ Overhead de coordinación

### Opción 2: Module Federation

- ✅ Compartir dependencias entre apps
- ❌ Requiere Webpack 5+ específico
- ❌ Debugging complejo

### Opción 3: Code Splitting + Lazy Loading (SELECCIONADA)

- ✅ Balance complejidad/beneficio
- ✅ Soportado nativamente en Next.js
- ✅ Progresivo y reversible
- ✅ Herramientas de análisis maduras

## Consecuencias

### Positivas

- Reducción 40-60% en First Load JS
- Mejor TTI y FCP
- Caché más eficiente
- Actualizaciones más granulares

### Negativas

- Más archivos HTTP (mitigado con HTTP/2)
- Complejidad inicial de configuración
- Posible FOUC si no se maneja bien

### Métricas de Monitoreo

```typescript
// utils/bundle-metrics.ts
export const BUNDLE_THRESHOLDS = {
  firstLoadJS: 100_000, // 100KB
  totalBundleSize: 1_000_000, // 1MB
  largestChunk: 200_000, // 200KB
  vendorChunk: 300_000, // 300KB
  cssSize: 50_000, // 50KB
};

// Script de validación
export async function validateBundleSize() {
  const stats = await analyzeBuild();
  const violations = [];

  if (stats.firstLoadJS > BUNDLE_THRESHOLDS.firstLoadJS) {
    violations.push(`First Load JS: ${stats.firstLoadJS} > ${BUNDLE_THRESHOLDS.firstLoadJS}`);
  }

  return violations;
}
```

## Plan de Implementación

### Semana 1: Análisis y Configuración

- [ ] Ejecutar bundle analyzer baseline
- [ ] Identificar chunks problemáticos
- [ ] Configurar splitChunks inicial

### Semana 2: Lazy Loading

- [ ] Identificar componentes no críticos
- [ ] Implementar dynamic imports
- [ ] Validar métricas post-cambio

### Semana 3: Optimizaciones Finas

- [ ] Tree shaking audit
- [ ] Eliminar duplicados
- [ ] Optimizar imágenes y assets

## Recursos Necesarios

- **Herramientas**: @next/bundle-analyzer, webpack-bundle-analyzer
- **Tiempo**: 2 desarrolladores x 3 semanas
- **Infra**: CDN para assets optimizados

## Criterios de Reversión

Si post-implementación observamos:

- Incremento en errores de carga > 5%
- Degradación de UX reportada
- Complejidad de mantenimiento insostenible

Revertimos a configuración anterior manteniendo aprendizajes.

## Referencias

- [Next.js Code Splitting](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Webpack SplitChunks](https://webpack.js.org/plugins/split-chunks-plugin/)
- [Web.dev Bundle Optimization](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
