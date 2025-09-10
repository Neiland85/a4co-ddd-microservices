# 📚 Documentación de Endpoints REST - Microservicios A4CO

## 🎯 Resumen Ejecutivo

Esta documentación describe todos los endpoints REST implementados para la comunicación crítica entre microservicios en el proyecto A4CO DDD Marketplace. Los endpoints están diseñados siguiendo principios de REST, con validación de entrada, manejo de errores consistente y respuestas estandarizadas.

## 🏗️ Arquitectura de Endpoints

### Principios de Diseño

- **RESTful**: Seguimiento estricto de convenciones REST
- **Validación**: Validación de entrada con class-validator
- **Error Handling**: Manejo consistente de errores con códigos HTTP apropiados
- **Documentación**: Cada endpoint incluye descripción, parámetros y ejemplos
- **Monitoreo**: Endpoints de salud y métricas para observabilidad

## 📦 Inventory Service

### Base URL: `/inventory`

#### 🔍 Endpoints Críticos para Otros Servicios

##### `GET /inventory/check/:productId`

**Descripción**: Verificar disponibilidad de stock para un producto específico

**Parámetros**:

- `productId` (path): UUID del producto
- `quantity` (query): Cantidad a verificar (default: 1)

**Ejemplo de Request**:


```bash
GET /inventory/check/123e4567-e89b-12d3-a456-426614174000?quantity=5


```


**Ejemplo de Response**:


```json
{
  "available": true,
  "currentStock": 100,
  "reservedStock": 20,
  "availableStock": 80,
  "message": "Stock disponible"
}

```


##### `POST /inventory/check/bulk`

**Descripción**: Verificar disponibilidad de stock para múltiples productos

**Body**:


```json
{
  "items": [
    {
      "productId": "123e4567-e89b-12d3-a456-426614174000",
      "quantity": 5
    },
    {
      "productId": "987fcdeb-51a2-43d1-b789-123456789abc",
      "quantity": 3
    }
  ]
}

```


**Response**:


```json
{
  "allAvailable": true,
  "items": [
    {
      "productId": "123e4567-e89b-12d3-a456-426614174000",
      "available": true,
      "currentStock": 100,
      "availableStock": 80
    }
  ],
  "summary": "Todos los productos están disponibles"
}

```


##### `POST /inventory/reserve`

**Descripción**: Reservar stock para una orden

**Body**:


```json
{
  "orderId": "order-123",
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "quantity": 5,
  "customerId": "customer-456"
}

```


**Response**:


```json
{
  "success": true,
  "reservationId": "res-789",
  "orderId": "order-123",
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "reservedQuantity": 5,
  "message": "Stock reservado exitosamente"
}

```


##### `POST /inventory/release`

**Descripción**: Liberar stock reservado

**Body**:


```json
{
  "orderId": "order-123",
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "quantity": 5
}

```


#### 🔧 Endpoints Internos del Servicio

##### `GET /inventory/product/:productId`

**Descripción**: Obtener información completa de inventario de un producto

##### `GET /inventory/status`

**Descripción**: Obtener estado general del inventario

##### `POST /inventory/update`

**Descripción**: Actualizar stock de un producto

#### 📊 Endpoints de Monitoreo

##### `GET /inventory/health`

**Descripción**: Verificar salud del servicio de inventario

##### `GET /inventory/metrics`

**Descripción**: Obtener métricas del servicio

---

## 💳 Payment Service

### Base URL: `/payments`

#### 🔍 Endpoints Críticos para Otros Servicios

##### `POST /payments/validate`

**Descripción**: Validar método de pago antes de procesar la orden

**Body**:


```json
{
  "paymentMethodType": "credit_card",
  "paymentMethodId": "pm_123456",
  "customerId": "customer-456",
  "amount": 99.99,
  "currency": "EUR",
  "orderId": "order-123"
}

```


**Response**:


```json
{
  "valid": true,
  "paymentMethodType": "credit_card",
  "paymentMethodId": "pm_123456",
  "customerId": "customer-456",
  "availableBalance": 1000.0,
  "dailyLimit": 5000.0,
  "monthlyLimit": 50000.0,
  "message": "Método de pago válido"
}

```


##### `POST /payments/process`

**Descripción**: Procesar el pago de una orden

**Body**:


```json
{
  "orderId": "order-123",
  "customerId": "customer-456",
  "paymentMethodType": "credit_card",
  "paymentMethodId": "pm_123456",
  "amount": 99.99,
  "currency": "EUR",
  "description": "Compra de productos",
  "customerEmail": "cliente@example.com"
}

```


**Response**:


```json
{
  "success": true,
  "paymentId": "pay_789",
  "orderId": "order-123",
  "status": "completed",
  "amount": 99.99,
  "currency": "EUR",
  "transactionId": "txn_abc123",
  "message": "Pago procesado exitosamente"
}

```


##### `GET /payments/methods/:customerId`

**Descripción**: Obtener métodos de pago de un cliente

**Query Params**:

- `activeOnly`: Filtrar solo métodos activos (true/false)

##### `POST /payments/refund`

**Descripción**: Procesar reembolso de un pago

#### 🔧 Endpoints Internos del Servicio

##### `GET /payments/:paymentId`

**Descripción**: Obtener detalles de un pago específico

##### `GET /payments/order/:orderId`

**Descripción**: Obtener pagos asociados a una orden

##### `GET /payments/customer/:customerId`

**Descripción**: Obtener historial de pagos de un cliente

##### `POST /payments/methods`

**Descripción**: Agregar nuevo método de pago para un cliente

##### `PUT /payments/methods/:methodId`

**Descripción**: Actualizar método de pago existente

##### `DELETE /payments/methods/:methodId`

**Descripción**: Eliminar método de pago

#### 📊 Endpoints de Monitoreo

##### `GET /payments/health`

**Descripción**: Verificar salud del servicio de pagos

##### `GET /payments/metrics`

**Descripción**: Obtener métricas del servicio

##### `GET /payments/status/:paymentId`

**Descripción**: Obtener estado actual de un pago

---

## 📋 Order Service

### Base URL: `/orders`

#### 🔍 Endpoints Críticos para Otros Servicios

##### `GET /orders/:orderId/status`

**Descripción**: Obtener estado actual de una orden

##### `GET /orders/:orderId/details`

**Descripción**: Obtener detalles completos de una orden

##### `GET /orders/customer/:customerId`

**Descripción**: Obtener órdenes de un cliente específico

#### 🔧 Endpoints Internos del Servicio

##### `POST /orders`

**Descripción**: Crear una nueva orden

##### `PUT /orders/:orderId/confirm`

**Descripción**: Confirmar una orden

##### `PUT /orders/:orderId/cancel`

**Descripción**: Cancelar una orden

##### `PUT /orders/:orderId/ship`

**Descripción**: Marcar orden como enviada

##### `PUT /orders/:orderId/deliver`

**Descripción**: Marcar orden como entregada

##### `POST /orders/:orderId/items`

**Descripción**: Agregar items a una orden existente

##### `PUT /orders/:orderId/items/:itemId`

**Descripción**: Actualizar un item específico de la orden

##### `DELETE /orders/:orderId/items/:itemId`

**Descripción**: Eliminar un item de la orden

#### 🔍 Endpoints de Validación y Verificación

##### `POST /orders/validate`

**Descripción**: Validar una orden antes de crearla

##### `POST /orders/:orderId/check-availability`

**Descripción**: Verificar disponibilidad de productos en una orden

##### `POST /orders/:orderId/calculate-total`

**Descripción**: Recalcular total de una orden

#### 📊 Endpoints de Monitoreo

##### `GET /orders/health`

**Descripción**: Verificar salud del servicio de órdenes

##### `GET /orders/metrics`

**Descripción**: Obtener métricas del servicio

##### `GET /orders/stats`

**Descripción**: Obtener estadísticas de órdenes

#### 🔗 Endpoints de Integración con Otros Servicios

##### `POST /orders/:orderId/reserve-inventory`

**Descripción**: Reservar inventario para una orden

##### `POST /orders/:orderId/validate-payment`

**Descripción**: Validar método de pago para una orden

---

## 🚀 Patrones de Uso

### Flujo Típico de Creación de Orden

1. **Validar Inventario**:

   ```bash
   GET /inventory/check/{productId}?quantity={quantity}
   ```

2. **Validar Método de Pago**:

   ```bash
   POST /payments/validate
   ```

3. **Crear Orden**:

   ```bash
   POST /orders
   ```

4. **Reservar Inventario**:

   ```bash
   POST /inventory/reserve
   ```

5. **Procesar Pago**:

   ```bash
   POST /payments/process
   ```

6. **Confirmar Orden**:

   ```bash
   PUT /orders/{orderId}/confirm
   ```

### Validaciones de Entrada

Todos los endpoints implementan validación usando `class-validator`:

- **UUIDs**: Validación de formato UUID v4
- **Números**: Validación de rangos y valores mínimos
- **Strings**: Validación de longitud y formato
- **Enums**: Validación de valores permitidos
- **Arrays**: Validación de estructura y contenido

### Manejo de Errores

**Estructura de Error Estándar**:


```json
{
  "error": "Error code",
  "message": "Descripción del error en español"
}

```


**Códigos HTTP**:

- `200`: Operación exitosa
- `400`: Error de validación o datos incorrectos
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

### Headers de Respuesta

- `Content-Type: application/json`
- `X-Service: {service-name}`
- `X-Request-ID: {unique-id}` (para tracing)

---

## 🔧 Configuración y Despliegue

### Variables de Entorno


```bash
# Configuración del servicio
SERVICE_NAME=inventory-service
SERVICE_PORT=3001
SERVICE_HOST=0.0.0.0

# Configuración de base de datos
DATABASE_URL=postgresql://user:pass@localhost:5432/inventory_db

# Configuración de NATS
NATS_SERVERS=nats://localhost:4222

# Configuración de logging
LOG_LEVEL=info
LOG_FORMAT=json


```


### Health Checks

Cada servicio expone endpoints de salud:


```bash
# Verificar salud del servicio
GET /{service}/health

# Verificar métricas
GET /{service}/metrics


```


### Rate Limiting

Los endpoints críticos implementan rate limiting:

- **Inventario**: 100 requests/minuto por IP
- **Pagos**: 50 requests/minuto por IP
- **Órdenes**: 200 requests/minuto por IP

---

## 📊 Monitoreo y Observabilidad

### Métricas Expuestas

- **Throughput**: Requests por segundo
- **Latencia**: Tiempo de respuesta promedio
- **Errores**: Tasa de errores por endpoint
- **Conectividad**: Estado de conexiones a servicios externos

### Logs Estructurados


```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "level": "info",
  "service": "inventory-service",
  "endpoint": "/inventory/check/:productId",
  "method": "GET",
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "quantity": 5,
  "responseTime": 45,
  "statusCode": 200
}

```


---

## 🧪 Testing

### Endpoints de Testing


```bash
# Verificar que el servicio esté funcionando
GET /{service}/health

# Obtener métricas para testing
GET /{service}/metrics

# Endpoint de prueba (solo en desarrollo)
POST /{service}/test/reset


```


### Ejemplos de Tests


```typescript
// Test de validación de inventario
describe('Inventory Check Endpoint', () => {
  it('should validate stock availability', async () => {
    const response = await request(app)
      .get('/inventory/check/123e4567-e89b-12d3-a456-426614174000?quantity=5')
      .expect(200);

    expect(response.body.available).toBe(true);
    expect(response.body.availableStock).toBeGreaterThanOrEqual(5);
  });
});

```


---

## 📚 Referencias

### Documentación Adicional

- [Estrategia de Comunicación](./microservices-communication-strategy.md)
- [Diseño de Comunicación](./MICROSERVICES_COMMUNICATION_DESIGN.md)
- [Arquitectura DDD](./DDD_ARCHITECTURE_ANALYSIS.md)

### Estándares

- [REST API Design Guidelines](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [JSON API Specification](https://jsonapi.org/)

---

## 🎯 Próximos Pasos

1. **Implementar Autenticación**: JWT tokens para endpoints críticos
2. **Rate Limiting Avanzado**: Basado en usuario y tipo de operación
3. **Circuit Breaker**: Para llamadas entre servicios
4. **Caching**: Redis para respuestas frecuentes
5. **API Versioning**: Soporte para múltiples versiones de API
6. **OpenAPI/Swagger**: Documentación automática de endpoints
7. **GraphQL**: Para consultas complejas y agregación de datos
