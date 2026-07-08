# Triage Effect / Prisma

Motivo:

- `pnpm audit --prod` mantiene una alerta high de `effect`.
- Ruta detectada:
  - `apps__infrastructure__notification-service>@prisma/client>prisma>@prisma/config>effect`

Objetivo:

- Confirmar qué versión de Prisma y @prisma/client arrastra `effect`.
- Confirmar si notification-service usa Prisma en runtime real.
- Evitar actualización mayor de Prisma sin validación.
- Evaluar si basta actualización patch/minor o override controlado.

Criterio:

- No actualizar a Prisma 7 sin revisar impacto.
- Priorizar actualización dentro de la misma rama mayor si existe.
- Si no hay versión Prisma 6 parcheada disponible, evaluar override específico de `effect`.
- Cualquier cambio debe ir en rama con build/test/audit.

## Diagnóstico ampliado

La auditoría sigue marcando `effect <3.20.0`.

Hallazgo:

- `@prisma/config 6.18.0` arrastra `effect 3.18.4`.
- `@prisma/config 6.19.0` arrastra `effect 3.18.4`.
- `@prisma/config 6.19.3` arrastra `effect 3.21.0`.

Criterio:

- No se aplica override directo de `effect`.
- No se actualiza a Prisma 7.
- Se prioriza alinear paquetes Prisma 6.x a `6.19.3`.

## Resultado final

Se alinea Prisma dentro de la rama mayor 6.x:

- `prisma`: `6.19.3`
- `@prisma/client`: `6.19.3`
- `@prisma/config`: `6.19.3`
- `effect`: `3.21.0`

Validación realizada:

- `notification-service` build OK.
- `inventory-service` build OK.
- `h-modern-dashboard` build OK.
- Prisma Client generado correctamente en `v6.19.3`.
- `pnpm audit --prod` baja a 8 vulnerabilidades.
- Severidad final prod: 8 moderate, 0 high.
- La alerta high de `effect` desaparece.

Nota:

- No se actualiza a Prisma 7.
- No se aplica override directo de `effect`.
- La remediación se hace alineando dependencias Prisma 6.x.

## Corrección CI posterior

El PR falló en CI porque `pnpm install --frozen-lockfile` detectó desalineación entre `packages/design-system/package.json` y `pnpm-lock.yaml`.

Causa:

- `packages/design-system/package.json` mantenía `@prisma/client` en `7.4.0`.
- `pnpm-lock.yaml` ya resolvía `@prisma/client` en `6.19.3`.

Corrección:

- Se alinea `packages/design-system/package.json` a Prisma 6.19.3.
- Se mantiene el criterio de no migrar a Prisma 7.
- Se valida instalación con `pnpm install --frozen-lockfile`.

Resultado esperado:

- Beta Runtime Quality Gate deja de fallar en instalación.
- Snyk deja de ver manifiesto/lockfile inconsistente.

## Corrección CI posterior

El PR falló en CI porque quedaban manifests activos desalineados con el lockfile.

Hallazgo:

- Algunos `package.json` seguían declarando Prisma o @prisma/client en versiones antiguas o 7.x.
- El lockfile ya resolvía Prisma 6.19.3.
- `pnpm install --frozen-lockfile` y Snyk pueden fallar cuando manifest y lockfile no coinciden.

Corrección:

- Se alinean todos los manifests activos bajo `apps` y `packages`.
- Se fijan paquetes Prisma relacionados a `6.19.3`:
  - `prisma`
  - `@prisma/client`
  - `@prisma/adapter-pg`
- Se mantiene el criterio de no migrar a Prisma 7.

Validación:

- `pnpm install --frozen-lockfile` OK.
- `build:preview` validado.
- `notification-service` build validado.
- `h-modern-dashboard` build validado.
- `pnpm audit --prod` mantiene 0 high si `effect` no aparece.

## Corrección CI posterior

El PR falló en CI porque quedaban manifests activos desalineados con el lockfile.

Hallazgo:

- Algunos `package.json` seguían declarando Prisma o @prisma/client en versiones antiguas o 7.x.
- El lockfile ya resolvía Prisma 6.19.3.
- `pnpm install --frozen-lockfile` y Snyk pueden fallar cuando manifest y lockfile no coinciden.

Corrección:

- Se alinean todos los manifests activos bajo `apps` y `packages`.
- Se fijan paquetes Prisma relacionados a `6.19.3`:
  - `prisma`
  - `@prisma/client`
  - `@prisma/adapter-pg`
- Se mantiene el criterio de no migrar a Prisma 7.

Validación:

- `pnpm install --frozen-lockfile` OK.
- `build:preview` validado.
- `notification-service` build validado.
- `h-modern-dashboard` build validado.
- `pnpm audit --prod` mantiene 0 high si `effect` no aparece.
