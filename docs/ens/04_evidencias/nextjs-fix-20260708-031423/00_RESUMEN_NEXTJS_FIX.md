# Fix controlado de Next.js

Cambio aplicado:

- Actualización de `next` en aplicaciones reales detectadas.
- Objetivo: parchear alerta SSRF/WebSocket upgrades en Next.js.
- Versión objetivo: 15.5.16.
- No se eliminan lockfiles obsoletos en este hito.
- No se modifica `main` directamente.

Paquetes afectados:

- `apps/dashboard-client`
- `packages/design-system/h-modern-dashboard`

Validación esperada:

- Build de dashboard-client.
- Build de h-modern-dashboard.
- Auditoría pnpm post-fix.
