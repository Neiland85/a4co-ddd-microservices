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

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

