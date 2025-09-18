# 🚀 GUÍA RÁPIDA: EJECUTAR Y PROBAR LAS INTEGRACIONES

## 📋 PASOS PARA ARRANCAR EL PROYECTO

### 1. **Arrancar el Servidor**


```bash
# Opción A: Script automatizado
./start-dashboard.sh

# Opción B: Manual
cd apps/dashboard-web
pnpm dev --port 3001


```


### 2. **URLs Principales**


```


🏠 Dashboard Principal:    http://localhost:3001/
🧪 Página de Testing:     http://localhost:3001/test-integrations


```


### 3. **APIs Directas para Probar**


```


📊 Oportunidades de Venta:  http://localhost:3001/api/sales-opportunities
🛒 Productos Locales:      http://localhost:3001/api/products
👨‍🌾 Artesanos:             http://localhost:3001/api/artisans

🔍 Con Filtros:
     /api/products?category=aceite
     /api/products?search=queso&location=Cazorla
     /api/artisans?verified=true


```


---

## 🧪 QUÉ PROBAR EN EL DASHBOARD

### **1. Dashboard Principal (localhost:3001/)**

#### ✅ **Geolocalización Automática**

- Al cargar, debería solicitar permisos de ubicación
- Si estás en Jaén, mostrará mensaje especial
- Calculará distancias a productores cercanos

#### ✅ **Estadísticas en Tiempo Real**

- Contador de productos disponibles
- Número de productores verificados
- Oportunidades de venta actuales

#### ✅ **Navegación Integrada**

- Botón "Buscar" → Página de búsqueda
- Botón "Catálogo" → Vista de productos
- "Ver oportunidades" → API de ventas

#### ✅ **Productos Estacionales**

- Grid de productos de temporada
- Cards con información completa
- Botón "Ver todos" funcional

---

### **2. Búsqueda Inteligente**

#### ✅ **Búsqueda en Tiempo Real**

- Escribe "aceite" → resultados instantáneos
- Escribe "queso" → productos filtrados
- Debounce de 300ms (no spam de requests)

#### ✅ **Filtros Rápidos**

- Clic en "🫒 Aceite" → filtra por categoría
- Clic en "🧀 Quesos" → productos de queso
- Clic en "Todo" → reset de filtros

#### ✅ **Sugerencias**

- "Aceite Picual", "Queso de cabra", etc.
- Clic en sugerencia → búsqueda automática

---

### **3. Catálogo Completo**

#### ✅ **Filtros Avanzados**

- Dropdown de categorías
- Selector de ubicación (Úbeda, Cazorla...)
- Checkboxes "Solo temporada" / "Solo disponibles"

#### ✅ **Grid Responsive**

- 1 columna móvil → 4 columnas desktop
- Cards con toda la información
- Modal de detalles al hacer clic

#### ✅ **Paginación**

- Botón "Cargar más productos"
- Contador "X de Y productos"

---

## 🧪 PÁGINA DE TESTING (localhost:3001/test-integrations)

### **Tests de APIs**

- Botones para probar cada API individualmente
- Respuestas JSON visibles
- Estados de loading y error

### **Tests de Hooks**

- Estado en tiempo real de cada hook
- Contadores y métricas
- Botones para activar funciones

### **Búsqueda en Vivo**

- Input para buscar productos
- Resultados actualizándose automáticamente
- Debounce visible

### **Filtros Combinados**

- Dropdowns para combinar filtros
- Botones para acciones específicas
- Estado global visible

---

## 🔍 DATOS MOCK DISPONIBLES

### **🛒 Productos (6 disponibles):**

1. **Aceite Picual** (Úbeda) - €12.50
2. **Queso de Cabra** (Cazorla) - €8.75
3. **Miel de Azahar** (Huelma) - €15.00
4. **Jamón Ibérico** (Andújar) - €45.00
5. **Aceitunas Aliñadas** (Mengíbar) - €6.50
6. **Cerámica Artesanal** (Úbeda) - €25.00

### **👨‍🌾 Artesanos (3 disponibles):**

1. **Cooperativa Olivarera San José** (Úbeda)
2. **Quesería Los Olivos** (Cazorla)
3. **Taller Cerámico Paco Tito** (Úbeda)

### **📅 Oportunidades (3 disponibles):**

1. **Mercado Plaza Santa María** (Úbeda)
2. **Festival del Aceite** (Baeza)
3. **Cooperativa de Consumo** (Jaén Capital)

---

## 🎯 TÉRMINOS DE BÚSQUEDA PARA PROBAR

### **Búsquedas que funcionan:**

- `aceite` → Aceite Picual de Úbeda
- `queso` → Queso de Cabra de Cazorla
- `miel` → Miel de Azahar de Huelma
- `jamón` → Jamón Ibérico de Andújar
- `cerámica` → Cerámica de Úbeda
- `Úbeda` → Productos de Úbeda
- `Cazorla` → Productos de Cazorla
- `picual` → Aceite específico
- `cabra` → Queso de cabra

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### **Si no arranca:**


```bash
# Verificar que estás en el directorio correcto
pwd
# Debería mostrar: .../a4co-ddd-microservices

# Instalar dependencias si es necesario
cd apps/dashboard-web
pnpm install

# Arrancar manualmente
pnpm dev --port 3001


```


### **Si las APIs no responden:**

- Verificar que el servidor esté en puerto 3001
- Abrir http://localhost:3001/api/products directamente
- Revisar la consola del navegador para errores

### **Si los hooks no cargan:**

- Verificar que los imports sean correctos
- Comprobar que useEffect se ejecute
- Revisar la red en DevTools del navegador

---

## ✅ **CHECKLIST DE FUNCIONAMIENTO**

### **Dashboard Principal:**

- [ ] Carga sin errores
- [ ] Solicita geolocalización
- [ ] Muestra estadísticas
- [ ] Navegación funciona
- [ ] Productos estacionales visibles

### **Búsqueda:**

- [ ] Input responde en tiempo real
- [ ] Filtros rápidos funcionan
- [ ] Sugerencias clicleables
- [ ] Resultados se actualizan

### **Catálogo:**

- [ ] Filtros avanzados funcionan
- [ ] Grid responsive
- [ ] Modal de detalles abre
- [ ] Paginación funciona

### **APIs:**

- [ ] /api/products responde
- [ ] /api/artisans responde
- [ ] /api/sales-opportunities responde
- [ ] Filtros en URLs funcionan

---

**🎯 ¡Todo debería funcionar perfectamente! La integración está completa y operativa.**
