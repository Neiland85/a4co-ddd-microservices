# 🛍️ Portal de Artesanos

Un monolito simple construido con **NestJS** y **Next.js** para conectar artesanos con clientes.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar base de datos
cp .env.example .env
# Editar .env con tus credenciales de BD

# Ejecutar migraciones de Prisma
npm run prisma:migrate

# Generar cliente de Prisma
npm run prisma:generate

# Iniciar en modo desarrollo
npm run start:dev
```

## 📁 Estructura del Proyecto

```
src/
├── modules/           # Módulos de negocio
│   ├── auth/         # Autenticación
│   ├── products/     # Gestión de productos
│   ├── orders/       # Pedidos
│   ├── users/        # Usuarios
│   └── artisans/     # Artesanos
├── common/           # Utilidades compartidas
├── config/           # Configuración
└── main.ts           # Punto de entrada
```

## 🛠️ Scripts Disponibles

- `npm run start:dev` - Inicia en modo desarrollo
- `npm run build` - Construye para producción
- `npm run start:prod` - Inicia en modo producción
- `npm run test` - Ejecuta tests
- `npm run lint` - Ejecuta linter

## 🗄️ Base de Datos

### Prisma ORM

- Schema: `prisma/schema.prisma`
- Migraciones: `npm run prisma:migrate`
- Studio: `npm run prisma:studio`

### Variables de Entorno

```env
DATABASE_URL="postgresql://user:password@localhost:5432/artisan_portal"
JWT_SECRET="your-secret-key"
```

## 📦 Tecnologías

- **Backend**: NestJS, TypeScript, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT
- **Validación**: class-validator
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 📊 Observabilidad (PR4)

El proyecto incluye una infraestructura completa de observabilidad para monitoreo, logging y alertas.

### Stack de Observabilidad

- **Grafana**: Dashboards y visualización
- **Prometheus**: Recolección de métricas
- **Loki**: Agregación de logs
- **Promtail**: Recolección de logs
- **AlertManager**: Gestión de alertas
- **NATS Exporter**: Métricas de NATS

### Inicio Rápido

```bash
# Iniciar stack de observabilidad
./scripts/start-observability.sh

# Acceder a Grafana
# URL: http://localhost:3000 (admin/admin)
```

### Dashboards Disponibles

- **Main Dashboard**: Métricas HTTP, latencia, disponibilidad
- **Events Dashboard**: Eventos publicados/consumidos, errores, latencia
- **NATS Dashboard**: Clientes, throughput, JetStream, consumer lag

### Documentación

- **Guía Rápida**: `infra/observability/README.md`
- **Documentación Completa**: `docs/PR4-OBSERVABILITY-SETUP.md` (50KB)

### Comandos Útiles

```bash
# Ver logs
docker-compose -f docker-compose.observability.yml logs -f

# Detener stack
./scripts/stop-observability.sh

# Detener y eliminar datos
./scripts/stop-observability.sh --remove-volumes
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

