<<<<<<< HEAD
import { CatalogHeader } from '@/components/CatalogHeader';
import { Pagination } from '@/components/Pagination';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductGrid } from '@/components/ProductGrid';
=======
import { Suspense } from 'react';
import { CatalogHeader } from '@/components/CatalogHeader';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductGrid } from '@/components/ProductGrid';
import { Pagination } from '@/components/Pagination';
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

export default function CatalogPage() {
  return (
    <div className="bg-background min-h-screen">
      <CatalogHeader />

      <main className="py-8">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar con filtros */}
            <aside className="lg:col-span-1">
<<<<<<< HEAD
              <ProductFilters />
=======
              <Suspense fallback={<div>Cargando filtros...</div>}>
                <ProductFilters />
              </Suspense>
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
            </aside>

            {/* Contenido principal */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold">Catálogo de Productos</h1>
                <p className="text-muted-foreground">
                  Descubre productos únicos de artesanos locales
                </p>
              </div>

<<<<<<< HEAD
              <ProductGrid />
=======
              <Suspense fallback={<div>Cargando productos...</div>}>
                <ProductGrid />
              </Suspense>
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

              <div className="mt-8">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
