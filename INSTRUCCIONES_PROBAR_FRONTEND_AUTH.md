# 🧪 CÓMO PROBAR FRONTEND CON AUTH-SERVICE

## ✅ Configuración Realizada

### 1. Integración API Configurada

- ✅ Frontend ahora se conecta a `http://localhost:3001/api/v1`
- ✅ Fallback a datos mock si el servicio no está disponible
- ✅ Función `loginUser` y `registerUser` actualizadas para usar API real

### 2. Variables de Entorno

- ✅ Archivo `.env` creado en `apps/frontend/`
- ✅ Variable: `VITE_API_BASE_URL=http://localhost:3001/api/v1`

---

## 🚀 CÓMO INICIAR LOS SERVICIOS

### Opción 1: En Terminales Separadas (Recomendado)

**Terminal 1 - Auth Service:**

```bash
pnpm dev:auth
# Debería iniciar en: http://localhost:3001
# Swagger docs: http://localhost:3001/api/docs
```

**Terminal 2 - Frontend:**

```bash
cd apps/frontend
pnpm dev
# Debería iniciar en: http://localhost:5173
```

### Opción 2: Todo Junto (Con Turbo)

```bash
pnpm dev
```

---

## 🧪 PROBAR LA INTEGRACIÓN

### 1. Verificar que auth-service esté corriendo

```bash
curl http://localhost:3001/api/v1/health
```

### 2. Verificar endpoints en Swagger

Abre en el navegador:

```
http://localhost:3001/api/docs
```

### 3. Probar Login desde Frontend

1. Abre http://localhost:5173
2. Intenta hacer login con:
   ```
   Email: cliente@a4co.es
   Password: password123
   ```
3. El frontend intentará conectarse al auth-service
4. Si el auth-service no está corriendo, usará datos mock

### 4. Probar desde Consola del Navegador

Abre DevTools (F12) y ejecuta:

```javascript
// Login
fetch('http://localhost:3001/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@a4co.es',
    password: 'password123',
  }),
})
  .then(r => r.json())
  .then(console.log);
```

---

## 🔍 VERIFICAR FUNCIONAMIENTO

### Logs del Frontend

Cuando haces login, busca en la consola del navegador:

**Si funciona con API:**

```
✅ Authenticated with auth-service
Token: eyJhbGc...
```

**Si usa datos mock (fallback):**

```
⚠️ API call failed, using mock data
Authenticated with mock data
```

### Logs del Auth Service

En la terminal del auth-service deberías ver:

```
[INFO] POST /api/v1/auth/login 200
```

---

## 🐛 Troubleshooting

### "Cannot connect to auth-service"

**Causa:** auth-service no está corriendo o en puerto incorrecto

**Solución:**

```bash
# Verificar que el servicio esté corriendo
curl http://localhost:3001/api/v1/health

# Si no responde, iniciar auth-service
pnpm dev:auth
```

### "CORS error"

**Causa:** auth-service no permite requests desde localhost:5173

**Solución:** Ya configurado en `apps/auth-service/src/main.ts`:

```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
});
```

### "401 Unauthorized"

**Causa:** Email/password incorrecto o usuario no existe

**Solución:**

```bash
# Verificar en auth-service que exista el usuario
# O crear uno nuevo a través del API
```

---

## 📝 Endpoints del Auth-Service

### Login

```
POST http://localhost:3001/api/v1/auth/login
Body: { "email": "test@example.com", "password": "password" }
Response: { "access_token": "...", "user": {...} }
```

### Register

```
POST http://localhost:3001/api/v1/auth/register
Body: { "email": "...", "password": "...", "name": "..." }
Response: { "access_token": "...", "user": {...} }
```

### Health Check

```
GET http://localhost:3001/api/v1/health
```

---

## ✅ Checklist de Prueba

- [ ] Auth-service corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 5173
- [ ] Health check devuelve 200 OK
- [ ] Swagger docs accesible en http://localhost:3001/api/docs
- [ ] Login funciona desde frontend
- [ ] Register funciona desde frontend
- [ ] No hay errores CORS en consola del navegador
- [ ] Token se guarda en localStorage
- [ ] Usuario autenticado navega por la app

---

## 🎯 Próximos Pasos Después de la Prueba

1. **Implementar refresh token** en frontend
2. **Agregar interceptor** de token en todas las requests
3. **Conectar otros servicios** (product, order, payment)
4. **Implementar logout**
5. **Agregar manejo de sesión**

---

**¡Ya está listo para probar!** 🚀

---

_Generado automáticamente_
