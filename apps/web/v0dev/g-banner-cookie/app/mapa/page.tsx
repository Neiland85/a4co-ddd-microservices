import MapView from '../../components/map-view';
import { Car, Navigation, Settings } from 'lucide-react';

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="shadow-natural-sm border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Mapa de Productores Artesanales</h1>
          <p className="text-gray-600">
            Descubre los mejores productores locales cerca de ti. Filtra por categoría, distancia y
            valoración.
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="shadow-natural-lg overflow-hidden rounded-lg bg-white">
          <MapView
            className="h-[600px]"
            defaultCenter={{ lat: 38.0138, lng: -3.3706 }}
            defaultZoom={10}
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="shadow-natural rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-3 flex items-center">
              <div className="bg-a4co-olive-100 mr-3 flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-a4co-olive-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900">Explora el Mapa</h3>
            </div>
            <p className="text-sm text-gray-600">
              Navega por el mapa para descubrir productores artesanales en tu zona. Cada marcador
              representa un productor local verificado.
            </p>
          </div>

          <div className="shadow-natural rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-3 flex items-center">
              <div className="bg-a4co-clay-100 mr-3 flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-a4co-clay-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900">Usa los Filtros</h3>
            </div>
            <p className="text-sm text-gray-600">
              Filtra por categoría de producto, distancia máxima, valoración mínima o busca por
              nombre para encontrar exactamente lo que necesitas.
            </p>
          </div>

          <div className="shadow-natural rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-3 flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900">Calcula Rutas</h3>
            </div>
            <p className="text-sm text-gray-600">
              Haz clic en "Cómo Llegar" en cualquier productor para obtener direcciones detalladas
              en coche, bicicleta o a pie.
            </p>
          </div>

          <div className="shadow-natural rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-3 flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <span className="font-bold text-green-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900">Conecta con Productores</h3>
            </div>
            <p className="text-sm text-gray-600">
              Ve información detallada del productor, sus especialidades, datos de contacto y
              planifica tu visita.
            </p>
          </div>
        </div>

        {/* Routing Features */}
        <div className="from-a4co-olive-50 to-a4co-clay-50 border-a4co-olive-200 mt-12 rounded-xl border bg-gradient-to-r p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Planifica tu Visita</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Nuestro sistema de rutas te ayuda a llegar fácilmente a cualquier productor artesanal
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="shadow-natural mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <Car className="text-a4co-olive-600 h-8 w-8" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Múltiples Transportes</h3>
              <p className="text-sm text-gray-600">
                Rutas optimizadas para coche, bicicleta o caminando
              </p>
            </div>

            <div className="text-center">
              <div className="shadow-natural mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <Navigation className="text-a4co-clay-600 h-8 w-8" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Navegación Detallada</h3>
              <p className="text-sm text-gray-600">
                Instrucciones paso a paso con distancias y tiempos
              </p>
            </div>

            <div className="text-center">
              <div className="shadow-natural mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <Settings className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Opciones Avanzadas</h3>
              <p className="text-sm text-gray-600">
                Evita peajes, autopistas y personaliza tu ruta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
