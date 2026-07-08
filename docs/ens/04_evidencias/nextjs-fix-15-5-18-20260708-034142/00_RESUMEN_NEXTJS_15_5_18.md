# Fix follow-up Next.js 15.5.18

Motivo:

- `pnpm audit --prod` detecta nueva advisory de Next.js.
- Advisory: Middleware / Proxy bypass in App Router applications via segment-prefetch routes - Incomplete Fix Follow-Up.
- Versiones afectadas en rama 15: `>=15.2.0 <15.5.18`.
- Versión aplicada: `15.5.18`.

Paquetes actualizados:

- `apps/dashboard-client`
- `packages/design-system/h-modern-dashboard`

Validación:

- `dashboard-client` build OK.
- `h-modern-dashboard` build OK.
- Auditoría post-fix guardada.

Nota:

- No se eliminan lockfiles.
- No se actualiza a Next 16.
- No se modifica `main` directamente.
