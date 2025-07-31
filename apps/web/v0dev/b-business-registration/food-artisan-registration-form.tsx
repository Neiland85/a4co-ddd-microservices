"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, X, FileText, Info, Eye, ChefHat, Award, Cpu, Video, Play } from "lucide-react"

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
import { FoodArtisanProfilePreview } from "@/components/food-artisan-profile-preview"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB para imágenes
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB para videos
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"]
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/mov", "video/avi", "video/webm"]
const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

const schema = z
  .object({
    producerName: z.string().min(3, "El nombre del productor/empresa debe tener al menos 3 caracteres."),
    activityType: z.enum(["alimentario", "tecnologico"], {
      required_error: "Selecciona el tipo de actividad.",
    }),
    foodCategory: z.string().optional(),
    techCategory: z.string().optional(),
    specialty: z.string().min(1, "Especifica tu especialidad."),
    description: z.string().max(800, "La descripción no puede exceder los 800 caracteres."),
    familyTradition: z.string().optional(),
    productionMethods: z.array(z.string()).min(1, "Selecciona al menos un método de producción/trabajo."),
    ingredients: z.string().optional(),
    techStack: z.string().optional(),
    experience: z.string().min(1, "Indica tu experiencia."),
    images: z
      .array(z.instanceof(File))
      .min(1, "Debes subir al menos una imagen de tus productos/proyectos.")
      .max(8, "Puedes subir un máximo de 8 imágenes.")
      .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), "Cada imagen no debe exceder los 5MB.")
      .refine(
        (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        "Solo se permiten imágenes en formato JPG, PNG o GIF.",
      ),
    videos: z
      .array(z.instanceof(File))
      .max(3, "Puedes subir un máximo de 3 videos.")
      .refine((files) => files.every((file) => file.size <= MAX_VIDEO_SIZE), "Cada video no debe exceder los 50MB.")
      .refine(
        (files) => files.every((file) => ACCEPTED_VIDEO_TYPES.includes(file.type)),
        "Solo se permiten videos en formato MP4, MOV, AVI o WebM.",
      )
      .optional(),
    priceRange: z.string().min(1, "Selecciona un rango de precios."),
    organicCertified: z.boolean().default(false),
    localSuppliers: z.boolean().default(false),
    seasonalProduction: z.boolean().default(false),
    openSource: z.boolean().default(false),
    customOrders: z.boolean().default(false),
    tastings: z.boolean().default(false),
    workshops: z.boolean().default(false),
    certifications: z.string().optional(),
    distributionArea: z.string().optional(),
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
  .refine(
    (data) => {
      if (data.activityType === "alimentario" && !data.foodCategory) {
        return false
      }
      if (data.activityType === "tecnologico" && !data.techCategory) {
        return false
      }
      return true
    },
    {
      message: "Selecciona una categoría según el tipo de actividad.",
      path: ["foodCategory"],
    },
  )

type FormData = z.infer<typeof schema>

const foodCategories = [
  { value: "ochio-pan", label: "Ochio y Pan" },
  { value: "quesos", label: "Quesos Artesanales" },
  { value: "embutidos", label: "Embutidos y Charcutería" },
  { value: "aceite", label: "Aceite de Oliva" },
  { value: "carne", label: "Carne y Productos Cárnicos" },
  { value: "vino", label: "Vinos y Licores" },
  { value: "miel", label: "Miel y Productos Apícolas" },
  { value: "conservas", label: "Conservas y Encurtidos" },
  { value: "dulces", label: "Dulces y Repostería" },
  { value: "cerveza", label: "Cerveza Artesanal" },
  { value: "lacteos", label: "Productos Lácteos" },
  { value: "otros-alimentarios", label: "Otros Productos Alimentarios" },
]

const techCategories = [
  { value: "recetas-ia", label: "Recetas con Inteligencia Artificial" },
  { value: "videoclips-ia", label: "Videoclips con IA" },
  { value: "codigo-abierto", label: "Proyectos de Código Open Source" },
  { value: "subvenciones-ia", label: "Subvenciones Culturales con IA" },
  { value: "hackeo-ayuntamiento", label: "Hackeo al Ayuntamiento con IA" },
  { value: "video-bromas", label: "Video-bromas con IA" },
  { value: "automatizacion-cultural", label: "Automatización de Procesos Culturales" },
  { value: "apps-culturales", label: "Aplicaciones Culturales" },
  { value: "realidad-virtual", label: "Realidad Virtual y Aumentada" },
  { value: "blockchain-cultura", label: "Blockchain para Cultura" },
  { value: "otros-tech", label: "Otros Servicios Tecnológicos" },
]

const foodProductionMethods = [
  "Elaboración tradicional",
  "Fermentación natural",
  "Curado en cuevas naturales",
  "Ahumado artesanal",
  "Prensado manual",
  "Cocción en horno de leña",
  "Maduración controlada",
  "Destilación artesanal",
  "Secado al aire libre",
  "Métodos ancestrales",
  "Producción ecológica",
  "Técnicas familiares",
]

const techMethods = [
  "Desarrollo con IA generativa",
  "Machine Learning",
  "Procesamiento de lenguaje natural",
  "Computer Vision",
  "Automatización con scripts",
  "APIs y microservicios",
  "Blockchain y Web3",
  "Realidad virtual/aumentada",
  "Desarrollo móvil",
  "Cloud computing",
  "DevOps y CI/CD",
  "Open source collaboration",
]

export default function FoodArtisanRegistrationForm() {
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [videoList, setVideoList] = useState<File[]>([])
  const [documentList, setDocumentList] = useState<File[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])

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
      videos: [],
      documents: [],
      productionMethods: [],
      organicCertified: false,
      localSuppliers: false,
      seasonalProduction: false,
      openSource: false,
      customOrders: false,
      tastings: false,
      workshops: false,
    },
  })

  const watchedImages = watch("images")
  const watchedVideos = watch("videos")
  const watchedDocuments = watch("documents")
  const activityType = watch("activityType")

  const onSubmit = async (data: FormData) => {
    console.log("Datos del productor/creador enviados:", data)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("¡Perfil registrado exitosamente!")
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

  const handleVideoUpload = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(
      (file) => ACCEPTED_VIDEO_TYPES.includes(file.type) && file.size <= MAX_VIDEO_SIZE,
    )

    if (validFiles.length + watchedVideos.length > 3) {
      alert("Solo puedes subir un máximo de 3 videos")
      return
    }

    setValue("videos", [...watchedVideos, ...validFiles])
    setVideoList((prev) => [...prev, ...validFiles])
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

  const removeVideo = (index: number) => {
    const newVideos = watchedVideos.filter((_, i) => i !== index)
    const newVideoList = videoList.filter((_, i) => i !== index)
    setValue("videos", newVideos)
    setVideoList(newVideoList)
  }

  const removeDocument = (index: number) => {
    const newDocuments = watchedDocuments.filter((_, i) => i !== index)
    const newDocumentList = documentList.filter((_, i) => i !== index)
    setValue("documents", newDocuments)
    setDocumentList(newDocumentList)
  }

  const handleMethodChange = (method: string, checked: boolean) => {
    let newMethods: string[]
    if (checked) {
      newMethods = [...selectedMethods, method]
    } else {
      newMethods = selectedMethods.filter((m) => m !== method)
    }
    setSelectedMethods(newMethods)
    setValue("productionMethods", newMethods)
  }

  const currentMethods = activityType === "tecnologico" ? techMethods : foodProductionMethods

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {activityType === "tecnologico" ? (
                <Cpu className="w-8 h-8 text-blue-600" />
              ) : (
                <ChefHat className="w-8 h-8 text-green-600" />
              )}
              <CardTitle className="text-3xl font-bold text-gray-800">Registro de Productor y Creador</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Comparte tus productos alimentarios tradicionales o servicios tecnológicos culturales. Conecta con quienes
              valoran la calidad artesanal y la innovación digital.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Información básica */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2">
                  Información Básica
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="producerName">
                      Nombre del Productor/Creador *
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="inline w-4 h-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tu nombre o el nombre de tu empresa/proyecto</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="producerName"
                      {...register("producerName")}
                      placeholder="Ej: Quesería La Tradición / TechCultura Labs"
                    />
                    {errors.producerName && <p className="text-red-500 text-sm">{errors.producerName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityType">Tipo de Actividad *</Label>
                    <Controller
                      name="activityType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo de actividad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alimentario">🍯 Productos Alimentarios Artesanales</SelectItem>
                            <SelectItem value="tecnologico">💻 Servicios Tecnológicos Culturales</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.activityType && <p className="text-red-500 text-sm">{errors.activityType.message}</p>}
                  </div>
                </div>

                {/* Categorías específicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activityType === "alimentario" && (
                    <div className="space-y-2">
                      <Label htmlFor="foodCategory">Categoría de Producto Alimentario *</Label>
                      <Controller
                        name="foodCategory"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu categoría alimentaria" />
                            </SelectTrigger>
                            <SelectContent>
                              {foodCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.foodCategory && <p className="text-red-500 text-sm">{errors.foodCategory.message}</p>}
                    </div>
                  )}

                  {activityType === "tecnologico" && (
                    <div className="space-y-2">
                      <Label htmlFor="techCategory">Categoría de Servicio Tecnológico *</Label>
                      <Controller
                        name="techCategory"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu categoría tecnológica" />
                            </SelectTrigger>
                            <SelectContent>
                              {techCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.techCategory && <p className="text-red-500 text-sm">{errors.techCategory.message}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidad *</Label>
                    <Input
                      id="specialty"
                      {...register("specialty")}
                      placeholder={
                        activityType === "tecnologico"
                          ? "Ej: Automatización con ChatGPT, Apps culturales"
                          : "Ej: Queso de cabra curado, Chorizo ibérico"
                      }
                    />
                    {errors.specialty && <p className="text-red-500 text-sm">{errors.specialty.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiencia *</Label>
                    <Controller
                      name="experience"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu experiencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="principiante">Principiante (1-3 años)</SelectItem>
                            <SelectItem value="intermedio">Intermedio (4-7 años)</SelectItem>
                            <SelectItem value="avanzado">Avanzado (8-15 años)</SelectItem>
                            <SelectItem value="maestro">
                              {activityType === "tecnologico" ? "Tech Lead/Senior" : "Maestro Productor"} (15+ años)
                            </SelectItem>
                            <SelectItem value="tradicion-familiar">
                              {activityType === "tecnologico" ? "Pionero/Innovador" : "Tradición Familiar"}{" "}
                              (generaciones/vanguardia)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message}</p>}
                  </div>

                  {activityType === "alimentario" && (
                    <div className="space-y-2">
                      <Label htmlFor="familyTradition">Historia y Tradición Familiar</Label>
                      <Textarea
                        id="familyTradition"
                        {...register("familyTradition")}
                        placeholder="Cuéntanos sobre la historia de tu familia en la producción, recetas ancestrales..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Métodos de producción/trabajo */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2">
                  {activityType === "tecnologico" ? "Métodos y Tecnologías" : "Métodos de Producción"}
                </h3>

                <div className="space-y-4">
                  <Label>
                    {activityType === "tecnologico" ? "Tecnologías que dominas *" : "Métodos que utilizas *"}
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentMethods.map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={method}
                          checked={selectedMethods.includes(method)}
                          onCheckedChange={(checked) => handleMethodChange(method, checked as boolean)}
                        />
                        <Label htmlFor={method} className="text-sm font-normal">
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.productionMethods && (
                    <p className="text-red-500 text-sm">{errors.productionMethods.message}</p>
                  )}
                </div>

                {activityType === "alimentario" ? (
                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Ingredientes principales</Label>
                    <Textarea
                      id="ingredients"
                      {...register("ingredients")}
                      placeholder="Ej: Leche cruda de cabras de la zona, sal marina, cuajo natural..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="techStack">Stack tecnológico y herramientas</Label>
                    <Textarea
                      id="techStack"
                      {...register("techStack")}
                      placeholder="Ej: Python, OpenAI API, React, Node.js, GitHub, Figma, Adobe Premiere..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2">
                  {activityType === "tecnologico" ? "Descripción de tus Servicios" : "Descripción de tus Productos"}
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    {activityType === "tecnologico"
                      ? "Cuéntanos sobre tus servicios *"
                      : "Cuéntanos sobre tus productos *"}
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder={
                      activityType === "tecnologico"
                        ? "Describe tus servicios, proyectos realizados, cómo ayudas a organizaciones culturales con tecnología..."
                        : "Describe el sabor, textura, proceso de elaboración, lo que hace únicos tus productos..."
                    }
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

              {/* Galería de imágenes */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2">
                  {activityType === "tecnologico" ? "Galería de Proyectos" : "Galería de Productos"}
                </h3>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
                    activityType === "tecnologico" ? "border-blue-300 bg-blue-50" : "border-green-300 bg-green-50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload
                      className={`mx-auto h-12 w-12 ${
                        activityType === "tecnologico" ? "text-blue-500" : "text-green-500"
                      }`}
                    />
                    <p
                      className={`mt-2 text-sm font-medium ${
                        activityType === "tecnologico" ? "text-blue-700" : "text-green-700"
                      }`}
                    >
                      {activityType === "tecnologico"
                        ? "Sube capturas de tus proyectos y aplicaciones"
                        : "Sube fotos de tus mejores productos"}
                    </p>
                    <p className={`text-xs ${activityType === "tecnologico" ? "text-blue-600" : "text-green-600"}`}>
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
                          alt={`${activityType === "tecnologico" ? "Proyecto" : "Producto"} ${index + 1}`}
                          className={`w-full h-32 object-cover rounded-lg border-2 ${
                            activityType === "tecnologico" ? "border-blue-200" : "border-green-200"
                          }`}
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

              {/* Galería de videos */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  {activityType === "tecnologico" ? "Videos de Proyectos" : "Videos de Productos"}
                </h3>

                <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors bg-purple-50">
                  <input
                    type="file"
                    accept="video/mp4,video/mov,video/avi,video/webm"
                    multiple
                    onChange={(e) => handleVideoUpload(e.target.files)}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Video className="mx-auto h-12 w-12 text-purple-500" />
                    <p className="mt-2 text-sm font-medium text-purple-700">
                      {activityType === "tecnologico"
                        ? "Sube videos demostrativos de tus proyectos"
                        : "Sube videos de tu proceso de elaboración"}
                    </p>
                    <p className="text-xs text-purple-600">MP4, MOV, AVI, WebM hasta 50MB cada uno (máximo 3 videos)</p>
                  </label>
                </div>

                {videoList.length > 0 && (
                  <div className="space-y-3">
                    {videoList.map((video, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Play className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{video.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Badge variant="secondary" className="text-xs">
                                {(video.size / 1024 / 1024).toFixed(1)} MB
                              </Badge>
                              <span>•</span>
                              <span>{video.type.split("/")[1].toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeVideo(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {errors.videos && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.videos.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Información comercial */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2">
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
                            {activityType === "tecnologico" ? (
                              <>
                                <SelectItem value="basico">Básico (€50-200/proyecto)</SelectItem>
                                <SelectItem value="intermedio">Intermedio (€200-800/proyecto)</SelectItem>
                                <SelectItem value="avanzado">Avanzado (€800-2000/proyecto)</SelectItem>
                                <SelectItem value="enterprise">Enterprise (€2000+/proyecto)</SelectItem>
                                <SelectItem value="por-horas">Por horas (€25-100/hora)</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="economico">Económico (€5-15/kg)</SelectItem>
                                <SelectItem value="medio">Medio (€15-30/kg)</SelectItem>
                                <SelectItem value="premium">Premium (€30-60/kg)</SelectItem>
                                <SelectItem value="gourmet">Gourmet (€60+/kg)</SelectItem>
                                <SelectItem value="variable">Variable según producto</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.priceRange && <p className="text-red-500 text-sm">{errors.priceRange.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distributionArea">
                      {activityType === "tecnologico" ? "Área de trabajo" : "Área de distribución"}
                    </Label>
                    <Input
                      id="distributionArea"
                      {...register("distributionArea")}
                      placeholder={
                        activityType === "tecnologico"
                          ? "Ej: Remoto, Local, Nacional, Internacional"
                          : "Ej: Local, Regional, Nacional, Internacional"
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Características y servicios</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {activityType === "alimentario" ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <Controller
                              name="organicCertified"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  id="organicCertified"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                            <Label htmlFor="organicCertified" className="font-normal">
                              Certificación ecológica
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Controller
                              name="localSuppliers"
                              control={control}
                              render={({ field }) => (
                                <Checkbox id="localSuppliers" checked={field.value} onCheckedChange={field.onChange} />
                              )}
                            />
                            <Label htmlFor="localSuppliers" className="font-normal">
                              Proveedores locales
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Controller
                              name="seasonalProduction"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  id="seasonalProduction"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                            <Label htmlFor="seasonalProduction" className="font-normal">
                              Producción estacional
                            </Label>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2">
                            <Controller
                              name="openSource"
                              control={control}
                              render={({ field }) => (
                                <Checkbox id="openSource" checked={field.value} onCheckedChange={field.onChange} />
                              )}
                            />
                            <Label htmlFor="openSource" className="font-normal">
                              Proyectos Open Source
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
                              Talleres y formación
                            </Label>
                          </div>
                        </>
                      )}
                    </div>
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
                          {activityType === "tecnologico" ? "Proyectos personalizados" : "Pedidos personalizados"}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="tastings"
                          control={control}
                          render={({ field }) => (
                            <Checkbox id="tastings" checked={field.value} onCheckedChange={field.onChange} />
                          )}
                        />
                        <Label htmlFor="tastings" className="font-normal">
                          {activityType === "tecnologico" ? "Demos y presentaciones" : "Catas y degustaciones"}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificaciones */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certificaciones y Reconocimientos
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="certifications">
                    {activityType === "tecnologico"
                      ? "Certificaciones técnicas, premios o reconocimientos"
                      : "Certificaciones, premios o denominaciones de origen"}
                  </Label>
                  <Textarea
                    id="certifications"
                    {...register("certifications")}
                    placeholder={
                      activityType === "tecnologico"
                        ? "Ej: AWS Certified, Google Developer Expert, Premios de hackathons, Certificaciones en IA..."
                        : "Ej: D.O.P. Queso Manchego, Certificación Ecológica, Premio Nacional de Gastronomía 2023..."
                    }
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
                    placeholder={
                      activityType === "tecnologico"
                        ? "Horarios de trabajo, colaboraciones con organizaciones, proyectos destacados, etc."
                        : "Horarios de producción, visitas a la granja/fábrica, mercados donde vendes, etc."
                    }
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* Documentos adicionales */}
              <div className="space-y-4">
                <Label>
                  {activityType === "tecnologico" ? "Portfolio y documentación" : "Catálogos y certificados"}
                </Label>
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
                    <p className="mt-2 text-sm text-gray-600">
                      {activityType === "tecnologico"
                        ? "Sube portfolio, documentación técnica, casos de estudio"
                        : "Sube catálogos de productos, certificados sanitarios, premios"}
                    </p>
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
                  className={`flex-1 bg-transparent ${
                    activityType === "tecnologico"
                      ? "border-blue-300 text-blue-700 hover:bg-blue-50"
                      : "border-green-300 text-green-700 hover:bg-green-50"
                  }`}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? "Ocultar vista previa" : "Ver vista previa"}
                </Button>
                <Button
                  type="submit"
                  className={`flex-1 ${
                    activityType === "tecnologico" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registrando..." : "Registrar Perfil"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Vista previa del perfil */}
        {showPreview && (
          <FoodArtisanProfilePreview
            producerName={watch("producerName")}
            activityType={watch("activityType")}
            foodCategory={watch("foodCategory")}
            techCategory={watch("techCategory")}
            specialty={watch("specialty")}
            description={watch("description")}
            familyTradition={watch("familyTradition")}
            productionMethods={selectedMethods}
            ingredients={watch("ingredients")}
            techStack={watch("techStack")}
            experience={watch("experience")}
            priceRange={watch("priceRange")}
            organicCertified={watch("organicCertified")}
            localSuppliers={watch("localSuppliers")}
            seasonalProduction={watch("seasonalProduction")}
            openSource={watch("openSource")}
            customOrders={watch("customOrders")}
            tastings={watch("tastings")}
            workshops={watch("workshops")}
            certifications={watch("certifications")}
            distributionArea={watch("distributionArea")}
            additionalInfo={watch("additionalInfo")}
            images={imagePreview}
            videos={videoList}
            documents={documentList}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
