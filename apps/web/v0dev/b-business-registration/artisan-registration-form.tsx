"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, X, FileText, Info, Eye, Palette, Award } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { ArtisanProfilePreview } from "@/components/artisan-profile-preview"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"]
const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

const schema = z.object({
  artisanName: z.string().min(3, "El nombre del artesano/taller debe tener al menos 3 caracteres."),
  niche: z.string().min(1, "Selecciona un nicho artesanal."),
  specialty: z.string().min(1, "Especifica tu especialidad."),
  description: z.string().max(800, "La descripción no puede exceder los 800 caracteres."),
  culturalOrigin: z.string().optional(),
  techniques: z.array(z.string()).min(1, "Selecciona al menos una técnica."),
  materials: z.string().min(1, "Especifica los materiales que utilizas."),
  experience: z.string().min(1, "Indica tu experiencia."),
  images: z
    .array(z.instanceof(File))
    .min(1, "Debes subir al menos una imagen de tus productos.")
    .max(8, "Puedes subir un máximo de 8 imágenes.")
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), "Cada archivo no debe exceder los 5MB.")
    .refine(
      (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Solo se permiten imágenes en formato JPG, PNG o GIF.",
    ),
  priceRange: z.string().min(1, "Selecciona un rango de precios."),
  customOrders: z.boolean().default(false),
  workshops: z.boolean().default(false),
  certifications: z.string().optional(),
  additionalInfo: z.string().optional(),
  documents: z
    .array(z.instanceof(File))
    .max(3, "Puedes subir un máximo de 3 documentos.")
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), "Cada archivo no debe exceder los 5MB.")
    .refine(
      (files) => files.every((file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type)),
      "Solo se permiten documentos en formato PDF, DOC o DOCX.",
    )
    .optional(),
})

type FormData = z.infer<typeof schema>

const artisanNiches = [
  { value: "ceramica", label: "Cerámica y Alfarería" },
  { value: "textil", label: "Textil y Fibras" },
  { value: "madera", label: "Carpintería y Tallado" },
  { value: "metal", label: "Metalistería y Joyería" },
  { value: "cuero", label: "Marroquinería y Cuero" },
  { value: "vidrio", label: "Vidrio y Cristal" },
  { value: "papel", label: "Papel y Encuadernación" },
  { value: "piedra", label: "Cantería y Escultura" },
  { value: "gastronomia", label: "Gastronomía Tradicional" },
  { value: "instrumentos", label: "Instrumentos Musicales" },
  { value: "decoracion", label: "Decoración y Ornamentos" },
  { value: "otros", label: "Otros Oficios Tradicionales" },
]

const commonTechniques = [
  "Torno de alfarero",
  "Tejido a mano",
  "Bordado tradicional",
  "Tallado en madera",
  "Forja",
  "Soldadura artística",
  "Repujado",
  "Filigrana",
  "Soplado de vidrio",
  "Grabado",
  "Pintura decorativa",
  "Técnicas ancestrales",
]

export default function ArtisanRegistrationForm() {
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [documentList, setDocumentList] = useState<File[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      images: [],
      documents: [],
      techniques: [],
      customOrders: false,
      workshops: false,
    },
  })

  const watchedImages = watch("images")
  const watchedDocuments = watch("documents")

  const onSubmit = async (data: FormData) => {
    console.log("Datos del artesano enviados:", data)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("¡Perfil de artesano registrado exitosamente!")
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE,
    )

    if (validFiles.length + watchedImages.length > 8) {
      alert("Solo puedes subir un máximo de 8 imágenes")
      return
    }

    setValue("images", [...watchedImages, ...validFiles])

    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDocumentUpload = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(
      (file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE,
    )

    if (validFiles.length + watchedDocuments.length > 3) {
      alert("Solo puedes subir un máximo de 3 documentos")
      return
    }

    setValue("documents", [...watchedDocuments, ...validFiles])
    setDocumentList((prev) => [...prev, ...validFiles])
  }

  const removeImage = (index: number) => {
    const newImages = watchedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreview.filter((_, i) => i !== index)
    setValue("images", newImages)
    setImagePreview(newPreviews)
  }

  const removeDocument = (index: number) => {
    const newDocuments = watchedDocuments.filter((_, i) => i !== index)
    const newDocumentList = documentList.filter((_, i) => i !== index)
    setValue("documents", newDocuments)
    setDocumentList(newDocumentList)
  }

  const handleTechniqueChange = (technique: string, checked: boolean) => {
    let newTechniques: string[]
    if (checked) {
      newTechniques = [...selectedTechniques, technique]
    } else {
      newTechniques = selectedTechniques.filter((t) => t !== technique)
    }
    setSelectedTechniques(newTechniques)
    setValue("techniques", newTechniques)
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Palette className="w-8 h-8 text-amber-600" />
              <CardTitle className="text-3xl font-bold text-amber-800">Registro de Artesano</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Comparte tu arte y tradición cultural con el mundo. Registra tu taller artesanal y conecta con quienes
              valoran el trabajo hecho a mano.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Información básica del artesano */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-amber-700 border-b border-amber-200 pb-2">
                  Información del Artesano
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="artisanName">
                      Nombre del Artesano/Taller *
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="inline w-4 h-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tu nombre o el nombre de tu taller artesanal</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input id="artisanName" {...register("artisanName")} placeholder="Ej: Taller de Cerámica Maya" />
                    {errors.artisanName && <p className="text-red-500 text-sm">{errors.artisanName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="niche">Nicho Artesanal *</Label>
                    <Controller
                      name="niche"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu nicho" />
                          </SelectTrigger>
                          <SelectContent>
                            {artisanNiches.map((niche) => (
                              <SelectItem key={niche.value} value={niche.value}>
                                {niche.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.niche && <p className="text-red-500 text-sm">{errors.niche.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidad *</Label>
                    <Input
                      id="specialty"
                      {...register("specialty")}
                      placeholder="Ej: Vasijas decorativas, Huipiles bordados"
                    />
                    {errors.specialty && <p className="text-red-500 text-sm">{errors.specialty.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="culturalOrigin">Origen Cultural</Label>
                    <Input
                      id="culturalOrigin"
                      {...register("culturalOrigin")}
                      placeholder="Ej: Tradición Maya, Artesanía Andaluza"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experiencia *</Label>
                  <Controller
                    name="experience"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu nivel de experiencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="principiante">Principiante (1-2 años)</SelectItem>
                          <SelectItem value="intermedio">Intermedio (3-5 años)</SelectItem>
                          <SelectItem value="avanzado">Avanzado (6-10 años)</SelectItem>
                          <SelectItem value="maestro">Maestro Artesano (10+ años)</SelectItem>
                          <SelectItem value="tradicion-familiar">Tradición Familiar (generaciones)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message}</p>}
                </div>
              </div>

              {/* Técnicas y materiales */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-amber-700 border-b border-amber-200 pb-2">
                  Técnicas y Materiales
                </h3>

                <div className="space-y-4">
                  <Label>Técnicas que dominas *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonTechniques.map((technique) => (
                      <div key={technique} className="flex items-center space-x-2">
                        <Checkbox
                          id={technique}
                          checked={selectedTechniques.includes(technique)}
                          onCheckedChange={(checked) => handleTechniqueChange(technique, checked as boolean)}
                        />
                        <Label htmlFor={technique} className="text-sm font-normal">
                          {technique}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.techniques && <p className="text-red-500 text-sm">{errors.techniques.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials">Materiales principales *</Label>
                  <Textarea
                    id="materials"
                    {...register("materials")}
                    placeholder="Ej: Arcilla local, pigmentos naturales, madera de cedro, hilos de algodón orgánico..."
                    rows={3}
                    className="resize-none"
                  />
                  {errors.materials && <p className="text-red-500 text-sm">{errors.materials.message}</p>}
                </div>
              </div>

              {/* Descripción del trabajo */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-700 border-b border-amber-200 pb-2">
                  Descripción de tu Trabajo
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="description">Cuéntanos sobre tu arte *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe tu proceso creativo, la historia detrás de tus piezas, qué te inspira, técnicas especiales que utilizas..."
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Máximo 800 caracteres</span>
                    <span>{watch("description")?.length || 0}/800</span>
                  </div>
                  {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>
              </div>

              {/* Galería de productos */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-700 border-b border-amber-200 pb-2">
                  Galería de Productos
                </h3>

                <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors bg-amber-50">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-amber-500" />
                    <p className="mt-2 text-sm text-amber-700 font-medium">Sube fotos de tus mejores creaciones</p>
                    <p className="text-xs text-amber-600">
                      JPG, PNG, GIF hasta 5MB cada una (mínimo 1, máximo 8 imágenes)
                    </p>
                  </label>
                </div>

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Producto ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-amber-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {errors.images && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.images.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Información comercial */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-amber-700 border-b border-amber-200 pb-2">
                  Información Comercial
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Rango de precios *</Label>
                    <Controller
                      name="priceRange"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el rango de precios" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="economico">Económico (€10-50)</SelectItem>
                            <SelectItem value="medio">Medio (€50-150)</SelectItem>
                            <SelectItem value="premium">Premium (€150-500)</SelectItem>
                            <SelectItem value="lujo">Lujo (€500+)</SelectItem>
                            <SelectItem value="variable">Variable según pieza</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.priceRange && <p className="text-red-500 text-sm">{errors.priceRange.message}</p>}
                  </div>

                  <div className="space-y-4">
                    <Label>Servicios adicionales</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="customOrders"
                          control={control}
                          render={({ field }) => (
                            <Checkbox id="customOrders" checked={field.value} onCheckedChange={field.onChange} />
                          )}
                        />
                        <Label htmlFor="customOrders" className="font-normal">
                          Acepto pedidos personalizados
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="workshops"
                          control={control}
                          render={({ field }) => (
                            <Checkbox id="workshops" checked={field.value} onCheckedChange={field.onChange} />
                          )}
                        />
                        <Label htmlFor="workshops" className="font-normal">
                          Ofrezco talleres y clases
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificaciones y reconocimientos */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-700 border-b border-amber-200 pb-2 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certificaciones y Reconocimientos
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certificaciones, premios o reconocimientos</Label>
                  <Textarea
                    id="certifications"
                    {...register("certifications")}
                    placeholder="Ej: Certificado de Artesano Tradicional, Premio Regional de Artesanía 2023, Denominación de Origen..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* Información adicional */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Información adicional</Label>
                  <Textarea
                    id="additionalInfo"
                    {...register("additionalInfo")}
                    placeholder="Horarios de taller, ubicación, historia familiar, colaboraciones especiales, etc."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* Documentos adicionales */}
              <div className="space-y-4">
                <Label>Catálogos y material adicional</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) => handleDocumentUpload(e.target.files)}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Sube catálogos, certificados, artículos de prensa</p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX hasta 5MB cada uno (máximo 3 documentos)</p>
                  </label>
                </div>

                {documentList.length > 0 && (
                  <div className="space-y-2">
                    {documentList.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm truncate">{doc.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {(doc.size / 1024 / 1024).toFixed(1)} MB
                          </Badge>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {errors.documents && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.documents.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? "Ocultar vista previa" : "Ver vista previa"}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registrando..." : "Registrar Perfil Artesanal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Vista previa del perfil */}
        {showPreview && (
          <ArtisanProfilePreview
            artisanName={watch("artisanName")}
            niche={watch("niche")}
            specialty={watch("specialty")}
            description={watch("description")}
            culturalOrigin={watch("culturalOrigin")}
            techniques={selectedTechniques}
            materials={watch("materials")}
            experience={watch("experience")}
            priceRange={watch("priceRange")}
            customOrders={watch("customOrders")}
            workshops={watch("workshops")}
            certifications={watch("certifications")}
            additionalInfo={watch("additionalInfo")}
            images={imagePreview}
            documents={documentList}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
