# 🤖 Instrucciones para GitHub Copilot Review – Proyecto `a4co-ddd-microservices`

Estas instrucciones definen el estilo, las convenciones y los criterios técnicos que Copilot debe aplicar al revisar
automáticamente un Pull Request.

---

## 🧠 Estilo general

- Usa siempre **TypeScript estricto** (`strict: true`)
- No se permite el uso de `any`
- Todos los DTOs deben tener validaciones con `class-validator`
- Toda función debe tener **JSDoc si no está documentada por contexto**
- Prohibido usar `console.log` o código comentado obsoleto

---

## 🧱 Backend – NestJS

- La estructura debe respetar el patrón modular de NestJS
- Los DTOs deben estar en archivos separados, documentados y validados
- Cada handler debe seguir el **principio SRP** (responsabilidad única)
- El ORM oficial es **Prisma** (nunca sugerir TypeORM) — ver [ADR-0003](./adr/adr-0003-prisma.md)
- Los servicios deben estar desacoplados, inyectados por constructor y ser testeables

---

## 🌐 Frontend – Next.js + Tailwind + shadcn/ui

- Debe usarse `shadcn/ui` para la UI (no usar Material UI, Chakra, etc.)
- Las vistas deben ser accesibles: uso correcto de ARIA, `alt`, roles semánticos
- Todos los componentes deben estar escritos en TSX con tipado fuerte
- Los hooks deben estar desacoplados de los componentes
- Aplicar lazy-loading (`dynamic()`), loading states y SSR/ISR correctamente

---

## 🔒 Seguridad

- Todos los endpoints deben tener guards o middleware apropiado
- No se permiten endpoints públicos sin justificación
- JWT debe tener expiración y usar firma segura (ej: HS256)
- Validar inputs estrictamente: no confiar en el frontend

---

## ⚙️ DevOps

- Los workflows deben tener `lint`, `test`, `build` y `deploy` como etapas separadas
- Usar `matrix.strategy` por microservicio donde aplique
- Dockerfiles deben ser multi-stage con imágenes mínimas (ej: `node:18-alpine`)
- Los `.env.example` deben reflejar todas las variables utilizadas en CI y local

---

## 🧪 Testing

- Todo servicio debe tener al menos un test unitario (`Jest`)
- Los endpoints deben estar cubiertos por `Supertest` (e2e)
- Las vistas deben tener tests con `Playwright` y validaciones de accesibilidad
- Los tests deben ejecutarse en CI, y fallar si la cobertura baja de 90%

---

## 🧩 Trazabilidad y ética IA

- Las funciones o bloques sugeridos por Copilot deben incluir referencia:

  ```ts
  // prompt: ✦ prisma-schema
  // ADR: 0003-prisma – relación Producto-Categoría
  ```
