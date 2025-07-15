# 📦 Requisitos técnicos y dependencias clave — `a4co-ddd-microservices`

Este documento define las herramientas mínimas necesarias para trabajar con este monorepo y las versiones recomendadas para evitar conflictos.

---

## 🧱 Requisitos globales

| Herramienta       | Versión recomendada | Motivo                                |
|-------------------|---------------------|----------------------------------------|
| Node.js           | >= 18.x             | Compatibilidad con Next.js + Prisma   |
| pnpm              | >= 8.x              | Monorepo eficiente y reproducible      |
| Docker            | >= 24.x             | Infraestructura local + despliegue CI  |
| Docker Compose    | >= 2.x              | Orquestación local de servicios        |
| Terraform         | >= 1.6.x            | Infraestructura como código (IaC)      |
| GitHub CLI        | opcional            | Autenticación + CI/CD + scripts        |
| VS Code           | >= 1.85              | IDE principal + integración Copilot    |

---

## 🔧 Extensiones VS Code recomendadas

Estas se encuentran también en `.vscode/extensions.json`:

- GitHub Copilot
- Tailwind CSS IntelliSense
- Prisma
- ESLint
- Prettier
- Docker
- YAML
- Terraform
- Playwright Test for VS Code

---

## 📦 Dependencias de proyecto por stack

### Backend (NestJS Microservices)

- `@nestjs/core` `^10.x`
- `@nestjs/config`
- `@nestjs/swagger` + `swagger-ui-express`
- `@prisma/client` `^5.x`
- `class-validator`, `class-transformer`
- `bcryptjs`, `jsonwebtoken`
- `cache-manager`, `redis`

### Frontend (Next.js)

- `next` `^14.x`
- `react` `^18.2`
- `tailwindcss` `^3.4`
- `shadcn/ui` (vía `@radix-ui` y `@tailwind-variants`)
- `@tanstack/react-query`
- `zustand`, `react-hook-form`

### DevOps / Infraestructura

- `Terraform` con módulos para AWS (ECS, ECR, RDS, Redis, VPC)
- `Dockerfile` multi-stage por microservicio
- `GitHub Actions` workflows:
  - `lint`, `test`, `build`, `deploy`, `plan-terraform`, `run-e2e`

---

## 🤖 Copilot Pro+ integración

- `copilot-prompts.json`: Prompts por rol técnico
- `.vscode/copilot-chat.json`: Estilo de generación (TS estricto, DTOs, JSDoc)
- `copilot-dashboard`: Panel visual de prompts Copilot

---

## 🧪 Testing

- `Jest` + `Supertest` (unitarios e integración)
- `Playwright` (end-to-end y UI)
- `eslint`, `prettier` (linting y estilo)

---

## 📝 Notas

- No se permite el uso de `npm` o `yarn` en este repositorio.
- Todas las instalaciones deben hacerse con `pnpm install`.
- Si usas GitHub Codespaces, activa el `devcontainer.json` (por configurar).

