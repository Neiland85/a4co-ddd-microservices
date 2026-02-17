# FASE 3 — Release Gate Audit (determinismo y reproducibilidad)

Fecha: 2026-02-06

## Veredicto

**NO PASS**

## Bloqueantes mínimos (máx. 5)

1. **No existe `pre-release` en root** (`package.json`): el gate formal no está definido como comando único exigible.
2. **CI incompleta** (`.github/workflows/ci.yml`): ejecuta `build` y `test`, pero no ejecuta `lint` ni `pre-release`.
3. **Falso verde en tests**: los servicios del gate usan `--passWithNoTests`, por lo que puede aprobar sin pruebas reales.
4. **Lint no puro (check-only)**: hay `lint` con `--fix` en servicios incluidos en el gate, por lo que la validación muta código.
5. **Ejecución de test raíz por lista manual** (`--filter` encadenado, sin `pnpm -r`): riesgo de deriva del scope auditado frente al workspace real.

## Auditoría solicitada

### 1) `pnpm-workspace.yaml` (unicidad)

- El workspace define inclusiones/exclusiones explícitas (incluye `apps/services/*`, `apps/infrastructure/*`, `packages/**` y excluye rutas legacy/frozen).
- Validación de unicidad en workspace resuelto: **23 proyectos, 0 nombres duplicados**.

### 2) Scripts raíz `build / test / lint / pre-release`

- `build`: existe.
- `test`: existe.
- `lint`: existe.
- `pre-release`: **no existe**.

### 3) Uso indebido de `--fix` / `--passWithNoTests` en gates

- `--passWithNoTests`: presente en servicios del gate de test.
- `--fix`: presente en servicios del gate de lint.

### 4) CI readiness (sin depender de Docker local)

- Estado actual de CI: gate parcial (`build` + `test`).
- Falta de ejecución en CI de `lint` y `pre-release` impide considerar el gate reproducible de release.
