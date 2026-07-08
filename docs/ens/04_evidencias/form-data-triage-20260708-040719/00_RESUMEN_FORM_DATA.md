# Triage form-data

Motivo:

- `pnpm audit --prod` mantiene dos alertas high de `form-data`.
- Ruta 1: `apps__dashboard-client>axios>form-data`.
- Ruta 2: `apps__infrastructure__notification-service>firebase-admin>@google-cloud/firestore>google-gax>retry-request>@types/request>form-data`.

Objetivo:

- Separar exposición real runtime de dependencia transitiva.
- Revisar si `dashboard-client` usa multipart/form-data realmente.
- Revisar si notification-service usa Firebase/Google Cloud en runtime real.
- Evitar override global de `form-data` sin validar compatibilidad entre ramas 2.x y 4.x.

Criterio:

- Si axios puede actualizarse sin romper build, se prioriza esa vía.
- Si firebase-admin/google-gax arrastra una rama antigua, se trata por paquete upstream o override específico, no global.
- Cualquier cambio debe ir en rama con build/test/audit.
