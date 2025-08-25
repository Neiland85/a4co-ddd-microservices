import { Suspense } from 'react'
import { CatalogHeader } from '@/components/CatalogHeader'
import { ProductFilters } from '@/components/ProductFilters'
import { ProductGrid } from '@/components/ProductGrid'
import { Pagination } from '@/components/Pagination'

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader />
      
      <main className="py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar con filtros */}
            <aside className="lg:col-span-1">
              <Suspense fallback={<div>Cargando filtros...</div>}>
                <ProductFilters />
              </Suspense>
            </aside>

            {/* Contenido principal */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Catálogo de Productos</h1>
                <p className="text-muted-foreground">
                  Descubre productos únicos de artesanos locales
                </p>
              </div>

              <Suspense fallback={<div>Cargando productos...</div>}>
                <ProductGrid />
              </Suspense>

              <div className="mt-8">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
