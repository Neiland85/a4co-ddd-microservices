import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Users, Store } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* Background Gradient - tonos terrosos */}
      <div className="from-a4co-olive-500 via-a4co-olive-400 to-a4co-clay-400 absolute inset-0 bg-gradient-to-br" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="shadow-natural mb-6 inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <MapPin className="mr-2 h-4 w-4" />
              Jaén, Andalucía
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              Mercado Local
              <br />
              <span className="text-a4co-clay-200">de Jaén</span>
            </h1>

            <p className="mb-8 max-w-2xl text-xl text-white/90 drop-shadow-md">
              Descubre la auténtica artesanía jiennense. Conectamos a los mejores artesanos locales
              con personas que valoran la calidad y la tradición.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="text-a4co-olive-700 shadow-natural-lg hover:shadow-natural-xl bg-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:bg-gray-50"
              >
                Explorar Artesanos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="hover:text-a4co-olive-700 shadow-natural hover:shadow-natural-lg border-white bg-transparent px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-white"
              >
                Únete como Artesano
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white drop-shadow-md">150+</div>
                <div className="text-sm text-white/80">Artesanos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white drop-shadow-md">500+</div>
                <div className="text-sm text-white/80">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white drop-shadow-md">2.5k+</div>
                <div className="text-sm text-white/80">Clientes</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Logo */}
          <div className="relative">
            <div className="relative mx-auto h-96 w-full max-w-md">
              <div className="shadow-natural-xl absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm" />
              <div className="relative flex h-full items-center justify-center p-8">
                <Image
                  src="/images/logo-dark.jpeg"
                  alt="A4CO Logo"
                  width={300}
                  height={200}
                  className="object-contain brightness-0 drop-shadow-lg invert filter"
                  priority
                />
              </div>
            </div>

            {/* Floating elements */}
            <div className="bg-a4co-clay-400 shadow-warm-lg hover:shadow-warm-lg absolute -right-4 -top-4 rounded-full p-3 transition-shadow duration-300">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div className="shadow-natural-lg hover:shadow-natural-xl absolute -bottom-4 -left-4 rounded-full bg-white p-3 transition-shadow duration-300">
              <Users className="text-a4co-olive-600 h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
