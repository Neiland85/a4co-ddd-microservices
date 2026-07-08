# Análisis inicial de riesgos ENS-ready

Este análisis es preliminar. No sustituye a un análisis formal ENS ni a auditoría externa.

## R-001 — Pérdida de disponibilidad del runtime beta

- Activos afectados: API Gateway, Order Service, Inventory Service, Postgres, NATS.
- Impacto: interrupción del servicio.
- Probabilidad: media.
- Impacto: medio/alto.
- Evidencia actual: runtime incremental healthy.
- Tratamiento: healthchecks, smoke tests, runbook de arranque/parada, evidence pack por release.

## R-002 — Pérdida de eventos NATS / JetStream

- Activos afectados: NATS / JetStream.
- Impacto: pérdida de eventos operacionales.
- Probabilidad: media.
- Impacto: alto.
- Evidencia actual: NATS avisa de almacenamiento temporal en `/tmp/nats/jetstream`.
- Tratamiento: volumen persistente, política de retención, backup o estrategia de replay.

## R-003 — Falta de trazabilidad formal de operación

- Activos afectados: logs de aplicación, runtime, endpoints.
- Impacto: dificultad para auditar incidentes o demostrar estado.
- Probabilidad: media.
- Impacto: alto.
- Evidencia actual: logs con traceId/spanId y evidencias guardadas en `docs/ens/04_evidencias`.
- Tratamiento: normalizar logs, retención, exportación, procedimiento de revisión.

## R-004 — Validación completa buyer inestable

- Activos afectados: scripts buyer/runtime, Docker Compose.
- Impacto: pérdida de reproducibilidad ante terceros.
- Probabilidad: media.
- Impacto: medio.
- Evidencia actual: `buyer:validate` falló por runtime/cleanup, pero validación incremental fue correcta.
- Tratamiento: separar build, up, smoke y down en fases; evitar rebuild innecesario; limpiar orphans.

## R-005 — Endpoints proxy a servicios no incluidos

- Activos afectados: API Gateway.
- Impacto: rutas disponibles hacia servicios no levantados en beta incremental.
- Probabilidad: alta.
- Impacto: medio.
- Evidencia actual: Gateway lista auth, products y payments aunque no están incluidos en el hito incremental.
- Tratamiento: documentar alcance beta, feature flags o health degraded por servicio ausente.

## R-006 — Deuda de calidad TypeScript/lint

- Activos afectados: Order Service, Inventory Service.
- Impacto: mantenibilidad, auditoría técnica, riesgo de errores.
- Probabilidad: alta.
- Impacto: medio.
- Evidencia actual: lint sin errores bloqueantes pero con warnings de `any`, unused vars y console.
- Tratamiento: backlog técnico de reducción progresiva de warnings.

## R-007 — Confusión comercial sobre ENS

- Activos afectados: documentación comercial y ventas.
- Impacto: claim falso o sobreactuado.
- Probabilidad: media.
- Impacto: alto.
- Evidencia actual: `NO_CERTIFICACION_ENS.md` creado.
- Tratamiento: mantener lenguaje seguro: ENS-ready / alineable, no certificado.
