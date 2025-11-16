/**
 * Artisan Gallery Page
 * Upload and manage photos and videos with drag & drop
 */
'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { galleryApi } from '@/lib/api/client';
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';

interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
  productId?: string;
  uploadedAt: string;
}

export default function ArtisanGalleryPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const artisanId = '1'; // From auth context

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await galleryApi.uploadMedia(artisanId, null, acceptedFiles);
      setMedia((prev) => [...prev, ...response.media]);
      setUploadProgress(100);
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Error al subir archivos');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  }, [artisanId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return;

    try {
      await galleryApi.deleteMedia(artisanId, mediaId);
      setMedia((prev) => prev.filter((m) => m.id !== mediaId));
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Error al eliminar el archivo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Galería Multimedia</h1>
        <p className="mt-1 text-gray-600">
          Sube y gestiona fotos y vídeos de tus productos
        </p>
      </div>

      {/* Upload Zone */}
      <AnimatedCard>
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all ${
            isDragActive
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/50'
          }`}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div>
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-purple-600" />
              <p className="text-lg font-medium text-gray-900">
                Subiendo archivos... {uploadProgress}%
              </p>
              <div className="mx-auto mt-4 h-2 w-64 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              {isDragActive ? (
                <p className="text-lg font-medium text-purple-600">
                  ¡Suelta los archivos aquí!
                </p>
              ) : (
                <div>
                  <p className="mb-2 text-lg font-medium text-gray-900">
                    Arrastra fotos o vídeos aquí
                  </p>
                  <p className="mb-4 text-sm text-gray-600">
                    o haz clic para seleccionar archivos
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, WEBP, MP4, WEBM • Máx. 10MB por archivo
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </AnimatedCard>

      {/* Gallery Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {media.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="text-gray-600">No hay archivos en la galería</p>
            <p className="mt-1 text-sm text-gray-500">
              Sube tus primeras fotos o vídeos para comenzar
            </p>
          </div>
        ) : (
          media.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-md transition-all hover:shadow-xl"
            >
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt="Gallery item"
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="relative h-full w-full">
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Video className="h-12 w-12 text-white" />
                  </div>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="mb-2 text-xs text-white">
                    {new Date(item.uploadedAt).toLocaleDateString('es-ES')}
                  </p>
                  <button
                    onClick={() => handleDeleteMedia(item.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
