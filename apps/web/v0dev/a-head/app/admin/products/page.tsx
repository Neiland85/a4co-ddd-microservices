'use client';

import { AdminProducts } from '@/components/admin/products';
import type { Product } from '@/types/admin-types';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Aceite de Oliva Virgen Extra',
    description: 'Aceite premium de olivas centenarias',
    price: 24.99,
    category: 'Alimentación',
    producer: 'Olivares del Sur',
    images: ['/placeholder.svg?height=200&width=200'],
    stock: 45,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Cerámica Artesanal',
    description: 'Plato decorativo hecho a mano',
    price: 35.5,
    category: 'Artesanía',
    producer: 'Alfarería Tradicional',
    images: ['/placeholder.svg?height=200&width=200'],
    stock: 12,
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'Miel de Azahar',
    description: 'Miel pura de flores de naranjo',
    price: 18.75,
    category: 'Alimentación',
    producer: 'Colmenar Sierra Sur',
    images: ['/placeholder.svg?height=200&width=200'],
    stock: 0,
    status: 'inactive',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
  },
];

export default function AdminProductsPage() {
  const handleEdit = (product: Product) => {
    console.log('Editing product:', product.id);
  };

  const handleDelete = (productId: string) => {
    console.log('Deleting product:', productId);
  };

  const handleView = (product: Product) => {
    console.log('Viewing product:', product.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <AdminProducts
          products={mockProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>
    </div>
  );
}
