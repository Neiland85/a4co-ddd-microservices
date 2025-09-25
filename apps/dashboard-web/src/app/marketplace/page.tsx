import { ProductCatalogV0 } from '../../components/ProductCatalogSimple';

export default function Marketplace(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Marketplace A4CO</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Descubre productos únicos creados por artesanos locales colombianos. Cada pieza cuenta
            una historia y apoya el talento nacional.
          </p>
        </div>
        <ProductCatalogV0 />
      </div>
    </div>
  );
}
