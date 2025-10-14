<<<<<<< HEAD
import { BackButton } from '@/components/BackButton';
import { ProductDetail } from '@/components/ProductDetail';
import { ProductReviews } from '@/components/ProductReviews';
import { RelatedProducts } from '@/components/RelatedProducts';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Mock data - TODO: Implement actual data fetching
  const mockProduct = {
    id,
    name: 'Producto de ejemplo',
    description: 'Descripción del producto',
    price: 99.99,
    images: ['/placeholder.jpg'],
    category: 'Categoría',
    location: 'Ubicación',
    artisan: 'Artesano',
    rating: 4.5,
    reviews: 10,
    stock: 5,
  };

  const mockRelatedProducts = [
    {
      id: '1',
      name: 'Producto relacionado 1',
      price: 49.99,
      image: '/placeholder.jpg',
      rating: 4.0,
      location: 'Ubicación 1',
    },
  ];

  const mockReviews = [
    {
      id: '1',
      userName: 'Usuario 1',
      rating: 5,
      comment: 'Excelente producto',
      date: '2024-01-01',
      helpful: 5,
    },
  ];

=======
import { Suspense } from 'react';
import { ProductDetail } from '@/components/ProductDetail';
import { RelatedProducts } from '@/components/RelatedProducts';
import { ProductReviews } from '@/components/ProductReviews';
import { BackButton } from '@/components/BackButton';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  return (
    <div className="bg-background min-h-screen">
      <div className="container py-8">
        <BackButton />

<<<<<<< HEAD
        <ProductDetail product={mockProduct} />

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Productos Relacionados</h2>
          <RelatedProducts products={mockRelatedProducts} />
=======
        <Suspense fallback={<div className="py-12 text-center">Cargando producto...</div>}>
          <ProductDetail productId={params.id} />
        </Suspense>

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Productos Relacionados</h2>
          <Suspense fallback={<div>Cargando productos relacionados...</div>}>
            <RelatedProducts productId={params.id} />
          </Suspense>
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        </section>

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Reseñas y Comentarios</h2>
<<<<<<< HEAD
          <ProductReviews reviews={mockReviews} averageRating={4.5} totalReviews={10} />
=======
          <Suspense fallback={<div>Cargando reseñas...</div>}>
            <ProductReviews productId={params.id} />
          </Suspense>
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        </section>
      </div>
    </div>
  );
}
