'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, FileText, Info, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BusinessProfilePreview } from '@/components/business-profile-preview';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const schema = z.object({
  businessName: z.string().min(3, 'El nombre del negocio debe tener al menos 3 caracteres.'),
  description: z.string().max(500, 'La descripción no puede exceder los 500 caracteres.'),
  activity: z.string().min(1, 'Selecciona una actividad.'),
  images: z
    .array(z.instanceof(File))
    .max(5, 'Puedes subir un máximo de 5 imágenes.')
    .refine(
      files => files.every(file => file.size <= MAX_FILE_SIZE),
      'Cada archivo no debe exceder los 5MB.'
    )
    .refine(
      files => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      'Solo se permiten imágenes en formato JPG, PNG o GIF.'
    ),
  additionalInfo: z.string().optional(),
  documents: z
    .array(z.instanceof(File))
    .max(3, 'Puedes subir un máximo de 3 documentos.')
    .refine(
      files => files.every(file => file.size <= MAX_FILE_SIZE),
      'Cada archivo no debe exceder los 5MB.'
    )
    .refine(
      files => files.every(file => ACCEPTED_DOCUMENT_TYPES.includes(file.type)),
      'Solo se permiten documentos en formato PDF, DOC o DOCX.'
    )
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function BusinessRegistrationForm() {
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [documentList, setDocumentList] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);

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
    },
  });

  const watchedImages = watch('images');
  const watchedDocuments = watch('documents');

  const onSubmit = async (data: FormData) => {
    console.log('Datos enviados:', data);
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('¡Negocio registrado exitosamente!');
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
    );

    if (validFiles.length + watchedImages.length > 5) {
      alert('Solo puedes subir un máximo de 5 imágenes');
      return;
    }

    setValue('images', [...watchedImages, ...validFiles]);

    // Crear previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDocumentUpload = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      file => ACCEPTED_DOCUMENT_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
    );

    if (validFiles.length + watchedDocuments.length > 3) {
      alert('Solo puedes subir un máximo de 3 documentos');
      return;
    }

    setValue('documents', [...watchedDocuments, ...validFiles]);
    setDocumentList(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    const newImages = watchedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setValue('images', newImages);
    setImagePreview(newPreviews);
  };

  const removeDocument = (index: number) => {
    const newDocuments = watchedDocuments.filter((_, i) => i !== index);
    const newDocumentList = documentList.filter((_, i) => i !== index);
    setValue('documents', newDocuments);
    setDocumentList(newDocumentList);
  };

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Registro de Negocio</CardTitle>
            <CardDescription>
              Completa la información de tu negocio para crear tu perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">
                    Nombre del negocio *
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 inline h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>El nombre comercial de tu negocio</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="businessName"
                    {...register('businessName')}
                    placeholder="Ej: Mi Restaurante"
                  />
                  {errors.businessName && (
                    <p className="text-sm text-red-500">{errors.businessName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity">Actividad principal *</Label>
                  <Controller
                    name="activity"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una actividad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="restaurante">Restaurante</SelectItem>
                          <SelectItem value="tienda">Tienda</SelectItem>
                          <SelectItem value="servicios">Servicios</SelectItem>
                          <SelectItem value="tecnologia">Tecnología</SelectItem>
                          <SelectItem value="salud">Salud y Bienestar</SelectItem>
                          <SelectItem value="educacion">Educación</SelectItem>
                          <SelectItem value="construccion">Construcción</SelectItem>
                          <SelectItem value="otros">Otros</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.activity && (
                    <p className="text-sm text-red-500">{errors.activity.message}</p>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción del negocio</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe tu negocio, servicios que ofreces, etc."
                  rows={4}
                  className="resize-none"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Máximo 500 caracteres</span>
                  <span>{watch('description')?.length || 0}/500</span>
                </div>
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Subida de imágenes */}
              <div className="space-y-4">
                <Label>Imágenes del negocio</Label>
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    multiple
                    onChange={e => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Haz clic para subir imágenes o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, GIF hasta 5MB cada una (máximo 5 imágenes)
                    </p>
                  </label>
                </div>

                {/* Preview de imágenes */}
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="group relative">
                        <img
                          src={preview || '/placeholder.svg'}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
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

              {/* Información adicional */}
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Información adicional</Label>
                <Textarea
                  id="additionalInfo"
                  {...register('additionalInfo')}
                  placeholder="Horarios de atención, ubicación, servicios especiales, etc."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Subida de documentos */}
              <div className="space-y-4">
                <Label>Material adicional (opcional)</Label>
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={e => handleDocumentUpload(e.target.files)}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Sube documentos adicionales (menús, catálogos, etc.)
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX hasta 5MB cada uno (máximo 3 documentos)
                    </p>
                  </label>
                </div>

                {/* Lista de documentos */}
                {documentList.length > 0 && (
                  <div className="space-y-2">
                    {documentList.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="truncate text-sm">{doc.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {(doc.size / 1024 / 1024).toFixed(1)} MB
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                        >
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
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {showPreview ? 'Ocultar vista previa' : 'Ver vista previa'}
                </Button>
                <Button type="submit" className="flex-1" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Registrando...' : 'Registrar negocio'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Vista previa del perfil */}
        {showPreview && (
          <BusinessProfilePreview
            businessName={watch('businessName')}
            description={watch('description')}
            activity={watch('activity')}
            additionalInfo={watch('additionalInfo')}
            images={imagePreview}
            documents={documentList}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
