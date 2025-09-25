'use client';

export default function V0DemoPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">V0 Demo Components</h1>
          <p className="mt-2 text-gray-600">Demostración de componentes generados con V0</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Componentes Disponibles</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <h3 className="font-medium text-gray-900">Product Catalog</h3>
              <p className="mt-1 text-sm text-gray-600">Catálogo de productos avanzado</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <h3 className="font-medium text-gray-900">User Dashboard</h3>
              <p className="mt-1 text-sm text-gray-600">Panel de usuario personalizado</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <h3 className="font-medium text-gray-900">Business Forms</h3>
              <p className="mt-1 text-sm text-gray-600">Formularios de registro empresarial</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <h3 className="font-medium text-gray-900">Artisan Tools</h3>
              <p className="mt-1 text-sm text-gray-600">Herramientas para artesanos</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <h3 className="font-medium text-gray-900">Modern Backoffice</h3>
              <p className="mt-1 text-sm text-gray-600">Panel administrativo avanzado</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <h3 className="font-medium text-gray-900">Gamified Experience</h3>
              <p className="mt-1 text-sm text-gray-600">Experiencia gamificada</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-medium text-blue-900">Nota de Desarrollo</h3>
            <p className="text-sm text-blue-700">
              Esta página mostrará los componentes V0 una vez que se resuelvan las dependencias de
              los componentes UI. Actualmente está simplificada para evitar errores de compilación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
