'use client';

import { ProductCard } from './ProductCard';
import type { Product } from '@dashboard/lib/types';

interface ProductGridProps {
  products: Product[];
  onBuy: (product: Product) => void;
}

export function ProductGrid({ products, onBuy }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-2">
          No hay productos disponibles
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onBuy={onBuy} />
      ))}
    </div>
  );
}
