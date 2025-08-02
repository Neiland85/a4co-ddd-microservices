import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Heart, Users } from "lucide-react"

const advantages = [
  {
    icon: Heart,
    title: "Productos Auténticos",
    description:
      "Cada producto cuenta una historia. Artesanía tradicional jiennense elaborada con técnicas ancestrales y materiales de la más alta calidad.",
    color: "text-red-700", // Rojo terroso
  },
  {
    icon: Users,
    title: "Comunidad Local",
    description:
      "Apoyamos directamente a los artesanos de Jaén. Tu compra contribuye al desarrollo económico local y preserva nuestras tradiciones.",
    color: "text-a4co-olive-600", // Verde oliva
  },
  {
    icon: Shield,
    title: "Calidad Garantizada",
    description:
      "Todos nuestros artesanos pasan por un proceso de verificación. Garantizamos la autenticidad y calidad de cada producto.",
    color: "text-a4co-clay-600", // Arcilla
  },
]

export default function AdvantagesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">¿Por qué elegir A4CO?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos más que un marketplace. Somos una plataforma dedicada por y para el pequeño comercio, conectando la
            tradición artesanal con el mundo digital.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon
            return (
              <Card
                key={index}
                className="border-0 shadow-natural-lg hover:shadow-natural-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gray-100 shadow-natural">
                    <IconComponent className={`h-8 w-8 ${advantage.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">{advantage.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-a4co-olive-500 to-a4co-clay-500 rounded-2xl p-8 text-white shadow-mixed-lg hover:shadow-natural-xl transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 drop-shadow-md">Únete a nuestra comunidad</h3>
            <p className="text-lg mb-6 opacity-90 drop-shadow-sm">
              Descubre productos únicos y apoya a los artesanos locales de Jaén
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-a4co-olive-700 hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-natural-md hover:shadow-natural-lg transform hover:-translate-y-0.5">
                Explorar Productos
              </button>
              <button className="border border-white text-white hover:bg-white hover:text-a4co-olive-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-natural hover:shadow-natural-lg transform hover:-translate-y-0.5">
                Registrarse como Artesano
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
