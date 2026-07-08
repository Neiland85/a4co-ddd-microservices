# Inventario inicial de activos ENS-ready

Este inventario identifica los activos técnicos relevantes para una preparación ENS/CCN-STIC inicial.

No implica certificación ENS.

| ID | Activo | Tipo | Servicio / ubicación | Dimensiones afectadas | Criticidad | Estado actual | Gap |
|---|---|---|---|---|---|---|---|
| ACT-001 | API Gateway | Servicio | `api-gateway` / puerto beta 8088 | Disponibilidad, trazabilidad, autenticidad | Alta | Runtime beta healthy | Endurecer JWT, revisar rutas proxy a servicios no activos |
| ACT-002 | Order Service | Servicio | `order-service` / puerto beta 3004 | Disponibilidad, integridad, trazabilidad | Media | Runtime beta healthy | Reducir warnings lint, revisar logs duplicados |
| ACT-003 | Inventory Service | Servicio | `inventory-service` / puerto beta 3006 | Disponibilidad, integridad, trazabilidad | Alta | Runtime beta healthy, DB conectada | Reducir `any`, revisar validaciones y errores |
| ACT-004 | PostgreSQL beta | Base de datos | `a4co-beta-postgres` / puerto 55433 | Integridad, confidencialidad, disponibilidad | Alta | Healthy | Definir backup, permisos, retención y hardening |
| ACT-005 | NATS / JetStream | Mensajería | `a4co-beta-nats` / puertos 14222/18222 | Disponibilidad, integridad operacional, trazabilidad | Alta | Healthy | JetStream usa almacenamiento temporal; falta persistencia |
| ACT-006 | Logs de aplicación | Evidencia operacional | Gateway, Order, Inventory | Trazabilidad, detección, auditoría | Alta | Logs presentes con traceId/spanId | Definir retención, formato y exportación |
| ACT-007 | Healthchecks | Control operacional | Gateway, Order, Inventory, NATS | Disponibilidad, monitorización | Media | Endpoints responden 200 OK | Integrar en CI/evidence pack |
| ACT-008 | Docker Compose beta | Infraestructura | `docker-compose.beta.yml` | Disponibilidad, configuración segura | Alta | Runtime incremental validado | Evitar orphans, revisar cleanup, persistencia NATS |
| ACT-009 | Scripts buyer/runtime | DevSecOps | `buyer:validate`, runtime scripts | Trazabilidad, reproducibilidad | Media | Buyer validate completo falla por runtime/cleanup | Separar validación incremental de validación completa |
| ACT-010 | Documentación ENS | Documentación | `docs/ens` | Gobernanza, auditoría, evidencia | Alta | Baseline creado y commiteado | Completar matriz de controles y procesos |
