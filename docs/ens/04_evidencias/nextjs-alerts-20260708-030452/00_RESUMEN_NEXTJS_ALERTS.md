# Evidencia de alertas Next.js

Objetivo:

- Identificar qué paquetes declaran `next`.
- Identificar qué lockfiles contienen referencias a `next`.
- Separar aplicaciones Next reales de lockfiles obsoletos o duplicados.
- Evitar actualización masiva sin confirmar alcance real.

Criterio:

- Si un `package.json` declara `next`, se analiza como aplicación o paquete Next real.
- Si solo aparece en un lockfile dentro de un servicio backend, se revisa si ese lockfile es obsoleto.
- No se elimina ningún lockfile sin validar si forma parte del workspace activo.
