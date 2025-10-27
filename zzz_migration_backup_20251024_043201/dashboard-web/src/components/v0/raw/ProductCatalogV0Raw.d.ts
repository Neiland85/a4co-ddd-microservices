interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    producer: string;
    location: string;
    stock: number;
    available: boolean;
    seasonal: boolean;
    certifications: string[];
    image?: string;
}
interface ProductCatalogV0RawProps {
    readonly products?: readonly Product[];
    readonly onProductSelect?: (product: Product) => void;
    readonly showFilters?: boolean;
    readonly maxItems?: number;
    readonly loading?: boolean;
    readonly title?: string;
}
declare function ProductCatalogV0Raw({ products, onProductSelect, showFilters, maxItems, loading, title, }: Readonly<ProductCatalogV0RawProps>): import("react/jsx-runtime").JSX.Element;
declare namespace ProductCatalogV0Raw {
    var displayName: string;
}
export default ProductCatalogV0Raw;
//# sourceMappingURL=ProductCatalogV0Raw.d.ts.map