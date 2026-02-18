# FASE 3.3 — Release Gate formal (evaluación mínima)

Fecha: 2026-02-06

## Resultado de ejecución local

- `pnpm -w run build` → **OK** (exit code 0).
- `pnpm -w run test` → **OK** técnicamente (exit code 0), pero todos los servicios críticos se ejecutan con `--passWithNoTests` y reportan `No tests found`.
- `pnpm -w run lint` → **OK** (exit code 0), pero con warnings masivos y con uso de `--fix` en el script raíz/servicios.

## Hallazgos de gate (mínimos, sin cambios funcionales)

1. No existe script `pre-release` en `package.json`.
2. CI actual (`.github/workflows/ci.yml`) solo ejecuta build + test, no ejecuta lint ni un gate de pre-release.
3. Script de test raíz permite verde sin cobertura real (`--passWithNoTests` en cada servicio).
4. Script de lint raíz ejecuta `--fix` en el gate, introduciendo mutación en fase de validación.

## Acciones mínimas propuestas para gate determinista

### CORREGIR

- Incorporar un script `pre-release` explícito y estable (solo verificación, sin efectos laterales) para formalizar la puerta de salida.
- Hacer que CI ejecute también `lint` y `pre-release` como condiciones obligatorias antes de merge.
- Endurecer `test` para que no pase cuando un servicio esperado no tenga tests efectivos.

### ELIMINAR

- Eliminar `--fix` de cualquier comando usado como gate de release/merge.
- Eliminar el patrón de "verde por ausencia de tests" en pipelines de merge.

### CONGELAR

- Congelar alcance: no tocar dominio, casos de uso ni contratos de servicios en esta fase.
- Congelar cambios a seguridad/arquitectura funcional: solo ajustes de pipeline/quality gate.

## Criterio mínimo de merge (todos verdes)

1. `pnpm -w run build`
2. `pnpm -w run test`
3. `pnpm -w run lint`
4. `pnpm -w run pre-release`

Sin esos cuatro checks en verde y ejecutados en CI, no se debe habilitar merge a `main`.
