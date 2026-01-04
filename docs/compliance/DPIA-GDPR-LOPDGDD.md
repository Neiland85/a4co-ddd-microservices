# DPIA + Matriz GDPR/LOPDGDD

Documento formal de Evaluación de Impacto en la Protección de Datos (DPIA) y matriz de cumplimiento para el ecosistema A4CO. Se enfoca en trazabilidad, seguridad y tratamiento de datos personales, alineado con niveles de exigencia propios de ICANN.

## 1. Resumen ejecutivo de la DPIA

- **Flujos cubiertos**: autenticación/registro (`apps/auth-service`), gestión de usuarios (`apps/user-service`), órdenes y pagos (`prisma/schema.prisma`, `apps/order-service`, `apps/payment-service`), y telemetría/observabilidad (`packages/observability`).
- **Categorías de datos personales**: email, nombre, rol y credenciales (ver modelo `User` en [`prisma/schema.prisma`](../../prisma/schema.prisma)); trazas de auditoría con identificadores de solicitud y usuario (`packages/observability/src/middleware/trace-context.middleware.ts`).
- **Riesgos principales identificados**: acceso no autorizado, exceso de retención, falta de prueba de consentimiento y falta de borrado efectivo. Las medidas técnicas actuales se detallan en la matriz y los gaps se listan al final.

## 2. Controles técnicos implementados

- **Autenticación y salvaguardas de entrada**: rate limiting, validación de JWT, sanitización de payload y logging de seguridad en [`apps/auth-service/src/middleware/security.middleware.ts`](../../apps/auth-service/src/middleware/security.middleware.ts).
- **Trazabilidad extremo a extremo**: asignación de trace-id y propagación contextual en [`packages/observability/src/middleware/trace-context.middleware.ts`](../../packages/observability/src/middleware/trace-context.middleware.ts) y logging estructurado en [`packages/observability/src/logger/simple-logger.ts`](../../packages/observability/src/logger/simple-logger.ts).
- **Minimización y control de modelo**: datos estrictamente necesarios en el modelo `User` (`email`, `name`, `role`) y relaciones de negocio en [`prisma/schema.prisma`](../../prisma/schema.prisma); DTOs limitan la exposición en [`apps/user-service/src/contracts/api/v1/dto.ts`](../../apps/user-service/src/contracts/api/v1/dto.ts).
- **Auditoría de actividad**: registro de solicitudes y resultados en middleware de seguridad y en wrappers HTTP (`packages/observability/src/logging/http-client-wrapper.ts`) para poder reconstruir acciones administrativas y de cliente.

## 3. Matriz de trazabilidad por artículo (GDPR/LOPDGDD)

| Artículo | Evidencia en código | Estado / Observación |
| --- | --- | --- |
| GDPR art. 5 (Principios, minimización) | Definición de atributos mínimos de usuario en [`prisma/schema.prisma`](../../prisma/schema.prisma) y conversión controlada en [`apps/user-service/src/presentation/controllers/controller.ts`](../../apps/user-service/src/presentation/controllers/controller.ts). | ✅ Implementado; mantener revisión cuando se agreguen campos nuevos. |
| GDPR art. 6 / LOPDGDD (Base legal y consentimiento) | Punto de entrada de registro en [`apps/auth-service/src/presentation/controllers/auth.controller.ts`](../../apps/auth-service/src/presentation/controllers/auth.controller.ts); actualmente el modelo `User` no almacena consentimiento. | ⚠️ Gap: añadir `consentAccepted` y trazabilidad de timestamp antes de GA. |
| GDPR art. 25 (Privacy by design & by default) | Propagación de trazas por middleware (`trace-context.middleware.ts`) y logging estructurado (`simple-logger.ts`) en `packages/observability`. | ✅ Implementado; extender a nuevos servicios que se creen en `apps/*`. |
| GDPR art. 30 (Registro de actividades) | Logging de seguridad y auditoría en [`apps/auth-service/src/middleware/security.middleware.ts`](../../apps/auth-service/src/middleware/security.middleware.ts) y trazas de cliente en [`packages/observability/src/logging/http-client-wrapper.ts`](../../packages/observability/src/logging/http-client-wrapper.ts). | ✅ Implementado; definir retención/rotación en despliegues. |
| GDPR art. 32 (Seguridad técnica) | Controles de rate limiting, validación JWT y sanitización en `security.middleware.ts`; separación de roles en `User.role` (`prisma/schema.prisma`). | ✅ Implementado; añadir pruebas de penetración automatizadas en pipeline. |
| GDPR art. 33/34 (Notificación de brechas) | Métricas y hooks de instrumentación en [`packages/observability/src/instrumentation/index.ts`](../../packages/observability/src/instrumentation/index.ts) habilitan alertas; procedimiento \"Security Incident Procedure\" en [`docs/SECURITY.md`](../SECURITY.md). | ✅ Parcial: conectar alertas a canal 24x7 y documentar RTO/RPO por servicio. |
| LOPDGDD derechos ARSULIPO (Acceso/Rectificación/Supresión) | Lectura y actualización de usuarios en [`apps/user-service/src/application/services/service.ts`](../../apps/user-service/src/application/services/service.ts); no existe eliminación ni exportación. | ⚠️ Gap crítico: falta endpoint de supresión/borrado y exportación portátil de datos. |
| LOPDGDD art. 32 (Medidas de seguridad) | Reglas de sanitización y control de tamaño de payload en `security.middleware.ts`; trazas firmadas con `trace-id` en `trace-context.middleware.ts`. | ✅ Implementado; revisar firmas/verificación de integridad en logs centralizados. |

## 4. Gaps y acciones priorizadas

1) **Registrar consentimiento**: extender DTO de registro y persistencia para almacenar `consentAccepted` + `consentTimestamp` en `apps/auth-service` y `prisma/schema.prisma`.  
2) **Derecho al olvido**: añadir método `deleteUser` en `apps/user-service/src/application/services/service.ts` y endpoint correspondiente para purga controlada.  
3) **Retención y rotación de logs**: definir política en despliegue de `packages/observability` (TTL, cifrado en tránsito y en reposo).  
4) **Canal de alertas 24x7**: integrar `instrumentation/index.ts` con el proveedor de alertas elegido (PagerDuty, Opsgenie) y documentar RACI en `docs/SECURITY.md`.

## 5. Procedimiento de trazabilidad

1. Toda petición entrante recibe un `trace-id` en [`trace-context.middleware.ts`](../../packages/observability/src/middleware/trace-context.middleware.ts) y se propaga en logs y métricas.  
2. Los eventos de seguridad (auth, rate limit, errores 4xx/5xx) se registran con contexto de usuario/IP en [`security.middleware.ts`](../../apps/auth-service/src/middleware/security.middleware.ts).  
3. Las operaciones CRUD sobre usuarios quedan auditadas mediante DTOs controlados y logs de aplicación (`user-service` + `observability`).  
4. Para auditorías externas, usar los logs estructurados (`simple-logger.ts`) filtrando por `traceId` + `userId`; los artefactos deben conservarse según la política de retención aprobada.
