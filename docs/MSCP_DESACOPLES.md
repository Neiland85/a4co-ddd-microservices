# MSCPs por desacople (Modelo de Separación Cognitiva por Capa)

Este documento define **MSCPs (Microservice Separation & Context Plans)** para cada desacople clave. El objetivo es establecer planes operativos y técnicos por contexto, con contratos claros, límites de responsabilidad y mecanismos de realimentación hacia un objetivo común de producción y escalabilidad a 6 meses.

## Objetivo común (North Star)
- **Tiempo a producción:** 6 meses con estabilidad operacional.
- **Escalabilidad:** crecimiento sostenido sin degradación de SLOs.
- **SLOs base:** disponibilidad, latencia p95, tasa de error, lead time.

Cada MSCP debe declarar cómo contribuye a estas métricas y cómo retroalimenta ajustes al resto del sistema.

---

## Estructura de un MSCP
Cada desacople debe documentar lo siguiente:

1. **Propósito del desacople**
2. **Límites de contexto y ownership**
3. **Contratos (APIs/Eventos)**
4. **Datos y fuente de verdad**
5. **Dependencias**
6. **SLOs e indicadores**
7. **Mitigaciones de riesgo**
8. **Plan de evolución (6 meses)**
9. **Mecanismo de realimentación hacia el objetivo común**

---

## MSCP-01: Identidad/Auth vs Dominio de Negocio
**Propósito:** aislar autenticación/autorización de lógica de negocio.

- **Límites:** Auth como proveedor central; dominios consumen tokens/claims.
- **Contratos:** JWT/OAuth2, endpoints de introspección, eventos de sesión.
- **Datos:** fuente de verdad en Auth (usuarios/roles). El resto usa claims.
- **SLOs:** p95 autenticación, tasa de fallo login, expiración tokens.
- **Riesgos:** dependencia central; mitigación con caché de verificación y JWKS.
- **Evolución:** ampliar claims, MFA, rotación de claves.
- **Realimentación:** errores de autorización reportan cambios de scope.

## MSCP-02: Catálogo vs Órdenes
**Propósito:** desacoplar inventario/precios de creación de órdenes.

- **Límites:** Catálogo es fuente de verdad de productos/precios.
- **Contratos:** API de consulta de productos; evento `catalog.updated`.
- **Datos:** Órdenes almacena snapshot de precio al momento de compra.
- **SLOs:** p95 consulta catálogo, divergencia de precio.
- **Riesgos:** inconsistencia de precios; mitigación con snapshot y auditoría.
- **Evolución:** pricing dinámico, promociones.
- **Realimentación:** órdenes fallidas informan política de pricing.

## MSCP-03: Órdenes vs Pagos
**Propósito:** aislar procesamiento financiero del ciclo de orden.

- **Límites:** Pagos maneja captura, reembolsos, conciliación.
- **Contratos:** evento `order.payment.requested` / `payment.completed`.
- **Datos:** pagos es fuente de verdad de transacciones.
- **SLOs:** tiempo de autorización, tasa de rechazo.
- **Riesgos:** doble cobro; mitigación con idempotencia y correlación.
- **Evolución:** múltiples PSPs, fallback.
- **Realimentación:** cambios de políticas en base a rechazos.

## MSCP-04: Órdenes vs Notificaciones
**Propósito:** desacoplar comunicaciones del ciclo transaccional.

- **Límites:** Notificaciones envía email/SMS/push.
- **Contratos:** evento `order.status.changed`.
- **Datos:** notificaciones es eventual; no bloquea órdenes.
- **SLOs:** tiempo de entrega, tasa de reintentos.
- **Riesgos:** duplicados; mitigación con deduplicación + idempotencia.
- **Evolución:** templates multicanal, preferencias usuario.
- **Realimentación:** feedback de envío alimenta UX y timing.

## MSCP-05: Observabilidad vs Servicios
**Propósito:** centralizar métricas/logs/tracing sin acoplar lógica.

- **Límites:** cada servicio emite métricas; plataforma agrega.
- **Contratos:** OpenTelemetry, métricas estándar.
- **Datos:** plataforma es fuente de verdad de observabilidad.
- **SLOs:** disponibilidad de dashboards, retención logs.
- **Riesgos:** ruido; mitigación con sampling y cardinalidad controlada.
- **Evolución:** alertas inteligentes, SLO error budget.
- **Realimentación:** alertas ajustan prioridades de backlog.

## MSCP-06: Feature Flags vs Deployments
**Propósito:** desacoplar releases de despliegues.

- **Límites:** plataforma de flags gobierna activaciones.
- **Contratos:** SDK/REST para evaluar flags.
- **Datos:** flags como fuente de verdad de activaciones.
- **SLOs:** latencia evaluación, disponibilidad SDK.
- **Riesgos:** fallos de flags; mitigación con defaults y circuit breakers.
- **Evolución:** segmentación, experimentos A/B.
- **Realimentación:** métricas de impacto por flag.

---

## Checklist mínimo para cada nuevo desacople
- [ ] Define ownership y límites explícitos.
- [ ] Publica contratos versionados y con backward compatibility.
- [ ] Declara fuente de verdad de datos.
- [ ] Asegura idempotencia y correlación.
- [ ] Añade métricas y alertas por SLO.
- [ ] Documenta riesgos y mitigaciones.
- [ ] Establece canal de realimentación hacia North Star.

---

## Próximos pasos sugeridos
1. Validar estos MSCPs con los equipos responsables.
2. Transformarlos en tickets/épicas con criterios de aceptación.
3. Integrarlos a la gobernanza de arquitectura (revisión mensual).
