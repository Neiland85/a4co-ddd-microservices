import { Prisma, PrismaClient, Product as PrismaProduct } from '@prisma/client';
import { Product, ProductProps } from '../../domain/entities/product.entity';
import { ProductRepository } from './product.repository';

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({ where: { id } });
    return productData ? this.toDomain(productData) : null;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return productsData.map((data) => this.toDomain(data));
  }

  async save(product: Product): Promise<void> {
    const data = product.toJSON();

    await this.prisma.product.upsert({
      where: { id: data.id },
      update: this.buildUpdatePayload(data),
      create: this.buildCreatePayload(data),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async findAll(): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return productsData.map((data) => this.toDomain(data));
  }

  async findByCategory(category: string): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { category },
      orderBy: { name: 'asc' },
    });

    return productsData.map((data) => this.toDomain(data));
  }

  async findByArtisan(artisanId: string): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { artisanId },
      orderBy: { createdAt: 'desc' },
    });

    return productsData.map((data) => this.toDomain(data));
  }

  async findLowStock(): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { isActive: true },
    });

    const products = productsData.map((data) => this.toDomain(data));
    return products.filter((product) => product.needsRestock);
  }

  async findOutOfStock(): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { isActive: true },
    });

    const products = productsData.map((data) => this.toDomain(data));
    return products.filter((product) => product.stockStatus === 'out_of_stock');
  }

  private toDomain(data: PrismaProduct): Product {
    const props: ProductProps = {
      id: data.id,
      name: data.name,
      sku: data.sku,
      category: data.category,
      unitPrice: data.unitPrice,
      currency: data.currency,
      currentStock: data.currentStock,
      reservedStock: data.reservedStock,
      minimumStock: data.minimumStock,
      maximumStock: data.maximumStock,
      isActive: data.isActive,
      artisanId: data.artisanId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    if (data.description !== null && data.description !== undefined) {
      props.description = data.description;
    }

    if (data.brand !== null && data.brand !== undefined) {
      props.brand = data.brand;
    }

    return Product.reconstruct(props);
  }

  private buildUpdatePayload(data: ProductProps): Prisma.ProductUpdateInput {
    const updateData: Prisma.ProductUpdateInput = {
      name: data.name,
      sku: data.sku,
      category: data.category,
      unitPrice: data.unitPrice,
      currency: data.currency,
      currentStock: data.currentStock,
      reservedStock: data.reservedStock,
      minimumStock: data.minimumStock,
      maximumStock: data.maximumStock,
      isActive: data.isActive,
      artisanId: data.artisanId,
      updatedAt: data.updatedAt,
    };

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.brand !== undefined) {
      updateData.brand = data.brand;
    }

    return updateData;
  }

  private buildCreatePayload(data: ProductProps): Prisma.ProductCreateInput {
    const createData: Prisma.ProductCreateInput = {
      id: data.id,
      name: data.name,
      sku: data.sku,
      category: data.category,
      unitPrice: data.unitPrice,
      currency: data.currency,
      currentStock: data.currentStock,
      reservedStock: data.reservedStock,
      minimumStock: data.minimumStock,
      maximumStock: data.maximumStock,
      isActive: data.isActive,
      artisanId: data.artisanId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    if (data.description !== undefined) {
      createData.description = data.description;
    }

    if (data.brand !== undefined) {
      createData.brand = data.brand;
    }

    return createData;
  }
}

