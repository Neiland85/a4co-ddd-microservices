# 🛍️ Product Service

Microservicio de gestión de productos implementado siguiendo los principios de **Domain-Driven Design (DDD)** y **Clean Architecture**.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Características](#-características)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

## 🎯 Descripción

El **Product Service** es un microservicio especializado en la gestión completa de productos artesanales. Implementa una arquitectura robusta basada en DDD que garantiza la integridad del dominio de negocio y la escalabilidad del sistema.

### 🏗️ Principios Arquitectónicos

- **Domain-Driven Design (DDD)**: Separación clara entre dominio, aplicación e infraestructura
- **Clean Architecture**: Inversión de dependencias y separación de responsabilidades
- **SOLID Principles**: Código mantenible y extensible
- **Event-Driven**: Comunicación asíncrona entre microservicios

## 🏛️ Arquitectura

```
src/
├── domain/                 # 🧠 Capa de Dominio
│   ├── entities/          # Entidades de negocio
│   ├── value-objects/     # Objetos de valor
│   ├── events/           # Eventos de dominio
│   └── interfaces/       # Contratos del dominio
├── application/           # 📋 Capa de Aplicación
│   ├── use-cases/        # Casos de uso
│   └── dto/             # Objetos de transferencia
├── infrastructure/        # 🔧 Capa de Infraestructura
│   ├── prisma/          # Configuración de base de datos
│   └── repositories/    # Implementaciones de repositorios
└── api/                  # 🌐 Capa de API
    ├── controllers/      # Controladores REST
    ├── routes.ts        # Definición de rutas
    └── index.ts         # Configuración de Express
```

### 🔄 Flujo de Datos

1. **Request** → API Layer (Controllers)
2. **Validation** → Application Layer (Use Cases)
3. **Business Logic** → Domain Layer (Entities)
4. **Persistence** → Infrastructure Layer (Repositories)
5. **Response** → API Layer (DTOs)

## ✨ Características

### 🎨 Dominio Rico
- **Entidades**: Product con validaciones de negocio
- **Value Objects**: ProductId con validación de formato
- **Eventos**: ProductCreated para comunicación entre servicios
- **Reglas de Negocio**: Validaciones automáticas y lógica de dominio

### 🔒 Seguridad y Validación
- Validación de entrada en múltiples capas
- Sanitización de datos
- Manejo robusto de errores
- Logging estructurado

### 📊 Persistencia
- **PostgreSQL** como base de datos principal
- **Prisma ORM** para mapeo objeto-relacional
- Migraciones automáticas
- Transacciones ACID

### 🚀 Performance
- Caché inteligente
- Paginación eficiente
- Búsqueda optimizada
- Compresión de respuestas

## 🛠️ Instalación

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL 14+
- pnpm (recomendado) o npm

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd packages/product-service

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# 4. Generar cliente de Prisma
npx prisma generate

# 5. Ejecutar migraciones
npx prisma migrate dev

# 6. Iniciar en modo desarrollo
pnpm run dev
```

## ⚙️ Configuración

### Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/product_service_db"

# Servidor
PORT=3003
NODE_ENV=development

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Seguridad
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

### Configuración de Base de Datos

```sql
-- Crear base de datos
CREATE DATABASE product_service_db;

-- Crear usuario (opcional)
CREATE USER product_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE product_service_db TO product_user;
```

## 🚀 Uso

### Desarrollo Local

```bash
# Modo desarrollo con hot reload
pnpm run dev

# Modo producción
pnpm run build
pnpm start

# Ejecutar tests
pnpm test
pnpm test:watch
pnpm test:coverage
```

### Docker

```bash
# Construir imagen
docker build -t product-service .

# Ejecutar contenedor
docker run -p 3003:3003 product-service
```

## 📚 API Reference

### Endpoints Principales

#### `GET /api/health`
Verificación de estado del servicio.

```bash
curl http://localhost:3003/api/health
```

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "product-service",
  "version": "1.0.0"
}
```

#### `GET /api/products`
Obtener lista de productos con filtros.

```bash
curl "http://localhost:3003/api/products?category=aceite&seasonal=true"
```

**Parámetros de Query:**
- `category` - Filtrar por categoría
- `seasonal` - Filtrar por productos estacionales
- `available` - Filtrar por disponibilidad
- `search` - Búsqueda por texto
- `limit` - Límite de resultados (default: 10)
- `offset` - Offset para paginación

#### `POST /api/products`
Crear un nuevo producto.

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

#### `GET /api/products/:id`
Obtener un producto específico.

```bash
curl http://localhost:3003/api/products/prod_123
```

#### `PUT /api/products/:id`
Actualizar un producto existente.

```bash
curl -X PUT http://localhost:3003/api/products/prod_123 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 15.0,
    "stock": 200
  }'
```

#### `DELETE /api/products/:id`
Eliminar un producto.

```bash
curl -X DELETE http://localhost:3003/api/products/prod_123
```

### Modelos de Datos

#### Product
```typescript
interface Product {
  id: string;                    // ID único (formato: prod_xxx)
  name: string;                  // Nombre del producto
  category: string;              // Categoría
  seasonal: boolean;             // Es estacional
  price?: number;                // Precio
  unit?: string;                 // Unidad de medida
  description?: string;          // Descripción
  producer?: string;             // Productor
  location?: any;                // Ubicación (JSON)
  images: string[];              // URLs de imágenes
  certifications: string[];      // Certificaciones
  available: boolean;            // Disponible para venta
  stock?: number;                // Cantidad en inventario
  harvestDate?: string;          // Fecha de cosecha
  createdAt: Date;               // Fecha de creación
  updatedAt: Date;               // Fecha de actualización
}
```

## 🧪 Testing

### Cobertura de Tests

```bash
# Ejecutar todos los tests
pnpm test

# Tests con cobertura
pnpm test:coverage

# Tests en modo watch
pnpm test:watch

# Tests específicos
pnpm test -- --testNamePattern="Product Entity"
```

### Tipos de Tests

- **Unit Tests**: Entidades, value objects, casos de uso
- **Integration Tests**: Repositorios, controladores
- **E2E Tests**: Flujos completos de usuario
- **Performance Tests**: Carga y estrés

### Ejemplo de Test

```typescript
describe('Product Entity', () => {
  it('should validate product with valid data', () => {
    const product = new Product('prod_123', 'Aceite', 'aceite', true);
    expect(() => product.validate()).not.toThrow();
  });

  it('should throw error for invalid product', () => {
    const product = new Product('prod_123', '', 'aceite', true);
    expect(() => product.validate()).toThrow('Product name is required');
  });
});
```

## 🚀 Despliegue

### Docker Compose

```yaml
version: '3.8'
services:
  product-service:
    build: .
    ports:
      - "3003:3003"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/product_service_db
    depends_on:
      - postgres

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=product_service_db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: product-service
  template:
    metadata:
      labels:
        app: product-service
    spec:
      containers:
      - name: product-service
        image: product-service:latest
        ports:
        - containerPort: 3003
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

## 🤝 Contribución

### Guías de Desarrollo

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. **Commit** tus cambios (`git commit -m 'Add amazing feature'`)
4. **Push** a la rama (`git push origin feature/amazing-feature`)
5. **Abre** un Pull Request

### Estándares de Código

- **TypeScript** estricto
- **ESLint** para linting
- **Prettier** para formateo
- **Jest** para testing
- **JSDoc** para documentación

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new product validation
fix: resolve database connection issue
docs: update API documentation
test: add unit tests for Product entity
refactor: improve error handling
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- **Documentación**: [Wiki del proyecto](https://github.com/org/repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/org/repo/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/org/repo/discussions)
- **Email**: support@example.com

---

**Desarrollado con ❤️ por el equipo de A4CO** 