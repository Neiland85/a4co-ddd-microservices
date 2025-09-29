import { Product, ProductProps } from '../../domain/entities/product.entity';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findByIds(ids: string[]): Promise<Product[]>;
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  findByArtisan(artisanId: string): Promise<Product[]>;
  findLowStock(): Promise<Product[]>;
  findOutOfStock(): Promise<Product[]>;
}

export class InMemoryProductRepository implements ProductRepository {
  private products: Map<string, Product> = new Map();

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleProducts: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Handmade Ceramic Mug',
        description: 'Beautiful handcrafted ceramic mug with unique design',
        sku: 'CERAMIC-MUG-001',
        category: 'Kitchenware',
        brand: 'ArtisanCraft',
        unitPrice: 25.99,
        currency: 'USD',
        currentStock: 50,
        reservedStock: 5,
        minimumStock: 10,
        maximumStock: 100,
        isActive: true,
        artisanId: 'artisan_001',
      },
      {
        name: 'Wooden Cutting Board',
        description: 'Premium hardwood cutting board with food-safe finish',
        sku: 'WOOD-CUTTING-001',
        category: 'Kitchenware',
        brand: 'WoodWorks',
        unitPrice: 45.99,
        currency: 'USD',
        currentStock: 30,
        reservedStock: 2,
        minimumStock: 8,
        maximumStock: 80,
        isActive: true,
        artisanId: 'artisan_002',
      },
      {
        name: 'Handwoven Cotton Scarf',
        description: 'Soft cotton scarf with traditional patterns',
        sku: 'COTTON-SCARF-001',
        category: 'Accessories',
        brand: 'TextileArt',
        unitPrice: 35.99,
        currency: 'USD',
        currentStock: 15,
        reservedStock: 0,
        minimumStock: 5,
        maximumStock: 60,
        isActive: true,
        artisanId: 'artisan_003',
      },
    ];

    sampleProducts.forEach((props, index) => {
      const product = Product.create(props);
      this.products.set(product.id, product);
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return ids
      .map(id => this.products.get(id))
      .filter((product): product is Product => product !== undefined);
  }

  async save(product: Product): Promise<void> {
    this.products.set(product.id, product);
  }

  async delete(id: string): Promise<void> {
    this.products.delete(id);
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async findByArtisan(artisanId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.artisanId === artisanId);
  }

  async findLowStock(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.needsRestock);
  }

  async findOutOfStock(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.stockStatus === 'out_of_stock',
    );
  }
}
