# 🛡️ Snyk API Token - Guía Detallada para CI/CD

## 🔍 **OAuth2 vs API Token - ¿Cuál necesitas?**

### ❌ **OAuth2** (Lo que viste en la documentación)
- **Para**: Snyk Apps (aplicaciones de terceros)
- **Uso**: Integrations complejas, multi-tenant
- **NO necesario** para CI/CD básico

### ✅ **API Token Personal** (Lo que SÍ necesitas)
- **Para**: CI/CD pipelines, scripts, automación
- **Uso**: Autenticación directa y simple
- **Perfecto** para nuestro caso

---

## 🚀 **Generar API Token Personal - Paso a Paso**

### **Opción 1: Método Estándar (Recomendado)**

#### 1. **Ir a Snyk**
```bash
🌐 https://snyk.io/
```

#### 2. **Login/Signup**
- **Click "Get started free"** o **"Log in"**
- **"Sign up with GitHub"** (más fácil)
- **Autorizar** Snyk acceso a GitHub

#### 3. **Ir a Account Settings**
- **Click tu avatar** (esquina superior derecha)
- **"Account settings"** del dropdown

#### 4. **Generar API Token**
- **Menú izquierdo**: **"General"** (debería estar por defecto)
- **Scroll down** hasta encontrar **"API Token"**
- **Click "click to show"** (si hay un token existente) o **"Generate token"**
- **COPIAR el token inmediatamente** (solo se muestra una vez)

```bash
# El token se ve así:
12345678-90ab-cdef-1234-567890abcdef
```

### **Opción 2: URL Directa**

Si ya tienes cuenta en Snyk:
```bash
🌐 https://app.snyk.io/account
```

Scroll down hasta la sección **"API Token"**.

---

## 🎯 **Screenshots de Referencia**

### **Paso 1: Dashboard Principal**
```
https://app.snyk.io/
┌─ Avatar (esquina superior derecha)
└─ "Account settings"
```

### **Paso 2: Account Settings**
```
https://app.snyk.io/account
┌─ General (tab activo)
├─ Notifications  
├─ Integrations
└─ ...

Scroll down ⬇️

┌─ API Token
├─ [Hidden token] "click to show"
└─ "Generate token" (si no tienes uno)
```

### **Paso 3: Token Generado**
```
API Token: 12345678-90ab-cdef-1234-567890abcdef
⚠️ This is your personal API token. Keep it secure!
```

---

## 🔧 **Configurar en GitHub Secrets**

Una vez que tengas tu token:

### **1. Ir a GitHub Secrets**
```bash
🌐 https://github.com/Neiland85/a4co-ddd-microservices/settings/secrets/actions
```

### **2. Crear Secret**
- **Click "New repository secret"**
- **Name**: `SNYK_TOKEN`
- **Value**: `tu-token-snyk-aquí` (sin comillas)
- **Click "Add secret"**

---

## 🧪 **Verificar Token Localmente** (Opcional)

### **Instalar Snyk CLI**
```bash
npm install -g snyk
# o
pnpm add -g snyk
```

### **Autenticar**
```bash
# Método 1: Login interactivo
snyk auth

# Método 2: Token directo
snyk auth tu-token-aquí
```

### **Test**
```bash
# Test básico
snyk test

# Test con más detalle
snyk test --severity-threshold=medium
```

---

## ❌ **Troubleshooting**

### **"No puedo encontrar API Token en Account Settings"**

#### **Solución A: Verificar ubicación**
- **Asegúrate** de estar en: https://app.snyk.io/account
- **Tab "General"** (no "Integrations" u otros)
- **Scroll down** completamente

#### **Solución B: UI diferente**
Algunas cuentas tienen UI ligeramente diferente:
- **Settings** → **API Token**
- **Account** → **API Token**  
- **Profile** → **API Token**

#### **Solución C: Generar nuevo token**
Si ya tienes un token pero no lo recuerdas:
- **"Regenerate token"** o **"Generate new token"**
- **Copiar inmediatamente**

### **"Token no funciona en CI"**

#### **Verificar formato**
```bash
# Token correcto:
12345678-90ab-cdef-1234-567890abcdef

# Formato UUID: 8-4-4-4-12 caracteres
```

#### **Verificar permisos**
- Token debe tener **permisos de lectura** al menos
- Para CI/CD típicamente **read** es suficiente

#### **Verificar secret name**
```bash
# Exactamente así (case-sensitive):
SNYK_TOKEN
```

---

## 💡 **Tips y Best Practices**

### **🔒 Seguridad**
- **Nunca** commitear el token en código
- **Rotar** el token cada 6-12 meses  
- **Usar** diferentes tokens para diferentes proyectos (opcional)

### **⚡ Performance**
- Token es **gratis hasta 200 tests/mes**
- Perfecto para CI/CD normal
- **Cacheable** por el pipeline

### **📊 Monitoring**
- Ver usage en: https://app.snyk.io/account
- **Alerts** cuando te acerques al límite
- **Upgrade** a plan paid si necesitas más

---

## 🎯 **Resultado Final**

Una vez configurado tendrás:

```bash
# En GitHub Secrets:
SNYK_TOKEN=12345678-90ab-cdef-1234-567890abcdef

# En CI Pipeline:
✅ Vulnerability scanning automático
✅ Reportes detallados de seguridad  
✅ Integration con GitHub Security tab
✅ Better insights que npm audit
```

---

## 📞 **Enlaces Útiles**

- **Snyk Dashboard**: https://app.snyk.io/
- **Account Settings**: https://app.snyk.io/account
- **GitHub Secrets**: https://github.com/Neiland85/a4co-ddd-microservices/settings/secrets/actions
- **Snyk Docs**: https://docs.snyk.io/snyk-cli/getting-started-with-the-cli

---

## 🚀 **Siguiente Paso**

Una vez configurado `SNYK_TOKEN`:

```bash
# Test del pipeline completo
git add .
git commit -m "feat: configurar Snyk security scanning"  
git push origin develop

# Monitorear en:
# https://github.com/Neiland85/a4co-ddd-microservices/actions
```

---

**🛡️ ¡API Token personal es todo lo que necesitas para CI/CD!**

*OAuth2 es para casos más complejos que no aplican a nuestro pipeline.*