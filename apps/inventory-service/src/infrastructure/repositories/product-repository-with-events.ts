import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from './product.repository';
import { DomainEventDispatcher } from '../events/domain-event-dispatcher.service';

@Injectable()
export class ProductRepositoryWithEvents implements ProductRepository {
  constructor(
    private readonly repository: ProductRepository,
    private readonly eventDispatcher: DomainEventDispatcher,
  ) {}

  async findById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return this.repository.findByIds(ids);
  }

  async findBySKU(sku: any): Promise<Product | null> {
    return this.repository.findBySKU(sku);
  }

  async findLowStockProducts(): Promise<Product[]> {
    return this.repository.findLowStockProducts();
  }

  async findByWarehouse(location: string): Promise<Product[]> {
    return this.repository.findByWarehouse(location);
  }

  async save(product: Product): Promise<void> {
    await this.repository.save(product);
    // Dispatch domain events after saving
    await this.eventDispatcher.dispatchProductEvents(product);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.repository.findByCategory(category);
  }

  async findByArtisan(artisanId: string): Promise<Product[]> {
    return this.repository.findByArtisan(artisanId);
  }

  async findLowStock(): Promise<Product[]> {
    return this.repository.findLowStock();
  }

  async findOutOfStock(): Promise<Product[]> {
    return this.repository.findOutOfStock();
  }
}
