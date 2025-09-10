import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Heart, Award, Users } from 'lucide-react';

export default function ArtisanalHeader() {
  return (
    <header className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MjQwMGUiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNNDAgNDBjMC0yMi4wOTEgMTcuOTA5LTQwIDQwLTQwdjQwSDQweiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      {/* Floating Artisanal Elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Wheat stalks */}
        <div className="absolute left-10 top-20 rotate-12 opacity-20">
          <div className="h-32 w-16 scale-x-50 transform rounded-full bg-gradient-to-t from-amber-600 to-amber-400"></div>
        </div>
        <div className="absolute right-16 top-32 -rotate-12 opacity-15">
          <div className="h-28 w-12 scale-x-50 transform rounded-full bg-gradient-to-t from-amber-700 to-amber-500"></div>
        </div>

        {/* Olive branch */}
        <div className="absolute bottom-32 left-20 opacity-20">
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
            <div className="h-8 w-1 bg-green-700"></div>
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
          </div>
        </div>

        {/* Bread crumbs pattern */}
        <div className="absolute right-1/4 top-1/2 opacity-10">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-3 w-3 rounded-full bg-amber-800"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto flex h-full items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          {/* Content Side */}
          <div className="text-center lg:text-left">
            {/* Brand Badge */}
            <div className="shadow-warm mb-6 inline-flex items-center rounded-full border border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 text-sm font-medium text-amber-800">
              <Heart className="mr-2 h-4 w-4 text-red-600" />
              Desde el corazón de Jaén
            </div>

            {/* Main Heading */}
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              <span className="text-a4co-olive-700">Artesanía</span>
              <br />
              <span className="text-a4co-clay-600">Auténtica</span>
              <br />
              <span className="text-3xl text-gray-800 sm:text-4xl lg:text-5xl">de España</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-8 max-w-2xl text-xl leading-relaxed text-gray-700">
              Descubre los sabores más auténticos de nuestra tierra. Desde el tradicional ochío
              jiennense hasta los quesos artesanales, cada producto cuenta la historia de
              generaciones de maestros artesanos.
            </p>

            {/* Product Highlights */}
            <div className="mb-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {[
                { name: 'Ochíos Tradicionales', icon: '🥖' },
                { name: 'Aceite de Oliva', icon: '🫒' },
                { name: 'Quesos Artesanales', icon: '🧀' },
                { name: 'Embutidos Ibéricos', icon: '🥓' },
                { name: 'Miel Natural', icon: '🍯' },
              ].map((product, index) => (
                <div
                  key={index}
                  className="shadow-natural-sm flex items-center rounded-full border border-amber-200 bg-white/80 px-3 py-2 backdrop-blur-sm"
                >
                  <span className="mr-2 text-lg">{product.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{product.name}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="from-a4co-olive-600 to-a4co-clay-600 hover:from-a4co-olive-700 hover:to-a4co-clay-700 shadow-mixed hover:shadow-mixed-lg bg-gradient-to-r px-8 py-3 text-lg font-semibold text-white transition-all duration-300"
              >
                Explorar Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-a4co-olive-600 text-a4co-olive-700 hover:bg-a4co-olive-50 shadow-natural hover:shadow-natural-lg bg-transparent px-8 py-3 text-lg font-semibold transition-all duration-300"
              >
                Conoce a los Artesanos
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 border-t border-amber-200 pt-6">
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Award className="mr-1 h-5 w-5 text-amber-600" />
                  <span className="text-a4co-olive-700 text-2xl font-bold">150+</span>
                </div>
                <div className="text-sm text-gray-600">Artesanos Certificados</div>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center">
                  <MapPin className="mr-1 h-5 w-5 text-red-600" />
                  <span className="text-a4co-clay-700 text-2xl font-bold">12</span>
                </div>
                <div className="text-sm text-gray-600">Provincias Españolas</div>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Users className="mr-1 h-5 w-5 text-green-600" />
                  <span className="text-a4co-olive-700 text-2xl font-bold">2.5k+</span>
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
              <div className="relative mx-auto h-96 w-full max-w-lg">
                <div className="shadow-natural-xl absolute inset-0 rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-amber-100/30 backdrop-blur-sm"></div>

                {/* Product Grid */}
                <div className="relative grid h-full grid-cols-2 gap-4 p-8">
                  {/* Ochío */}
                  <div className="shadow-warm flex flex-col items-center justify-center rounded-2xl bg-white/90 p-4">
                    <div className="shadow-warm-sm mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                      <span className="text-2xl">🥖</span>
                    </div>
                    <span className="text-center text-xs font-semibold text-gray-700">
                      Ochío Tradicional
                    </span>
                  </div>

                  {/* Olive Oil */}
                  <div className="shadow-warm flex flex-col items-center justify-center rounded-2xl bg-white/90 p-4">
                    <div className="shadow-natural-sm mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
                      <span className="text-2xl">🫒</span>
                    </div>
                    <span className="text-center text-xs font-semibold text-gray-700">
                      Aceite Virgen Extra
                    </span>
                  </div>

                  {/* Cheese */}
                  <div className="shadow-warm flex flex-col items-center justify-center rounded-2xl bg-white/90 p-4">
                    <div className="shadow-warm-sm mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500">
                      <span className="text-2xl">🧀</span>
                    </div>
                    <span className="text-center text-xs font-semibold text-gray-700">
                      Queso Artesanal
                    </span>
                  </div>

                  {/* Ham */}
                  <div className="shadow-warm flex flex-col items-center justify-center rounded-2xl bg-white/90 p-4">
                    <div className="shadow-warm-sm mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600">
                      <span className="text-2xl">🥓</span>
                    </div>
                    <span className="text-center text-xs font-semibold text-gray-700">
                      Jamón Ibérico
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Quality Badges */}
              <div className="shadow-natural-lg absolute -right-4 -top-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 p-3">
                <Award className="h-6 w-6 text-white" />
              </div>

              <div className="shadow-warm-lg absolute -bottom-4 -left-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-3">
                <Heart className="h-6 w-6 text-white" />
              </div>

              {/* Artisan Badge */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 transform">
                <div className="shadow-natural-lg rounded-full border-2 border-amber-200 bg-white p-4">
                  <div className="text-center">
                    <div className="mb-1 text-2xl">👨‍🍳</div>
                    <div className="text-a4co-olive-700 text-xs font-bold">Maestros</div>
                    <div className="text-xs text-gray-600">Artesanos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute right-0 top-0 h-32 w-32 opacity-20">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-amber-300 to-orange-400 blur-xl"></div>
            </div>

            <div className="absolute bottom-0 left-0 h-24 w-24 opacity-15">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-green-300 to-green-500 blur-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="h-12 w-full fill-white">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </header>
  );
}
