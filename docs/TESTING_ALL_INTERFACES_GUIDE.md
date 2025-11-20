# 🧪 Guía Completa: Cómo Probar Todas las Interfaces A4CO

## 🎯 Resumen

Esta guía te permitirá probar todas las interfaces del proyecto A4CO DDD Microservices de manera completa y sistemática. Todas las interfaces han sido verificadas y están funcionando perfectamente.

## 🚀 Inicio Rápido

### 1. Arrancar el Servidor

```bash
# Opción A: Usando pnpm directamente
cd apps/dashboard-web
pnpm dev --port 3001

# Opción B: Usando el script (si está disponible)
./start-dashboard.sh
```

### 2. Acceder a las Interfaces de Testing

- **Página Principal**: http://localhost:3001/
- **Interface de Testing Completa**: http://localhost:3001/test-integrations

## 📊 Interfaces Disponibles para Testing

### 🌐 APIs Backend (4 APIs)

#### 1. **Sales Opportunities API**

- **Endpoint**: `/api/sales-opportunities`
- **URL Directa**: http://localhost:3001/api/sales-opportunities
- **Funcionalidad**: Retorna 3 oportunidades de venta con información detallada
- **Datos incluidos**:
  - Eventos de mercado
  - Festivales
  - Cooperativas de consumo
  - Información de contacto
  - Productos relacionados

#### 2. **Products API**

- **Endpoint**: `/api/products`
- **URL Directa**: http://localhost:3001/api/products
- **Funcionalidad**: Retorna 6 productos locales con información completa
- **Categorías**: aceite, queso, miel, jamón, aceitunas, artesanía
- **Datos incluidos**:
  - Información detallada del producto
  - Ubicación del productor
  - Certificaciones
  - Stock disponible
  - Precios

#### 3. **Artisans API**

- **Endpoint**: `/api/artisans`
- **URL Directa**: http://localhost:3001/api/artisans
- **Funcionalidad**: Retorna 3 artesanos verificados
- **Datos incluidos**:
  - Información de contacto
  - Especialidades
  - Horarios
  - Servicios ofrecidos
  - Calificaciones y reseñas

#### 4. **Products with Filters API**

- **Endpoint**: `/api/products?category=aceite`
- **Funcionalidad**: Demuestra capacidades de filtrado
- **Filtros disponibles**: categoría, ubicación, disponibilidad, búsqueda

### 🎣 Custom Hooks React (4 hooks)

#### 1. **useSalesOpportunities**

- **Funcionalidad**: Gestión de oportunidades de venta
- **Testing**: Botón "Cargar Oportunidades"
- **Resultado esperado**: Carga 3 oportunidades, actualiza estado global

#### 2. **useProducts**

- **Funcionalidad**: Gestión de productos con filtros
- **Testing**: Botones "Cargar Productos" y "Filtrar Aceite"
- **Resultado esperado**: Carga 6 productos, filtrado funcional

#### 3. **useArtisans**

- **Funcionalidad**: Gestión de artesanos
- **Testing**: Botón "Cargar Artesanos"
- **Resultado esperado**: Carga 3 artesanos verificados de 2 ubicaciones

#### 4. **useGeolocation**

- **Funcionalidad**: Servicios de geolocalización
- **Testing**: Botón "Obtener Ubicación"
- **Nota**: Requiere permisos del navegador

### 🔍 Búsqueda en Tiempo Real

#### **useProductSearch Hook**

- **Funcionalidad**: Búsqueda con debounce (300ms)
- **Testing**: Campo de búsqueda "Buscar productos"
- **Ejemplo de prueba**: Escribe "aceite"
- **Resultado esperado**: Encuentra 1 producto con información detallada

### 🎛️ Filtros Combinados

#### **Filtros Disponibles**

1. **Categoría**: Todas, Aceite, Queso, Miel
2. **Ubicación**: Todas, Úbeda, Cazorla, Andújar
3. **Especiales**: Solo Temporada, Solo Disponibles

#### **Testing de Filtros**

- **Ejemplo**: Seleccionar "Aceite" en categoría
- **Resultado esperado**: Productos se reducen de 6 a 1 en estado global

### 📊 Estado Global en Tiempo Real

#### **Métricas Monitoreadas**

- **Oportunidades**: Actualización en tiempo real
- **Productos**: Cambia según filtros aplicados
- **Artesanos**: Muestra total cargado
- **Geolocalización**: Estado de disponibilidad

## 🧪 Procedimiento de Testing Completo

### Paso 1: Testing de APIs

1. Acceder a http://localhost:3001/test-integrations
2. En la sección "Tests de APIs Backend":
   - Hacer clic en "Test API" para cada endpoint
   - Verificar respuestas exitosas con datos JSON
   - Confirmar que todos muestran "✅ Respuesta exitosa"

### Paso 2: Testing de Hooks

1. En la sección "Tests de Hooks Personalizados":
   - Hacer clic en "Cargar Oportunidades" → Debe mostrar 3 oportunidades
   - Hacer clic en "Cargar Productos" → Debe mostrar 6 productos
   - Hacer clic en "Cargar Artesanos" → Debe mostrar 3 artesanos
   - Opcional: "Obtener Ubicación" (requiere permisos)

### Paso 3: Testing de Búsqueda

1. En la sección "Test de Búsqueda en Tiempo Real":
   - Escribir "aceite" en el campo de búsqueda
   - Verificar que aparece 1 resultado
   - Confirmar información del producto mostrada

### Paso 4: Testing de Filtros

1. En la sección "Test de Filtros Combinados":
   - Cambiar categoría a "Aceite"
   - Verificar que el estado global se actualiza (6→1 productos)
   - Probar otros filtros según sea necesario

### Paso 5: Verificar Estado Global

1. En la sección "Resumen de Estado Global":
   - Confirmar números actualizados en tiempo real
   - Verificar que reflejan las acciones realizadas

## 🔧 Testing de APIs Directo

También puedes probar las APIs directamente en el navegador:

```bash
# Productos
http://localhost:3001/api/products

# Oportunidades de venta
http://localhost:3001/api/sales-opportunities

# Artesanos
http://localhost:3001/api/artisans

# Productos filtrados
http://localhost:3001/api/products?category=aceite
```

## ✅ Resultados Esperados

### Estado Final de Testing Exitoso

- **APIs**: 4/4 funcionando con respuestas JSON completas
- **Hooks**: 4/4 funcionando con actualización de estado
- **Búsqueda**: Tiempo real con debounce funcional
- **Filtros**: Combinados y funcionales
- **Estado Global**: Actualización en tiempo real
- **UI**: Todas las interfaces responsive y funcionales

### Números de Verificación

- **Oportunidades**: 3 cargadas
- **Productos**: 6 totales (1 cuando filtrado por "aceite")
- **Artesanos**: 3 verificados de 2 ubicaciones
- **Búsqueda "aceite"**: 1 resultado encontrado

## 🚨 Solución de Problemas

### Si el servidor no arranca

```bash
# Instalar dependencias
pnpm install

# Arrancar sin turbopack si hay problemas
pnpm next dev --port 3001
```

### Si hay errores de React

```bash
# Actualizar React a la misma versión
pnpm update react react-dom --latest
```

### Si hay problemas de CSS

- El servidor usa la versión estándar de Next.js sin Turbopack para mayor compatibilidad

## 🎯 Conclusión

Todas las interfaces del proyecto A4CO DDD Microservices están completamente funcionales y permiten testing integral de:

1. **Backend APIs** con datos reales de la región de Jaén
2. **Custom Hooks** con gestión de estado React
3. **Búsqueda en tiempo real** con funcionalidad de debounce
4. **Filtros combinados** con actualización dinámica
5. **Estado global** con sincronización en tiempo real
6. **Interfaz de usuario** completa y responsive

El sistema proporciona una base sólida para el desarrollo de microservicios DDD con interfaces bien integradas y totalmente testables.
