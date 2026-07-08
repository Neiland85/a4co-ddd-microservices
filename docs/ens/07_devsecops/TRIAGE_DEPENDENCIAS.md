# Triage inicial de dependencias

No implica remediación completa. Es clasificación inicial para ENS-ready.

| ID | Paquete | Severidad | Ruta principal | Entorno | Prioridad | Acción |
|---|---|---:|---|---|---:|---|
| DEP-001 | http-proxy-middleware | High/Moderate | gateway | Runtime beta | Alta | Actualizar a >=3.0.7 y ejecutar tests gateway |
| DEP-002 | multer | High/Moderate | @nestjs/platform-express > multer | Gateway/runtime potencial | Alta | Revisar exposición multipart; actualizar vía Nest/platform-express si procede |
| DEP-003 | form-data | High | axios / firebase-admin chain | Dashboard/notification | Media | Clasificar si entra en runtime; actualizar axios/firebase stack |
| DEP-004 | effect | High | prisma config chain | Notification/prisma | Media | Revisar actualización prisma/config |
| DEP-005 | uuid | Moderate | legal-evidence-service / firebase storage | Evidence/notification | Alta para evidence | Sustituir por crypto.randomUUID o actualizar uuid >=11.1.1 |
| DEP-006 | @opentelemetry/core | Moderate | observability / sentry | Observabilidad | Media | Actualizar paquete observability con tests |
| DEP-007 | postcss | Moderate | dashboard/frontend | Frontend | Media | Actualizar a >=8.5.10 |
| DEP-008 | protobufjs | Moderate | firebase/grpc/testcontainers | Front/dev/infra | Media | Actualizar si no rompe Firebase/tooling |
| DEP-009 | vite | High/Moderate | frontend/vitest/design-system | Dev/frontend | Media | Alinear versiones parcheadas |
| DEP-010 | undici | High/Moderate/Low | testcontainers | Dev/test | Baja/Media | Actualizar testcontainers/undici |
| DEP-011 | minimatch | High | markdownlint-cli | Dev tooling | Baja | Actualizar markdownlint-cli |
| DEP-012 | markdown-it/linkify-it/js-yaml/smol-toml | Moderate/High | markdownlint/Nest CLI/Jest | Dev tooling | Baja | Actualizar tooling sin tocar runtime |
