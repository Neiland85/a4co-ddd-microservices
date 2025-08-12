import { ProductRepository } from "../../domain/interfaces/ProductRepository";
import { ProductResponseDto } from "../dto/CreateProductDto";

export class GetProductsUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(filters?: {
    category?: string;
    seasonal?: boolean;
    available?: boolean;
    search?: string;
  }): Promise<ProductResponseDto[]> {
    let products;

    if (filters?.category) {
      products = await this.productRepo.findByCategory(filters.category);
    } else if (filters?.seasonal !== undefined) {
      products = await this.productRepo.findBySeasonal(filters.seasonal);
    } else if (filters?.available !== undefined) {
      products = await this.productRepo.findByAvailable(filters.available);
    } else if (filters?.search) {
      products = await this.productRepo.search(filters.search);
    } else {
      products = await this.productRepo.findAll();
    }

    return products.map(this.toResponseDto);
  }

  private toResponseDto(product: any): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      seasonal: product.seasonal,
      price: product.price,
      unit: product.unit,
      description: product.description,
      producer: product.producer,
      location: product.location,
      images: product.images || [],
      certifications: product.certifications || [],
      available: product.available,
      stock: product.stock,
      harvestDate: product.harvestDate,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  }
} 