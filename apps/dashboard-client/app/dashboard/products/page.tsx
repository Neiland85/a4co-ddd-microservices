'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { BuyModal } from '@/components/products/BuyModal';
import { Input } from '@/components/ui/input';
import { useToast } from '@dashboard/lib/context/ToastContext';
import { productsService } from '@dashboard/lib/services';
import type { Product } from '@dashboard/lib/types';

/* -------------------------------------------------
   Feature flag: backend on/off
-------------------------------------------------- */
const BACKEND_ENABLED = process.env.NEXT_PUBLIC_BACKEND_ENABLED === 'true';

/* -------------------------------------------------
   Mock temporal de productos
-------------------------------------------------- */
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-1',
    name: 'Producto Demo A',
    description: 'Producto de ejemplo para desarrollo UI',
    price: 29.99,
    stock: 12,
  },
  {
    id: 'mock-2',
    name: 'Producto Demo B',
    description: 'Otro producto mock',
    price: 49.99,
    stock: 0,
  },
  {
    id: 'mock-3',
    name: 'Producto Demo C',
    description: 'Mock con stock',
    price: 19.99,
    stock: 5,
  },
];

type PageState = 'loading' | 'error' | 'empty' | 'success';

export default function ProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [state, setState] = useState<PageState>('loading');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  /* -------------------------------------------------
     Load products
  -------------------------------------------------- */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setState('loading');

        let data: Product[];

        if (BACKEND_ENABLED) {
          data = await productsService.getProducts();
        } else {
          data = MOCK_PRODUCTS;
        }

        if (data.length === 0) {
          setState('empty');
        } else {
          setProducts(data);
          setState('success');
        }
      } catch (error) {
        console.error('Error loading products:', error);
        showToast('No se pudieron cargar los productos', 'error');
        setState('error');
      }
    };

    loadProducts();
  }, [showToast]);

  /* -------------------------------------------------
     Optimización filtros
  -------------------------------------------------- */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }

    if (showAvailableOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    return result;
  }, [products, searchQuery, showAvailableOnly]);

  /* -------------------------------------------------
     UX states
  -------------------------------------------------- */
  if (state === 'loading') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (state === 'error') {
    return <div className="text-center py-20 text-slate-500">Error al cargar productos.</div>;
  }

  if (state === 'empty') {
    return <div className="text-center py-20 text-slate-500">No hay productos disponibles.</div>;
  }

  /* -------------------------------------------------
     Success
  -------------------------------------------------- */
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Explora nuestro catálogo de productos
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
          />
          <span className="text-sm">Solo disponibles</span>
        </label>
      </div>

      <ProductGrid
        products={filteredProducts}
        onBuy={(p) => {
          setSelectedProduct(p);
          setIsBuyModalOpen(true);
        }}
      />

      <BuyModal
        product={selectedProduct}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </div>
  );
}
