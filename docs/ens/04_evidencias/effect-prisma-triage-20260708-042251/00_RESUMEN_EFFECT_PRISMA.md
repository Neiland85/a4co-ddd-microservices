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
