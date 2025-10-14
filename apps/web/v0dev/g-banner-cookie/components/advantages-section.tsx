import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, Users } from 'lucide-react';

const advantages = [
  {
    icon: Heart,
    title: 'Productos Auténticos',
    description:
      'Cada producto cuenta una historia. Artesanía tradicional jiennense elaborada con técnicas ancestrales y materiales de la más alta calidad.',
    color: 'text-red-700', // Rojo terroso
  },
  {
    icon: Users,
    title: 'Comunidad Local',
    description:
      'Apoyamos directamente a los artesanos de Jaén. Tu compra contribuye al desarrollo económico local y preserva nuestras tradiciones.',
    color: 'text-a4co-olive-600', // Verde oliva
  },
  {
    icon: Shield,
    title: 'Calidad Garantizada',
    description:
      'Todos nuestros artesanos pasan por un proceso de verificación. Garantizamos la autenticidad y calidad de cada producto.',
    color: 'text-a4co-clay-600', // Arcilla
  },
];

export default function AdvantagesSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 drop-shadow-sm sm:text-4xl">
            ¿Por qué elegir A4CO?
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Somos más que un marketplace. Somos una plataforma dedicada por y para el pequeño
            comercio, conectando la tradición artesanal con el mundo digital.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <Card
                key={index}
                className="shadow-natural-lg hover:shadow-natural-xl transform border-0 transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-4 text-center">
                  <div className="shadow-natural mx-auto mb-4 rounded-full bg-gray-100 p-3">
                    <IconComponent className={`h-8 w-8 ${advantage.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {advantage.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="leading-relaxed text-gray-600">
                    {advantage.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="from-a4co-olive-500 to-a4co-clay-500 shadow-mixed-lg hover:shadow-natural-xl rounded-2xl bg-gradient-to-r p-8 text-white transition-all duration-300">
            <h3 className="mb-4 text-2xl font-bold drop-shadow-md">Únete a nuestra comunidad</h3>
            <p className="mb-6 text-lg opacity-90 drop-shadow-sm">
              Descubre productos únicos y apoya a los artesanos locales de Jaén
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="text-a4co-olive-700 shadow-natural-md hover:shadow-natural-lg transform rounded-lg bg-white px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50">
                Explorar Productos
              </button>
              <button className="hover:text-a4co-olive-700 shadow-natural hover:shadow-natural-lg transform rounded-lg border border-white px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
                Registrarse como Artesano
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
