export const CatalogHeader = () => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
            <p className="mt-1 text-gray-600">Descubre nuestra selección de productos locales</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Mostrando <span className="font-medium">1-12</span> de{' '}
              <span className="font-medium">48</span> productos
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
