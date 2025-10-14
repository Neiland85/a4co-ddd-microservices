'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Phone, Mail, FileText, Star } from 'lucide-react';

interface BusinessProfilePreviewProps {
  businessName?: string;
  description?: string;
  activity?: string;
  additionalInfo?: string;
  images: string[];
  documents: File[];
}

const activityLabels: Record<string, string> = {
  restaurante: 'Restaurante',
  tienda: 'Tienda',
  servicios: 'Servicios',
  tecnologia: 'Tecnología',
  salud: 'Salud y Bienestar',
  educacion: 'Educación',
  construccion: 'Construcción',
  otros: 'Otros',
};

const activityColors: Record<string, string> = {
  restaurante: 'bg-orange-100 text-orange-800',
  tienda: 'bg-blue-100 text-blue-800',
  servicios: 'bg-green-100 text-green-800',
  tecnologia: 'bg-purple-100 text-purple-800',
  salud: 'bg-red-100 text-red-800',
  educacion: 'bg-yellow-100 text-yellow-800',
  construccion: 'bg-gray-100 text-gray-800',
  otros: 'bg-indigo-100 text-indigo-800',
};

export default function BusinessProfilePreview({
  businessName = 'Nombre del negocio',
  description = '',
  activity = '',
  additionalInfo = '',
  images = [],
  documents = [],
}: BusinessProfilePreviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Vista previa del perfil</CardTitle>
          <Badge variant="secondary">Vista previa</Badge>
        </div>
        <CardDescription>
          Así es como se verá tu perfil de negocio para los usuarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Header del perfil */}
          <div className="relative">
            {/* Imagen de portada simulada */}
            <div className="h-32 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"></div>

            {/* Información principal */}
            <div className="relative -mt-8 ml-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* Avatar del negocio */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
                  {images[0] ? (
                    <img
                      src={images[0] || '/placeholder.svg'}
                      alt="Logo del negocio"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200">
                      <span className="text-xl font-bold text-gray-500">
                        {businessName.charAt(0).toUpperCase() || 'N'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Información básica */}
                <div className="flex-1 pb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{businessName}</h1>
                  <div className="mt-1 flex items-center gap-2">
                    {activity && (
                      <Badge className={activityColors[activity] || 'bg-gray-100 text-gray-800'}>
                        {activityLabels[activity] || activity}
                      </Badge>
                    )}
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4" />
                      <span className="ml-1 text-sm text-gray-600">4.0 (24 reseñas)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de contacto simulada */}
          <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Ciudad, País</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Abierto ahora</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>+1 234 567 890</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>contacto@negocio.com</span>
            </div>
          </div>

          {/* Descripción */}
          {description && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Acerca de nosotros</h3>
              <p className="leading-relaxed text-gray-700">{description}</p>
            </div>
          )}

          {/* Galería de imágenes */}
          {images.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold">Galería</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {images.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`Imagen ${index + 1}`}
                      className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional */}
          {additionalInfo && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Información adicional</h3>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="whitespace-pre-wrap text-gray-700">{additionalInfo}</p>
              </div>
            </div>
          )}

          {/* Documentos y material */}
          {documents.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold">Material disponible</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
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

          {/* Sección de reseñas simulada */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Reseñas recientes</h3>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-medium">Usuario ejemplo</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  "Excelente servicio y atención. Muy recomendado para cualquiera que busque
                  calidad."
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-medium">Otro usuario</p>
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                      ))}
                      <Star className="h-3 w-3 text-gray-300" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  "Muy buena experiencia en general. El lugar es acogedor y el personal muy amable."
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
