# PLAN: MIGRACIÓN A MONOLITO SIMPLE
## Portal Artesanos Jaén/Andalucía

**Fecha:** 8 Noviembre 2025
**Decisión:** Opción 1 - Monolito Modular
**Timeline:** 140 horas = 3-4 semanas (1 dev) = 6-7 semanas (part-time)

---

## ARQUITECTURA OBJETIVO

```
┌──────────────────────────────────────────┐
│     FRONTEND (React + Vite)              │
│  • Listado de artesanos                  │
│  • Búsqueda y filtros (ubicación)        │
│  • Perfil detallado artesano             │
│  • Galería de productos                  │
│  • Contacto directo                      │
└──────────────┬───────────────────────────┘
               │ HTTP REST API
┌──────────────┴───────────────────────────┐
│   BACKEND MONOLITO (NestJS)              │
│  ┌────────────────────────────────────┐  │
│  │  Auth Module      (Reutilizar)    │  │
│  │  Artisan Module   (CREAR - CORE)  │  │
│  │  Product Module   (Reutilizar)    │  │
│  │  Geo Module       (Crear)         │  │
│  │  User Module      (Reutilizar)    │  │
│  └────────────────────────────────────┘  │
│                                           │
│  Shared:                                 │
│  • Prisma ORM                            │
│  • JWT Auth                              │
│  • Winston Logs                          │
│  • Helmet Security                       │
└──────────────┬───────────────────────────┘
               │
┌──────────────┴───────────────────────────┐
│     PostgreSQL (Single Database)         │
│  • users                                 │
│  • artisans (NUEVA TABLA)                │
│  • products                              │
│  • categories                            │
│  • provinces / municipalities            │
│  • reviews (NUEVA TABLA)                 │
└──────────────────────────────────────────┘
```

---

## ESTRATEGIA: Reutilizar código existente

### ✅ LO QUE REUTILIZAMOS (Ya existe y funciona):
```
FROM microservicios actuales:
├── apps/auth-service/src/**        → backend/src/modules/auth/
├── apps/user-service/src/**        → backend/src/modules/user/
├── apps/product-service/src/**     → backend/src/modules/product/
└── apps/frontend/**                → frontend/ (con ajustes)

Ahorro: ~150 horas de desarrollo
```

### 🆕 LO QUE CREAMOS DESDE CERO:
```
1. backend/src/modules/artisan/     (50 horas)
2. backend/src/modules/geo/         (25 horas)
3. Integración y ajustes             (30 horas)
4. Frontend integración              (30 horas)
5. Testing básico                    (20 horas)
6. Deploy                            (10 horas)
```

### ❌ LO QUE ELIMINAMOS:
```
- Jaeger / OpenTelemetry completo
- Prometheus / Grafana
- NATS message broker
- Gateway (no necesario en monolito)
- 6 servicios vacíos innecesarios
- Saga pattern / Event sourcing
- Docker Compose con 16 servicios
```

---

## ESTRUCTURA DEL PROYECTO SIMPLIFICADO

```
a4co-portal-artesanos/
├── backend/                        # Monolito NestJS
│   ├── src/
│   │   ├── main.ts                 # Entry point
│   │   ├── app.module.ts           # App root module
│   │   ├── modules/
│   │   │   ├── auth/               # ✅ Reutilizar
│   │   │   │   ├── domain/
│   │   │   │   ├── application/
│   │   │   │   ├── infrastructure/
│   │   │   │   └── presentation/
│   │   │   ├── user/               # ✅ Reutilizar
│   │   │   ├── product/            # ✅ Reutilizar
│   │   │   ├── artisan/            # 🆕 CREAR (CORE)
│   │   │   │   ├── domain/
│   │   │   │   │   ├── artisan.entity.ts
│   │   │   │   │   ├── specialty.vo.ts
│   │   │   │   │   └── location.vo.ts
│   │   │   │   ├── application/
│   │   │   │   │   ├── create-artisan.use-case.ts
│   │   │   │   │   ├── find-artisans.use-case.ts
│   │   │   │   │   └── update-artisan.use-case.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── artisan.repository.ts
│   │   │   │   │   └── prisma/
│   │   │   │   └── presentation/
│   │   │   │       ├── artisan.controller.ts
│   │   │   │       └── dto/
│   │   │   └── geo/                # 🆕 CREAR
│   │   │       ├── domain/
│   │   │       ├── application/
│   │   │       ├── infrastructure/
│   │   │       └── presentation/
│   │   ├── shared/
│   │   │   ├── config/
│   │   │   ├── guards/
│   │   │   ├── filters/
│   │   │   └── interceptors/
│   │   └── common/
│   │       ├── logger.service.ts   # Winston simple
│   │       └── health.controller.ts
│   ├── prisma/
│   │   ├── schema.prisma           # Consolidado
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.example
│
├── frontend/                       # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Listado artesanos
│   │   │   ├── ArtisanDetail.tsx   # Perfil artesano
│   │   │   ├── Search.tsx          # Búsqueda avanzada
│   │   │   └── Contact.tsx         # Contacto
│   │   ├── components/
│   │   │   ├── ArtisanCard.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   ├── Map.tsx             # Mapa Leaflet
│   │   │   └── Gallery.tsx
│   │   ├── services/
│   │   │   └── api.ts              # Axios client
│   │   ├── hooks/
│   │   ├── context/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.simple.yml   # Solo 3 servicios
│
├── docs/
│   ├── API.md
│   ├── SETUP.md
│   └── DEPLOYMENT.md
│
├── scripts/
│   ├── migrate-to-monolith.sh
│   └── seed-data.sh
│
└── README.md
```

---

## FASES DE IMPLEMENTACIÓN

### FASE 1: SETUP INICIAL (5 horas)

#### 1.1 Crear estructura base (2h)
```bash
# Crear nueva rama
git checkout -b feature/migrate-to-monolith

# Crear estructura
mkdir -p backend/src/{modules/{auth,user,product,artisan,geo},shared,common}
mkdir -p frontend-monolith

# Copiar package.json base
cp apps/auth-service/package.json backend/package.json
```

#### 1.2 Configurar backend monolito (2h)
```bash
cd backend

# Instalar dependencias
pnpm install @nestjs/core @nestjs/common @nestjs/platform-express
pnpm install @prisma/client prisma
pnpm install class-validator class-transformer
pnpm install @nestjs/jwt @nestjs/passport passport-jwt
pnpm install winston

# Inicializar Prisma
pnpx prisma init
```

#### 1.3 Crear app.module.ts (1h)
```typescript
// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { ArtisanModule } from './modules/artisan/artisan.module';
import { GeoModule } from './modules/geo/geo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ProductModule,
    ArtisanModule,
    GeoModule,
  ],
})
export class AppModule {}
```

---

### FASE 2: MIGRAR MÓDULOS EXISTENTES (10 horas)

#### 2.1 Migrar Auth Module (3h)
```bash
# Copiar código
cp -r apps/auth-service/src/domain backend/src/modules/auth/
cp -r apps/auth-service/src/application backend/src/modules/auth/
cp -r apps/auth-service/src/infrastructure backend/src/modules/auth/
cp -r apps/auth-service/src/presentation backend/src/modules/auth/

# Ajustar imports
# Cambiar: from '@a4co/shared-utils'
# Por: from '../../../shared/...'
```

#### 2.2 Migrar User Module (2h)
```bash
cp -r apps/user-service/src/* backend/src/modules/user/
# Ajustar imports y paths
```

#### 2.3 Migrar Product Module (3h)
```bash
cp -r apps/product-service/src/* backend/src/modules/product/
# Ajustar imports y paths
```

#### 2.4 Consolidar Prisma Schema (2h)
```prisma
// backend/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Users & Auth
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  artisan   Artisan?
  reviews   Review[]
}

enum Role {
  USER
  ARTISAN
  ADMIN
}

// Artisans (NUEVA TABLA - CORE)
model Artisan {
  id           String   @id @default(uuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])

  businessName String
  description  String?
  specialty    String   // cerámica, textil, cuero, etc.
  phone        String?
  whatsapp     String?
  website      String?

  // Location
  provinceId   String
  province     Province @relation(fields: [provinceId], references: [id])
  municipality String
  address      String?

  // Gallery
  logo         String?
  coverImage   String?
  images       String[] // URLs

  // Rating
  rating       Float    @default(0)
  reviewCount  Int      @default(0)

  verified     Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  products     Product[]
  reviews      Review[]

  @@index([provinceId, specialty])
  @@index([specialty])
}

// Products
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  images      String[]
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  artisanId   String?
  artisan     Artisan? @relation(fields: [artisanId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@index([artisanId])
}

model Category {
  id       String    @id @default(uuid())
  name     String    @unique
  slug     String    @unique
  products Product[]
}

// Geo
model Province {
  id        String    @id @default(uuid())
  name      String    @unique
  code      String    @unique // JA, CO, GR, SE, etc.
  artisans  Artisan[]
}

// Reviews (NUEVA TABLA)
model Review {
  id        String   @id @default(uuid())
  rating    Int      // 1-5
  comment   String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  artisanId String
  artisan   Artisan  @relation(fields: [artisanId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, artisanId])
  @@index([artisanId])
}
```

---

### FASE 3: CREAR ARTISAN MODULE (50 horas) 🎯 CORE

#### 3.1 Domain Layer (10h)

```typescript
// backend/src/modules/artisan/domain/artisan.entity.ts
export class Artisan {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public businessName: string,
    public description: string | null,
    public specialty: Specialty,
    public location: Location,
    public contact: Contact,
    public gallery: Gallery,
    public rating: Rating,
    public verified: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  updateProfile(data: Partial<ArtisanProfile>): void {
    // Business logic
  }

  addImage(url: string): void {
    this.gallery.addImage(url);
  }

  updateRating(newRating: number): void {
    this.rating.addRating(newRating);
  }
}

// Value Objects
export class Specialty {
  private static readonly VALID_SPECIALTIES = [
    'ceramica',
    'textil',
    'cuero',
    'madera',
    'joyeria',
    'vidrio',
    'metal',
    'otros'
  ];

  constructor(public readonly value: string) {
    if (!Specialty.VALID_SPECIALTIES.includes(value)) {
      throw new Error('Invalid specialty');
    }
  }
}

export class Location {
  constructor(
    public readonly provinceId: string,
    public readonly municipality: string,
    public readonly address: string | null,
  ) {}
}

export class Contact {
  constructor(
    public readonly phone: string | null,
    public readonly whatsapp: string | null,
    public readonly website: string | null,
  ) {}
}

export class Gallery {
  constructor(
    public logo: string | null,
    public coverImage: string | null,
    public images: string[],
  ) {
    if (images.length > 10) {
      throw new Error('Maximum 10 images allowed');
    }
  }

  addImage(url: string): void {
    if (this.images.length >= 10) {
      throw new Error('Maximum images reached');
    }
    this.images.push(url);
  }
}

export class Rating {
  constructor(
    public average: number,
    public count: number,
  ) {}

  addRating(newRating: number): void {
    const total = this.average * this.count + newRating;
    this.count += 1;
    this.average = total / this.count;
  }
}
```

#### 3.2 Application Layer (15h)

```typescript
// backend/src/modules/artisan/application/create-artisan.use-case.ts
@Injectable()
export class CreateArtisanUseCase {
  constructor(
    private readonly artisanRepository: ArtisanRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateArtisanCommand): Promise<Artisan> {
    // 1. Validate user exists and not already artisan
    const user = await this.userRepository.findById(command.userId);
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.artisanRepository.findByUserId(command.userId);
    if (existing) throw new ConflictException('User already has artisan profile');

    // 2. Create artisan entity
    const artisan = new Artisan(
      uuidv4(),
      command.userId,
      command.businessName,
      command.description,
      new Specialty(command.specialty),
      new Location(command.provinceId, command.municipality, command.address),
      new Contact(command.phone, command.whatsapp, command.website),
      new Gallery(null, null, []),
      new Rating(0, 0),
      false, // verified
      new Date(),
      new Date(),
    );

    // 3. Save
    return await this.artisanRepository.save(artisan);
  }
}

// backend/src/modules/artisan/application/find-artisans.use-case.ts
@Injectable()
export class FindArtisansUseCase {
  constructor(private readonly artisanRepository: ArtisanRepository) {}

  async execute(query: FindArtisansQuery): Promise<PaginatedResult<Artisan>> {
    const filters = {
      provinceId: query.provinceId,
      specialty: query.specialty,
      municipality: query.municipality,
      search: query.search,
    };

    const pagination = {
      page: query.page || 1,
      limit: query.limit || 20,
    };

    return await this.artisanRepository.findMany(filters, pagination);
  }
}

// backend/src/modules/artisan/application/update-artisan.use-case.ts
// backend/src/modules/artisan/application/get-artisan-detail.use-case.ts
// backend/src/modules/artisan/application/upload-images.use-case.ts
// ... etc
```

#### 3.3 Infrastructure Layer (15h)

```typescript
// backend/src/modules/artisan/infrastructure/artisan.repository.ts
@Injectable()
export class PrismaArtisanRepository implements ArtisanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(artisan: Artisan): Promise<Artisan> {
    const data = {
      id: artisan.id,
      userId: artisan.userId,
      businessName: artisan.businessName,
      description: artisan.description,
      specialty: artisan.specialty.value,
      provinceId: artisan.location.provinceId,
      municipality: artisan.location.municipality,
      address: artisan.location.address,
      phone: artisan.contact.phone,
      whatsapp: artisan.contact.whatsapp,
      website: artisan.contact.website,
      logo: artisan.gallery.logo,
      coverImage: artisan.gallery.coverImage,
      images: artisan.gallery.images,
      rating: artisan.rating.average,
      reviewCount: artisan.rating.count,
      verified: artisan.verified,
      createdAt: artisan.createdAt,
      updatedAt: artisan.updatedAt,
    };

    const saved = await this.prisma.artisan.upsert({
      where: { id: artisan.id },
      create: data,
      update: data,
    });

    return this.toDomain(saved);
  }

  async findMany(
    filters: ArtisanFilters,
    pagination: Pagination,
  ): Promise<PaginatedResult<Artisan>> {
    const where: any = {};

    if (filters.provinceId) where.provinceId = filters.provinceId;
    if (filters.specialty) where.specialty = filters.specialty;
    if (filters.municipality) where.municipality = { contains: filters.municipality };
    if (filters.search) {
      where.OR = [
        { businessName: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.artisan.findMany({
        where,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        include: {
          province: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { rating: 'desc' },
      }),
      this.prisma.artisan.count({ where }),
    ]);

    return {
      items: items.map(this.toDomain),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findById(id: string): Promise<Artisan | null> {
    const artisan = await this.prisma.artisan.findUnique({
      where: { id },
      include: { province: true, products: true },
    });
    return artisan ? this.toDomain(artisan) : null;
  }

  private toDomain(raw: any): Artisan {
    return new Artisan(
      raw.id,
      raw.userId,
      raw.businessName,
      raw.description,
      new Specialty(raw.specialty),
      new Location(raw.provinceId, raw.municipality, raw.address),
      new Contact(raw.phone, raw.whatsapp, raw.website),
      new Gallery(raw.logo, raw.coverImage, raw.images),
      new Rating(raw.rating, raw.reviewCount),
      raw.verified,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
```

#### 3.4 Presentation Layer (10h)

```typescript
// backend/src/modules/artisan/presentation/artisan.controller.ts
@Controller('artisans')
@ApiTags('artisans')
export class ArtisanController {
  constructor(
    private readonly createArtisan: CreateArtisanUseCase,
    private readonly findArtisans: FindArtisansUseCase,
    private readonly getArtisanDetail: GetArtisanDetailUseCase,
    private readonly updateArtisan: UpdateArtisanUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create artisan profile' })
  async create(
    @Body() dto: CreateArtisanDto,
    @CurrentUser() user: User,
  ) {
    const command = new CreateArtisanCommand(user.id, dto);
    return await this.createArtisan.execute(command);
  }

  @Get()
  @ApiOperation({ summary: 'Search artisans with filters' })
  async findAll(@Query() query: FindArtisansDto) {
    return await this.findArtisans.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artisan detail' })
  async findOne(@Param('id') id: string) {
    return await this.getArtisanDetail.execute({ id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update artisan profile' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateArtisanDto,
    @CurrentUser() user: User,
  ) {
    return await this.updateArtisan.execute({ id, userId: user.id, data: dto });
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload artisan image' })
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Upload to S3 or local storage
    // Return URL
  }
}
```

---

### FASE 4: CREAR GEO MODULE (25 horas)

```typescript
// backend/src/modules/geo/domain/province.entity.ts
export class Province {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly municipalities: string[],
  ) {}
}

// backend/src/modules/geo/presentation/geo.controller.ts
@Controller('geo')
export class GeoController {
  @Get('provinces')
  async getProvinces() {
    // Return: Jaén, Córdoba, Granada, Sevilla, Málaga, Cádiz, Huelva, Almería
    return ANDALUSIA_PROVINCES;
  }

  @Get('provinces/:code/municipalities')
  async getMunicipalities(@Param('code') code: string) {
    // Return municipalities for province
    return MUNICIPALITIES[code];
  }
}

// Seed data
const ANDALUSIA_PROVINCES = [
  { id: '1', name: 'Jaén', code: 'JA' },
  { id: '2', name: 'Córdoba', code: 'CO' },
  { id: '3', name: 'Granada', code: 'GR' },
  { id: '4', name: 'Sevilla', code: 'SE' },
  { id: '5', name: 'Málaga', code: 'MA' },
  { id: '6', name: 'Cádiz', code: 'CA' },
  { id: '7', name: 'Huelva', code: 'HU' },
  { id: '8', name: 'Almería', code: 'AL' },
];
```

---

### FASE 5: FRONTEND (30 horas)

#### 5.1 Setup (5h)
```bash
cd frontend-monolith
pnpm create vite . --template react-ts
pnpm install axios react-router-dom
pnpm install @tanstack/react-query
pnpm install leaflet react-leaflet
pnpm install lucide-react
```

#### 5.2 API Client (5h)
```typescript
// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptors para auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const artisanApi = {
  findAll: (params) => api.get('/artisans', { params }),
  findOne: (id) => api.get(`/artisans/${id}`),
  create: (data) => api.post('/artisans', data),
  update: (id, data) => api.patch(`/artisans/${id}`, data),
};

export const geoApi = {
  getProvinces: () => api.get('/geo/provinces'),
  getMunicipalities: (provinceCode) => api.get(`/geo/provinces/${provinceCode}/municipalities`),
};
```

#### 5.3 Pages (15h)
```typescript
// frontend/src/pages/Home.tsx - Listado de artesanos
// frontend/src/pages/ArtisanDetail.tsx - Perfil completo
// frontend/src/pages/Search.tsx - Búsqueda avanzada
// frontend/src/components/ArtisanCard.tsx
// frontend/src/components/SearchFilters.tsx
// frontend/src/components/Map.tsx - Mapa con Leaflet
```

#### 5.4 Integración (5h)
```typescript
// React Query para data fetching
// React Router para navegación
// Context para auth state
```

---

### FASE 6: LOGGING SIMPLE (5 horas)

```typescript
// backend/src/common/logger.service.ts
import * as winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Usage
logger.info('Artisan created', { artisanId, userId });
logger.error('Failed to create artisan', { error, userId });
```

---

### FASE 7: TESTING (20 horas)

```typescript
// backend/test/artisan.e2e-spec.ts
describe('Artisan Module (e2e)', () => {
  it('POST /artisans - should create artisan', async () => {
    const response = await request(app.getHttpServer())
      .post('/artisans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        businessName: 'Cerámica García',
        specialty: 'ceramica',
        provinceId: '1', // Jaén
        municipality: 'Úbeda',
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.businessName).toBe('Cerámica García');
  });

  it('GET /artisans - should filter by province', async () => {
    const response = await request(app.getHttpServer())
      .get('/artisans?provinceId=1')
      .expect(200);

    expect(response.body.items).toBeDefined();
    expect(response.body.items.length).toBeGreaterThan(0);
  });
});
```

---

### FASE 8: DOCKER SIMPLIFICADO (5 horas)

```yaml
# docker-compose.simple.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/artesanos_db
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend-monolith
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    environment:
      - VITE_API_URL=http://localhost:3000

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: artesanos_db
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

---

### FASE 9: DEPLOYMENT (10 horas)

#### Opción 1: VPS Simple (Hetzner/DigitalOcean)
```bash
# 1. Provisionar servidor ($5-10/mes)
# 2. Instalar Docker + Docker Compose
# 3. Setup Nginx como reverse proxy
# 4. SSL con Let's Encrypt
# 5. Deploy con docker-compose
```

#### Opción 2: Railway/Render (PaaS)
```bash
# 1. Conectar repo GitHub
# 2. Configurar variables de entorno
# 3. Deploy automático
# Costo: ~$20-30/mes
```

---

## RESUMEN DE HORAS

| Fase | Tarea | Horas |
|------|-------|-------|
| 1 | Setup inicial | 5 |
| 2 | Migrar módulos existentes | 10 |
| 3 | Crear Artisan Module | 50 |
| 4 | Crear Geo Module | 25 |
| 5 | Frontend integración | 30 |
| 6 | Logging simple | 5 |
| 7 | Testing | 20 |
| 8 | Docker | 5 |
| 9 | Deployment | 10 |
| **TOTAL** | | **160h** |

**Ajustado:** 140-160 horas = **3-4 semanas full-time** o **6-8 semanas part-time**

---

## SCRIPTS DE MIGRACIÓN

```bash
# scripts/migrate-to-monolith.sh
#!/bin/bash

echo "🚀 Migrando a Monolito..."

# 1. Crear estructura
mkdir -p backend/src/modules/{auth,user,product,artisan,geo}
mkdir -p frontend-monolith

# 2. Copiar código existente
echo "📦 Copiando módulos existentes..."
cp -r apps/auth-service/src/* backend/src/modules/auth/
cp -r apps/user-service/src/* backend/src/modules/user/
cp -r apps/product-service/src/* backend/src/modules/product/

# 3. Ajustar imports
echo "🔧 Ajustando imports..."
find backend/src/modules -type f -name "*.ts" -exec sed -i '' 's/@a4co\/shared-utils/..\/..\/..\/shared/g' {} +

# 4. Consolidar Prisma
echo "🗄️ Consolidando esquema Prisma..."
cat apps/auth-service/prisma/schema.prisma > backend/prisma/schema.prisma
cat apps/user-service/prisma/schema.prisma >> backend/prisma/schema.prisma
cat apps/product-service/prisma/schema.prisma >> backend/prisma/schema.prisma

# 5. Eliminar duplicados en schema
# (manual: revisar y limpiar)

echo "✅ Migración completada. Revisar backend/prisma/schema.prisma manualmente"
```

---

## SEED DATA

```typescript
// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Provincias de Andalucía
  const provinces = [
    { name: 'Jaén', code: 'JA' },
    { name: 'Córdoba', code: 'CO' },
    { name: 'Granada', code: 'GR' },
    { name: 'Sevilla', code: 'SE' },
    { name: 'Málaga', code: 'MA' },
    { name: 'Cádiz', code: 'CA' },
    { name: 'Huelva', code: 'HU' },
    { name: 'Almería', code: 'AL' },
  ];

  for (const province of provinces) {
    await prisma.province.upsert({
      where: { code: province.code },
      update: {},
      create: province,
    });
  }

  // Categorías de productos
  const categories = [
    { name: 'Cerámica', slug: 'ceramica' },
    { name: 'Textil', slug: 'textil' },
    { name: 'Cuero', slug: 'cuero' },
    { name: 'Madera', slug: 'madera' },
    { name: 'Joyería', slug: 'joyeria' },
    { name: 'Vidrio', slug: 'vidrio' },
    { name: 'Metal', slug: 'metal' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Seed data created');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

---

## PRÓXIMOS PASOS INMEDIATOS

### HOY (2-3 horas):
1. [ ] Revisar este plan completo
2. [ ] Crear rama `feature/migrate-to-monolith`
3. [ ] Ejecutar `scripts/migrate-to-monolith.sh`
4. [ ] Validar que código copiado compila

### ESTA SEMANA (20-30 horas):
1. [ ] Completar Fase 1: Setup (5h)
2. [ ] Completar Fase 2: Migración (10h)
3. [ ] Comenzar Fase 3: Artisan Module (15h)

### PRÓXIMAS 2 SEMANAS (60-80 horas):
1. [ ] Completar Artisan Module (35h restantes)
2. [ ] Completar Geo Module (25h)
3. [ ] Comenzar Frontend (15h)

---

## MÉTRICAS DE ÉXITO

### Definición de "LISTO":
- [ ] Backend monolito con 5 módulos funcionando
- [ ] Artisan Module 100% implementado
- [ ] Frontend con listado + búsqueda + detalle
- [ ] API REST documentada (Swagger)
- [ ] Tests básicos >50% cobertura crítica
- [ ] Docker Compose con 3 servicios
- [ ] Deployed en servidor de staging
- [ ] Sin Jaeger/OpenTelemetry/NATS
- [ ] Logs simples con Winston
- [ ] Health checks funcionando

### KPIs:
- Tiempo de respuesta API: <200ms (p95)
- Uptime: >99%
- Bugs críticos: 0
- Cobertura testing: >50%

---

## ESCALADO FUTURO

### Cuándo migrar a microservicios:
- [ ] >10,000 artesanos registrados
- [ ] >100,000 usuarios/mes
- [ ] Equipo >5 desarrolladores
- [ ] Necesidad de escalar componentes específicos
- [ ] SLA requirements >99.9%

### Por ahora: KISS (Keep It Simple, Stupid)
- Monolito es suficiente para 90% casos de uso
- Más rápido de desarrollar
- Más fácil de mantener
- Más barato de operar
- Escala a 10K+ usuarios sin problema

---

**¿Listo para empezar? 🚀**

Siguiente paso: Crear rama y ejecutar script de migración.
