# 🛡️ Configuración de Proyecto Snyk - Monorepo DDD

## 🎯 **Objetivo**: Configurar Snyk para analizar correctamente tu monorepo

## 📋 **Configuración Recomendada**

### **Repository**: `Neiland85/a4co-ddd-microservices` ✅

### **🔧 Custom File Locations (Targets)**

Para tu monorepo DDD, necesitas configurar múltiples targets:

#### **Target 1: Root Package**
```
Target: /package.json
```

#### **Target 2: Dashboard Web App**
```
Target: /apps/dashboard-web/package.json
```

#### **Target 3: Web App** (si existe)
```
Target: /apps/web/package.json
```

#### **Target 4: Shared Packages**
```
Target: /packages/shared-utils/package.json
```

#### **Target 5: Auth Service**
```
Target: /apps/auth-service/package.json
```

#### **Target 6: Otros servicios principales** (opcional)
```
Target: /apps/payment-service/package.json
Target: /apps/user-service/package.json
Target: /apps/product-service/package.json
```

---

## 🚫 **Exclude Folders (Recomendado)**

### **Configuración Optimizada:**
```
fixtures, tests, __tests__, test, __test__, ci, node_modules, bower_components, .next, dist, coverage, .turbo, docs, media, .git, .github, .storybook, prisma/migrations, test-results, playwright-report
```

### **Explicación de Exclusiones:**

#### **Testing & Build:**
- `tests, __tests__, test, __test__` - Directorios de tests
- `fixtures` - Datos de prueba
- `coverage` - Reportes de cobertura
- `test-results, playwright-report` - Resultados de E2E

#### **Dependencies & Build:**
- `node_modules, bower_components` - Dependencias
- `.next, dist` - Build outputs
- `.turbo` - Cache de Turbo

#### **Documentation & Media:**
- `docs, media` - Documentación y assets
- `.storybook` - Storybook config

#### **Git & CI:**
- `.git, .github` - Control de versiones y CI
- `ci` - Scripts de CI

#### **Database:**
- `prisma/migrations` - Migraciones de DB (opcional)

---

## 🎯 **Configuración Paso a Paso**

### **1. Agregar Target Principal**
```
Repository: Neiland85/a4co-ddd-microservices
Target: /package.json
```

### **2. Configurar Exclusiones**
```
Exclude folders:
fixtures, tests, __tests__, test, __test__, ci, node_modules, bower_components, .next, dist, coverage, .turbo, docs, media, .git, .github, .storybook, prisma/migrations, test-results, playwright-report
```

### **3. Agregar Targets Adicionales**

Para cada aplicación importante, repetir el proceso:

#### **Dashboard Web:**
```
Repository: Neiland85/a4co-ddd-microservices  
Target: /apps/dashboard-web/package.json
Exclude folders: [misma configuración de arriba]
```

#### **Shared Utils:**
```
Repository: Neiland85/a4co-ddd-microservices
Target: /packages/shared-utils/package.json  
Exclude folders: [misma configuración de arriba]
```

---

## 🔧 **Configuración Avanzada (Opcional)**

### **Si quieres análisis más granular:**

#### **Solo aplicaciones principales:**
```
/package.json
/apps/dashboard-web/package.json
/apps/web/package.json (si existe)
/packages/shared-utils/package.json
```

#### **Todos los servicios:**
```
/package.json
/apps/*/package.json (configurar uno por uno)
/packages/*/package.json
```

---

## 📊 **Verificación de Configuración**

### **Una vez configurado, Snyk debería:**

1. ✅ **Analizar** todas las dependencias principales
2. ✅ **Ignorar** carpetas de testing y build
3. ✅ **Detectar** vulnerabilidades en cada app
4. ✅ **Evitar** falsos positivos de test files

### **En el dashboard verás:**
```
📦 a4co-ddd-microservices (root)
📦 a4co-ddd-microservices (dashboard-web)
📦 a4co-ddd-microservices (shared-utils)
📦 a4co-ddd-microservices (otros targets)
```

---

## 🚀 **Integración con CI/CD**

Una vez configurado Snyk web, tu pipeline CI/CD usará automáticamente:

### **En `security.yml`:**
```yaml
- name: 🛡️ Run Snyk vulnerability scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=medium
```

### **Beneficios:**
- ✅ **Análisis automático** en cada push
- ✅ **Reportes** en GitHub Security tab
- ✅ **Alertas** de nuevas vulnerabilidades
- ✅ **Integración** perfecta con monorepo

---

## 💡 **Tips y Best Practices**

### **🎯 Targets Prioritarios:**
1. **Root** (`/package.json`) - Dependencias globales
2. **Dashboard** (`/apps/dashboard-web/package.json`) - App principal
3. **Shared** (`/packages/shared-utils/package.json`) - Código compartido

### **🚫 Exclusiones Críticas:**
- `node_modules` - Siempre excluir
- `test*` folders - Evitar falsos positivos
- `.next, dist` - Build artifacts
- `.turbo` - Cache files

### **⚡ Performance:**
- **No más de 5-7 targets** para evitar lentitud
- **Prioriza** aplicaciones con más dependencias
- **Excluye** agresivamente carpetas innecesarias

---

## 🐛 **Troubleshooting**

### **"No se detectan vulnerabilidades"**
- Verificar que el `package.json` existe en el path
- Revisar que las exclusiones no bloqueen archivos importantes

### **"Demasiados falsos positivos"**
- Agregar más carpetas a exclusiones: `test, __test__, spec, __spec__`

### **"Análisis muy lento"**
- Reducir número de targets
- Aumentar exclusiones de carpetas grandes

---

## 📞 **Configuración Rápida Copy-Paste**

### **Target Principal:**
```
Repository: Neiland85/a4co-ddd-microservices
Target: /package.json
```

### **Exclude Folders:**
```
fixtures, tests, __tests__, test, __test__, ci, node_modules, bower_components, .next, dist, coverage, .turbo, docs, media, .git, .github, .storybook, prisma/migrations, test-results, playwright-report
```

### **Targets Adicionales (uno por uno):**
```
/apps/dashboard-web/package.json
/packages/shared-utils/package.json
```

---

**🛡️ ¡Con esta configuración Snyk analizará perfectamente tu monorepo DDD!**

*Una vez configurado, no olvides agregar el `SNYK_TOKEN` a GitHub Secrets.*