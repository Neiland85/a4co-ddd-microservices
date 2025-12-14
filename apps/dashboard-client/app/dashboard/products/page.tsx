'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { BuyModal } from '@/components/products/BuyModal';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { useToast } from '@dashboard/lib/context/ToastContext';
import { productsService } from '@dashboard/lib/services';
import type { Product } from '@dashboard/lib/types';

export default function ProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, showAvailableOnly]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      showToast('Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    if (showAvailableOnly) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    setFilteredProducts(filtered);
  };

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setIsBuyModalOpen(true);
  };

  if (loading) {
    return <LoadingPage />;
  }

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
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-white"
          />
        </div>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Solo disponibles
          </span>
        </label>
      </div>

      {/* Products Grid */}
      <ProductGrid products={filteredProducts} onBuy={handleBuy} />

      {/* Buy Modal */}
      <BuyModal
        product={selectedProduct}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </div>
  );
}
