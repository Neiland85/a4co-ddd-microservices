
# 📊 Reporte de Análisis de Archivos Críticos
*Generado: 2025-08-03T03:20:55.331Z*

## 📈 Resumen Ejecutivo
- **Total archivos analizados:** 797
- **Archivos críticos:** 20
- **Prioridad URGENTE:** 9
- **Prioridad HIGH:** 11

## 💳 Deuda Técnica Detectada
- **TODOs/FIXMEs:** 1
- **Tipos "any":** 140
- **Console.logs:** 116
- **@ts-ignore:** 0

## 🚨 Top 10 Archivos Críticos

| Archivo | Líneas | Complejidad | Prioridad | Principales Issues |
|---------|--------|-------------|-----------|-------------------|
| `/apps/web/v0dev/b-business-registration/food-artisan-registration-form.tsx` | 1024 | 61 | URGENT | Archivo muy grande (>500 líneas), Complejidad alta (>20) |
| `/apps/web/v0dev/a-head/components/ui/sidebar.tsx` | 764 | 45 | URGENT | Archivo muy grande (>500 líneas), Complejidad alta (>20) |
| `/apps/web/v0dev/b-business-registration/components/ui/sidebar.tsx` | 764 | 45 | URGENT | Archivo muy grande (>500 líneas), Complejidad alta (>20) |
| `/apps/web/v0dev/c-artisan-dashboard/components/ui/sidebar.tsx` | 764 | 45 | URGENT | Archivo muy grande (>500 líneas), Complejidad alta (>20) |
| `/apps/web/v0dev/d-user-registration/components/ui/sidebar.tsx` | 764 | 45 | URGENT | Archivo muy grande (>500 líneas), Complejidad alta (>20) |
| `/apps/web/v0dev/e-gamified-dashboard/components/ui/sidebar.tsx` | 764 | 45 | URGENT | Archivo muy grande (>500 líneas), Complejidad alta (>20) |
| `/apps/web/v0dev/f-modern-backoffice/components/ui/sidebar.tsx` | 764 | 45 | URGENT | Archivo muy grande (>500 líneas), Complejidad alta (>20) |
| `/apps/web/v0dev/g-banner-cookie/components/ui/sidebar.tsx` | 764 | 45 | URGENT | Archivo muy grande (>500 líneas), Complejidad alta (>20) |
| `/apps/web/v0dev/a-head/components/hero.tsx` | 560 | 83 | URGENT | Archivo muy grande (>500 líneas), Complejidad alta (>20) |
| `/apps/web/v0dev/f-modern-backoffice/components/settings/settings-dashboard.tsx` | 1389 | 8 | HIGH | Archivo muy grande (>500 líneas), Console.log en código |

## 🎯 Recomendaciones Prioritarias

- 🚨 20 archivos requieren refactor URGENTE
- 📏 Dividir 2 archivos >1000 líneas: /apps/web/v0dev/b-business-registration/food-artisan-registration-form.tsx, /apps/web/v0dev/f-modern-backoffice/components/settings/settings-dashboard.tsx
- 🧮 Simplificar 12 archivos con alta complejidad ciclomática
- 🖥️ Remover 116 console.log antes de producción
- 🎯 Tipificar 140 usos de "any" para mejor type safety

## 📊 Distribución por Directorio

- **/apps/web:** 18 archivos críticos
- **/apps/dashboard-web:** 2 archivos críticos

---
*Para implementar las mejoras, consulta el PLAN_AUDITORIA_TECNICA_PERFORMANCE.md*
