# Procedimiento de backup y restauración

## Objetivo

Definir una política inicial de backup/restore para preparación ENS-ready.

## Alcance

- PostgreSQL beta.
- Configuración Docker Compose.
- Evidencias `docs/ens`.
- Logs operacionales exportados.
- Configuración relevante no secreta.

## Estado actual

PostgreSQL está validado como healthy en runtime beta incremental.

## Riesgos

- Pérdida de datos.
- Corrupción tras parada no limpia.
- Falta de prueba de restauración.
- Falta de política de retención.
- Falta de separación entre backup local y backup externo.

## Política mínima propuesta

| Elemento | Frecuencia | Retención | Medio |
|---|---:|---:|---|
| PostgreSQL beta | Bajo demanda | Temporal | Local |
| Evidencias ENS | Por hito | Permanente en repo | Git |
| Logs runtime | Por ejecución | Según hito | Carpeta evidence |
| Config no secreta | Por cambio | Git | Repo |

## Producción / cliente enterprise

Para producción se debe definir:

- backup automático;
- cifrado en reposo;
- cifrado en tránsito;
- prueba de restauración;
- retención;
- responsable;
- ubicación;
- control de acceso;
- evidencia de restore test.

## Gaps

- No hay backup automatizado formal.
- No hay restore test documentado.
- No hay política de retención por entorno.
- No hay WORM/offsite definido.
