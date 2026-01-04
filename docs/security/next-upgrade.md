# Post-Security Upgrade Verification

Guía rápida para validar que los upgrades de seguridad (Next.js 15.5.9 y `qs` >= 6.14.1) no rompen el build ni regresan a versiones vulnerables.

## Checklist de verificación

1. **Instalación limpia**
   - Ejecuta `pnpm install` (usa `corepack pnpm` si no está disponible).
2. **Validación de versiones**
   - `pnpm why next` debe mostrar `15.5.9`.
   - `pnpm why qs` debe mostrar `6.14.1` o superior (forzado por override).
3. **Builds**
   - `NEXT_FONT_DISABLE_HOSTED_DOWNLOADS=1 pnpm --filter dashboard-client build`
   - `NEXT_FONT_DISABLE_HOSTED_DOWNLOADS=1 pnpm --filter @a4co/v0-modern-dashboard build`
4. **Tests rápidos**
   - `pnpm --filter dashboard-client test --if-present`
   - `pnpm --filter @a4co/v0-modern-dashboard test --if-present`
5. **Revisión de logs**
   - Asegura que los pasos anteriores no muestren errores de importación, SSR o tipado.

## Flujo en CI (security-verification)

El job temporal `security-verification` en `.github/workflows/ci.yml` automatiza:

- Instalación con pnpm
- Validación de versiones de Next.js y `qs`
- Build de `dashboard-client` y `h-modern-dashboard` con descargas de fuentes deshabilitadas
- Tests rápidos (optativos si existen scripts)

Los logs del job muestran claramente los resultados de cada paso.

## 🛡️ Prevención Futura: Protección de versiones sensibles

Se añadió el workflow `.github/workflows/lint-version.yml` que falla el pipeline si detecta regresiones en `package.json` o `pnpm-lock.yaml`:

- next >= 15.5.9
- qs >= 6.14.1

Mensaje de error en caso de regresión:

```
🚨 Seguridad: Se detectó una regresión de versión en 'next' o 'qs'.
Por favor, mantén la versión mínima segura:
- next >= 15.5.9
- qs >= 6.14.1
```
