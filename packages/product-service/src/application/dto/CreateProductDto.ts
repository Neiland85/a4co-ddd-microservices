export interface CreateProductDto {
  name: string;
  category: string;
  seasonal: boolean;
  price?: number;
  unit?: string;
  description?: string;
  producer?: string;
  location?: any;
  images?: string[];
  certifications?: string[];
  available?: boolean;
  stock?: number;
  harvestDate?: string;
}

export interface UpdateProductDto {
  name?: string;
  category?: string;
  seasonal?: boolean;
  price?: number;
  unit?: string;
  description?: string;
  producer?: string;
  location?: any;
  images?: string[];
  certifications?: string[];
  available?: boolean;
  stock?: number;
  harvestDate?: string;
}

export interface ProductResponseDto {
  id: string;
  name: string;
  category: string;
  seasonal: boolean;
  price?: number;
  unit?: string;
  description?: string;
  producer?: string;
  location?: any;
  images: string[];
  certifications: string[];
  available: boolean;
  stock?: number;
  harvestDate?: string;
  createdAt: Date;
  updatedAt: Date;
} 