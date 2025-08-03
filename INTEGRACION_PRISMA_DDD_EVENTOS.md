# 🗄️ INTEGRACIÓN PRISMA + DDD + EVENTOS DE DOMINIO

**Proyecto:** A4CO DDD Marketplace Local de Jaén  
**Fecha:** Enero 2025  
**Enfoque:** Prisma ORM + Domain-Driven Design + Event-Driven Architecture

---

## 🎯 RESUMEN EJECUTIVO

Esta documentación presenta una implementación completa de **Persistencia DDD** usando **Prisma ORM** para el `product-service`, integrando:

1. **Esquema de Base de Datos** optimizado para patrones DDD
2. **Entidades de Dominio** con agregados, value objects y eventos
3. **Repositorios** que mapean entre dominio y persistencia
4. **Servicios de Aplicación** que coordinan casos de uso
5. **Eventos de Dominio** para comunicación entre microservicios

---

## 📊 ARQUITECTURA DE PERSISTENCIA

### Capas de la Aplicación

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│         (Controllers, DTOs)             │
├─────────────────────────────────────────┤
│          APPLICATION LAYER              │
│    (Services, Use Cases, Commands)      │
├─────────────────────────────────────────┤
│            DOMAIN LAYER                 │
│   (Entities, Value Objects, Events)     │
├─────────────────────────────────────────┤
│         INFRASTRUCTURE LAYER            │
│    (Repositories, Prisma, EventBus)     │
└─────────────────────────────────────────┘
```

### Patrón Repository con Prisma

```typescript
// Separación clara entre dominio e infraestructura
Domain Entity ←→ Repository Interface ←→ Prisma Repository ←→ Database
```

---

## 🏗️ ESQUEMA DE BASE DE DATOS (PRISMA)

### Características Clave del Diseño

1. **Agregados como tablas principales** (`Product`, `Category`, `Artisan`)
2. **Entidades relacionadas** (`ProductVariant`, `ProductImage`)
3. **Value Objects embebidos** (`Money`, `Address` como JSON)
4. **Índices optimizados** para consultas frecuentes
5. **Integridad referencial** con cascadas apropiadas
6. **Campos de auditoría** (createdAt, updatedAt)

### Ejemplo de Agregado Product

```prisma
model Product {
  id                String   @id @default(cuid())
  
  // Información básica
  name              String
  description       String?
  sku               String   @unique
  
  // Value Object Money embebido
  price             Decimal  @db.Decimal(10, 2)
  originalPrice     Decimal? @db.Decimal(10, 2)
  currency          String   @default("EUR")
  
  // Referencias a otros bounded contexts
  artisanId         String
  categoryId        String
  
  // Business rules
  status            ProductStatus @default(DRAFT)
  availability      ProductAvailability @default(AVAILABLE)
  
  // Relaciones dentro del agregado
  variants          ProductVariant[]
  images            ProductImage[]
  specifications    ProductSpecification[]
  
  // Índices para performance
  @@index([artisanId])
  @@index([categoryId])
  @@index([status, availability])
}
```

### Ventajas de este Diseño

✅ **Consistencia del Agregado**: Todas las entidades relacionadas se persisten juntas  
✅ **Performance**: Índices estratégicos para consultas frecuentes  
✅ **Flexibilidad**: JSON para atributos variables de productos  
✅ **Escalabilidad**: Diseño preparado para sharding por artesano  
✅ **Auditoría**: Campos de timestamp automáticos  

---

## 🏛️ ENTIDADES DE DOMINIO CON DDD

### Agregado Root: Product

```typescript
export class Product extends AggregateRoot {
  // Estado interno protegido
  private _status: ProductStatus;
  private _price: Money;
  private _variants: ProductVariant[] = [];
  
  constructor(
    id: string,
    public readonly name: string,
    // ... otros parámetros
  ) {
    super(id);
    
    // Validaciones de dominio
    if (!name.trim()) {
      throw new Error('Product name cannot be empty');
    }
    
    // Evento de dominio
    this.addDomainEvent(new ProductCreatedEvent(id, {
      name, price, artisanId, categoryId, createdAt: new Date()
    }));
  }
  
  // Métodos de negocio
  publish(): void {
    if (this._images.length === 0) {
      throw new Error('Product must have at least one image');
    }
    
    this._status = ProductStatus.PUBLISHED;
    this.addDomainEvent(new ProductPublishedEvent(/*...*/));
  }
}
```

### Value Objects Inmutables

```typescript
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'EUR'
  ) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
  }
  
  equals(other: Money): boolean {
    return this.amount === other.amount && 
           this.currency === other.currency;
  }
  
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }
}
```

### Eventos de Dominio

```typescript
export class ProductCreatedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      name: string;
      price: Money;
      artisanId: string;
      categoryId: string;
      createdAt: Date;
    }
  ) {
    super(productId, data);
  }
}
```

---

## 🔄 REPOSITORIO CON MAPEO PRISMA ↔ DOMINIO

### Interfaz del Repositorio (Domain Layer)

```typescript
export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findByArtisan(artisanId: string): Promise<Product[]>;
  search(query: string, filters?: SearchFilters): Promise<Product[]>;
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### Implementación con Prisma (Infrastructure Layer)

```typescript
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(product: Product): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Crear producto principal
      await tx.product.create({
        data: {
          id: product.id,
          name: product.name,
          price: product.price.amount,
          currency: product.price.currency,
          status: product.status,
          // ... otros campos
        }
      });

      // Crear entidades relacionadas
      if (product.variants.length > 0) {
        await tx.productVariant.createMany({
          data: product.variants.map(variant => ({
            id: variant.id,
            productId: product.id,
            name: variant.name,
            price: variant.price.amount,
            attributes: variant.attributes, // JSON
          }))
        });
      }
    });
  }

  private mapToDomainEntity(productData: any): Product {
    const price = new Money(
      productData.price.toNumber(), 
      productData.currency
    );
    
    const product = new Product(
      productData.id,
      productData.name,
      productData.description,
      productData.sku,
      price,
      // ... otros parámetros
    );
    
    // Reconstruir agregado completo
    productData.variants?.forEach((variantData: any) => {
      const variant = new ProductVariant(/*...*/);
      product.addVariant(variant);
    });
    
    return product;
  }
}
```

### Ventajas del Mapeo

✅ **Separación de Responsabilidades**: Dominio independiente de persistencia  
✅ **Flexibilidad**: Cambios en BD no afectan reglas de negocio  
✅ **Testabilidad**: Repositorios pueden ser mockeados fácilmente  
✅ **Transacciones**: Consistencia del agregado garantizada  

---

## 🚀 SERVICIO DE APLICACIÓN (USE CASES)

### Coordinación de Casos de Uso

```typescript
export class ProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly eventBus: IEventBus
  ) {}

  async createProduct(dto: CreateProductDTO): Promise<Product> {
    // Validaciones de aplicación
    const existingProduct = await this.productRepository.findBySku(dto.sku);
    if (existingProduct) {
      throw new Error(`Product with SKU '${dto.sku}' already exists`);
    }

    // Crear agregado de dominio
    const product = new Product(
      this.generateId(),
      dto.name,
      dto.description,
      dto.sku,
      new Money(dto.price, dto.currency || 'EUR'),
      dto.artisanId,
      dto.categoryId,
      dto.slug
    );

    // Persistir
    await this.productRepository.save(product);

    // Publicar eventos de dominio
    await this.publishDomainEvents(product);

    return product;
  }

  private async publishDomainEvents(product: Product): Promise<void> {
    const events = product.domainEvents;
    
    for (const event of events) {
      if (event instanceof ProductCreatedEvent) {
        await this.eventBus.publish(EventSubjects.PRODUCT_CREATED, event);
      } else if (event instanceof ProductPublishedEvent) {
        await this.eventBus.publish(EventSubjects.PRODUCT_PUBLISHED, event);
      }
    }

    product.clearDomainEvents();
  }
}
```

---

## 📡 EVENTOS DE DOMINIO Y COMUNICACIÓN

### Eventos Publicados por Product Service

```typescript
// Cuando se crea un producto
ProductCreatedEvent → 
  - inventory-service (crear registro de stock)
  - analytics-service (métricas de catálogo)
  - search-service (indexar producto)

// Cuando se publica un producto
ProductPublishedEvent →
  - notification-service (notificar artesano)
  - recommendation-service (actualizar algoritmos)
  - cache-service (invalidar cache)

// Cuando cambia el precio
ProductPriceChangedEvent →
  - analytics-service (track price changes)
  - notification-service (alertas de precio)
  - order-service (recalcular órdenes pendientes)
```

### Integración con NATS Event Bus

```typescript
// En el startup del servicio
const eventBus = new NatsEventBus('product-service');
await eventBus.connect(['nats://localhost:4222']);

// Configurar suscriptores
await eventBus.subscribe(EventSubjects.ORDER_CONFIRMED, async (event) => {
  // Actualizar contador de ventas
  await productService.incrementSoldCount(event.productId, event.quantity);
});

await eventBus.subscribe(EventSubjects.REVIEW_APPROVED, async (event) => {
  // Actualizar rating del producto
  await productService.updateProductRating(
    event.productId, 
    event.newAverageRating, 
    event.newReviewCount
  );
});
```

---

## 🛠️ EJEMPLOS PRÁCTICOS DE USO

### 1. Crear Producto Completo

```typescript
// Configuración de dependencias
const prisma = new PrismaClient();
const eventBus = new NatsEventBus('product-service');
const productRepository = new PrismaProductRepository(prisma);
const productService = new ProductService(productRepository, eventBus);

// Crear producto
const product = await productService.createProduct({
  name: "Cerámica Artesanal de Úbeda",
  description: "Hermosa vasija de cerámica tradicional de Úbeda",
  sku: "CER-UBE-001",
  price: 89.99,
  originalPrice: 120.00,
  artisanId: "artisan_maria_gonzalez",
  categoryId: "ceramica_tradicional",
  slug: "ceramica-artesanal-ubeda-001",
  tags: ["cerámica", "úbeda", "artesanal", "tradicional"],
  keywords: ["vasija", "decoración", "hogar", "jaén"],
  featured: true
});

// Agregar variantes
await productService.addVariant({
  productId: product.id,
  name: "Tamaño Mediano",
  sku: "CER-UBE-001-M",
  price: 89.99,
  attributes: {
    size: "Medium",
    height: "25cm",
    diameter: "18cm",
    color: "Azul Cobalto"
  },
  stockQuantity: 12,
  weight: 850, // gramos
  isDefault: true
});

await productService.addVariant({
  productId: product.id,
  name: "Tamaño Grande",
  sku: "CER-UBE-001-L",
  price: 129.99,
  attributes: {
    size: "Large",
    height: "35cm",
    diameter: "25cm",
    color: "Azul Cobalto"
  },
  stockQuantity: 8,
  weight: 1200 // gramos
});

// Agregar imágenes
await productService.addImage({
  productId: product.id,
  url: "https://storage.a4co.com/products/cer-ube-001-main.jpg",
  altText: "Cerámica artesanal de Úbeda - vista principal",
  type: "HERO",
  isPrimary: true,
  sortOrder: 0
});

await productService.addImage({
  productId: product.id,
  url: "https://storage.a4co.com/products/cer-ube-001-detail.jpg",
  altText: "Detalle del acabado de la cerámica",
  type: "DETAIL",
  sortOrder: 1
});

// Agregar especificaciones
await productService.addSpecification({
  productId: product.id,
  name: "Material",
  value: "Arcilla roja de Úbeda",
  type: "TEXT",
  category: "Composición"
});

await productService.addSpecification({
  productId: product.id,
  name: "Técnica",
  value: "Torno alfarero tradicional",
  type: "TEXT",
  category: "Proceso"
});

await productService.addSpecification({
  productId: product.id,
  name: "Origen",
  value: "Úbeda, Jaén, España",
  type: "TEXT",
  category: "Procedencia"
});

// Publicar producto
await productService.publishProduct(product.id);

console.log(`✅ Producto '${product.name}' creado y publicado`);
console.log(`🆔 ID: ${product.id}`);
console.log(`🏷️ SKU: ${product.sku}`);
console.log(`💰 Precio: ${product.price.amount} ${product.price.currency}`);
console.log(`🎨 Variantes: ${product.variants.length}`);
console.log(`📸 Imágenes: ${product.images.length}`);
```

### 2. Buscar y Filtrar Productos

```typescript
// Búsqueda por texto
const searchResults = await productService.searchProducts({
  query: "cerámica úbeda",
  categoryId: "ceramica_tradicional",
  priceMin: 50,
  priceMax: 150,
  featured: true,
  page: 1,
  limit: 20
});

console.log(`🔍 Encontrados ${searchResults.total} productos`);
console.log(`📄 Página ${searchResults.page} de ${searchResults.totalPages}`);

searchResults.products.forEach(product => {
  console.log(`- ${product.name} (${product.price.amount}€)`);
  console.log(`  Rating: ${product.averageRating}⭐ (${product.reviewCount} reviews)`);
  console.log(`  Vendidos: ${product.totalSold} unidades`);
});

// Productos por artesano
const artisanProducts = await productService.getProductsByArtisan(
  "artisan_maria_gonzalez",
  1, // página
  10 // límite
);

// Productos destacados
const featuredProducts = await productService.getFeaturedProducts(8);
```

### 3. Gestión de Eventos en Tiempo Real

```typescript
// Event handlers para otros servicios
class ProductEventHandlers {
  constructor(private productService: ProductService) {}

  @EventHandler(EventSubjects.ORDER_CONFIRMED)
  async onOrderConfirmed(event: OrderConfirmedEvent): Promise<void> {
    // Actualizar contador de ventas
    for (const item of event.items) {
      await this.productService.incrementSoldCount(
        item.productId, 
        item.quantity
      );
    }
  }

  @EventHandler(EventSubjects.STOCK_DEPLETED)
  async onStockDepleted(event: StockDepletedEvent): Promise<void> {
    // Marcar producto como agotado
    await this.productService.markProductOutOfStock(event.productId);
  }

  @EventHandler(EventSubjects.REVIEW_APPROVED)
  async onReviewApproved(event: ReviewApprovedEvent): Promise<void> {
    // Recalcular rating promedio
    const newRating = await this.calculateAverageRating(event.productId);
    await this.productService.updateProductRating(
      event.productId,
      newRating.average,
      newRating.count
    );
  }
}
```

---

## 📈 BENEFICIOS DE ESTA ARQUITECTURA

### ✅ **Escalabilidad**
- **Agregados independientes**: Cada producto es una unidad transaccional
- **Sharding natural**: Por artesano o categoría
- **Caching eficiente**: Agregados como unidades de cache

### ✅ **Mantenibilidad**
- **Separación clara**: Dominio separado de infraestructura
- **Reglas centralizadas**: Lógica de negocio en las entidades
- **Testing simplificado**: Mocks de repositorios y eventos

### ✅ **Performance**
- **Consultas optimizadas**: Índices estratégicos en Prisma
- **Carga perezosa**: Solo cargar lo necesario
- **Transacciones eficientes**: Operaciones atómicas por agregado

### ✅ **Consistencia**
- **Invariantes protegidas**: Validaciones en el dominio
- **Transacciones ACID**: Consistencia del agregado garantizada
- **Eventual consistency**: Entre agregados via eventos

### ✅ **Observabilidad**
- **Eventos de dominio**: Auditoria completa de cambios
- **Métricas de negocio**: Tracking automático via eventos
- **Debugging facilitado**: Estado del dominio trazeable

---

## 🎯 CONCLUSIONES

Esta implementación establece una **base sólida** para el product-service del marketplace, combinando:

1. **Prisma ORM** para persistencia eficiente y type-safe
2. **Patrones DDD** para modelado del dominio rico
3. **Eventos de dominio** para integración entre servicios
4. **Arquitectura hexagonal** para flexibilidad y testabilidad

### Próximos Pasos

1. **Implementar caching** con Redis para consultas frecuentes
2. **Agregar search service** con Elasticsearch para búsquedas avanzadas
3. **Configurar métricas** con Prometheus para observabilidad
4. **Testing completo** con Jest para todas las capas
5. **CI/CD pipeline** para despliegue automatizado

**Esta arquitectura posiciona al marketplace local de Jaén para escalar desde cientos a millones de productos manteniendo la calidad y performance.**