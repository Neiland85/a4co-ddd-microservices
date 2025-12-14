# A4CO Dashboard Client

Panel de administración frontend para el ecosistema A4CO de comercio colaborativo andaluz.

## 🚀 Características

- **Autenticación JWT**: Login seguro con tokens de acceso
- **Gestión de Productos**: Explorar catálogo, búsqueda y filtros
- **Carrito de Compras**: Sistema simplificado de compra
- **Órdenes**: Historial completo con seguimiento de estados
- **UI Moderna**: Componentes responsivos con Tailwind CSS y shadcn/ui
- **Notificaciones**: Sistema de toast para feedback visual
- **Manejo de Errores**: Interceptores HTTP con redirección automática

## 📋 Requisitos Previos

- Node.js 18+ o superior
- pnpm 8+ (recomendado) o npm
- Backend API Gateway ejecutándose en `http://localhost:4000`

## 🛠️ Instalación

1. **Instalar dependencias:**

```bash
pnpm install
```

2. **Configurar variables de entorno:**

```bash
cp .env.example .env.local
```

Variables disponibles:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=A4CO Dashboard
NEXT_PUBLIC_LOG_LEVEL=info
```

## 🏃 Ejecución

### Modo Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Producción

```bash
pnpm build
pnpm start
```

## 🔌 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Usuario actual

### Productos
- `GET /products` - Listar productos
- `GET /products/:id` - Detalle

### Órdenes
- `POST /orders` - Crear orden
- `GET /orders/my-orders` - Mis órdenes
- `GET /orders/:id` - Detalle de orden

## 🎯 Flujo de Usuario

1. **Login** → Autenticación con JWT
2. **Productos** → Explorar catálogo y filtrar
3. **Comprar** → Modal de confirmación con cantidad y dirección
4. **Órdenes** → Ver historial con estados (PENDING, CONFIRMED, FAILED)
5. **Detalle** → Timeline completo de la orden

## 🔐 Autenticación

JWT almacenado en localStorage con redirección automática en caso de expiración (401).

## 📁 Estructura

```
app/                    # Next.js App Router
├── login/             # Autenticación
├── dashboard/
│   ├── products/      # Catálogo
│   └── orders/        # Órdenes
components/
├── auth/              # Login, protección
├── products/          # Cards, grid, modal
├── orders/            # Tabla, detalle, timeline
└── common/            # Toast, spinners
lib/
├── types/             # TypeScript definitions
├── services/          # API clients
├── context/           # React contexts
└── hooks/             # Custom hooks
```

## 🐛 Manejo de Errores

- **401**: Sesión expirada → redirect login
- **400**: Validación → toast error
- **500**: Server error → toast retry
- **Network**: Conexión fallida → toast

## 📚 Recursos

- [Next.js 15](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

**A4CO DevOps Team** © 2025
