'use client';

import { AdminSettingsComponent } from '@/components/admin/settings';
import type { AdminSettings } from '@/types/admin-types';

// Mock data
const mockSettings: AdminSettings = {
  siteName: 'Jaén Artesanal',
  siteDescription: 'Plataforma de productos artesanales de la provincia de Jaén',
  contactEmail: 'contacto@jaenartesanal.com',
  supportEmail: 'soporte@jaenartesanal.com',
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  smsNotifications: false,
};

export default function AdminSettingsPage() {
  const handleSave = (settings: AdminSettings) => {
    console.log('Saving settings:', settings);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <AdminSettingsComponent settings={mockSettings} onSave={handleSave} />
      </div>
    </div>
  );
}
