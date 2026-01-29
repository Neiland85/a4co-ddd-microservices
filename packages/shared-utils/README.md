# shared-utils

## Estructura del paquete

- `src/` — Código fuente TypeScript
- `dist/` — Output generado por el build (compilado por TypeScript)
- `package.json` — Exporta desde `dist/index.js` y `dist/index.d.ts`

## Regla de build

- El comando `pnpm build` ejecuta `tsc -p tsconfig.json` y genera todo en `dist/`.
- El comando `pnpm clean` elimina el output previo (`dist/`).
- El source nunca debe mezclarse con el output.
- El entrypoint del paquete es `dist/index.js` (y los types en `dist/index.d.ts`).

## Convención para todos los packages

- Mantener siempre la separación entre source (`src/`) y output (`dist/`).
- No usar `lib/` como output (solo `dist/`).
- No incluir archivos generados en el control de versiones.
- El build debe limpiar el output antes de generar nuevos archivos.

## Ejemplo de uso

```bash
pnpm --filter @a4co/shared-utils build
```

## Auditoría rápida

- Verifica que solo `src/` y `dist/` existan en cada package.
- Confirma que el entrypoint en `package.json` apunte a `dist/index.js`.
- Revisa que no haya archivos generados en `src/`.

---

Actualizado: 2026-01-21
