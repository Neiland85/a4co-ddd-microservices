import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Heart, Award, Users } from "lucide-react"

export default function ArtisanalHeader() {
  return (
    <header className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MjQwMGUiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNNDAgNDBjMC0yMi4wOTEgMTcuOTA5LTQwIDQwLTQwdjQwSDQweiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      {/* Floating Artisanal Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Wheat stalks */}
        <div className="absolute top-20 left-10 opacity-20 rotate-12">
          <div className="w-16 h-32 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full transform scale-x-50"></div>
        </div>
        <div className="absolute top-32 right-16 opacity-15 -rotate-12">
          <div className="w-12 h-28 bg-gradient-to-t from-amber-700 to-amber-500 rounded-full transform scale-x-50"></div>
        </div>

        {/* Olive branch */}
        <div className="absolute bottom-32 left-20 opacity-20">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <div className="w-1 h-8 bg-green-700"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
        </div>

        {/* Bread crumbs pattern */}
        <div className="absolute top-1/2 right-1/4 opacity-10">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-amber-800 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Content Side */}
          <div className="text-center lg:text-left">
            {/* Brand Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 text-amber-800 text-sm font-medium mb-6 shadow-warm">
              <Heart className="h-4 w-4 mr-2 text-red-600" />
              Desde el corazón de Jaén
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-a4co-olive-700">Artesanía</span>
              <br />
              <span className="text-a4co-clay-600">Auténtica</span>
              <br />
              <span className="text-gray-800 text-3xl sm:text-4xl lg:text-5xl">de España</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-700 mb-8 max-w-2xl leading-relaxed">
              Descubre los sabores más auténticos de nuestra tierra. Desde el tradicional ochío jiennense hasta los
              quesos artesanales, cada producto cuenta la historia de generaciones de maestros artesanos.
            </p>

            {/* Product Highlights */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
              {[
                { name: "Ochíos Tradicionales", icon: "🥖" },
                { name: "Aceite de Oliva", icon: "🫒" },
                { name: "Quesos Artesanales", icon: "🧀" },
                { name: "Embutidos Ibéricos", icon: "🥓" },
                { name: "Miel Natural", icon: "🍯" },
              ].map((product, index) => (
                <div
                  key={index}
                  className="flex items-center px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-natural-sm"
                >
                  <span className="text-lg mr-2">{product.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{product.name}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-a4co-olive-600 to-a4co-clay-600 hover:from-a4co-olive-700 hover:to-a4co-clay-700 text-white font-semibold px-8 py-3 text-lg shadow-mixed hover:shadow-mixed-lg transition-all duration-300"
              >
                Explorar Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-a4co-olive-600 text-a4co-olive-700 hover:bg-a4co-olive-50 font-semibold px-8 py-3 text-lg shadow-natural hover:shadow-natural-lg transition-all duration-300 bg-transparent"
              >
                Conoce a los Artesanos
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-amber-200">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-amber-600 mr-1" />
                  <span className="text-2xl font-bold text-a4co-olive-700">150+</span>
                </div>
                <div className="text-sm text-gray-600">Artesanos Certificados</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-5 w-5 text-red-600 mr-1" />
                  <span className="text-2xl font-bold text-a4co-clay-700">12</span>
                </div>
                <div className="text-sm text-gray-600">Provincias Españolas</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-green-600 mr-1" />
                  <span className="text-2xl font-bold text-a4co-olive-700">2.5k+</span>
                </div>
                <div className="text-sm text-gray-600">Familias Satisfechas</div>
              </div>
            </div>
          </div>

          {/* Visual Side - Artisanal Showcase */}
          <div className="relative">
            {/* Main Product Display */}
            <div className="relative">
              {/* Central Hero Image Container */}
              <div className="relative h-96 w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-amber-100/30 backdrop-blur-sm rounded-3xl shadow-natural-xl border border-white/30"></div>

                {/* Product Grid */}
                <div className="relative h-full p-8 grid grid-cols-2 gap-4">
                  {/* Ochío */}
                  <div className="bg-white/90 rounded-2xl p-4 shadow-warm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-2 shadow-warm-sm flex items-center justify-center">
                      <span className="text-2xl">🥖</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 text-center">Ochío Tradicional</span>
                  </div>

                  {/* Olive Oil */}
                  <div className="bg-white/90 rounded-2xl p-4 shadow-warm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-2 shadow-natural-sm flex items-center justify-center">
                      <span className="text-2xl">🫒</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 text-center">Aceite Virgen Extra</span>
                  </div>

                  {/* Cheese */}
                  <div className="bg-white/90 rounded-2xl p-4 shadow-warm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full mb-2 shadow-warm-sm flex items-center justify-center">
                      <span className="text-2xl">🧀</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 text-center">Queso Artesanal</span>
                  </div>

                  {/* Ham */}
                  <div className="bg-white/90 rounded-2xl p-4 shadow-warm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full mb-2 shadow-warm-sm flex items-center justify-center">
                      <span className="text-2xl">🥓</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 text-center">Jamón Ibérico</span>
                  </div>
                </div>
              </div>

              {/* Floating Quality Badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full p-3 shadow-natural-lg">
                <Award className="h-6 w-6 text-white" />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-3 shadow-warm-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>

              {/* Artisan Badge */}
              <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
                <div className="bg-white rounded-full p-4 shadow-natural-lg border-2 border-amber-200">
                  <div className="text-center">
                    <div className="text-2xl mb-1">👨‍🍳</div>
                    <div className="text-xs font-bold text-a4co-olive-700">Maestros</div>
                    <div className="text-xs text-gray-600">Artesanos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-amber-300 to-orange-400 rounded-full blur-xl"></div>
            </div>

            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-15">
              <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-500 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-12 fill-white">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </header>
  )
}
