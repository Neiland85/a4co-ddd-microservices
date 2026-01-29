# MSCPs por desacople (Modelo de Separación Cognitiva por Capa)

Este documento define **MSCPs (Microservice Separation & Context Plans)** para cada desacople clave. El objetivo es establecer planes operativos y técnicos por contexto, con contratos claros, límites de responsabilidad y mecanismos de realimentación hacia un objetivo común de producción y escalabilidad a 6 meses.

## Objetivo común (North Star)
- **Tiempo a producción:** 6 meses con estabilidad operacional.
- **Escalabilidad:** crecimiento sostenido sin degradación de SLOs.
- **SLOs base:** disponibilidad, latencia p95, tasa de error, lead time.

Cada MSCP declara cómo contribuye a estas métricas y cómo retroalimenta ajustes al resto del sistema.

---

## Plantilla de MSCP (usar para cada desacople)
**1) Propósito**
- ¿Qué acoplamiento se elimina y por qué importa?

**2) Límites de contexto y ownership**
- Servicio(s) dueños, responsables de SLA y operación.

**3) Contratos y compatibilidad**
- APIs/eventos, versionado, backward compatibility, esquemas.

**4) Datos y fuente de verdad**
- Dónde se escriben y leen datos, snapshots permitidos.

**5) Dependencias y rutas críticas**
- Dependencias síncronas y asíncronas.

**6) SLOs/SLIs**
- Disponibilidad, latencia, errores, colas, throughput.

**7) Riesgos y mitigaciones**
- Fallos previsibles, controles y circuit breakers.

**8) Plan de evolución (6 meses)**
- Hitos por fase y entregables.

**9) Realimentación al objetivo común**
- Eventos/indicadores que ajustan prioridades globales.
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
**Propósito:** aislar autenticación/autorización de lógica de negocio para permitir evolución de seguridad sin bloquear dominios.

- **Límites y ownership:** Auth es proveedor central. Los dominios consumen tokens/claims.
- **Contratos:** OAuth2/JWT, endpoints de introspección, JWKS; eventos de revocación de sesión.
- **Datos:** Auth es fuente de verdad de usuarios/roles. Dominios solo usan claims.
- **Dependencias:** síncrono en login; verificación offline de JWT en requests.
- **SLOs:** p95 login, tasa de fallos auth, tiempo de propagación de revocaciones.
- **Riesgos:** dependencia central; **mitigación:** caché de JWKS + rotación segura.
- **Plan 6 meses:** MFA → rotación de claves → scopes granulares por dominio.
- **Realimentación:** errores de autorización generan ajustes de scopes y UX.

## MSCP-02: Catálogo vs Órdenes
**Propósito:** desacoplar inventario/precios de la creación de órdenes, asegurando consistencia de compra.

- **Límites y ownership:** Catálogo es fuente de verdad de productos/precios.
- **Contratos:** API de consulta + evento `catalog.updated`.
- **Datos:** Órdenes guarda snapshot de precio/stock al momento de compra.
- **Dependencias:** sincronía solo para validación previa; cambios posteriores vía eventos.
- **SLOs:** p95 consulta catálogo, tasa de divergencia de precio.
- **Riesgos:** inconsistencia de precios; **mitigación:** snapshot + auditoría.
- **Plan 6 meses:** pricing dinámico + promociones por segmento.
- **Realimentación:** órdenes fallidas ajustan reglas de pricing.

## MSCP-03: Órdenes vs Pagos
**Propósito:** aislar procesamiento financiero del ciclo de orden para tolerar fallas y múltiples PSPs.

- **Límites y ownership:** Pagos gestiona capturas, reembolsos y conciliación.
- **Contratos:** `order.payment.requested` / `payment.completed` / `payment.failed`.
- **Datos:** Pagos es fuente de verdad de transacciones; órdenes reflejan estado.
- **Dependencias:** asíncrono por eventos, con fallback manual.
- **SLOs:** tiempo de autorización, tasa de rechazo, tiempo de reversa.
- **Riesgos:** doble cobro; **mitigación:** idempotencia + correlación.
- **Plan 6 meses:** multi-PSP + reconciliación automática.
- **Realimentación:** políticas de fraude ajustadas por métricas de rechazo.

## MSCP-04: Órdenes vs Notificaciones
**Propósito:** desacoplar comunicaciones del ciclo transaccional para evitar bloqueos.

- **Límites y ownership:** Notificaciones envía email/SMS/push con SLA propio.
- **Contratos:** evento `order.status.changed`.
- **Datos:** notificaciones es eventual; no bloquea órdenes.
- **Dependencias:** asíncrono, con reintentos y DLQ.
- **SLOs:** tiempo de entrega, tasa de reintentos, tasa de apertura.
- **Riesgos:** duplicados; **mitigación:** deduplicación + idempotencia.
- **Plan 6 meses:** templates multicanal + preferencias por usuario.
- **Realimentación:** métricas de entrega ajustan UX y timing.

## MSCP-05: Observabilidad vs Servicios
**Propósito:** centralizar métricas/logs/tracing sin acoplar lógica de negocio.

- **Límites y ownership:** plataforma observabilidad agrega, servicios solo emiten.
- **Contratos:** OpenTelemetry, métricas estándar y etiquetas.
- **Datos:** plataforma es fuente de verdad de trazas/logs.
- **Dependencias:** asíncrono (exporters); degradación controlada si falla backend.
- **SLOs:** disponibilidad de dashboards, retención logs, tiempo de ingestión.
- **Riesgos:** ruido; **mitigación:** sampling y control de cardinalidad.
- **Plan 6 meses:** SLO-based alerting + error budgets.
- **Realimentación:** alertas alimentan backlog y prioridades.

## MSCP-06: Feature Flags vs Deployments
**Propósito:** desacoplar releases de despliegues para habilitar rollout seguro.

- **Límites y ownership:** plataforma de flags gobierna activaciones.
- **Contratos:** SDK/REST para evaluar flags + auditoría de cambios.
- **Datos:** flags como fuente de verdad de activaciones.
- **Dependencias:** lectura local con cache; fallback por defaults.
- **SLOs:** latencia evaluación, disponibilidad SDK.
- **Riesgos:** fallos de flags; **mitigación:** defaults + circuit breakers.
- **Plan 6 meses:** segmentación, experimentos A/B, auto-rollback.
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
