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

## Resultado final

Se aplica override selectivo por rama mayor:

- `form-data@4`: `4.0.6`
- `form-data@2`: `2.5.6`

Validación realizada:

- `dashboard-client` build OK con entorno limpio (`env -u NODE_ENV`) y `.next` eliminado.
- `@a4co/observability` build OK.
- `notification-service` build OK.
- `pnpm audit --prod` baja a 9 vulnerabilidades.
- Severidad final prod: 8 moderate, 1 high.
- Las alertas high de `form-data` desaparecen de `pnpm audit --prod`.

Nota:

- El fallo inicial de dashboard-client estaba relacionado con entorno/caché de build, no con el override de `form-data`.
- No se aplica override global.
- Se respetan ramas mayores 2.x y 4.x.
