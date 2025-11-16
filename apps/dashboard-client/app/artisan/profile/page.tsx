/**
 * Artisan Profile Page
 * Main profile management for artisans
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { VoiceInput } from '@/components/ui/VoiceInput';
import { artisanApi } from '@/lib/api/client';
import { staggerIn } from '@/lib/animations/anime-utils';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Camera,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ArtisanProfile {
  id: string;
  name: string;
  bio: string;
  specialty: string;
  location: {
    province: string;
    city: string;
    address: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
  };
  avatar?: string;
  isPublished: boolean;
}

export default function ArtisanProfilePage() {
  const [profile, setProfile] = useState<ArtisanProfile>({
    id: '1',
    name: '',
    bio: '',
    specialty: '',
    location: {
      province: '',
      city: '',
      address: '',
    },
    contact: {
      phone: '',
      email: '',
    },
    social: {},
    isPublished: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animate on mount
  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.animate-card');
      staggerIn(Array.from(cards) as HTMLElement[]);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }
      // Handle nested objects
      const [parent, child] = keys;
      return {
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ArtisanProfile] as Record<string, unknown>),
          [child]: value,
        },
      };
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const response = await artisanApi.uploadAvatar(profile.id, file);
      setProfile((prev) => ({ ...prev, avatar: response.url }));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error al subir la foto. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await artisanApi.updateProfile(profile.id, profile);
      alert('Perfil guardado exitosamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar el perfil. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      setIsLoading(true);
      await artisanApi.publishProfile(profile.id, !profile.isPublished);
      setProfile((prev) => ({ ...prev, isPublished: !prev.isPublished }));
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('Error al cambiar el estado de publicación.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBioGenerated = (text: string) => {
    setProfile((prev) => ({ ...prev, bio: text }));
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="mt-1 text-gray-600">Gestiona tu información pública</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleTogglePublish}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              profile.isPublished
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {profile.isPublished ? (
              <>
                <EyeOff className="h-4 w-4" />
                Despublicar
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Publicar
              </>
            )}
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Avatar & Basic Info */}
      <AnimatedCard className="animate-card">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-purple-100 to-blue-100">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all hover:bg-purple-700">
              <Camera className="h-5 w-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Basic Info */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Especialidad
              </label>
              <input
                type="text"
                value={profile.specialty}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Ej: Cerámica, Orfebrería, Textil..."
              />
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Bio with Voice Input */}
      <AnimatedCard className="animate-card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Biografía / Descripción
        </h2>
        <VoiceInput
          onTextGenerated={handleBioGenerated}
          context="artisan biography"
          placeholder="Describe tu trayectoria como artesano, tu técnica y lo que te hace especial"
        />
        <div className="mt-4">
          <textarea
            value={profile.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            placeholder="Escribe o genera tu biografía con el asistente de voz..."
          />
        </div>
      </AnimatedCard>

      {/* Location */}
      <AnimatedCard className="animate-card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Ubicación</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4" />
              Provincia
            </label>
            <select
              value={profile.location.province}
              onChange={(e) => handleInputChange('location.province', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="">Selecciona provincia</option>
              <option value="Almería">Almería</option>
              <option value="Cádiz">Cádiz</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Granada">Granada</option>
              <option value="Huelva">Huelva</option>
              <option value="Jaén">Jaén</option>
              <option value="Málaga">Málaga</option>
              <option value="Sevilla">Sevilla</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Ciudad</label>
            <input
              type="text"
              value={profile.location.city}
              onChange={(e) => handleInputChange('location.city', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="Tu ciudad"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Dirección (opcional)
            </label>
            <input
              type="text"
              value={profile.location.address}
              onChange={(e) => handleInputChange('location.address', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="Calle, número..."
            />
          </div>
        </div>
      </AnimatedCard>

      {/* Contact & Social */}
      <AnimatedCard className="animate-card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Contacto y Redes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone className="h-4 w-4" />
              Teléfono
            </label>
            <input
              type="tel"
              value={profile.contact.phone}
              onChange={(e) => handleInputChange('contact.phone', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="+34 600 000 000"
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <input
              type="email"
              value={profile.contact.email}
              onChange={(e) => handleInputChange('contact.email', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Globe className="h-4 w-4" />
              Sitio Web (opcional)
            </label>
            <input
              type="url"
              value={profile.contact.website || ''}
              onChange={(e) => handleInputChange('contact.website', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Facebook className="h-4 w-4" />
              Facebook
            </label>
            <input
              type="text"
              value={profile.social.facebook || ''}
              onChange={(e) => handleInputChange('social.facebook', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="@usuario"
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Instagram className="h-4 w-4" />
              Instagram
            </label>
            <input
              type="text"
              value={profile.social.instagram || ''}
              onChange={(e) => handleInputChange('social.instagram', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="@usuario"
            />
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}
