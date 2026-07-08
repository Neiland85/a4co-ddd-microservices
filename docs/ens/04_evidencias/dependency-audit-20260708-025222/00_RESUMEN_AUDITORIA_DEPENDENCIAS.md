# Auditoría de dependencias ENS-ready

Resultado observado:

- `pnpm audit --prod`: 15 vulnerabilidades.
- Severidad prod: 10 moderate, 5 high.
- `pnpm audit --dev`: 33 vulnerabilidades.
- Severidad dev: 4 low, 15 moderate, 14 high.

Interpretación:

- GitHub Dependabot reporta un volumen agregado superior.
- La auditoría local accionable reduce el alcance inmediato.
- No se debe ejecutar upgrade masivo.
- Se requiere triage por runtime real, entorno y criticidad.

Prioridad inicial:

1. Gateway runtime: `http-proxy-middleware`.
2. Gateway/Nest Express: `multer`.
3. Evidence/legal: `uuid`.
4. Observabilidad: `@opentelemetry/core`.
5. Front/dev tooling: `vite`, `postcss`, `undici`, `minimatch`, `markdown-it`, `linkify-it`, `js-yaml`.
