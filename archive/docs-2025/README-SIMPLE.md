# 🛍️ Portal de Artesanos Andaluces

> Monolito NestJS con arquitectura MVC para conectar artesanos locales con clientes

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red.svg)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [API Documentation](#api-documentation)
- [Base de Datos](#base-de-datos)
- [Testing](#testing)
- [Deployment](#deployment)

## ✨ Características

- ✅ **Arquitectura MVC** con NestJS 10
- ✅ **TypeScript** con configuración estricta
- ✅ **Prisma ORM** para gestión de base de datos
- ✅ **PostgreSQL** como base de datos principal
- ✅ **Autenticación JWT** con Passport
- ✅ **Swagger/OpenAPI** documentación automática
- ✅ **Docker** para desarrollo local
- ✅ **ESLint + Prettier** para calidad de código
- ✅ **Jest** para testing unitario e integración

## 🔧 Requisitos Previos

- **Node.js** 18+ ([descargar](https://nodejs.org/))
- **npm** 9+ (viene con Node.js)
- **Docker** & Docker Compose ([descargar](https://www.docker.com/))
- **Git** ([descargar](https://git-scm.com/))

## 🚀 Instalación

### Opción 1: Setup Automático (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/artisan-portal.git
cd artisan-portal

# Ejecutar script de setup
./scripts/setup-dev.sh
```

### Opción 2: Setup Manual

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Iniciar base de datos con Docker
docker-compose up -d postgres

# 4. Generar cliente Prisma
npm run db:generate

# 5. Ejecutar migraciones
npm run db:migrate
```

## 🎮 Uso

### Desarrollo

```bash
# Iniciar servidor en modo desarrollo
npm run start:dev

# La aplicación estará disponible en:
# - API: http://localhost:3000
# - Swagger: http://localhost:3000/api/docs
```

### Producción

```bash
# Compilar para producción
npm run build

# Iniciar servidor de producción
npm run start:prod
```

### Docker Compose

```bash
# Iniciar solo PostgreSQL
docker-compose up -d postgres

# Iniciar PostgreSQL + pgAdmin
docker-compose --profile tools up -d

# Iniciar todo (PostgreSQL + Redis + pgAdmin)
docker-compose --profile cache --profile tools up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 📁 Estructura del Proyecto

```
artisan-portal/
├── src/
│   ├── common/                 # Utilidades compartidas
│   │   └── prisma/            # Configuración de Prisma
│   ├── modules/               # Módulos de negocio
│   │   ├── auth/             # Autenticación (JWT, Passport)
│   │   ├── users/            # Gestión de usuarios
│   │   ├── products/         # Gestión de productos
│   │   └── orders/           # Gestión de pedidos
│   ├── app.module.ts         # Módulo principal
│   └── main.ts               # Entry point
├── prisma/
│   └── schema.prisma         # Esquema de base de datos
├── test/                     # Tests E2E
├── scripts/                  # Scripts de utilidad
├── .env.example              # Variables de entorno de ejemplo
├── docker-compose.yml        # Configuración Docker
├── tsconfig.json             # Configuración TypeScript
└── package.json              # Dependencias del proyecto
```

## 📜 Scripts Disponibles

### Desarrollo

```bash
npm run start:dev      # Iniciar en modo desarrollo (watch)
npm run start:debug    # Iniciar con debugger
npm run build          # Compilar proyecto
npm run start:prod     # Iniciar versión compilada
```

### Base de Datos

```bash
npm run db:generate    # Generar cliente Prisma
npm run db:migrate     # Ejecutar migraciones
npm run db:push        # Push schema sin migraciones
npm run db:studio      # Abrir Prisma Studio (GUI)
```

### Calidad de Código

```bash
npm run lint           # Ejecutar ESLint
npm run format         # Formatear con Prettier
npm run test           # Ejecutar tests
npm run test:watch     # Tests en modo watch
npm run test:cov       # Tests con coverage
npm run test:e2e       # Tests end-to-end
```

## 📚 API Documentation

La documentación interactiva de la API está disponible vía Swagger:

```
http://localhost:3000/api/docs
```

### Endpoints Principales

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto (autenticado)
- `GET /api/orders` - Listar pedidos (autenticado)
- `POST /api/orders` - Crear pedido (autenticado)

## 🗄️ Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema (CUSTOMER, ARTISAN, ADMIN)
- **Product**: Productos de artesanos
- **Order**: Pedidos de clientes
- **OrderItem**: Ítems individuales de cada pedido

### Acceso a la Base de Datos

```bash
# Prisma Studio (GUI)
npm run db:studio

# pgAdmin (si está habilitado)
http://localhost:5050
# Usuario: admin@artisan-portal.local
# Password: admin
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests con coverage
npm run test:cov

# Tests E2E
npm run test:e2e

# Tests en modo watch
npm run test:watch
```

## 🚢 Deployment

### Variables de Entorno de Producción

Asegúrate de configurar estas variables en producción:

```bash
NODE_ENV=production
DATABASE_URL=<tu-conexión-postgresql>
JWT_SECRET=<secreto-generado-con-openssl>
PORT=3000
```

### Build para Producción

```bash
# Instalar solo dependencias de producción
npm ci --only=production

# Compilar
npm run build

# Ejecutar
npm run start:prod
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y no tiene licencia pública.

## 👥 Autores

- **A4CO Team** - _Desarrollo inicial_

## 🙏 Agradecimientos

- NestJS por el framework
- Prisma por el ORM
- La comunidad de TypeScript

---

**Hecho con ❤️ para artesanos andaluces**
