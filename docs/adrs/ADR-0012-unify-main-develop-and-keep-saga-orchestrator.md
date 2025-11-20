# ADR-0012: Unificación de Ramas y Preservación del Saga Orchestrator Robusto

**Fecha**: 2025-11-13
**Estado**: Aceptado
**Deciders**: Equipo de Arquitectura, Tech Lead
**Tags**: `git-flow`, `saga-pattern`, `architecture`, `refactoring`

---

## Contexto y Problema

El análisis de ramas (`ANALISIS_RAMAS_MITIGACIONES_ERRORES.md`) reveló una divergencia crítica entre `main` y `develop`. La rama `develop` había eliminado masivamente código de producción esencial presente en `main`, incluyendo:

1. **El Saga Orchestrator robusto**: Un orquestador con lógica de estados, compensaciones, reintentos y timeouts.
2. **Infraestructura de Monitoreo**: Configuración de Prometheus y dashboards de Grafana.
3. **Tests E2E Críticos**: Pruebas que validaban el flujo completo de la saga y su compensación.

La rama `develop` representaba una versión simplificada del sistema, pero había perdido funcionalidades críticas para la resiliencia y observabilidad en un entorno de producción. Un `merge` directo de `develop` a `main` habría resultado en una pérdida catastrófica de funcionalidad y en la degradación de la calidad del sistema.

El flujo de trabajo estándar de Git (donde `develop` es un superconjunto de `main`) estaba roto, creando un riesgo operativo y de desarrollo significativo.

---

## Decisión

Se decide realizar una **reconciliación estratégica** de las ramas `main` y `develop`, con los siguientes puntos clave:

1. **`main` como Única Fuente de Verdad**: La rama `main` se establece como la base para la unificación. El objetivo es enriquecer `main` con las mejoras válidas de `develop`, no reemplazarla.

2. **Preservar el Saga Orchestrator de `main`**: Se mantendrá la implementación completa del orquestador de sagas (`apps/order-service/src/application/sagas/order-saga-orchestrator.ts`) que incluye lógica de compensación y manejo de estados complejos. Se descarta la versión simplificada de `develop` por no ser suficientemente robusta para producción.

3. **Preservar Monitoreo y Tests E2E**: Se restaurarán y mantendrán todos los archivos relacionados con Prometheus, Grafana y los tests E2E de la rama `main`. La observabilidad y la validación de flujos complejos no son negociables.

4. **Proceso de Fusión Controlado**: La unificación no será un `git merge` directo. Se seguirá un plan de acción que implica:
    a. Crear una rama de integración a partir de `main`.
    b. Fusionar `develop` en esta rama de integración.
    c. Usar `git checkout origin/main -- <path>` para restaurar selectivamente los archivos y directorios críticos que fueron eliminados en `develop`.
    d. Realizar pruebas exhaustivas antes de integrar el resultado final en `main`.

5. **Sincronización Post-Unificación**: Una vez que la rama de integración se fusione en `main`, la rama `develop` será actualizada para que refleje el estado de `main`, restaurando así un flujo de Git coherente.

---

## Drivers de la Decisión

- **Resiliencia del Sistema**: El Saga Orchestrator de `main` con su lógica de compensación es fundamental para mantener la consistencia de los datos en un sistema distribuido. Eliminarlo introduce un alto riesgo de estados inconsistentes ante fallos.
- **Observabilidad**: Las métricas y dashboards son cruciales para monitorear la salud del sistema en producción. Su eliminación en `develop` era inaceptable.
- **Calidad y Confianza**: Los tests E2E para flujos complejos como las sagas son la única garantía de que el sistema se comporta como se espera. Su restauración es vital para la confianza en los despliegues.
- **Claridad del Flujo de Desarrollo**: La divergencia había creado confusión y riesgo. Era necesario restablecer un único flujo de trabajo donde `main` siempre represente el código más completo y estable.

---

## Opciones Consideradas

1. **Merge Directo de `develop` a `main` (Rechazado)**:
    - _Pros_: Simple de ejecutar.
    - _Contras_: Inaceptable. Resultaría en la eliminación de funcionalidades críticas de producción.

2. **Abandonar `develop` y Continuar desde `main` (Rechazado)**:
    - _Pros_: Preserva todo el código de `main`.
    - _Contras_: Se perderían las actualizaciones de dependencias y posibles limpiezas de código válidas que se hicieron en `develop`.

3. **Cherry-pick de `develop` a `main` (Considerado pero Rechazado)**:
    - _Pros_: Control granular sobre qué cambios integrar.
    - _Contras_: Proceso tedioso y propenso a errores dado el gran número de commits y cambios. Difícil de gestionar las eliminaciones de `develop`.

4. **Reconciliación Estratégica (Aceptado)**:
    - _Pros_: Combina lo mejor de ambos mundos. Permite adoptar las mejoras de `develop` mientras se restauran de forma masiva y segura las funcionalidades críticas de `main`. Es un proceso controlable y verificable.
    - _Contras_: Requiere un esfuerzo manual y una validación cuidadosa, pero el beneficio justifica el coste.

---

## Consecuencias

### Positivas

- Se establece una única base de código (`main`) que es robusta, observable y está lista para producción.
- Se restaura un flujo de Git lógico y seguro, donde `develop` vuelve a ser una rama de desarrollo que parte de `main`.
- Se mitiga el riesgo de desplegar una versión degradada del sistema.
- El equipo tiene una dirección clara sobre la arquitectura a seguir, reafirmando la importancia de la resiliencia y la observabilidad.

### Negativas

- El proceso de unificación requiere una congelación temporal de merges a `main` y `develop`.
- Requiere un esfuerzo de ejecución y validación de aproximadamente 1-2 días de trabajo concentrado.

---

## Referencias

- `ANALISIS_RAMAS_MITIGACIONES_ERRORES.md`
- `Plan de Acción Detallado para la Unificación de main y develop`
- `reconcile_branches.sh` (Script de automatización para la Fase 3)

---

**Última actualización**: 2025-11-13
