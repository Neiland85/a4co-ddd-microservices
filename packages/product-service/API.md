# 📚 API Documentation - Product Service

Documentación completa de la API REST del microservicio de productos.

## 🌐 Base URL

```
Development: http://localhost:3003
Production: https://api.example.com/product-service
```

## 🔐 Autenticación

Actualmente la API no requiere autenticación para endpoints públicos. Para endpoints protegidos, usar:

```bash
Authorization: Bearer <your-jwt-token>
```

## 📋 Endpoints

### Health Check

#### `GET /api/health`

Verifica el estado del servicio.

**Request:**
```bash
curl http://localhost:3003/api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "product-service",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200` - Servicio funcionando correctamente

---

### Productos

#### `GET /api/products`

Obtiene una lista paginada de productos con filtros opcionales.

**Query Parameters:**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `category` | string | Filtrar por categoría | `aceite` |
| `seasonal` | boolean | Filtrar por productos estacionales | `true` |
| `available` | boolean | Filtrar por disponibilidad | `true` |
| `search` | string | Búsqueda por texto | `oliva` |
| `limit` | number | Límite de resultados (default: 10) | `20` |
| `offset` | number | Offset para paginación | `0` |

**Request:**
```bash
curl "http://localhost:3003/api/products?category=aceite&seasonal=true&limit=5"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_1703123456789_abc123",
        "name": "Aceite de Oliva Virgen Extra Picual",
        "category": "aceite",
        "producer": "Cooperativa Olivarera San José",
        "location": {
          "municipality": "Úbeda",
          "coordinates": [38.0138, -3.3706]
        },
        "price": 12.5,
        "unit": "botella 500ml",
        "seasonal": true,
        "harvestDate": "2024-11-15",
        "description": "Aceite de primera presión en frío de aceitunas Picual",
        "images": ["/images/aceite-picual.jpg"],
        "certifications": ["Denominación de Origen", "Ecológico"],
        "available": true,
        "stock": 150,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 5,
      "offset": 0,
      "hasMore": false
    },
    "filters": {
      "category": "aceite",
      "location": null,
      "seasonal": true,
      "available": false,
      "search": null
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "region": "Jaén, Andalucía",
    "categories": ["aceite", "queso", "jamón", "miel", "vino", "aceitunas", "artesanía"]
  }
}
```

**Status Codes:**
- `200` - Lista obtenida correctamente
- `400` - Parámetros de query inválidos
- `500` - Error interno del servidor

---

#### `POST /api/products`

Crea un nuevo producto.

**Request Body:**
```json
{
  "name": "Aceite de Oliva Virgen Extra Picual",
  "category": "aceite",
  "seasonal": true,
  "price": 12.5,
  "unit": "botella 500ml",
  "description": "Aceite de primera presión en frío de aceitunas Picual recogidas en su punto óptimo de maduración",
  "producer": "Cooperativa Olivarera San José",
  "location": {
    "municipality": "Úbeda",
    "coordinates": [38.0138, -3.3706]
  },
  "images": ["/images/aceite-picual.jpg"],
  "certifications": ["Denominación de Origen", "Ecológico"],
  "available": true,
  "stock": 150,
  "harvestDate": "2024-11-15"
}
```

**Campos Requeridos:**
- `name` - Nombre del producto
- `category` - Categoría del producto

**Campos Opcionales:**
- `seasonal` - Es estacional (default: false)
- `price` - Precio del producto
- `unit` - Unidad de medida
- `description` - Descripción detallada
- `producer` - Productor o fabricante
- `location` - Información de ubicación (JSON)
- `images` - Array de URLs de imágenes
- `certifications` - Array de certificaciones
- `available` - Disponible para venta (default: true)
- `stock` - Cantidad en inventario
- `harvestDate` - Fecha de cosecha

**Request:**
```bash
curl -X POST http://localhost:3003/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aceite de Oliva Virgen Extra",
    "category": "aceite",
    "seasonal": true,
    "price": 12.5,
    "unit": "botella 500ml",
    "description": "Aceite de primera presión en frío",
    "producer": "Cooperativa San José"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_1703123456789_abc123",
    "name": "Aceite de Oliva Virgen Extra",
    "category": "aceite",
    "seasonal": true,
    "price": 12.5,
    "unit": "botella 500ml",
    "description": "Aceite de primera presión en frío",
    "producer": "Cooperativa San José",
    "location": null,
    "images": [],
    "certifications": [],
    "available": true,
    "stock": null,
    "harvestDate": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Producto creado correctamente
- `400` - Datos inválidos o faltantes
- `500` - Error interno del servidor

---

#### `GET /api/products/:id`

Obtiene un producto específico por su ID.

**Path Parameters:**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | string | ID único del producto | `prod_1703123456789_abc123` |

**Request:**
```bash
curl http://localhost:3003/api/products/prod_1703123456789_abc123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_1703123456789_abc123",
    "name": "Aceite de Oliva Virgen Extra Picual",
    "category": "aceite",
    "seasonal": true,
    "price": 12.5,
    "unit": "botella 500ml",
    "description": "Aceite de primera presión en frío",
    "producer": "Cooperativa San José",
    "location": {
      "municipality": "Úbeda",
      "coordinates": [38.0138, -3.3706]
    },
    "images": ["/images/aceite-picual.jpg"],
    "certifications": ["Denominación de Origen", "Ecológico"],
    "available": true,
    "stock": 150,
    "harvestDate": "2024-11-15",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Producto encontrado
- `404` - Producto no encontrado
- `500` - Error interno del servidor

---

#### `PUT /api/products/:id`

Actualiza un producto existente.

**Path Parameters:**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | string | ID único del producto | `prod_1703123456789_abc123` |

**Request Body:**
```json
{
  "name": "Aceite de Oliva Virgen Extra Picual Premium",
  "price": 15.0,
  "stock": 200,
  "description": "Aceite premium de primera presión en frío"
}
```

**Campos Actualizables:**
- `name` - Nombre del producto
- `category` - Categoría del producto
- `seasonal` - Es estacional
- `price` - Precio del producto
- `unit` - Unidad de medida
- `description` - Descripción detallada
- `producer` - Productor o fabricante
- `location` - Información de ubicación
- `images` - Array de URLs de imágenes
- `certifications` - Array de certificaciones
- `available` - Disponible para venta
- `stock` - Cantidad en inventario
- `harvestDate` - Fecha de cosecha

**Request:**
```bash
curl -X PUT http://localhost:3003/api/products/prod_1703123456789_abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 15.0,
    "stock": 200,
    "description": "Aceite premium de primera presión en frío"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_1703123456789_abc123",
    "name": "Aceite de Oliva Virgen Extra Picual",
    "category": "aceite",
    "seasonal": true,
    "price": 15.0,
    "unit": "botella 500ml",
    "description": "Aceite premium de primera presión en frío",
    "producer": "Cooperativa San José",
    "location": {
      "municipality": "Úbeda",
      "coordinates": [38.0138, -3.3706]
    },
    "images": ["/images/aceite-picual.jpg"],
    "certifications": ["Denominación de Origen", "Ecológico"],
    "available": true,
    "stock": 200,
    "harvestDate": "2024-11-15",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Producto actualizado correctamente
- `400` - Datos inválidos
- `404` - Producto no encontrado
- `500` - Error interno del servidor

---

#### `DELETE /api/products/:id`

Elimina un producto del sistema.

**Path Parameters:**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | string | ID único del producto | `prod_1703123456789_abc123` |

**Request:**
```bash
curl -X DELETE http://localhost:3003/api/products/prod_1703123456789_abc123
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Status Codes:**
- `200` - Producto eliminado correctamente
- `404` - Producto no encontrado
- `500` - Error interno del servidor

---

## 🔍 Búsqueda y Filtros

### Búsqueda por Texto

```bash
curl "http://localhost:3003/api/products?search=oliva"
```

Busca en los campos: `name`, `description`, `category`, `producer`

### Filtros Combinados

```bash
curl "http://localhost:3003/api/products?category=aceite&seasonal=true&available=true&limit=10&offset=0"
```

### Paginación

```bash
# Primera página
curl "http://localhost:3003/api/products?limit=5&offset=0"

# Segunda página
curl "http://localhost:3003/api/products?limit=5&offset=5"
```

---

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200` | OK - Operación exitosa |
| `201` | Created - Recurso creado |
| `400` | Bad Request - Datos inválidos |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## 🚨 Manejo de Errores

### Formato de Error

```json
{
  "success": false,
  "error": "Descripción del error",
  "details": {
    "field": "Campo específico con error",
    "code": "ERROR_CODE"
  }
}
```

### Ejemplos de Errores

**Validación de Datos:**
```json
{
  "success": false,
  "error": "Name and category are required"
}
```

**Producto No Encontrado:**
```json
{
  "success": false,
  "error": "Product not found"
}
```

**Error de Base de Datos:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 📈 Rate Limiting

La API implementa rate limiting para prevenir abuso:

- **Límite**: 100 requests por 15 minutos por IP
- **Headers de respuesta:**
  - `X-RateLimit-Limit`: Límite de requests
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Tiempo de reset

---

## 🔧 Headers de Respuesta

| Header | Descripción |
|--------|-------------|
| `Content-Type` | `application/json` |
| `X-Request-ID` | ID único de la request |
| `X-Response-Time` | Tiempo de respuesta en ms |
| `X-Total-Count` | Total de elementos (para listas) |

---

## 📝 Ejemplos de Uso

### Crear y Actualizar Producto

```bash
# 1. Crear producto
PRODUCT_ID=$(curl -X POST http://localhost:3003/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Queso de Cabra Artesanal",
    "category": "queso",
    "seasonal": false,
    "price": 8.75,
    "unit": "pieza 250g",
    "description": "Queso artesanal de cabra",
    "producer": "Quesería Los Olivos"
  }' | jq -r '.data.id')

# 2. Obtener producto
curl "http://localhost:3003/api/products/$PRODUCT_ID"

# 3. Actualizar stock
curl -X PUT "http://localhost:3003/api/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d '{"stock": 50}'

# 4. Eliminar producto
curl -X DELETE "http://localhost:3003/api/products/$PRODUCT_ID"
```

### Búsqueda Avanzada

```bash
# Buscar productos de aceite estacionales disponibles
curl "http://localhost:3003/api/products?category=aceite&seasonal=true&available=true"

# Buscar productos con descuento (precio < 10)
curl "http://localhost:3003/api/products?search=descuento&limit=20"

# Obtener productos por productor
curl "http://localhost:3003/api/products?search=Cooperativa"
```

---

## 🔗 Enlaces Útiles

- [README Principal](../README.md)
- [Guía de Instalación](../README.md#instalación)
- [Configuración](../README.md#configuración)
- [Testing](../README.md#testing)
- [Despliegue](../README.md#despliegue) 