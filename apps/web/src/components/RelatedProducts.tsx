'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  location: string;
}

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export function RelatedProducts({
  products,
  title = 'Productos relacionados',
}: RelatedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">{title}</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map(product => (
          <Link
            key={product.id}
            href={`/producto/${product.id}`}
            className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="aspect-square overflow-hidden">
              <Image
                src={product.image || '/placeholder-product.jpg'}
                alt={product.name}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900">
                {product.name}
              </h3>

              <div className="mb-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-xs text-gray-600">{product.rating}</span>
              </div>

              <p className="mb-2 text-xs text-gray-600">{product.location}</p>

              <p className="text-lg font-semibold text-gray-900">
                ${product.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
