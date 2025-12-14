export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  imageUrl?: string;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  imageUrl?: string;
  sku?: string;
}
