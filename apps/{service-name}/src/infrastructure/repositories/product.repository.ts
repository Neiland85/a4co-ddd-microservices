// Agrega interfaces para tipos seguros (opcional, pero recomendado)
interface ProductVariantData {
  id: string;
  name: string;
  value: string;
  priceAdjustment?: number;
  stock?: number;
  // Agrega más campos según el esquema de Prisma o ProductVariant
}

interface ProductImageData {
  id: string;
  url: string;
  alt?: string;
  order?: number;
  // Agrega más campos según ProductImage
}

interface ProductTagData {
  id: string;
  name: string;
  // Agrega más campos según ProductTag
}

public static reconstruct(data: {
    id: string;
    productId: string;
    name: string;
    description: string;
    sku?: string;
    slug?: string;
    price: number;
    originalPrice?: number;
    currency: string;
    categoryId: string;
    category?: string;
    stock?: number;
    artisanId: string;
    status: ProductStatus;
    availability: ProductAvailability;
    isHandmade?: boolean;
    isCustomizable: boolean;
    isDigital?: boolean;
    requiresShipping?: boolean;
    keywords?: string[];
    metaTitle?: string;
    metaDescription?: string;
    craftingTimeHours: number;
    sustainabilityScore?: number;
    materials: string[];
    dimensions?: {
      width: number;
      height: number;
      depth: number;
      weight: number;
    };
    variants: unknown[];  // Cambiado de any[] a unknown[]
    images: unknown[];    // Cambiado de any[] a unknown[]
    tags: unknown[];      // Cambiado de any[] a unknown[]
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    // ...existing code...
    data.variants.map(v => ProductVariant.reconstruct(v as ProductVariantData)),  // Cast seguro si defines interfaces
    data.images.map(i => ProductImage.reconstruct(i as ProductImageData)),
    data.tags.map(t => ProductTag.reconstruct(t as ProductTagData)),
    // ...existing code...
  }