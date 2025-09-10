'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Clock,
  FileText,
  Star,
  Award,
  ChefHat,
  Users,
  Euro,
  Video,
  Play,
} from 'lucide-react';

interface FoodArtisanProfilePreviewProps {
  producerName?: string;
  activityType?: string;
  foodCategory?: string;
  techCategory?: string;
  specialty?: string;
  description?: string;
  familyTradition?: string;
  productionMethods: string[];
  ingredients?: string;
  techStack?: string;
  experience?: string;
  priceRange?: string;
  organicCertified?: boolean;
  localSuppliers?: boolean;
  seasonalProduction?: boolean;
  openSource?: boolean;
  customOrders?: boolean;
  tastings?: boolean;
  workshops?: boolean;
  certifications?: string;
  distributionArea?: string;
  additionalInfo?: string;
  images: string[];
  videos: File[];
  documents: File[];
}

const categoryLabels: Record<string, string> = {
  // Categorías alimentarias
  'ochio-pan': 'Ochio y Pan',
  quesos: 'Quesos Artesanales',
  embutidos: 'Embutidos y Charcutería',
  aceite: 'Aceite de Oliva',
  carne: 'Carne y Productos Cárnicos',
  vino: 'Vinos y Licores',
  miel: 'Miel y Productos Apícolas',
  conservas: 'Conservas y Encurtidos',
  dulces: 'Dulces y Repostería',
  cerveza: 'Cerveza Artesanal',
  lacteos: 'Productos Lácteos',
  'otros-alimentarios': 'Otros Productos Alimentarios',
  // Categorías tecnológicas
  'recetas-ia': 'Recetas con IA',
  'videoclips-ia': 'Videoclips con IA',
  'codigo-abierto': 'Código Open Source',
  'subvenciones-ia': 'Subvenciones con IA',
  'hackeo-ayuntamiento': 'Hackeo Ayuntamiento IA',
  'video-bromas': 'Video-bromas con IA',
  'automatizacion-cultural': 'Automatización Cultural',
  'apps-culturales': 'Apps Culturales',
  'realidad-virtual': 'Realidad Virtual/AR',
  'blockchain-cultura': 'Blockchain Cultural',
  'otros-tech': 'Otros Servicios Tech',
};

const categoryColors: Record<string, string> = {
  // Colores para alimentarios (mantener los existentes)
  'ochio-pan': 'bg-amber-100 text-amber-800',
  quesos: 'bg-yellow-100 text-yellow-800',
  embutidos: 'bg-red-100 text-red-800',
  aceite: 'bg-green-100 text-green-800',
  pan: 'bg-amber-100 text-amber-800',
  carne: 'bg-rose-100 text-rose-800',
  vino: 'bg-purple-100 text-purple-800',
  miel: 'bg-orange-100 text-orange-800',
  conservas: 'bg-lime-100 text-lime-800',
  dulces: 'bg-pink-100 text-pink-800',
  cerveza: 'bg-blue-100 text-blue-800',
  lacteos: 'bg-cyan-100 text-cyan-800',
  'otros-alimentarios': 'bg-slate-100 text-slate-800',
  // Nuevos colores para tecnológicos
  'recetas-ia': 'bg-blue-100 text-blue-800',
  'videoclips-ia': 'bg-purple-100 text-purple-800',
  'codigo-abierto': 'bg-gray-100 text-gray-800',
  'subvenciones-ia': 'bg-green-100 text-green-800',
  'hackeo-ayuntamiento': 'bg-red-100 text-red-800',
  'video-bromas': 'bg-pink-100 text-pink-800',
  'automatizacion-cultural': 'bg-indigo-100 text-indigo-800',
  'apps-culturales': 'bg-cyan-100 text-cyan-800',
  'realidad-virtual': 'bg-violet-100 text-violet-800',
  'blockchain-cultura': 'bg-orange-100 text-orange-800',
  'otros-tech': 'bg-slate-100 text-slate-800',
};

const experienceLabels: Record<string, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  maestro: 'Maestro Productor',
  'tradicion-familiar': 'Tradición Familiar',
};

const priceRangeLabels: Record<string, string> = {
  economico: '€5-15/kg',
  medio: '€15-30/kg',
  premium: '€30-60/kg',
  gourmet: '€60+/kg',
  variable: 'Variable',
};

export function FoodArtisanProfilePreview({
  producerName = 'Nombre del Productor',
  activityType = '',
  foodCategory = '',
  techCategory = '',
  specialty = '',
  description = '',
  familyTradition = '',
  productionMethods = [],
  ingredients = '',
  techStack = '',
  experience = '',
  priceRange = '',
  organicCertified = false,
  localSuppliers = false,
  seasonalProduction = false,
  openSource = false,
  customOrders = false,
  tastings = false,
  workshops = false,
  certifications = '',
  distributionArea = '',
  additionalInfo = '',
  images = [],
  videos = [],
  documents = [],
}: FoodArtisanProfilePreviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ChefHat className="h-6 w-6 text-green-600" />
            Vista previa del perfil de productor
          </CardTitle>
          <Badge variant="secondary">Vista previa</Badge>
        </div>
        <CardDescription>
          Así es como se verá tu perfil para los amantes de los productos artesanales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Header del perfil de productor */}
          <div className="relative">
            {/* Banner gastronómico */}
            <div className="relative h-40 overflow-hidden rounded-lg bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <p className="text-sm font-medium opacity-90">Productos Artesanales</p>
                <p className="text-xs opacity-75">Sabor auténtico, tradición familiar</p>
              </div>
            </div>

            {/* Información principal */}
            <div className="relative -mt-12 ml-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* Avatar del productor */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
                  {images[0] ? (
                    <img
                      src={images[0] || '/placeholder.svg'}
                      alt="Productos del productor"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-green-100">
                      <ChefHat className="h-8 w-8 text-green-600" />
                    </div>
                  )}
                </div>

                {/* Información básica */}
                <div className="flex-1 pb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{producerName}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {(foodCategory || techCategory) && (
                      <Badge
                        className={
                          categoryColors[foodCategory || techCategory || ''] ||
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {categoryLabels[foodCategory || techCategory || ''] ||
                          foodCategory ||
                          techCategory}
                      </Badge>
                    )}
                    {specialty && (
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        {specialty}
                      </Badge>
                    )}
                    {experience && (
                      <Badge variant="secondary">
                        {experienceLabels[experience] || experience}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">5.0 (18 reseñas)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de contacto y servicios */}
          <div className="grid grid-cols-1 gap-4 rounded-lg bg-green-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-green-600" />
              <span>{distributionArea || 'Distribución local'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-green-600" />
              <span>Producción artesanal</span>
            </div>
            {priceRange && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Euro className="h-4 w-4 text-green-600" />
                <span>{priceRangeLabels[priceRange] || priceRange}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="h-4 w-4 text-green-600" />
              <span>Productor verificado</span>
            </div>
          </div>

          {/* Características especiales */}
          <div className="flex flex-wrap gap-2">
            {organicCertified && (
              <Badge className="bg-green-100 text-green-800">🌱 Certificación Ecológica</Badge>
            )}
            {localSuppliers && (
              <Badge className="bg-blue-100 text-blue-800">🏘️ Proveedores Locales</Badge>
            )}
            {seasonalProduction && (
              <Badge className="bg-orange-100 text-orange-800">🍂 Producción Estacional</Badge>
            )}
            {customOrders && (
              <Badge className="bg-purple-100 text-purple-800">✨ Pedidos Personalizados</Badge>
            )}
            {tastings && (
              <Badge className="bg-pink-100 text-pink-800">🍷 Catas y Degustaciones</Badge>
            )}
            {workshops && <Badge className="bg-lime-100 text-lime-800">🧑‍🏫 Talleres y Cursos</Badge>}
            {openSource && <Badge className="bg-gray-100 text-gray-800">👨‍💻 Código Abierto</Badge>}
          </div>

          {/* Descripción */}
          {description && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-green-800">Nuestros Productos</h3>
              <p className="leading-relaxed text-gray-700">{description}</p>
            </div>
          )}

          {/* Historia familiar */}
          {familyTradition && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-green-800">Historia y Tradición</h3>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="italic leading-relaxed text-gray-700">{familyTradition}</p>
              </div>
            </div>
          )}

          {/* Métodos e ingredientes */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {productionMethods.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-green-800">Métodos de Producción</h3>
                <div className="flex flex-wrap gap-2">
                  {productionMethods.map((method, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {ingredients && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-green-800">
                  Ingredientes Principales
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">{ingredients}</p>
              </div>
            )}
          </div>

          {activityType === 'tecnologico' && techStack && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-blue-800">Stack Tecnológico</h3>
              <p className="text-sm leading-relaxed text-gray-700">{techStack}</p>
            </div>
          )}

          {/* Galería de productos */}
          {images.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-green-800">Galería de Productos</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg border-2 border-green-200"
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`Producto ${index + 1}`}
                      className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Galería de videos */}
          {videos.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-800">
                <Video className="h-5 w-5" />
                Videos Demostrativos
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg border-2 border-purple-200 bg-gray-100"
                  >
                    <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                      <div className="text-center">
                        <Play className="mx-auto mb-2 h-12 w-12 text-purple-600" />
                        <p className="truncate px-2 text-sm font-medium text-purple-800">
                          {video.name}
                        </p>
                        <p className="text-xs text-purple-600">
                          {(video.size / 1024 / 1024).toFixed(1)} MB •{' '}
                          {video.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificaciones */}
          {certifications && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-800">
                <Award className="h-5 w-5" />
                Certificaciones y Reconocimientos
              </h3>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="whitespace-pre-wrap text-gray-700">{certifications}</p>
              </div>
            </div>
          )}

          {/* Información adicional */}
          {additionalInfo && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-green-800">Información Adicional</h3>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="whitespace-pre-wrap text-gray-700">{additionalInfo}</p>
              </div>
            </div>
          )}

          {/* Material adicional */}
          {documents.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-green-800">
                Catálogos y Certificados
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-green-200 p-3 hover:bg-green-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {(doc.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Sección de reseñas de clientes */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-green-800">Opiniones de Clientes</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                    <span className="text-xs font-bold text-green-800">AM</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ana María</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  "Productos de calidad excepcional. Se nota que están hechos con amor y siguiendo
                  la tradición. El sabor es incomparable."
                </p>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                    <span className="text-xs font-bold text-green-800">CR</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Carlos Rodríguez</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  "Llevo años comprando aquí y siempre me sorprenden. Productos frescos, auténticos
                  y con un trato muy personal."
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
