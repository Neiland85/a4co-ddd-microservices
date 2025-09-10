# 📋 Obligaciones de Documentación de Cambios - Proyecto `a4co-ddd-microservices`

Este documento establece el estándar obligatorio para mantener un `CHANGELOG.md` profesional, semántico y alineado con las fases de desarrollo del proyecto.

---

## 🎯 Objetivo

Asegurar la trazabilidad de todos los cambios técnicos realizados en el proyecto, permitiendo:

- Comprensión rápida del estado del sistema por parte de cualquier colaborador
- Auditoría de decisiones técnicas alineadas a ADRs
- Automatización futura de releases y notas de versión

---

## 🧱 Estructura del `CHANGELOG.md`

Cada entrada debe seguir la siguiente estructura por versión:

### Formato de encabezado


```md
## [vX.Y.Z-nombre] - YYYY-MM-DD

```


### Categorías permitidas

- `### ✨ feat:` (features nuevas)
- `### 🔧 fix:` (bugs corregidos)
- `### 📄 chore:` (infraestructura, tooling, limpieza)
- `### 🔥 breaking:` (cambios que rompen compatibilidad)
- `### 📈 docs:` (documentación o planes técnicos)

Cada categoría puede contener una lista de bullets con cambios descriptivos.

---

## 🔁 Flujo de actualización

- Cada merge a `develop` **debe venir con una entrada en `CHANGELOG.md`** en la PR.
- El merge de `develop` a `main` **debe incluir un resumen agrupado** bajo un nuevo tag de versión (`vX.Y.Z`)
- Las entradas deben hacer referencia, cuando sea relevante, a:
  - ID del ADR afectado (`ADR-0012`)
  - ID de PR o commit
  - Nombre de rama si se trata de integraciones específicas

---

## 📂 Ubicación y versionado

- El archivo `CHANGELOG.md` estará ubicado en la raíz del repositorio
- Deberá estar versionado y actualizado en cada PR relevante
- Cambios no significativos podrán agruparse bajo entradas `chore:` si no modifican lógica funcional

---

## 🔐 Revisión

Este documento es obligatorio a partir de la versión `v0.4.0-dev-env` y será revisado junto con el cumplimiento de los ADRs activos.

---

## 💾 Ejemplo


```md
## [v0.4.0-dev-env] - 2025-07-15

### 📄 chore

- Se crea el workspace `a4co-ddd-microservices.code-workspace`
- Se configura `.vscode/settings.json`, `.copilot-chat.json`, `.extensions.json`
- Se elimina workspace anterior y MCPs conflictivos

### 📈 docs

- Publicado `README.md` actualizado con plan técnico (Fase 0 a 10)
- Documentación de entorno Copilot alineado a ADR-0010

```


---

Este archivo debe ser mantenido por el líder técnico o cualquier colaborador que realice integraciones estructurales o evolutivas dentro del proyecto.
