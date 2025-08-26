import { Suspense } from 'react'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { InteractiveMap } from '@/components/InteractiveMap'
import { Testimonials } from '@/components/Testimonials'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Productos Destacados
            </h2>
            <Suspense fallback={<div className="text-center">Cargando productos...</div>}>
              <FeaturedProducts />
            </Suspense>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Mapa de Productores
            </h2>
            <Suspense fallback={<div className="text-center">Cargando mapa...</div>}>
              <InteractiveMap />
            </Suspense>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Testimonios de Nuestros Clientes
            </h2>
            <Testimonials />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
