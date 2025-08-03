# 🔧 Fix Snyk Import Error - pnpm vs yarn.lock

## ❌ **Error**: "Missing required yarn.lock"

**Problema**: Snyk detecta tu proyecto como Yarn pero usas `pnpm`

## 🎯 **Soluciones**

### **Opción 1: Target Específico (Recomendado)**

En lugar de `/package.json`, usa:

```
Target: /pnpm-lock.yaml
```

**O si eso no funciona:**

```
Target: /package.json,pnpm-lock.yaml
```

### **Opción 2: Verificar Estructura**

Snyk busca estos archivos en orden:
1. `yarn.lock` ❌ (no tienes)
2. `package-lock.json` ❌ (no tienes) 
3. `pnpm-lock.yaml` ✅ (tienes este)

### **Opción 3: Configuración Manual**

En Snyk Settings:

```
Repository: Neiland85/a4co-ddd-microservices
Target: /
Package manager: pnpm
Manifest file: package.json
Lock file: pnpm-lock.yaml
```

---

## 🔧 **Configuración Correcta para pnpm**

### **Target Principal:**
```
Repository: Neiland85/a4co-ddd-microservices
Target: /pnpm-lock.yaml
```

### **Targets Adicionales:**
```
/apps/dashboard-web/package.json
/packages/shared-utils/package.json
```

### **Exclude Folders:** (mismo que antes)
```
fixtures, tests, __tests__, test, __test__, ci, node_modules, bower_components, .next, dist, coverage, .turbo, docs, media, .git, .github, .storybook, prisma/migrations, test-results, playwright-report
```

---

## 🚀 **Alternativa: CLI Configuration**

Si la UI no funciona, configura via CLI:

```bash
# Con SNYK_TOKEN configurado en CI
snyk monitor --file=package.json --package-manager=pnpm
snyk monitor --file=apps/dashboard-web/package.json --package-manager=pnpm
```

---

## 🧪 **Verificación**

Tu proyecto debería tener:
- ✅ `package.json` (root)
- ✅ `pnpm-lock.yaml` (root)
- ✅ `pnpm-workspace.yaml` (root)
- ❌ `yarn.lock` (no debe existir)
- ❌ `package-lock.json` (no debe existir)

---

## 💡 **Si sigue fallando**

### **Opción A: Forzar detección**
```
Target: /package.json
Force package manager: pnpm
```

### **Opción B: Usar solo CI/CD**
Skip la configuración web y deja que el pipeline CI/CD maneje Snyk:

```yaml
# En security.yml ya está configurado:
- name: 🛡️ Run Snyk vulnerability scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

**🛡️ ¡Usa `/pnpm-lock.yaml` como target principal para proyectos pnpm!**