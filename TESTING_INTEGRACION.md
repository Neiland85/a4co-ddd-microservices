# Guía de Testing - Integración Frontend-Backend

## Servicios Requeridos

### Infraestructura

```bash
docker-compose -f compose.dev.yaml up -d
```

Esto inicia:

- PostgreSQL (puerto 5432)
- NATS (puerto 4222)
- Redis (puerto 6379)

### Microservicios

```bash
# Terminal 1 - Auth Service
cd apps/auth-service
pnpm install
pnpm run dev  # puerto 3001

# Terminal 2 - Product Service  
cd apps/product-service
pnpm install
pnpm run dev  # puerto 3003

# Terminal 3 - User Service
cd apps/user-service
pnpm install
pnpm run dev  # puerto 3002

# Terminal 4 - Order Service
cd apps/order-service
pnpm install
pnpm run dev  # puerto 3004

# Terminal 5 - Payment Service
cd apps/payment-service
pnpm install
pnpm run dev  # puerto 3005

# Terminal 6 - Frontend
cd apps/frontend
pnpm install
pnpm run dev  # puerto 5173
```

---

## Tests de Integración

### 1. Test de Autenticación (Auth-Service)

#### Login de Customer

```
1. Ir a http://localhost:5173
2. Click en "Acceder"
3. Email: cliente@a4co.es
4. Password: password123
5. Click "Acceder"

✅ Verificar:
   - Login exitoso
   - Token guardado en localStorage
   - Nombre aparece en header
   - Menú de usuario funcional
```

#### Login de Producer

```
1. Click en "Zona Productores"
2. Tab "Acceder"
3. Email: productor@a4co.es
4. Password: password123
5. Click "Acceder"

✅ Verificar:
   - Login exitoso
   - Redirección a Dashboard de productor
   - Token guardado
   - Dashboard carga correctamente
```

#### Logout

```
1. Click en nombre de usuario (header)
2. Click "Cerrar sesión"

✅ Verificar:
   - Token eliminado de localStorage
   - Redirección a home
   - Usuario ya no aparece en header
   - Cart limpiado
```

#### Session Persistence

```
1. Iniciar sesión
2. Refrescar página (F5)

✅ Verificar:
   - Sesión se mantiene
   - Usuario sigue logueado
   - Token sigue en localStorage
```

---

### 2. Test de Productos (Product-Service)

#### Lista de Productos

```
1. Abrir consola del navegador (F12)
2. Ir a home
3. Ver en consola si carga productos desde API

✅ Verificar en console:
   - Sin mensajes de "using mock data" (si servicio está activo)
   - Productos se cargan en el catálogo
   - Categorías aparecen correctamente
```

#### Búsqueda

```
1. En el buscador, escribir "aceite"
2. Ver resultados filtrados

✅ Verificar:
   - Productos se filtran correctamente
   - Búsqueda funciona en nombre y descripción
```

#### Detalle de Producto

```
1. Click en un producto
2. Ver página de detalle

✅ Verificar:
   - Carga detalles correctamente
   - Imágenes se muestran
   - Información del productor
```

---

### 3. Test de Usuarios (User-Service)

#### Favoritos

```
1. Iniciar sesión
2. Click en ❤️ de un producto
3. Ver console logs

✅ Verificar en console:
   - "Favorite toggled successfully" (si API funciona)
   - O "using mock favorites" (si API no disponible)
```

#### Producers List

```
1. Scroll down en home
2. Ver sección de productores

✅ Verificar:
   - Lista de productores carga
   - Transformación de artisan → producer correcta
```

---

### 4. Test de Órdenes (Order-Service)

#### Crear Orden

```
1. Iniciar sesión como customer
2. Agregar producto al carrito
3. Click en carrito
4. Click "Proceder al pago"
5. Completar formulario:
   - Nombre: Test User
   - Email: test@example.com
   - Dirección: Calle Test 123
   - Ciudad: Jaén
   - Código Postal: 23001
6. Seleccionar método de envío
7. Click "Realizar pedido"

✅ Verificar:
   - Orden se crea
   - Redirección a confirmación
   - Ver console para llamada API
   - Orden aparece en "Mi cuenta" → "Mis Pedidos"
```

#### Ver Historial de Órdenes

```
1. Iniciar sesión
2. Click en nombre → "Mi cuenta"
3. Ver tab "Mis Pedidos"

✅ Verificar:
   - Órdenes cargan desde API (o mocks)
   - Se muestran correctamente
```

#### Producer Orders

```
1. Iniciar sesión como productor
2. Ver Dashboard → "Pedidos"

✅ Verificar:
   - Órdenes del productor cargan
   - Puede actualizar estado
   - Cambios se reflejan
```

---

### 5. Test de Pagos (Payment-Service)

#### Payment Methods

```
Actualmente la integración está preparada pero el frontend
usa flujo simplificado. Los métodos de pago se pueden 
listar llamando a getPaymentMethods(token).
```

#### Payment Intent

```
El flujo de pago está preparado para:
1. Crear intent al hacer checkout
2. Confirmar pago con método seleccionado
3. Actualizar orden con pago exitoso

Actualmente funciona con mocks para desarrollo.
```

---

## Checklist de Testing

### Autenticación

- [ ] Login customer funciona
- [ ] Login producer funciona
- [ ] Register funciona
- [ ] Logout limpia sesión
- [ ] Session persistence funciona
- [ ] Protected routes validan auth
- [ ] Token se guarda en localStorage
- [ ] Token se pasa en headers

### Productos

- [ ] Lista de productos carga
- [ ] Categorías cargan
- [ ] Búsqueda funciona
- [ ] Detalle de producto carga
- [ ] Filtros funcionan

### Usuarios

- [ ] Favoritos se pueden toggle
- [ ] Producers list carga
- [ ] Perfil de usuario accesible

### Órdenes

- [ ] Crear orden funciona
- [ ] Ver historial de órdenes
- [ ] Producer ve sus órdenes
- [ ] Actualizar estado de orden

### Pagos

- [ ] Payment methods preparado
- [ ] Payment intent flow preparado

---

## Troubleshooting

### Servicio no responde

```
⚠️ Síntoma: Console muestra "using mock data"
✅ Solución: 
   1. Verificar que el servicio está corriendo
   2. Verificar puerto correcto
   3. Revisar logs del servicio backend
```

### Token inválido/expirado

```
⚠️ Síntoma: API devuelve 401
✅ Solución:
   1. Hacer logout y login nuevamente
   2. Verificar que JWT_SECRET coincide en todos los servicios
   3. Limpiar localStorage manualmente si es necesario
```

### CORS errors

```
⚠️ Síntoma: CORS policy error en console
✅ Solución:
   1. Verificar CORS_ORIGIN en servicios backend
   2. Debe incluir http://localhost:5173
   3. Reiniciar servicios después de cambiar .env
```

---

## Verificación de Logs

### Logs Esperados en Console

**✅ Exitoso (con API):**

```
Login successful
Favorite toggled successfully
Order created successfully
```

**⚠️ Fallback (sin API):**

```
Product service not available, using mock data
Order service error, using mock orders
Payment service not available, simulating payment
```

**❌ Error:**

```
Failed to fetch
Network error
401 Unauthorized
```

---

## Estado Final

- **Frontend:** React + Vite + TypeScript
- **Servicios integrados:** 5/8
- **Autenticación:** JWT completa
- **Fallback:** Mocks disponibles
- **Estado:** Listo para testing manual

---

_Documento generado: 28 Oct 2025_
_Rama: develop_
_Commit: 25e42d9_

