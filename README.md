# 🧱 a4co-ddd-microservices

Monorepo DDD para microservicios construidos en NestJS + Next.js, diseñado para una plataforma colaborativa de venta y logística del pequeño comercio andaluz. Soporte completo para CI/CD, infraestructura como código, trazabilidad técnica y GitHub Copilot Pro+.

## 🗂️ Estructura del repositorio

a4co-ddd-microservices/
├── apps/ # Microservicios y frontends (ej: auth, web)
├── packages/ # Librerías compartidas (DTOs, config, schemas)
├── infrastructure/ # Terraform, Docker, scripts de infraestructura
├── docs/ # Documentación organizada por categorías
│ ├── architecture/ # Arquitectura DDD, integración APIs
│ ├── deployment/ # CI/CD, Docker, configuración
│ ├── development/ # Guías de desarrollo y testing
│ ├── api/ # Documentación de APIs
│ └── security/ # Seguridad y mejores prácticas
├── .vscode/ # Configuración de entorno y Copilot
├── .github/ # Workflows CI/CD y configuración
├── .gitignore # Ignora outputs, secrets, cache, etc.
├── pnpm-workspace.yaml
└── README.md

### ✨ Características técnicas

- 🧩 Arquitectura basada en **Domain-Driven Design (DDD)**
- ⚙️ Microservicios con **NestJS** y **Prisma ORM**
- 🌐 Frontend con **Next.js 14+**, **Tailwind CSS** y **shadcn/ui**
- 🚢 CI/CD en GitHub Actions con despliegue **blue/green** en **AWS ECS Fargate**
- 🗂️ Monorepo gestionado por **pnpm workspaces**
- 📊 Observabilidad con **OpenTelemetry + Prometheus + Grafana**
- 🧠 Productividad avanzada con **GitHub Copilot Pro+** y prompts personalizados
- 🛡️ Seguridad mínima viable, JWT, HTTPS, rate limiting y validaciones estrictas

#### 🚀 Requisitos

Node.js v18+
pnpm v8+
Docker + Docker Compose
Terraform v1.6+
GitHub Copilot Pro+ (opcional pero recomendado)
VS Code (con extensiones de linter + formateo + pruebas unitarias en .vscode/extensions.json)

🤖 Copilot Pro+ Config

Este repositorio está optimizado para Copilot Pro+ con:
.vscode/copilot-chat.json: reglas de estilo y contexto técnico
copilot-prompts.json: comandos por rol (frontend, backend, devops, QA, revisión)
Dashboard visual (Copilot Prompts) accesible desde VS Code

Prompts incluyen:
✦ prisma-schema, ✦ test-e2e, ✦ generate-adr, ✦ revisar-ui, ✦ deploy-pipeline, etc.

## Prompts recomendados para Copilot

### Frontend

- **✦ frontend-styles**: ¿Cómo implementar un diseño responsive con Tailwind y shadcn/ui?
  - _Descripción_: Guía para diseño responsive usando Tailwind y shadcn/ui.

### Backend

- **✦ backend-dtos**: ¿Cómo estructurar DTOs validados con class-validator en NestJS?
  - _Descripción_: Estructuración de DTOs con validación en NestJS.

### DevOps

- **✦ devops-docker**: ¿Cómo optimizar este Dockerfile para reducir el tamaño de la imagen?
  - _Descripción_: Optimización de Dockerfile para imágenes más pequeñas.

### QA

- **✦ qa-tests**: ¿Cómo escribir pruebas e2e efectivas con Jest y Supertest?
  - _Descripción_: Guía para pruebas e2e usando Jest y Supertest.

### Documentación

- **✦ docs-jsdoc**: ¿Cómo documentar esta función con JSDoc para claridad y mantenimiento?
  - _Descripción_: Documentación de funciones con JSDoc.

##### 📚 Documentación técnica

- **� docs/architecture/**: Arquitectura DDD, integración APIs, análisis técnico
- **📁 docs/deployment/**: CI/CD, Docker, configuración de infraestructura
- **� docs/development/**: Guías de desarrollo, testing, levantamiento del proyecto
- **📁 docs/api/**: Documentación de endpoints y APIs
- **📁 docs/security/**: Seguridad, mejores prácticas, justificaciones

🔧 **Infraestructura**: `infrastructure/terraform/`
🧪 **Testing**: integrado con Jest + Supertest + Playwright
🤖 **Copilot**: prompts personalizados en `.vscode/copilot-chat.json`

####### 📜 Licencia

Apache License 2.0
(c) 2025 - Jesús Sánchez Campos (cliente titular) & Neil Muñoz Lago (autor técnico titular)
