/**
 * Artisan Products Page
 * CRUD operations for products with idempotent backend calls
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { VoiceInput } from '@/components/ui/VoiceInput';
import { productApi } from '@/lib/api/client';
import { staggerIn } from '@/lib/animations/anime-utils';
import {
  Plus,
  Edit,
  Copy,
  Archive,
  Trash2,
  Save,
  X,
  Package,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isArchived: boolean;
  images: string[];
  createdAt: string;
}

export default function ArtisanProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const artisanId = '1'; // This would come from auth context

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (containerRef.current && products.length > 0) {
      const cards = containerRef.current.querySelectorAll('.product-card');
      staggerIn(Array.from(cards) as HTMLElement[]);
    }
  }, [products]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productApi.list(artisanId);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setIsCreating(true);
    setEditingProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      category: '',
      isArchived: false,
      images: [],
      createdAt: new Date().toISOString(),
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsCreating(false);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    try {
      if (isCreating) {
        const newProduct = await productApi.create(artisanId, editingProduct);
        setProducts((prev) => [...prev, newProduct]);
      } else {
        await productApi.update(artisanId, editingProduct.id, editingProduct);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
        );
      }
      setEditingProduct(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleDuplicateProduct = async (productId: string) => {
    try {
      const duplicated = await productApi.duplicate(artisanId, productId);
      setProducts((prev) => [...prev, duplicated]);
    } catch (error) {
      console.error('Error duplicating product:', error);
      alert('Error al duplicar el producto');
    }
  };

  const handleArchiveProduct = async (productId: string) => {
    try {
      await productApi.archive(artisanId, productId);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isArchived: true } : p))
      );
    } catch (error) {
      console.error('Error archiving product:', error);
      alert('Error al archivar el producto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      await productApi.delete(artisanId, productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleDescriptionGenerated = (text: string) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, description: text });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Productos</h1>
          <p className="mt-1 text-gray-600">Gestiona tu catálogo de productos artesanales</p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Product Editor Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {isCreating ? 'Nuevo Producto' : 'Editar Producto'}
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreating(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <select
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">Selecciona categoría</option>
                  <option value="Cerámica">Cerámica</option>
                  <option value="Textil">Textil</option>
                  <option value="Orfebrería">Orfebrería</option>
                  <option value="Madera">Madera</option>
                  <option value="Cuero">Cuero</option>
                  <option value="Vidrio">Vidrio</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Precio (€)
                </label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <VoiceInput
                  onTextGenerated={handleDescriptionGenerated}
                  context="product description"
                  placeholder="Describe las características, materiales y técnicas de tu producto"
                />
                <textarea
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  rows={6}
                  className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Descripción del producto..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveProduct}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-medium text-white hover:bg-purple-700"
                >
                  <Save className="h-5 w-5" />
                  Guardar Producto
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreating(false);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div ref={containerRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Package className="mb-4 h-16 w-16 text-gray-300" />
            <p className="mb-2 text-lg font-medium text-gray-900">
              No tienes productos todavía
            </p>
            <p className="mb-4 text-gray-600">
              Crea tu primer producto para empezar a vender
            </p>
            <button
              onClick={handleCreateProduct}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              <Plus className="h-5 w-5" />
              Crear Producto
            </button>
          </div>
        ) : (
          products.map((product) => (
            <AnimatedCard
              key={product.id}
              className="product-card relative overflow-hidden"
              enable3D
            >
              {product.isArchived && (
                <div className="absolute right-2 top-2 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                  Archivado
                </div>
              )}

              <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>

              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="mb-2 text-sm text-gray-500">{product.category}</p>
              <p className="mb-3 text-xl font-bold text-purple-600">
                {product.price.toFixed(2)} €
              </p>
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDuplicateProduct(product.id)}
                  className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100"
                >
                  <Copy className="h-4 w-4" />
                  Duplicar
                </button>
                {!product.isArchived && (
                  <button
                    onClick={() => handleArchiveProduct(product.id)}
                    className="flex items-center gap-1 rounded-lg bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
                  >
                    <Archive className="h-4 w-4" />
                    Archivar
                  </button>
                )}
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            </AnimatedCard>
          ))
        )}
      </div>
    </div>
  );
}
