# Snyk failure - user-service Prisma

Snyk PR Check falla en:

- `apps/services/user-service/package.json`

Issues nuevas detectadas:

- `effect` race condition.
- `defu` prototype pollution.

Ruta indicada por Snyk:

- `@prisma/client@6.19.0`

Criterio de corrección:

- Alinear `user-service` a Prisma 6.19.3.
- No actualizar a Prisma 7.
- No aplicar override directo de `effect` ni `defu` salvo que siga fallando tras alinear Prisma.
