import React from 'react';
import type { LocalProduct } from '../../app/api/sales-opportunities/route';
interface ProductCardProps {
    product: LocalProduct;
    onViewDetails?: (product: LocalProduct) => void;
}
declare const ProductCard: React.FC<ProductCardProps>;
interface ProductFiltersProps {
    onCategoryChange: (category: string) => void;
    onLocationChange: (location: string) => void;
    onSeasonalToggle: (seasonal: boolean) => void;
    onAvailableToggle: (available: boolean) => void;
    filters: {
        category?: string;
        location?: string;
        seasonal?: boolean;
        available?: boolean;
    };
}
declare const ProductFilters: React.FC<ProductFiltersProps>;
interface ProductCatalogProps {
    title?: string;
    showFilters?: boolean;
    maxItems?: number;
}
declare const ProductCatalog: React.FC<ProductCatalogProps>;
export default ProductCatalog;
export { ProductCard, ProductFilters };
//# sourceMappingURL=ProductCatalog.d.ts.map