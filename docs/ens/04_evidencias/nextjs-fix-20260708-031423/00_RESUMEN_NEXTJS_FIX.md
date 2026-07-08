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

## Resultado de validación

### `packages/design-system/h-modern-dashboard`

Resultado:

- Build OK con Next.js 15.5.16.

### `apps/dashboard-client`

Resultado:

- Build fallido.
- Error: módulos internos no resueltos:
  - `@dashboard/lib/context/ToastContext`
  - `@dashboard/lib/services`

Interpretación:

- La actualización de Next.js se aplicó correctamente.
- La validación completa queda bloqueada por resolución de imports internos en `dashboard-client`.
- No se debe mergear a `main` hasta resolver o clasificar este fallo.

Estado:

- Fix de Next aplicado en rama.
- Evidencia generada.
- Merge a `main`: bloqueado temporalmente.
