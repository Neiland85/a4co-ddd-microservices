'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import type { Product } from '@dashboard/lib/types';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

export function ProductCard({ product, onBuy }: ProductCardProps) {
  const isAvailable = product.stock > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="aspect-video bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-slate-400 text-4xl">📦</div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            €{product.price.toFixed(2)}
          </span>
          
          <span
            className={`text-sm font-medium ${
              isAvailable ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isAvailable ? `${product.stock} disponible${product.stock > 1 ? 's' : ''}` : 'Agotado'}
          </span>
        </div>

        <Button
          onClick={() => onBuy(product)}
          disabled={!isAvailable}
          className="w-full"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAvailable ? 'Comprar' : 'No disponible'}
        </Button>
      </div>
    </div>
  );
}
