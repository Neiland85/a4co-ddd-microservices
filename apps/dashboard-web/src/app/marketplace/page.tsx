import { ProductCatalogV0 } from '../../components/ProductCatalogSimple';

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Marketplace A4CO</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre productos únicos creados por artesanos locales colombianos.
            Cada pieza cuenta una historia y apoya el talento nacional.
          </p>
        </div>
        <ProductCatalogV0 />
      </div>
    </div>
  );
}
