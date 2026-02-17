import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, Product as PrismaProduct, Prisma } from '@prisma/client';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product, ProductProps } from '../../domain/entities/product.entity';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(
    @Inject('PRISMA_CLIENT')
    private readonly prisma: PrismaClient,
  ) {}

  async save(product: Product): Promise<void> {
    const data = this.toPersistence(product);
    await this.prisma.product.upsert({
      where: { id: product.id },
      update: data,
      create: data,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) return null;
    return this.toDomain(product);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map((p) => this.toDomain(p));
  }

  async findByCategory(category: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { category },
    });
    return products.map((p) => this.toDomain(p));
  }

  async findByArtisan(artisanId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { artisanId },
    });
    return products.map((p) => this.toDomain(p));
  }

  async findLowStock(): Promise<Product[]> {
    // Asumimos que low stock es < 5, ajusta según tu lógica
    const products = await this.prisma.product.findMany({
      where: { currentStock: { lte: 5 } },
    });
    return products.map((p) => this.toDomain(p));
  }

  async findOutOfStock(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { currentStock: 0 },
    });
    return products.map((p) => this.toDomain(p));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  // --- Mappers ---

  private toDomain(prismaProduct: PrismaProduct): Product {
    return new Product({
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description || '',
      sku: prismaProduct.sku || '',
      category: prismaProduct.category,
      unitPrice: prismaProduct.unitPrice || 0,
      currency: 'EUR', // Asumimos EUR por defecto, ajusta según tu esquema
      currentStock: prismaProduct.currentStock,
      reservedStock: prismaProduct.reservedStock || 0,
      minimumStock: prismaProduct.minimumStock || 5,
      maximumStock: prismaProduct.maximumStock || 100,
      isActive: prismaProduct.isActive !== false, // Asumimos true por defecto
      artisanId: prismaProduct.artisanId || '',
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
    });
  }

  private toPersistence(product: Product): Prisma.ProductCreateInput {
    // Usamos campos básicos que deberían existir en el esquema de Prisma
    // Ajusta según tu esquema real de Prisma
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      // price: product.unitPrice, // Ajusta según el campo real en Prisma
      // artisan: product.artisanId, // Ajusta según el campo real en Prisma
    } as unknown as Prisma.ProductCreateInput; // Temporal hasta verificar el esquema
  }
}
