import { Injectable } from '@nestjs/common';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

@Injectable()
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Sample Product',
      description: 'A sample product for testing',
      price: 29.99,
      category: 'Test',
      stock: 100,
    },
  ];

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findOne(id: string): Promise<Product> {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    this.products[index] = { ...this.products[index], ...productData };
    return this.products[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    this.products.splice(index, 1);
  }
}
