# Transportista Service

FastAPI microservice para la gestión de transportistas en el ecosistema A4CO DDD Microservices.

## 🚀 Características

- **Validación robusta**: Validación completa de datos usando Pydantic
- **Códigos HTTP apropiados**: 201, 400, 422, 500
- **Documentación automática**: Swagger/OpenAPI en `/docs`
- **Manejo de errores**: Manejo consistente de errores y logging
- **Headers de respuesta**: Headers estándar para tracing y debugging
- **Tests completos**: Suite de tests con pytest

## 📋 Modelo de Datos

### Transportista

- **nombre**: Nombre completo (2-100 caracteres)
- **rut**: RUT chileno válido (formato: 12345678-9)
- **telefono**: Teléfono chileno válido
- **email**: Email válido
- **direccion**: Dirección completa (10-200 caracteres)  
- **tipo_vehiculo**: Tipo de vehículo (camion, furgon, motocicleta, bicicleta)
- **capacidad_kg**: Capacidad de carga en kg (> 0, <= 50000)
- **activo**: Estado activo (default: true)

## 🛠️ Instalación y Ejecución

### Requisitos

- Python 3.11+
- pip

### Instalación

```bash
cd apps/transportista-service
pip install -r requirements.txt
```

### Ejecución en desarrollo

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Ejecución con Docker

```bash
docker build -t transportista-service .
docker run -p 8000:8000 transportista-service
```

## 📚 API Endpoints

### `POST /transportistas`

Crear un nuevo transportista

**Request Body:**

```json
{
  "nombre": "Juan Pérez",
  "rut": "12345678-9",
  "telefono": "+56912345678",
  "email": "juan.perez@example.com",
  "direccion": "Av. Libertador 1234, Santiago",
  "tipo_vehiculo": "camion",
  "capacidad_kg": 5000.0,
  "activo": true
}
```

**Responses:**

- `201`: Transportista creado exitosamente
- `400`: Error de lógica de negocio (RUT o email duplicado)
- `422`: Datos de entrada inválidos
- `500`: Error interno del servidor

### `GET /transportistas/{id}`

Obtener transportista por ID

**Responses:**

- `200`: Transportista encontrado
- `404`: Transportista no encontrado

### `GET /transportistas`

Listar transportistas

**Query Parameters:**

- `activo` (opcional): Filtrar por estado activo

### `GET /health`

Health check del servicio

## 🧪 Testing

```bash
# Ejecutar tests
pytest tests/

# Ejecutar tests con coverage
pytest tests/ --cov=. --cov-report=html
```

## 🐳 Docker

El servicio incluye un Dockerfile multi-stage optimizado para desarrollo y producción.

### Desarrollo

```bash
docker build --target development -t transportista-service:dev .
```

### Producción

```bash
docker build --target production -t transportista-service:prod .
```

## 🔍 Monitoreo

- **Health Check**: `/health`
- **Documentation**: `/docs` (Swagger UI)
- **Alternative Docs**: `/redoc`
- **OpenAPI Schema**: `/openapi.json`

## 🏗️ Arquitectura

El servicio sigue los patrones establecidos en el proyecto:

- Separación clara entre modelos, servicios y controladores
- Validación usando Pydantic
- Manejo de errores consistente
- Headers de respuesta estándar
- Logging estructurado

## 🔐 Validaciones Implementadas

1. **RUT Chileno**: Formato válido con dígito verificador
2. **Email**: Formato RFC compliant
3. **Teléfono**: Formato chileno válido
4. **Tipo de Vehículo**: Lista de valores permitidos
5. **Capacidad**: Rango válido para vehículos
6. **Unicidad**: RUT y email únicos en el sistema

## 🚦 Códigos de Respuesta HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Error de lógica de negocio
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Datos de entrada inválidos
- `500 Internal Server Error`: Error interno del servidor
