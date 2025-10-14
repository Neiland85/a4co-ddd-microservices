'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, FileText, Star, Award, Palette, Users, Euro, Hammer } from 'lucide-react';

interface ArtisanProfilePreviewProps {
  artisanName?: string;
  niche?: string;
  specialty?: string;
  description?: string;
  culturalOrigin?: string;
  techniques: string[];
  materials?: string;
  experience?: string;
  priceRange?: string;
  customOrders?: boolean;
  workshops?: boolean;
  certifications?: string;
  additionalInfo?: string;
  images: string[];
  documents: File[];
}

const nicheLabels: Record<string, string> = {
  ceramica: 'Cerámica y Alfarería',
  textil: 'Textil y Fibras',
  madera: 'Carpintería y Tallado',
  metal: 'Metalistería y Joyería',
  cuero: 'Marroquinería y Cuero',
  vidrio: 'Vidrio y Cristal',
  papel: 'Papel y Encuadernación',
  piedra: 'Cantería y Escultura',
  gastronomia: 'Gastronomía Tradicional',
  instrumentos: 'Instrumentos Musicales',
  decoracion: 'Decoración y Ornamentos',
  otros: 'Otros Oficios Tradicionales',
};

const nicheColors: Record<string, string> = {
  ceramica: 'bg-orange-100 text-orange-800',
  textil: 'bg-purple-100 text-purple-800',
  madera: 'bg-amber-100 text-amber-800',
  metal: 'bg-gray-100 text-gray-800',
  cuero: 'bg-yellow-100 text-yellow-800',
  vidrio: 'bg-blue-100 text-blue-800',
  papel: 'bg-green-100 text-green-800',
  piedra: 'bg-stone-100 text-stone-800',
  gastronomia: 'bg-red-100 text-red-800',
  instrumentos: 'bg-indigo-100 text-indigo-800',
  decoracion: 'bg-pink-100 text-pink-800',
  otros: 'bg-slate-100 text-slate-800',
};

const experienceLabels: Record<string, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  maestro: 'Maestro Artesano',
  'tradicion-familiar': 'Tradición Familiar',
};

const priceRangeLabels: Record<string, string> = {
  economico: '€10-50',
  medio: '€50-150',
  premium: '€150-500',
  lujo: '€500+',
  variable: 'Variable',
};

export function ArtisanProfilePreview({
  artisanName = 'Nombre del Artesano',
  niche = '',
  specialty = '',
  description = '',
  culturalOrigin = '',
  techniques = [],
  materials = '',
  experience = '',
  priceRange = '',
  customOrders = false,
  workshops = false,
  certifications = '',
  additionalInfo = '',
  images = [],
  documents = [],
}: ArtisanProfilePreviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Palette className="h-6 w-6 text-amber-600" />
            Vista previa del perfil artesanal
          </CardTitle>
          <Badge variant="secondary">Vista previa</Badge>
        </div>
        <CardDescription>
          Así es como se verá tu perfil para los visitantes interesados en artesanías
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Header del perfil artesanal */}
          <div className="relative">
            {/* Banner artesanal */}
            <div className="relative h-40 overflow-hidden rounded-lg bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <p className="text-sm font-medium opacity-90">Artesanía Tradicional</p>
                <p className="text-xs opacity-75">Hecho a mano con amor y tradición</p>
              </div>
            </div>

            {/* Información principal */}
            <div className="relative -mt-12 ml-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* Avatar del artesano */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
                  {images[0] ? (
                    <img
                      src={images[0] || '/placeholder.svg'}
                      alt="Foto del artesano"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-amber-100">
                      <Hammer className="h-8 w-8 text-amber-600" />
                    </div>
                  )}
                </div>

                {/* Información básica */}
                <div className="flex-1 pb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{artisanName}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {niche && (
                      <Badge className={nicheColors[niche] || 'bg-gray-100 text-gray-800'}>
                        {nicheLabels[niche] || niche}
                      </Badge>
                    )}
                    {specialty && (
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        {specialty}
                      </Badge>
                    )}
                    {experience && (
                      <Badge variant="secondary">
                        {experienceLabels[experience] || experience}
                      </Badge>
                    )}
                  </div>
                  {culturalOrigin && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                      <Award className="h-4 w-4" />
                      {culturalOrigin}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información de contacto y servicios */}
          <div className="grid grid-cols-1 gap-4 rounded-lg bg-amber-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-amber-600" />
              <span>Taller local</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>Por cita previa</span>
            </div>
            {priceRange && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Euro className="h-4 w-4 text-amber-600" />
                <span>{priceRangeLabels[priceRange] || priceRange}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="h-4 w-4 text-amber-600" />
              <span>Artesano verificado</span>
            </div>
          </div>

          {/* Servicios especiales */}
          {(customOrders || workshops) && (
            <div className="flex flex-wrap gap-2">
              {customOrders && (
                <Badge className="bg-green-100 text-green-800">✨ Pedidos personalizados</Badge>
              )}
              {workshops && (
                <Badge className="bg-blue-100 text-blue-800">🎓 Talleres y clases</Badge>
              )}
            </div>
          )}

          {/* Descripción */}
          {description && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-amber-800">Mi Arte y Tradición</h3>
              <p className="leading-relaxed text-gray-700">{description}</p>
            </div>
          )}

          {/* Técnicas y materiales */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {techniques.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-amber-800">Técnicas que domino</h3>
                <div className="flex flex-wrap gap-2">
                  {techniques.map((technique, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {materials && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-amber-800">
                  Materiales principales
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">{materials}</p>
              </div>
            )}
          </div>

          {/* Galería de productos */}
          {images.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-amber-800">Galería de Creaciones</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg border-2 border-amber-200"
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`Creación ${index + 1}`}
                      className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificaciones */}
          {certifications && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-amber-800">
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
              <h3 className="mb-3 text-lg font-semibold text-amber-800">Información del Taller</h3>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="whitespace-pre-wrap text-gray-700">{additionalInfo}</p>
              </div>
            </div>
          )}

          {/* Material adicional */}
          {documents.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-amber-800">Catálogos y Material</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-amber-200 p-3 hover:bg-amber-50"
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
            <h3 className="mb-4 text-lg font-semibold text-amber-800">Opiniones de Clientes</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300">
                    <span className="text-xs font-bold text-amber-800">MC</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">María Carmen</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  "Una pieza única y hermosa. Se nota el amor y la dedicación en cada detalle.
                  Totalmente recomendado para quien busca artesanía auténtica."
                </p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300">
                    <span className="text-xs font-bold text-amber-800">JL</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">José Luis</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  "Excelente trabajo artesanal. La calidad es excepcional y el trato muy
                  profesional. Volveré sin duda."
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
