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

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-8">
        <BackButton />

        <ProductDetail product={mockProduct} />

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Productos Relacionados</h2>
          <RelatedProducts products={mockRelatedProducts} />
        </section>

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Reseñas y Comentarios</h2>
          <ProductReviews reviews={mockReviews} averageRating={4.5} totalReviews={10} />
        </section>
      </div>
    </div>
  );
}
