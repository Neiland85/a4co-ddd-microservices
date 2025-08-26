import { Suspense } from 'react'
import { ProductDetail } from '@/components/ProductDetail'
import { RelatedProducts } from '@/components/RelatedProducts'
import { ProductReviews } from '@/components/ProductReviews'
import { BackButton } from '@/components/BackButton'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <BackButton />
        
        <Suspense fallback={<div className="text-center py-12">Cargando producto...</div>}>
          <ProductDetail productId={params.id} />
        </Suspense>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Productos Relacionados</h2>
          <Suspense fallback={<div>Cargando productos relacionados...</div>}>
            <RelatedProducts productId={params.id} />
          </Suspense>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Reseñas y Comentarios</h2>
          <Suspense fallback={<div>Cargando reseñas...</div>}>
            <ProductReviews productId={params.id} />
          </Suspense>
        </section>
      </div>
    </div>
  )
}
