import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { InteractiveMap } from '@/components/InteractiveMap';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main>
        <Hero />

        <section className="py-16">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">Productos Destacados</h2>
            <Suspense fallback={<div className="text-center">Cargando productos...</div>}>
              <FeaturedProducts />
            </Suspense>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">Mapa de Productores</h2>
            <Suspense fallback={<div className="text-center">Cargando mapa...</div>}>
              <InteractiveMap />
            </Suspense>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Testimonios de Nuestros Clientes
            </h2>
            <Testimonials />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
