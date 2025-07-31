import MapView from "../../components/map-view"
import { Car, Navigation, Settings } from "lucide-react"

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-natural-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa de Productores Artesanales</h1>
          <p className="text-gray-600">
            Descubre los mejores productores locales cerca de ti. Filtra por categoría, distancia y valoración.
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-natural-lg overflow-hidden">
          <MapView className="h-[600px]" defaultCenter={{ lat: 38.0138, lng: -3.3706 }} defaultZoom={10} />
        </div>

        {/* Instructions */}
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-natural border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-a4co-olive-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-a4co-olive-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900">Explora el Mapa</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Navega por el mapa para descubrir productores artesanales en tu zona. Cada marcador representa un
              productor local verificado.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-natural border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-a4co-clay-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-a4co-clay-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900">Usa los Filtros</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Filtra por categoría de producto, distancia máxima, valoración mínima o busca por nombre para encontrar
              exactamente lo que necesitas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-natural border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900">Calcula Rutas</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Haz clic en "Cómo Llegar" en cualquier productor para obtener direcciones detalladas en coche, bicicleta o
              a pie.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-natural border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900">Conecta con Productores</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Ve información detallada del productor, sus especialidades, datos de contacto y planifica tu visita.
            </p>
          </div>
        </div>

        {/* Routing Features */}
        <div className="mt-12 bg-gradient-to-r from-a4co-olive-50 to-a4co-clay-50 rounded-xl p-8 border border-a4co-olive-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Planifica tu Visita</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestro sistema de rutas te ayuda a llegar fácilmente a cualquier productor artesanal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-natural">
                <Car className="h-8 w-8 text-a4co-olive-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Múltiples Transportes</h3>
              <p className="text-sm text-gray-600">Rutas optimizadas para coche, bicicleta o caminando</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-natural">
                <Navigation className="h-8 w-8 text-a4co-clay-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Navegación Detallada</h3>
              <p className="text-sm text-gray-600">Instrucciones paso a paso con distancias y tiempos</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-natural">
                <Settings className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Opciones Avanzadas</h3>
              <p className="text-sm text-gray-600">Evita peajes, autopistas y personaliza tu ruta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
