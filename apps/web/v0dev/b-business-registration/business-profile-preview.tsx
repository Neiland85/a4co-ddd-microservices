"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Phone, Mail, FileText, Star } from "lucide-react"

interface BusinessProfilePreviewProps {
  businessName?: string
  description?: string
  activity?: string
  additionalInfo?: string
  images: string[]
  documents: File[]
}

const activityLabels: Record<string, string> = {
  restaurante: "Restaurante",
  tienda: "Tienda",
  servicios: "Servicios",
  tecnologia: "Tecnología",
  salud: "Salud y Bienestar",
  educacion: "Educación",
  construccion: "Construcción",
  otros: "Otros",
}

const activityColors: Record<string, string> = {
  restaurante: "bg-orange-100 text-orange-800",
  tienda: "bg-blue-100 text-blue-800",
  servicios: "bg-green-100 text-green-800",
  tecnologia: "bg-purple-100 text-purple-800",
  salud: "bg-red-100 text-red-800",
  educacion: "bg-yellow-100 text-yellow-800",
  construccion: "bg-gray-100 text-gray-800",
  otros: "bg-indigo-100 text-indigo-800",
}

export default function BusinessProfilePreview({
  businessName = "Nombre del negocio",
  description = "",
  activity = "",
  additionalInfo = "",
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
        <CardDescription>Así es como se verá tu perfil de negocio para los usuarios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Header del perfil */}
          <div className="relative">
            {/* Imagen de portada simulada */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>

            {/* Información principal */}
            <div className="relative -mt-8 ml-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Avatar del negocio */}
                <div className="w-16 h-16 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  {images[0] ? (
                    <img
                      src={images[0] || "/placeholder.svg"}
                      alt="Logo del negocio"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-xl font-bold">
                        {businessName.charAt(0).toUpperCase() || "N"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Información básica */}
                <div className="flex-1 pb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{businessName}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    {activity && (
                      <Badge className={activityColors[activity] || "bg-gray-100 text-gray-800"}>
                        {activityLabels[activity] || activity}
                      </Badge>
                    )}
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4" />
                      <span className="ml-1 text-sm text-gray-600">4.0 (24 reseñas)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de contacto simulada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Ciudad, País</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Abierto ahora</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>+1 234 567 890</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>contacto@negocio.com</span>
            </div>
          </div>

          {/* Descripción */}
          {description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Acerca de nosotros</h3>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          )}

          {/* Galería de imágenes */}
          {images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Galería</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional */}
          {additionalInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Información adicional</h3>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{additionalInfo}</p>
              </div>
            </div>
          )}

          {/* Documentos y material */}
          {documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Material disponible</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{(doc.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Sección de reseñas simulada */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Reseñas recientes</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Usuario ejemplo</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  "Excelente servicio y atención. Muy recomendado para cualquiera que busque calidad."
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Otro usuario</p>
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                      ))}
                      <Star className="w-3 h-3 text-gray-300" />
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
  )
}
