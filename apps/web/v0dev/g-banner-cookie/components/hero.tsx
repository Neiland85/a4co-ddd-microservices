import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Users, Store } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient - tonos terrosos */}
      <div className="absolute inset-0 bg-gradient-to-br from-a4co-olive-500 via-a4co-olive-400 to-a4co-clay-400" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6 shadow-natural">
              <MapPin className="h-4 w-4 mr-2" />
              Jaén, Andalucía
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Mercado Local
              <br />
              <span className="text-a4co-clay-200">de Jaén</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl drop-shadow-md">
              Descubre la auténtica artesanía jiennense. Conectamos a los mejores artesanos locales con personas que
              valoran la calidad y la tradición.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-white text-a4co-olive-700 hover:bg-gray-50 font-semibold px-8 py-3 text-lg shadow-natural-lg hover:shadow-natural-xl transition-all duration-300"
              >
                Explorar Artesanos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-a4co-olive-700 font-semibold px-8 py-3 text-lg bg-transparent shadow-natural hover:shadow-natural-lg transition-all duration-300"
              >
                Únete como Artesano
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white drop-shadow-md">150+</div>
                <div className="text-white/80 text-sm">Artesanos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white drop-shadow-md">500+</div>
                <div className="text-white/80 text-sm">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white drop-shadow-md">2.5k+</div>
                <div className="text-white/80 text-sm">Clientes</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Logo */}
          <div className="relative">
            <div className="relative h-96 w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl shadow-natural-xl" />
              <div className="relative h-full flex items-center justify-center p-8">
                <Image
                  src="/images/logo-dark.jpeg"
                  alt="A4CO Logo"
                  width={300}
                  height={200}
                  className="object-contain filter brightness-0 invert drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-a4co-clay-400 rounded-full p-3 shadow-warm-lg hover:shadow-warm-lg transition-shadow duration-300">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-natural-lg hover:shadow-natural-xl transition-shadow duration-300">
              <Users className="h-6 w-6 text-a4co-olive-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
