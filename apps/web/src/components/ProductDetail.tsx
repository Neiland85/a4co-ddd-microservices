'use client';

import Image from 'next/image';
import React from 'react';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    location: string;
    artisan: string;
    rating: number;
    reviews: number;
    stock: number;
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = React.useState(0);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.images[selectedImage] || '/placeholder-product.jpg'}
            alt={product.name}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 overflow-hidden rounded border-2 ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {product.category} • {product.location}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({product.reviews} reseñas)
            </span>
          </div>
        </div>

        <p className="text-2xl font-bold text-gray-900">${product.price.toLocaleString()}</p>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">Disponibilidad:</span>
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">Artesano:</span>
            <span className="text-sm text-gray-600">{product.artisan}</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            disabled={product.stock === 0}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {product.stock > 0 ? 'Agregar al carrito' : 'Producto agotado'}
          </button>

          <button className="w-full rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50">
            Agregar a favoritos
          </button>
        </div>

        <div className="border-t pt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Descripción</h3>
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
