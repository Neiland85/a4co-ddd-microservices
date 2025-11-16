/**
 * Home Page - Dashboard Selector
 */
import Link from 'next/link';
import { Paintbrush, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="w-full max-w-4xl p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Portal de Artesanos Andaluces
          </h1>
          <p className="text-lg text-gray-600">
            Selecciona tu tipo de dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Artisan Dashboard */}
          <Link
            href="/artisan/profile"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 opacity-0 transition-opacity group-hover:opacity-10"></div>
            <div className="relative">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                <Paintbrush className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Panel de Artesano
              </h2>
              <p className="mb-4 text-gray-600">
                Gestiona tu perfil, productos, galería y analíticas
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span>
                  Perfil con IA por voz
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span>
                  Gestión de productos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span>
                  Galería multimedia
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span>
                  Analíticas detalladas
                </li>
              </ul>
            </div>
          </Link>

          {/* Admin Dashboard */}
          <Link
            href="/admin"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 opacity-0 transition-opacity group-hover:opacity-10"></div>
            <div className="relative">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white">
                <Shield className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Panel de Administración
              </h2>
              <p className="mb-4 text-gray-600">
                Modera artesanos y gestiona el sistema
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span>
                  Aprobar/bloquear artesanos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span>
                  Destacar perfiles
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span>
                  Filtros avanzados
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span>
                  Control de calidad
                </li>
              </ul>
            </div>
          </Link>
        </div>

        {/* Features Banner */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <div className="mb-2 text-3xl font-bold text-purple-600">100%</div>
              <p className="text-sm text-gray-600">Operaciones Idempotentes</p>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div>
              <div className="mb-2 text-3xl font-bold text-blue-600">IA</div>
              <p className="text-sm text-gray-600">Asistente por Voz</p>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div>
              <div className="mb-2 text-3xl font-bold text-pink-600">3D</div>
              <p className="text-sm text-gray-600">Animaciones Premium</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
