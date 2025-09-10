'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  Bell,
  User,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Save,
  FileText,
  Database,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SettingsSchema } from '../../types/admin-types';

// Mock data
const mockSettings = {
  businessName: 'Panadería El Ochío',
  email: 'info@panaderia-ochio.com',
  phone: '+34 953 123 456',
  address: 'Calle Real 45, Úbeda, Jaén',
  description:
    'Panadería tradicional especializada en ochíos y pan artesanal desde 1952. Elaboramos nuestros productos con ingredientes locales y técnicas ancestrales.',
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  privacy: {
    dataRetention: 24,
    cookieConsent: true,
    analyticsEnabled: true,
  },
};

const mockDataRequests = [
  {
    id: 'REQ-001',
    type: 'access',
    customerEmail: 'ana@email.com',
    status: 'completed',
    requestDate: new Date('2024-01-20'),
    completedDate: new Date('2024-01-22'),
    notes: 'Datos enviados por email',
  },
  {
    id: 'REQ-002',
    type: 'deletion',
    customerEmail: 'carlos@email.com',
    status: 'processing',
    requestDate: new Date('2024-01-22'),
    notes: 'Verificando pedidos pendientes',
  },
  {
    id: 'REQ-003',
    type: 'export',
    customerEmail: 'maria@email.com',
    status: 'pending',
    requestDate: new Date('2024-01-23'),
  },
];

const requestTypeLabels: Record<string, string> = {
  access: 'Acceso a datos',
  deletion: 'Eliminación de datos',
  export: 'Exportación de datos',
};

const requestStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  completed: 'Completado',
  rejected: 'Rechazado',
};

const getRequestStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getRequestStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return Clock;
    case 'processing':
      return Database;
    case 'completed':
      return CheckCircle;
    case 'rejected':
      return XCircle;
    default:
      return Clock;
  }
};

export default function AdminSettings() {
  const [settingsData, setSettingsData] = useState(mockSettings);
  const [dataRequestsData, setDataRequestsData] = useState(mockDataRequests);
  const [hoveredCardData, setHoveredCardData] = useState<string | null>(null);
  const [isExportDialogOpenData, setIsExportDialogOpenData] = useState(false);

  const form = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: settingsData,
  });

  const onSubmit = (data: any) => {
    setSettingsData(data);
    // Here you would typically save to your backend
    console.log('Settings saved:', data);
  };

  const handleDataRequest = (requestId: string, action: 'approve' | 'reject') => {
    setDataRequestsData(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: action === 'approve' ? 'completed' : 'rejected',
              completedDate: new Date(),
              notes: action === 'approve' ? 'Solicitud aprobada' : 'Solicitud rechazada',
            }
          : req
      )
    );
  };

  const exportPersonalData = (email: string) => {
    // Mock data export
    const userData = {
      personalInfo: {
        email: email,
        registrationDate: '2024-01-15',
        lastLogin: '2024-01-23',
      },
      orders: [
        { id: 'ORD-001', date: '2024-01-22', total: 15.5 },
        { id: 'ORD-002', date: '2024-01-20', total: 12.0 },
      ],
      preferences: {
        notifications: true,
        marketing: false,
      },
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `datos-personales-${email}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-1 text-gray-600">Gestiona la configuración de tu negocio y privacidad</p>
        </div>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Negocio</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Privacidad</span>
          </TabsTrigger>
          <TabsTrigger value="gdpr" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>GDPR</span>
          </TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card className="shadow-natural-lg hover:shadow-natural-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Información del Negocio
              </CardTitle>
              <CardDescription>
                Configura la información básica de tu negocio artesanal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nombre del Negocio</Label>
                    <Input
                      id="businessName"
                      {...form.register('businessName')}
                      className="transition-all duration-300 focus:scale-105"
                    />
                    {form.formState.errors.businessName && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.businessName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email de Contacto</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      className="transition-all duration-300 focus:scale-105"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      className="transition-all duration-300 focus:scale-105"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      {...form.register('address')}
                      className="transition-all duration-300 focus:scale-105"
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción del Negocio</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    rows={4}
                    className="transition-all duration-300 focus:scale-105"
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 shadow-mixed hover:shadow-mixed-lg bg-gradient-to-r text-white transition-all duration-300 hover:scale-105"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="shadow-natural-lg hover:shadow-natural-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>Controla cómo y cuándo recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  key: 'email',
                  label: 'Notificaciones por Email',
                  description: 'Recibir notificaciones de pedidos y mensajes por email',
                },
                {
                  key: 'sms',
                  label: 'Notificaciones por SMS',
                  description: 'Recibir alertas importantes por mensaje de texto',
                },
                {
                  key: 'push',
                  label: 'Notificaciones Push',
                  description: 'Recibir notificaciones en tiempo real en el navegador',
                },
              ].map(notification => (
                <div
                  key={notification.key}
                  className="hover:scale-102 hover:shadow-natural-md flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{notification.label}</div>
                    <div className="text-sm text-gray-600">{notification.description}</div>
                  </div>
                  <Switch
                    checked={
                      settingsData.notifications[
                        notification.key as keyof typeof settingsData.notifications
                      ] || false
                    }
                    onCheckedChange={checked => {
                      setSettingsData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [notification.key]: checked,
                        },
                      }));
                    }}
                    className="transition-all duration-300 hover:scale-110"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <div className="space-y-6">
            <Card className="shadow-natural-lg hover:shadow-natural-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Configuración de Privacidad
                </CardTitle>
                <CardDescription>Gestiona la privacidad y retención de datos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Retención de Datos (meses)</Label>
                  <Select
                    value={settingsData.privacy.dataRetention.toString()}
                    onValueChange={value => {
                      setSettingsData(prev => ({
                        ...prev,
                        privacy: {
                          ...prev.privacy,
                          dataRetention: Number.parseInt(value),
                        },
                      }));
                    }}
                  >
                    <SelectTrigger className="transition-all duration-300 hover:scale-105">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 meses</SelectItem>
                      <SelectItem value="24">24 meses</SelectItem>
                      <SelectItem value="36">36 meses</SelectItem>
                      <SelectItem value="60">60 meses</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Tiempo que se conservarán los datos de clientes inactivos
                  </p>
                </div>

                <div className="hover:scale-102 flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Consentimiento de Cookies</div>
                    <div className="text-sm text-gray-600">
                      Solicitar consentimiento para cookies no esenciales
                    </div>
                  </div>
                  <Switch
                    checked={settingsData.privacy.cookieConsent}
                    onCheckedChange={checked => {
                      setSettingsData(prev => ({
                        ...prev,
                        privacy: {
                          ...prev.privacy,
                          cookieConsent: checked,
                        },
                      }));
                    }}
                    className="transition-all duration-300 hover:scale-110"
                  />
                </div>

                <div className="hover:scale-102 flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Analytics Habilitado</div>
                    <div className="text-sm text-gray-600">
                      Permitir recopilación de datos analíticos
                    </div>
                  </div>
                  <Switch
                    checked={settingsData.privacy.analyticsEnabled}
                    onCheckedChange={checked => {
                      setSettingsData(prev => ({
                        ...prev,
                        privacy: {
                          ...prev.privacy,
                          analyticsEnabled: checked,
                        },
                      }));
                    }}
                    className="transition-all duration-300 hover:scale-110"
                  />
                </div>
              </CardContent>
            </Card>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Los cambios en la configuración de privacidad pueden afectar la funcionalidad de tu
                tienda. Asegúrate de cumplir con las regulaciones locales de protección de datos.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>

        {/* GDPR Compliance */}
        <TabsContent value="gdpr">
          <div className="space-y-6">
            {/* Data Requests Management */}
            <Card className="shadow-natural-lg hover:shadow-natural-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Lock className="mr-2 h-5 w-5" />
                      Solicitudes de Datos GDPR
                    </CardTitle>
                    <CardDescription>
                      Gestiona las solicitudes de acceso, exportación y eliminación de datos
                    </CardDescription>
                  </div>
                  <Dialog open={isExportDialogOpenData} onOpenChange={setIsExportDialogOpenData}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-transparent transition-all duration-300 hover:scale-105"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Exportar Datos
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Exportar Datos Personales</DialogTitle>
                        <DialogDescription>
                          Introduce el email del cliente para exportar sus datos personales
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="export-email">Email del Cliente</Label>
                          <Input id="export-email" type="email" placeholder="cliente@email.com" />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsExportDialogOpenData(false)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => {
                              exportPersonalData('cliente@email.com');
                              setIsExportDialogOpenData(false);
                            }}
                            className="from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 bg-gradient-to-r"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Exportar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataRequestsData.map(request => {
                    const StatusIcon = getRequestStatusIcon(request.status);
                    return (
                      <div
                        key={request.id}
                        onMouseEnter={() => setHoveredCardData(request.id)}
                        onMouseLeave={() => setHoveredCardData(null)}
                        className={cn(
                          'hover:shadow-natural-md cursor-pointer rounded-lg border p-4 transition-all duration-300',
                          hoveredCardData === request.id && 'scale-102 shadow-natural-lg'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center space-x-3">
                              <Badge
                                variant="outline"
                                className="bg-a4co-olive-50 text-a4co-olive-700"
                              >
                                {requestTypeLabels[request.type] || request.type}
                              </Badge>
                              <Badge
                                className={cn(
                                  'border text-xs',
                                  getRequestStatusColor(request.status)
                                )}
                              >
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {requestStatusLabels[request.status] || request.status}
                              </Badge>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {request.customerEmail}
                            </div>
                            <div className="text-xs text-gray-500">
                              Solicitado: {formatDate(request.requestDate)}
                              {request.completedDate &&
                                ` • Completado: ${formatDate(request.completedDate)}`}
                            </div>
                            {request.notes && (
                              <div className="mt-1 text-xs text-gray-600">{request.notes}</div>
                            )}
                          </div>

                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDataRequest(request.id, 'approve')}
                                className="transition-all duration-300 hover:scale-110 hover:border-green-300 hover:bg-green-50 hover:text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDataRequest(request.id, 'reject')}
                                className="transition-all duration-300 hover:scale-110 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* GDPR Compliance Info */}
            <Card className="shadow-natural-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Cumplimiento GDPR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Derechos del Usuario</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Derecho de acceso a datos personales</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Derecho de rectificación</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Derecho de supresión</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Derecho de portabilidad</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Medidas Implementadas</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Cifrado de datos sensibles</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Consentimiento explícito</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Retención limitada de datos</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Registro de actividades</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
