# PR #393 Merge Playbook (Phase 1: saga contracts + green monorepo build)

Este playbook está pensado para resolver el PR
`feature/phase1-saga-integration -> main`
sin perder los hardenings recientes de CI/security.

## Objetivo

Cerrar los conflictos del PR #393 manteniendo:

1. Build estable del monorepo.
2. Contratos saga/inventory de la rama feature.
3. Gate de seguridad/Next.js y lockfile guard ya incorporados en `main`.

## Conflictos reportados

- `.github/workflows/ci.yml`
- `apps/infrastructure/gateway/tsconfig.build.json`
- `apps/infrastructure/gateway/tsconfig.json`
- `docs/cspell-dictionary.md`
- `package.json`

---

## Orden recomendado de resolución

### 1) CI primero (`.github/workflows/ci.yml`)

**Regla de oro:** conservar la versión de `main`
para seguridad y lockfile integrity,
luego re-aplicar solo lo necesario del PR #393.

Mantener obligatoriamente:

- `Verify lockfile unchanged after install`.
- Advisory policy que bloquea `next` y `critical`.
- Upload de artifacts con `if: always()`.

Si la rama #393 trae cambios de build gate, integrarlos **sin quitar** los 3 puntos anteriores.

### 2) `package.json`

Resolver scripts y dependencias en esta prioridad:

1. Scripts de build/test/lint que ya funcionan en `main`.
2. Aportes de #393 para “green monorepo build” si no rompen lo anterior.
3. Mantener consistencia con `pnpm-lock.yaml` (sin drift).

### 3) Gateway tsconfig (`tsconfig.json` y `tsconfig.build.json`)

Aplicar estrategia “strict + deterministic build”:

- Conservar ajustes de salida/build determinista si vienen de #393.
- Conservar strictness y rutas efectivas de `main`.
- Verificar que `nest build` genere `dist` esperado sin incluir tests.

### 4) `docs/cspell-dictionary.md`

No mezclar manualmente bloques grandes.

Procedimiento seguro:

1. Resolver conflicto tomando versión limpia (sin markers).
2. Ejecutar `pnpm run update:dicts` una sola vez al final.
3. Verificar que no quede dirty después de commit/hook.

---

## Comandos sugeridos (flujo local)

```bash
# desde feature/phase1-saga-integration

git fetch origin
git checkout feature/phase1-saga-integration
git merge origin/main

# resolver archivos en el orden del playbook

pnpm install --frozen-lockfile
pnpm -w run build
pnpm -w run test
pnpm -w run lint
pnpm audit --prod --json > audit-prod.json || true

# validar lockfile estable
git diff -- pnpm-lock.yaml
```

---

## Criterio de “merge listo” para PR #393

- Sin conflictos pendientes.
- `pnpm-lock.yaml` estable tras install.
- CI de build en verde.
- Sin advisories `next` ni `critical` en policy de seguridad.
- `docs/cspell-dictionary.md` sin ruido de conflicto y sin churn inesperado.

## Nota de integración

Si al resolver `ci.yml` hay dudas entre versión de `main`
y de `feature`, priorizar la de `main`
y reintroducir solo lo imprescindible de #393.
Esto reduce riesgo de regresión en security gates.
