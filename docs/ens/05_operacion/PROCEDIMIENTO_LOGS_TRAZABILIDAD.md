# Procedimiento de logs y trazabilidad

## Objetivo

Definir cómo se capturan, conservan y revisan logs operacionales para preparación ENS-ready.

## Evidencia actual

El runtime beta genera logs con:

- `traceId`;
- `spanId`;
- método HTTP;
- URL;
- estado HTTP;
- tiempo de respuesta;
- servicio;
- entorno.

## Servicios cubiertos

- API Gateway.
- Order Service.
- Inventory Service.
- NATS.
- PostgreSQL.

## Política mínima

1. Cada request relevante debe tener identificador de traza.
2. Los errores deben conservar contexto suficiente.
3. Los logs de healthcheck deben poder separarse de tráfico funcional.
4. Las evidencias de runtime deben guardarse por timestamp.
5. Los logs no deben contener secretos, tokens ni claves privadas.
6. Para entorno productivo debe definirse retención mínima.
7. Para cliente enterprise debe integrarse con SIEM/SOC si se exige.

## Gaps

- Falta política formal de retención.
- Falta exportación estructurada centralizada.
- Falta clasificación de eventos críticos.
- Falta proceso de revisión periódica.
- Falta alerta por fallo de servicio.

## Acciones recomendadas

- Crear formato estándar JSON.
- Definir niveles: debug, info, warn, error, critical.
- Añadir redacción de secretos.
- Crear evidence pack automático.
- Preparar integración futura con SIEM.
