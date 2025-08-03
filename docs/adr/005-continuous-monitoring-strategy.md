# ADR-005: Estrategia de Monitoreo Continuo de Rendimiento

**Fecha**: 2025-01-03  
**Estado**: Propuesto  
**Deciders**: DevOps Lead, Tech Lead, Product Owner  
**Tags**: `monitoring`, `ci-cd`, `performance`, `metrics`

## Contexto y Problema

Sin monitoreo continuo, las optimizaciones de rendimiento se degradan con el tiempo:

- No hay visibilidad de regresiones hasta producción
- Métricas de rendimiento no están integradas en el flujo de desarrollo
- Sin alertas automáticas cuando se exceden umbrales
- Falta de datos históricos para análisis de tendencias
- Los desarrolladores no tienen feedback inmediato sobre impacto de sus cambios

Necesitamos un sistema que prevenga la degradación y mantenga las mejoras logradas.

## Decisión

Implementaremos un sistema de monitoreo continuo en 4 capas:

### 1. Performance Gates en CI/CD

```yaml
# .github/workflows/performance-gates.yml
name: Performance Gates

on: [pull_request]

jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check Bundle Size
        run: |
          npm run build
          npm run analyze:ci
          
      - name: Bundle Size Guard
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          skip_step: build
          
  complexity-check:
    runs-on: ubuntu-latest
    steps:
      - name: Complexity Analysis
        run: |
          npx eslint . --rule 'complexity: ["error", 10]' --format json > complexity.json
          node scripts/check-complexity-thresholds.js
          
      - name: Comment PR
        uses: actions/github-script@v6
        if: failure()
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ Complexity threshold exceeded. Please refactor before merging.'
            })
            
  lighthouse-ci:
    runs-on: ubuntu-latest
    steps:
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/dashboard
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

### 2. Real-time Performance Dashboard

```typescript
// monitoring/dashboard-config.ts
export const DASHBOARD_CONFIG = {
  metrics: [
    {
      id: 'bundle-size',
      name: 'Bundle Size Trend',
      query: 'SELECT date, first_load_js, total_size FROM bundle_metrics ORDER BY date DESC LIMIT 30',
      visualization: 'line-chart',
      thresholds: {
        warning: 100_000,  // 100KB
        critical: 150_000  // 150KB
      }
    },
    {
      id: 'complexity',
      name: 'Code Complexity Heatmap',
      query: 'SELECT file, function, complexity FROM complexity_metrics WHERE complexity > 5',
      visualization: 'heatmap',
      thresholds: {
        warning: 10,
        critical: 15
      }
    },
    {
      id: 'react-performance',
      name: 'React Render Metrics',
      query: 'SELECT component, render_count, render_time FROM react_metrics',
      visualization: 'scatter-plot',
      thresholds: {
        renderTime: 16,    // 60fps
        renderCount: 10
      }
    },
    {
      id: 'web-vitals',
      name: 'Core Web Vitals',
      query: 'SELECT lcp, fid, cls, inp FROM web_vitals WHERE timestamp > NOW() - INTERVAL 24 HOURS',
      visualization: 'gauge',
      thresholds: {
        lcp: 2500,
        fid: 100,
        cls: 0.1,
        inp: 200
      }
    }
  ],
  
  alerts: [
    {
      name: 'Bundle Size Regression',
      condition: 'bundle_size > previous_bundle_size * 1.1',
      severity: 'high',
      channels: ['slack', 'email']
    },
    {
      name: 'Complexity Spike',
      condition: 'max_complexity > 20',
      severity: 'critical',
      channels: ['slack', 'pagerduty']
    }
  ]
};
```

### 3. Automated Performance Testing

```typescript
// tests/performance/benchmarks.ts
import { test, expect } from '@playwright/test';
import lighthouse from 'lighthouse';

test.describe('Performance Benchmarks', () => {
  test('Dashboard should load within performance budget', async ({ page }) => {
    await page.goto('/dashboard');
    
    const metrics = await page.evaluate(() => {
      return {
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime,
        tbt: performance.measure('tbt').duration
      };
    });
    
    expect(metrics.fcp).toBeLessThan(1500);
    expect(metrics.lcp).toBeLessThan(2500);
    expect(metrics.tbt).toBeLessThan(300);
  });
  
  test('Heavy operations should not block main thread', async ({ page }) => {
    await page.goto('/dashboard');
    
    const startTime = Date.now();
    await page.click('[data-testid="heavy-operation"]');
    
    // Check if UI remains responsive
    const inputDelay = await page.evaluate(() => {
      return new Promise(resolve => {
        const input = document.createElement('input');
        document.body.appendChild(input);
        
        const start = performance.now();
        input.focus();
        
        requestAnimationFrame(() => {
          resolve(performance.now() - start);
        });
      });
    });
    
    expect(inputDelay).toBeLessThan(50); // Should respond within 50ms
  });
});

// Lighthouse automated tests
test('Lighthouse Performance Score', async ({ page }) => {
  const result = await lighthouse(page.url(), {
    port: 9222,
    onlyCategories: ['performance'],
  });
  
  expect(result.lhr.categories.performance.score).toBeGreaterThan(0.9);
});
```

### 4. Performance Budget Configuration

```json
// performance-budget.json
{
  "bundles": [
    {
      "name": "main",
      "budget": 100000
    },
    {
      "name": "vendor",
      "budget": 200000
    }
  ],
  "metrics": {
    "first-contentful-paint": 1500,
    "largest-contentful-paint": 2500,
    "first-input-delay": 100,
    "cumulative-layout-shift": 0.1,
    "interaction-to-next-paint": 200,
    "total-blocking-time": 300
  },
  "complexity": {
    "average": 5,
    "max": 15,
    "filesOverLimit": 10
  }
}
```

## Drivers de la Decisión

1. **Prevención vs Corrección**: Detectar problemas antes de producción
2. **Visibilidad**: Métricas accesibles para todo el equipo
3. **Automatización**: Reducir trabajo manual de análisis
4. **Accountability**: Cada PR muestra su impacto en performance

## Opciones Consideradas

### Opción 1: Monitoreo Manual
- ❌ Propenso a olvidos
- ❌ No escalable
- ✅ Sin costo adicional

### Opción 2: APM Comercial (DataDog, New Relic)
- ✅ Features completas
- ❌ Costo alto
- ❌ Vendor lock-in

### Opción 3: Stack Open Source (SELECCIONADA)
- ✅ Customizable
- ✅ Sin vendor lock-in
- ✅ Integración profunda
- ❌ Requiere mantenimiento

## Consecuencias

### Positivas
- Detección temprana de regresiones
- Cultura de performance en el equipo
- Datos para decisiones informadas
- Mejora continua automatizada

### Negativas
- Overhead en CI/CD (mitigado con paralelización)
- Curva de aprendizaje inicial
- Mantenimiento de infraestructura

### Stack Tecnológico

```typescript
// monitoring/stack.ts
export const MONITORING_STACK = {
  collection: {
    metrics: 'Prometheus',
    logs: 'Loki',
    traces: 'Tempo',
    realUser: 'Google Analytics 4'
  },
  
  storage: {
    timeSeries: 'InfluxDB',
    events: 'PostgreSQL',
    artifacts: 'S3'
  },
  
  visualization: {
    dashboards: 'Grafana',
    alerts: 'AlertManager',
    reports: 'Custom React Dashboard'
  },
  
  integration: {
    ci: 'GitHub Actions',
    cd: 'ArgoCD',
    communication: 'Slack'
  }
};
```

## Plan de Implementación

### Fase 1: CI/CD Gates (Semana 1)
- [ ] Configurar size-limit
- [ ] Implementar complexity checks
- [ ] Setup Lighthouse CI

### Fase 2: Monitoring Infrastructure (Semana 2-3)
- [ ] Deploy Prometheus + Grafana
- [ ] Configurar data collectors
- [ ] Crear dashboards básicos

### Fase 3: Alerting (Semana 4)
- [ ] Configurar AlertManager
- [ ] Integrar con Slack
- [ ] Definir SLOs

### Fase 4: Advanced Analytics (Semana 5-6)
- [ ] Implement trend analysis
- [ ] Predictive alerts
- [ ] Automated reports

## Métricas de Éxito

- **Mean Time to Detection (MTTD)**: < 5 minutos
- **False Positive Rate**: < 5%
- **Performance Regression Rate**: < 1 por sprint
- **Developer Adoption**: 100% de PRs con checks

## Presupuesto Estimado

| Item | Costo Mensual | Anual |
|------|---------------|-------|
| Infraestructura (AWS) | $200 | $2,400 |
| Storage (100GB) | $50 | $600 |
| Herramientas | $0 (OSS) | $0 |
| **Total** | **$250** | **$3,000** |

## Referencias

- [Google Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Size Limit](https://github.com/ai/size-limit)
- [Grafana Best Practices](https://grafana.com/docs/grafana/latest/best-practices/)