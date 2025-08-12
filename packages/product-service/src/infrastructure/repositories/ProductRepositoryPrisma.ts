import { prisma } from "../prisma/prisma.service";
import { Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/interfaces/ProductRepository";

export class ProductRepositoryPrisma implements ProductRepository {
  async save(product: Product): Promise<Product> {
    const savedProduct = await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        category: product.category,
        seasonal: product.seasonal,
        price: product.price,
        unit: product.unit,
        description: product.description,
        producer: product.producer,
        location: product.location,
        images: product.images,
        certifications: product.certifications,
        available: product.available,
        stock: product.stock,
        harvestDate: product.harvestDate
      }
    });

    return this.toDomainEntity(savedProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    return product ? this.toDomainEntity(product) : null;
  }

  async findAll(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return products.map(this.toDomainEntity);
  }

  async findByCategory(category: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' }
    });

    return products.map(this.toDomainEntity);
  }

  async findBySeasonal(seasonal: boolean): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { seasonal },
      orderBy: { createdAt: 'desc' }
    });

    return products.map(this.toDomainEntity);
  }

  async findByAvailable(available: boolean): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { available },
      orderBy: { createdAt: 'desc' }
    });

    return products.map(this.toDomainEntity);
  }

  async update(id: string, productData: Partial<Product>): Promise<Product | null> {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: productData.name,
        category: productData.category,
        seasonal: productData.seasonal,
        price: productData.price,
        unit: productData.unit,
        description: productData.description,
        producer: productData.producer,
        location: productData.location,
        images: productData.images,
        certifications: productData.certifications,
        available: productData.available,
        stock: productData.stock,
        harvestDate: productData.harvestDate
      }
    });

    return this.toDomainEntity(updatedProduct);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async search(query: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { producer: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    return products.map(this.toDomainEntity);
  }

  private toDomainEntity(dbProduct: any): Product {
    return new Product(
      dbProduct.id,
      dbProduct.name,
      dbProduct.category,
      dbProduct.seasonal,
      dbProduct.price,
      dbProduct.unit,
      dbProduct.description,
      dbProduct.producer,
      dbProduct.location,
      dbProduct.images || [],
      dbProduct.certifications || [],
      dbProduct.available,
      dbProduct.stock,
      dbProduct.harvestDate,
      dbProduct.createdAt,
      dbProduct.updatedAt
    );
  }
} 