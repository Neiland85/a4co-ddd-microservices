"use client"

import { Activity, BarChart3, Bell, Settings, Shield, Users } from "lucide-react"

export default function BackofficePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Backoffice Dashboard</h1>
          <p className="text-gray-600 mt-2">Panel de administración y gestión del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Usuarios Totales</h3>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">1,234</div>
              <p className="text-xs text-gray-500">+12% desde el mes pasado</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Rendimiento</h3>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">98.5%</div>
              <p className="text-xs text-gray-500">Uptime del sistema</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Seguridad</h3>
              <Shield className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Seguro
                </span>
              </div>
              <p className="text-xs text-gray-500">Sin amenazas detectadas</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Actividad Reciente
              </h3>
              <p className="text-sm text-gray-600">Últimas acciones realizadas en el sistema</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Usuario registrado</p>
                  <p className="text-xs text-gray-500">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Producto publicado</p>
                  <p className="text-xs text-gray-500">Hace 15 minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Contenido moderado</p>
                  <p className="text-xs text-gray-500">Hace 1 hora</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Acciones Rápidas
              </h3>
              <p className="text-sm text-gray-600">Herramientas de administración principales</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="h-20 flex flex-col gap-2 items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-6 w-6 text-gray-600" />
                <span className="text-sm text-gray-900">Gestionar Usuarios</span>
              </button>
              <button className="h-20 flex flex-col gap-2 items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="h-6 w-6 text-gray-600" />
                <span className="text-sm text-gray-900">Ver Métricas</span>
              </button>
              <button className="h-20 flex flex-col gap-2 items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Shield className="h-6 w-6 text-gray-600" />
                <span className="text-sm text-gray-900">Seguridad</span>
              </button>
              <button className="h-20 flex flex-col gap-2 items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="text-sm text-gray-900">Notificaciones</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
