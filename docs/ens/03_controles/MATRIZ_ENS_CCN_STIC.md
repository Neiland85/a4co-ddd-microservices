# Matriz inicial ENS/CCN-STIC

Matriz preliminar de alineamiento. No equivale a certificación ENS.

| ID | Área ENS | Control lógico | Aplicabilidad | Evidencia actual | Gap | Acción recomendada | Prioridad | Estado |
|---|---|---|---|---|---|---|---|---|
| ENS-001 | Marco organizativo | Alcance del sistema | Alta | `ALCANCE_ENS_READY.md` | Falta alcance formal por cliente | Mantener alcance por entorno y servicio | Alta | Parcial |
| ENS-002 | Marco organizativo | No certificación / claims | Alta | `NO_CERTIFICACION_ENS.md` | Revisar lenguaje comercial final | Añadir one-pager cliente | Alta | Parcial |
| ENS-003 | Marco operacional | Inventario de activos | Alta | `INVENTARIO_ACTIVOS.md` | Falta propietario/responsable | Añadir owners y criticidad final | Alta | Inicial |
| ENS-004 | Marco operacional | Análisis de riesgos | Alta | `ANALISIS_RIESGOS_INICIAL.md` | Falta valoración formal | Completar probabilidad/impacto/tratamiento | Alta | Inicial |
| ENS-005 | Marco operacional | Monitorización de disponibilidad | Alta | Healthchecks 200 OK guardados | Falta integración CI/monitor externo | Automatizar smoke evidence pack | Alta | Parcial |
| ENS-006 | Marco operacional | Registro de actividad | Alta | Logs con traceId/spanId | Falta política de retención/exportación | Crear procedimiento de logs | Alta | Parcial |
| ENS-007 | Marco operacional | Gestión de cambios | Media | Commit `docs(ens): add runtime beta evidence baseline` | Falta plantilla de cambio/release | Crear changelog ENS/evidence pack | Media | Parcial |
| ENS-008 | Medidas de protección | Protección de servicios | Alta | Headers de seguridad en Gateway/Inventory | Falta revisión completa de CORS/proxy | Hardening gateway | Alta | Parcial |
| ENS-009 | Medidas de protección | Persistencia de mensajería | Alta | NATS healthy | JetStream temporal | Añadir volumen persistente | Alta | Pendiente |
| ENS-010 | Medidas de protección | Protección de base de datos | Alta | Postgres healthy | Falta backup/restore/permisos | Crear procedimiento backup y mínimos privilegios | Alta | Pendiente |
| ENS-011 | Medidas de protección | Segregación de servicios | Media | Runtime beta por compose | Auth/Product/Payment fuera de scope | Documentar perfiles beta/preview/full | Media | Parcial |
| ENS-012 | DevSecOps | Evidencias reproducibles | Alta | Carpeta runtime evidence | Falta script único estable | Crear `ens:evidence` | Alta | Parcial |
| ENS-013 | Calidad técnica | Warnings lint | Media | Lint sin errores, con warnings | Deuda TS | Backlog reducción warnings | Media | Pendiente |
| ENS-014 | Operación | Runbook Docker | Alta | Limpieza manual documentada en logs | Falta procedimiento formal | Crear `PROCEDIMIENTO_OPERACION_SEGURA.md` completo | Alta | Pendiente |
| ENS-015 | Comercial | Lenguaje cliente | Alta | Docs base creados | Falta versión vendible | Completar `LENGUAJE_COMERCIAL_SEGURO.md` | Alta | Pendiente |
| ENS-016 | DevSecOps | Gestión de vulnerabilidades de dependencias | Alta | GitHub Dependabot reporta vulnerabilidades | Falta triage formal | Crear plan de remediación critical/high y auditoría reproducible | Alta | Pendiente |
