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
