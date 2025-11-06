import { PrismaClient } from '@prisma/client';
import { Product, ProductProps } from '../../domain/entities/product.entity';
import { ProductRepository } from './product.repository';
import { SKU } from '../../domain/value-objects';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { EventPublisherService } from '../events/event-publisher.service';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  private readonly logger = new Logger(PrismaProductRepository.name);

  constructor(
    @Inject('PRISMA_CLIENT') private prisma: PrismaClient,
    private eventPublisher?: EventPublisherService,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productData) return null;

    return this.toDomain(productData);
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return productsData.map(data => this.toDomain(data));
  }

  async findBySKU(sku: SKU): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { sku: sku.value },
    });

    if (!productData) return null;

    return this.toDomain(productData);
  }

  async findLowStockProducts(): Promise<Product[]> {
    // Find products where (currentStock - reservedStock) <= reorderPoint
    const productsData = await this.prisma.product.findMany({
      where: {
        isActive: true,
      },
    });

    // Filter in application layer (Prisma doesn't support computed fields in WHERE)
    const products = productsData.map(data => this.toDomain(data));
    return products.filter(product => product.needsRestock);
  }

  async findByWarehouse(location: string): Promise<Product[]> {
    // Note: This assumes warehouse location is stored as JSON or separate fields
    // For now, we'll search by a pattern in a JSON field or return all if not implemented
    // This is a placeholder - actual implementation depends on schema
    const productsData = await this.prisma.product.findMany({
      where: {
        isActive: true,
      },
    });

    const products = productsData.map(data => this.toDomain(data));
    // Filter by warehouse if warehouseLocation is stored
    // For now, return all active products
    return products;
  }

  async save(product: Product): Promise<void> {
    const data = product.toJSON();

    await this.prisma.product.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        category: data.category,
        brand: data.brand,
        unitPrice: data.unitPrice,
        currency: data.currency,
        currentStock: data.currentStock,
        reservedStock: data.reservedStock,
        minimumStock: data.minimumStock,
        maximumStock: data.maximumStock,
        reorderPoint: data.reorderPoint,
        reorderQuantity: data.reorderQuantity,
        warehouseLocation: data.warehouseLocation,
        isActive: data.isActive,
        artisanId: data.artisanId,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        name: data.name,
        description: data.description,
        sku: data.sku,
        category: data.category,
        brand: data.brand,
        unitPrice: data.unitPrice,
        currency: data.currency,
        currentStock: data.currentStock,
        reservedStock: data.reservedStock,
        minimumStock: data.minimumStock,
        maximumStock: data.maximumStock,
        reorderPoint: data.reorderPoint,
        reorderQuantity: data.reorderQuantity,
        warehouseLocation: data.warehouseLocation,
        isActive: data.isActive,
        artisanId: data.artisanId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    // Publicar eventos de dominio después de guardar
    const events = product.getUncommittedEvents();
    if (events.length > 0 && this.eventPublisher) {
      try {
        await this.eventPublisher.publishEvents(events);
        product.clearDomainEvents();
      } catch (error) {
        this.logger.error('Failed to publish domain events:', error);
        // No lanzar error para no romper la transacción, pero loguear
      }
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return productsData.map(data => this.toDomain(data));
  }

  async findByCategory(category: string): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { category },
      orderBy: {
        name: 'asc',
      },
    });

    return productsData.map(data => this.toDomain(data));
  }

  async findByArtisan(artisanId: string): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { artisanId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return productsData.map(data => this.toDomain(data));
  }

  async findLowStock(): Promise<Product[]> {
    return this.findLowStockProducts();
  }

  async findOutOfStock(): Promise<Product[]> {
    // Find products where (currentStock - reservedStock) <= 0
    const productsData = await this.prisma.product.findMany({
      where: {
        isActive: true,
      },
    });

    // Filter in application layer
    const products = productsData.map(data => this.toDomain(data));
    return products.filter(product => product.stockStatus === 'out_of_stock');
  }

  async findBySKU(sku: SKU): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { sku: sku.value },
    });

    if (!productData) return null;

    return this.toDomain(productData);
  }

  async findLowStockProducts(): Promise<Product[]> {
    // Alias para findLowStock para mantener compatibilidad
    return this.findLowStock();
  }

  async findByWarehouse(location: string): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: {
        warehouseLocation: location,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return productsData.map(data => this.toDomain(data));
  }

  private toDomain(data: any): Product {
    const props: ProductProps = {
      id: data.id,
      name: data.name,
      description: data.description,
      sku: data.sku,
      category: data.category,
      brand: data.brand,
      unitPrice: data.unitPrice,
      currency: data.currency,
      currentStock: data.currentStock,
      reservedStock: data.reservedStock,
      minimumStock: data.minimumStock,
      maximumStock: data.maximumStock,
      reorderPoint: data.reorderPoint ?? data.minimumStock,
      reorderQuantity: data.reorderQuantity ?? data.minimumStock * 2,
      warehouseLocation: data.warehouseLocation,
      isActive: data.isActive,
      artisanId: data.artisanId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return Product.reconstruct(props);
  }
}

