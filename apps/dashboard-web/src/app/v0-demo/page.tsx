'use client';


export default function V0DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">V0 Demo Components</h1>
          <p className="text-gray-600 mt-2">Demostración de componentes generados con V0</p>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Componentes Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Product Catalog</h3>
              <p className="text-sm text-gray-600 mt-1">Catálogo de productos avanzado</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">User Dashboard</h3>
              <p className="text-sm text-gray-600 mt-1">Panel de usuario personalizado</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Business Forms</h3>
              <p className="text-sm text-gray-600 mt-1">Formularios de registro empresarial</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Artisan Tools</h3>
              <p className="text-sm text-gray-600 mt-1">Herramientas para artesanos</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Modern Backoffice</h3>
              <p className="text-sm text-gray-600 mt-1">Panel administrativo avanzado</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Gamified Experience</h3>
              <p className="text-sm text-gray-600 mt-1">Experiencia gamificada</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Nota de Desarrollo</h3>
            <p className="text-sm text-blue-700">
              Esta página mostrará los componentes V0 una vez que se resuelvan las dependencias de los componentes UI.
              Actualmente está simplificada para evitar errores de compilación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
