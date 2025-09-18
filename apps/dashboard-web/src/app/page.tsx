import { BarChart3, Settings, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            A4CO Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema de gestión integral para microservicios con arquitectura DDD.
            Navega entre el marketplace y el panel de administración.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/marketplace" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 mx-auto">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Marketplace</h2>
              <p className="text-gray-600 text-center mb-6">
                Explora productos, gestiona catálogos y conecta con artesanos locales.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Productos
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Búsqueda
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Filtros
                </div>
              </div>
            </div>
          </Link>

          <Link href="/backoffice" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-6 mx-auto">
                <Settings className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Backoffice</h2>
              <p className="text-gray-600 text-center mb-6">
                Panel de administración con métricas, gestión de usuarios y seguridad.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Usuarios
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Métricas
                </div>
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-1" />
                  Config
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado del Sistema</h3>
          <div className="inline-flex items-center space-x-6 bg-white rounded-full px-6 py-3 shadow-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Backend Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Frontend Activo</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Base de Datos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
