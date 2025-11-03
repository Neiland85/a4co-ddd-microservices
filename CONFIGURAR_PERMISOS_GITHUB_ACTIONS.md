# 🔧 Configurar Permisos de GitHub Actions

Este documento explica cómo configurar los permisos de GitHub Actions para resolver el error `startup_failure` en los workflows.

---

## ⚠️ Problema

Los workflows de CI/CD fallan con el error:

```
The action pnpm/action-setup@v4 is not allowed because all actions must be from
a repository owned by Neiland85, created by GitHub, or verified in the GitHub Marketplace.
```

**Causa:** Restricciones de seguridad en el repositorio limitan qué acciones se pueden usar.

---

## ✅ Solución: Configurar Permisos

### Método 1: A través de GitHub Web UI (Recomendado)

1. **Abre el repositorio en GitHub:**

   ```
   https://github.com/Neiland85/a4co-ddd-microservices
   ```

2. **Ve a Settings > Actions > General:**

   ```
   https://github.com/Neiland85/a4co-ddd-microservices/settings/actions
   ```

3. **En la sección "Actions permissions":**
   - Selecciona **"Allow all actions and reusable workflows"**
   - Esto permitirá usar cualquier acción pública de GitHub Marketplace

4. **Opción alternativa (más restrictiva):**
   - Selecciona **"Allow local actions and reusable workflows"**
   - Agrega excepciones para acciones específicas:
     - `pnpm/action-setup`
     - `docker/*`
     - `actions/*`

5. **Guarda los cambios**

### Método 2: Usando GitHub CLI

Si tienes permisos de administrador:

```bash
# Ver permisos actuales
gh api repos/Neiland85/a4co-ddd-microservices/actions/permissions/workflow

# Configurar permisos (requiere permisos de admin)
gh api repos/Neiland85/a4co-ddd-microservices/actions/permissions/workflow \
  -X PUT \
  -f default_workflow_permissions=write \
  -f can_approve_pull_request_reviews=true
```

Nota: Este método puede no funcionar si el repositorio tiene restricciones organizacionales.

### Método 3: Configuración por archivo `.github/actions.yml`

Crea el archivo `.github/actions.yml` con configuración de organización:

```yaml
# Este archivo está en la organización, no en el repo individual
```

---

## 🔍 Verificar Configuración

Después de configurar los permisos:

1. **Hacer un nuevo push:**

   ```bash
   git commit --allow-empty -m "test: verify GitHub Actions permissions"
   git push origin main
   ```

2. **Verificar el workflow:**

   ```
   https://github.com/Neiland85/a4co-ddd-microservices/actions
   ```

3. **El workflow debería ejecutarse sin `startup_failure`**

---

## 🎯 Estructura de Permisos

### Permisos Principales

| Permiso | Descripción                    |
| ------- | ------------------------------ |
| `read`  | Leer repositorio, issues, PRs  |
| `write` | Crear/modificar código, issues |
| `admin` | Configuración del repositorio  |

### Acciones Permitidas

Con `Allow all actions` se permiten:

- ✅ `actions/checkout` (de GitHub)
- ✅ `pnpm/action-setup` (de terceros)
- ✅ `docker/*` (de Docker)
- ✅ Cualquier acción de GitHub Marketplace

---

## 🛠️ Troubleshooting

### No se pueden cambiar permisos

**Sintomas:**

- No puedes seleccionar "Allow all actions"
- Menú deshabilitado

**Solución:**

- El repositorio puede estar bajo una organización con políticas estrictas
- Contacta al administrador de la organización
- Se requieren permisos de `admin` o de la organización

### Workflow sigue fallando después de configurar

**Sintomas:**

- Permisos configurados pero workflow sigue con errores

**Posibles causas:**

1. Cache de GitHub Actions - espera unos minutos
2. Error en el workflow mismo (revisar logs)
3. Otro tipo de restricción (secrets, variables)

**Solución:**

```bash
# Hacer push nuevamente para disparar workflow
git commit --allow-empty -m "retrigger workflow"
git push origin main
```

---

## 📝 Alternativa: Workflow Simplificado

Si no puedes configurar permisos, puedes simplificar el workflow para usar solo acciones nativas:

```yaml
# En lugar de usar pnpm/action-setup
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'

# Instalar pnpm manualmente
- run: npm install -g pnpm@10.14.0

# Instalar dependencias
- run: pnpm install --frozen-lockfile
```

Esto ya está configurado en el workflow actual.

---

## ✅ Checklist de Configuración

- [ ] Ir a Settings > Actions > General
- [ ] Cambiar "Actions permissions" a "Allow all actions"
- [ ] Guardar cambios
- [ ] Hacer push para disparar workflow
- [ ] Verificar que el workflow se ejecuta correctamente

---

## 🔗 URLs Rápidas

- **Settings:** https://github.com/Neiland85/a4co-ddd-microservices/settings
- **Actions Settings:** https://github.com/Neiland85/a4co-ddd-microservices/settings/actions
- **Actions:** https://github.com/Neiland85/a4co-ddd-microservices/actions

---

## 💡 Nota Importante

Configurar "Allow all actions" es **seguro** cuando:

- Solo usas acciones de repositorios confiables
- Revisas los workflows antes de hacer merge
- Usas Dependabot para actualizar acciones

El workflow ya está configurado para usar versiones pinneadas de las acciones, lo que agrega una capa extra de seguridad.

---

**¡Después de configurar los permisos, los workflows deberían funcionar correctamente!**

---

_Generado automáticamente_
