'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
  categoria?: string;
  imagen?: string;
}

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductForm({ product, isOpen, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    nombre: product?.nombre || '',
    precio: product?.precio || 0,
    stock: product?.stock || 0,
    descripcion: product?.descripcion || '',
    categoria: product?.categoria || '',
    imagen: product?.imagen || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Product = { ...formData };
    if (product?.id) {
      productData.id = product.id;
    }
    onSave(productData);
    onClose();
  };

  const handleChange = (field: keyof Product, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>{product ? 'Editar Producto' : 'Agregar Producto'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Precio (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => handleChange('precio', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar categoría</option>
                <option value="ceramica">Cerámica</option>
                <option value="tejido">Tejido</option>
                <option value="joyeria">Joyería</option>
                <option value="madera">Madera</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {product ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
