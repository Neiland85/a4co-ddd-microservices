# Uso de Shortcuts y Dashboard de Copilot

## 📋 Introducción

Este proyecto incluye una colección de shortcuts personalizados para GitHub Copilot, organizados por roles técnicos.
Además, se ha implementado un dashboard interactivo para visualizar y copiar estos comandos desde una interfaz web.

---

## 🚀 Shortcuts en VS Code

### 📁 Configuración de snippets

1. Abre VS Code → `Cmd + Shift + P` → “Preferences: Configure User Snippets”.
2. Selecciona o crea `copilot-shortcuts.code-snippets`.
3. Copia el contenido del archivo `.vscode/copilot-shortcuts.code-snippets` en el editor de snippets.

### 🧠 Uso de los shortcuts

- Escribe el prefijo del shortcut (por ejemplo, `✦ revisar-ui`) en el editor.
- GitHub Copilot sugerirá el prompt correspondiente.

---

## 💬 Dashboard Interactivo

### 📁 Ubicación del archivo

El dashboard está implementado en el archivo `src/components/CopilotDashboard.jsx`.

### 🖥️ Cómo usar el dashboard

1. Ejecuta el proyecto y accede al dashboard desde la interfaz web.
2. Usa el buscador para encontrar comandos por nombre o prefijo.
3. Filtra los comandos por rol técnico (frontend, backend, DevOps, QA, revisión).
4. Haz clic en “Copiar comando” para copiar el prompt al portapapeles.

---

## 🛠️ Roles y Comandos

### 🎨 Frontend

- `✦ revisar-ui`: Mejora accesibilidad y estructura semántica.
- `✦ hook-api`: Optimización de data-fetching y caching.
- `✦ lazy-component`: Reducción de bundle y mejora UX.
- `✦ animate-tailwind`: Transiciones modernas y fluidas.

### 🧠 Backend

- `✦ dto-clean`: Limpieza y validación tipada.
- `✦ handler-srp`: Diseño por responsabilidades.
- `✦ prisma-schema`: Buen modelado y escalabilidad.
- `✦ secure-endpoint`: Seguridad y control de acceso.

### ⚙️ DevOps

- `✦ deploy-pipeline`: Automatización continua.
- `✦ tf-module-doc`: Infraestructura documentada.
- `✦ docker-health`: Resiliencia en despliegues.
- `✦ ecs-scale-check`: Escalabilidad dinámica.

### 🧪 QA

- `✦ test-unit`: Cobertura y confianza.
- `✦ test-e2e`: Validación completa de flujo.
- `✦ test-ui`: Tests accesibles y visuales.
- `✦ test-coverage-check`: Mejora de cobertura total.

### 🧠 Revisión y Documentación

- `✦ refactor-mejorar`: Limpieza de código.
- `✦ revisar-errores`: Auditoría estática proactiva.
- `✦ doc-export`: Wiki técnica precisa.
- `✦ generar-adr`: Documentación de decisiones.

---

## 📎 Referencias

- [Documentación oficial de GitHub Copilot](https://github.com/features/copilot)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de React Query](https://tanstack.com/query/v4)
- [Documentación de NestJS](https://nestjs.com/)
