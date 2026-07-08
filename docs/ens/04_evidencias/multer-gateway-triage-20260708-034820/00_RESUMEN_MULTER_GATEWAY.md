# Triage Multer / Gateway

Motivo:

- `pnpm audit --prod` mantiene alerta de `multer`.
- Ruta detectada: `apps__infrastructure__gateway>@nestjs/platform-express>multer`.
- Vulnerabilidades:
  - DoS via deeply nested field names.
  - DoS via incomplete cleanup of aborted uploads.

Objetivo:

- Confirmar si el gateway expone endpoints multipart/upload.
- Confirmar si `multer` se usa realmente en runtime.
- Evitar actualización bruta de `@nestjs/platform-express` o override de `multer` sin validar compatibilidad.

Criterio:

- Si no hay uso real de upload/multipart en gateway, se documenta exposición transitoria por dependencia de framework.
- Si hay uso real, se prioriza remediación técnica con tests de gateway.
- Cualquier cambio debe ir en rama y con build/test.

## Acción posterior

Se actualiza `@nestjs/platform-express` en gateway para arrastrar `multer` parcheado.

Resultado esperado:

- `@nestjs/platform-express`: 11.1.27.
- `multer`: 2.2.0.
- Sin uso real detectado de endpoints multipart/upload en gateway.
- Gateway tests OK.
- Gateway build OK.
- Alerta `multer` eliminada o reducida en `pnpm audit --prod`.

Nota:

- No se aplica override directo de `multer`.
- No se modifica la arquitectura del gateway.
- No se habilitan endpoints upload.

## Corrección de criterio

La actualización de `@nestjs/platform-express` a `11.1.27` no elimina la alerta, porque esa versión sigue declarando internamente `multer 2.1.1`.

Se aplica override controlado mediante `pnpm.overrides`:

- `multer`: `2.2.0`

Justificación:

- No se detectó uso real de endpoints multipart/upload en gateway.
- El riesgo es transitivo por framework.
- La vía upstream Nest todavía no arrastra `multer 2.2.0`.
- El override queda documentado y validado con tests/build de gateway.

Validación requerida:

- `pnpm why multer` debe mostrar `multer 2.2.0`.
- `pnpm audit --prod` no debe mostrar alerta de `multer`.
- Gateway tests OK.
- Gateway build OK.
