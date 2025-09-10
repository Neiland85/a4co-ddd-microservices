# ADR-004: Optimización de Rendimiento React 19

**Fecha**: 2025-01-03  
**Estado**: Propuesto  
**Deciders**: Frontend Lead, UX Lead, Performance Engineer  
**Tags**: `react`, `performance`, `rendering`, `react-19`

## Contexto y Problema

Análisis preliminar de la aplicación dashboard-web muestra:

- Re-renders innecesarios en componentes de lista (>10 renders/interacción)
- Falta de memoización en cálculos costosos
- Props drilling causando cascadas de renders
- Sin aprovechamiento de nuevas APIs de React 19
- Componentes pesados bloqueando el main thread

Métricas actuales:

- **Interaction to Next Paint (INP)**: > 200ms (target: < 100ms)
- **Total Blocking Time (TBT)**: > 300ms (target: < 50ms)
- **Re-renders promedio**: 15 por interacción (target: < 5)

## Decisión

Implementaremos optimizaciones específicas de React 19 en 4 áreas:

### 1. Concurrent Features y Transitions


```typescript
// hooks/useConcurrentState.ts
import { useTransition, useDeferredValue, useState } from 'react';

export function useConcurrentState<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const deferredValue = useDeferredValue(value);

  const setConcurrentValue = (newValue: T) => {
    startTransition(() => {
      setValue(newValue);
    });
  };

  return {
    value: deferredValue,
    setValue: setConcurrentValue,
    isPending,
    immediateValue: value
  };
}

// Uso en componentes
function SearchableList({ items }) {
  const { value: searchTerm, setValue: setSearchTerm, isPending } = useConcurrentState('');

  const filteredItems = useMemo(
    () => items.filter(item => item.includes(searchTerm)),
    [items, searchTerm]
  );

  return (
    <>
      <SearchInput onChange={setSearchTerm} />
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        <VirtualList items={filteredItems} />
      </div>
    </>
  );
}

```


### 2. Render Optimization Strategy


```typescript
// components/OptimizedComponent.tsx
import { memo, useCallback, useMemo } from 'react';

// Nivel 1: Memo con comparación customizada
export const OptimizedList = memo(({
  items,
  onItemClick,
  filters
}: ListProps) => {
  // Nivel 2: Memoización de cálculos costosos
  const processedItems = useMemo(
    () => expensiveProcessing(items, filters),
    [items, filters]
  );

  // Nivel 3: Callbacks estables
  const handleClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  return <VirtualizedList items={processedItems} onItemClick={handleClick} />;
}, (prevProps, nextProps) => {
  // Comparación superficial customizada
  return (
    prevProps.items === nextProps.items &&
    shallowEqual(prevProps.filters, nextProps.filters)
  );
});

// Nivel 4: Context optimization
const FilterContext = createContext<FilterState>(null);
const ItemContext = createContext<ItemState>(null);

// Split contexts para evitar re-renders innecesarios
export function OptimizedProvider({ children }) {
  const [filters, setFilters] = useState({});
  const [items, setItems] = useState([]);

  return (
    <FilterContext.Provider value={filters}>
      <ItemContext.Provider value={items}>
        {children}
      </ItemContext.Provider>
    </FilterContext.Provider>
  );
}

```


### 3. Virtual Scrolling y Windowing


```typescript
// components/VirtualList.tsx
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export const VirtualList = memo(({ items, itemHeight = 50 }) => {
  const Row = useCallback(({ index, style }) => (
    <div style={style}>
      <OptimizedListItem item={items[index]} />
    </div>
  ), [items]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={items.length}
          itemSize={itemHeight}
          overscanCount={5}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
});

```


### 4. Performance Monitoring HOC


```typescript
// hoc/withPerformanceMonitoring.tsx
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
  thresholds = { renderTime: 16, renderCount: 10 }
) {
  return memo((props: P) => {
    const renderCount = useRef(0);
    const renderStart = useRef(performance.now());

    useEffect(() => {
      const renderTime = performance.now() - renderStart.current;
      renderCount.current++;

      if (renderTime > thresholds.renderTime) {
        console.warn(`⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }

      if (renderCount.current > thresholds.renderCount) {
        console.error(`🚨 Excessive renders: ${componentName} rendered ${renderCount.current} times`);
      }

      // Enviar a sistema de monitoreo
      trackPerformance({
        component: componentName,
        renderTime,
        renderCount: renderCount.current,
        props: Object.keys(props)
      });
    });

    renderStart.current = performance.now();
    return <Component {...props} />;
  });
}

```


## Drivers de la Decisión

1. **User Experience**: Interacciones < 100ms para sensación de instantáneo
2. **React 19 Features**: Aprovechar nuevas optimizaciones del framework
3. **Scalability**: Soportar listas de 10K+ items sin degradación
4. **Developer Experience**: Optimizaciones no deben complicar el desarrollo

## Opciones Consideradas

### Opción 1: Server Components

- ✅ Elimina hidratación
- ❌ Requiere reestructuración mayor
- ❌ Limitaciones con estado local

### Opción 2: Qwik/Solid Migration

- ✅ Performance superior
- ❌ Reescribir toda la app
- ❌ Ecosystem limitado

### Opción 3: React 19 Optimizations (SELECCIONADA)

- ✅ Incremental
- ✅ Mantiene ecosystem
- ✅ Nuevas APIs poderosas
- ✅ Compatible con código existente

## Consecuencias

### Positivas

- Reducción 60% en re-renders innecesarios
- INP < 100ms en 90% de interacciones
- Mejor UX en dispositivos low-end
- Preparados para React Compiler (futuro)

### Negativas

- Complejidad inicial en patterns
- Overhead de monitoreo
- Posible over-optimization

### Métricas de Monitoreo


```typescript
// utils/performance-metrics.ts
export const PERFORMANCE_BUDGETS = {
  INP: 100, // ms
  TBT: 50, // ms
  FID: 100, // ms
  renderTime: 16, // ms (60fps)
  rerenderLimit: 5, // per interaction
  memoryLimit: 50, // MB heap growth
};

export function measureComponentPerformance() {
  return {
    renderTime: performance.measure('render'),
    memoryUsage: performance.memory?.usedJSHeapSize,
    interactionLatency: performance.getEntriesByType('event'),
  };
}

```


## Plan de Implementación

### Sprint 1: Foundations

- [ ] Implementar performance monitoring
- [ ] Identificar componentes problemáticos
- [ ] Setup React DevTools Profiler

### Sprint 2: Quick Wins

- [ ] Aplicar memo a componentes top-level
- [ ] Implementar useMemo/useCallback donde crítico
- [ ] Virtual scrolling para listas largas

### Sprint 3: Advanced Optimizations

- [ ] Migrar a concurrent features
- [ ] Implementar code splitting granular
- [ ] Optimizar Context providers

### Sprint 4: Monitoring

- [ ] Dashboard de métricas
- [ ] Alertas automáticas
- [ ] Performance regression tests

## Criterios de Éxito


```typescript
// tests/performance.spec.ts
describe('Performance Benchmarks', () => {
  it('should render list with 1000 items < 100ms', async () => {
    const start = performance.now();
    render(<OptimizedList items={generateItems(1000)} />);
    const renderTime = performance.now() - start;

    expect(renderTime).toBeLessThan(100);
  });

  it('should not re-render on unrelated prop changes', () => {
    const { rerender } = render(<OptimizedComponent data={data} />);
    const renderCount = getRenderCount();

    rerender(<OptimizedComponent data={data} unrelatedProp="new" />);

    expect(getRenderCount()).toBe(renderCount);
  });
});

```


## Referencias

- [React 19 Blog Post](https://react.dev/blog/2024/04/25/react-19)
- [Patterns.dev - Performance Patterns](https://www.patterns.dev/posts/react-performance)
- [Web.dev - Optimize INP](https://web.dev/optimize-inp/)
- [React Window](https://github.com/bvaughn/react-window)
