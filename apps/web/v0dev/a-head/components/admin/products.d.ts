import type { Product } from '@/types/admin-types';
interface AdminProductsProps {
    products: Product[];
    onEdit?: (product: Product) => void;
    onDelete?: (productId: string) => void;
    onView?: (product: Product) => void;
}
export declare function AdminProducts({ products, onEdit, onDelete, onView }: AdminProductsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=products.d.ts.map