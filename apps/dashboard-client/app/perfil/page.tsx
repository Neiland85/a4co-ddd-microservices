'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ProfileForm } from '@/components/forms/ProfileForm';

interface Profile {
  nombre: string;
  especialidad: string;
  descripcion?: string;
  telefono?: string;
  email?: string;
  ubicacion?: string;
}

export default function PerfilPage() {
  // Estado para modal
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Datos del perfil
  const [profile, setProfile] = useState<Profile>({
    nombre: 'Arturo Ramírez',
    especialidad: 'Cerámica',
    descripcion:
      'Artesano especializado en cerámica tradicional con más de 15 años de experiencia.',
    telefono: '+34 600 123 456',
    email: 'arturo@ceramicaartesanal.com',
    ubicacion: 'Granada, España',
  });

  // Handler para guardar perfil
  const handleSaveProfile = (profileData: Profile) => {
    setProfile(profileData);
  };

  const handleEditProfile = () => {
    setShowProfileForm(true);
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.jpg" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Arturo Ramírez</p>
              <p>Especialidad: Cerámica</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ventas este mes: 150</p>
            <p>Productos activos: 12</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Button onClick={handleEditProfile}>Editar Perfil</Button>
      </div>

      {/* Modal para editar perfil */}
      <ProfileForm
        profile={profile}
        isOpen={showProfileForm}
        onClose={() => setShowProfileForm(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
