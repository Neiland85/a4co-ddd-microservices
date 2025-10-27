import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
} from 'lucide-react';
import { Button } from '../../components/Button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

export default function Support(): React.ReactElement {
  const faqs = [
    {
      question: '¿Cómo subir una nueva factura?',
      answer:
        'Puedes subir facturas desde el dashboard principal haciendo clic en \'Nueva Factura\' o desde la sección de Facturas. Aceptamos formatos PDF, JPG y PNG. El sistema procesará automáticamente el texto con OCR.',
    },
    {
      question: '¿Cómo funciona la identificación automática de subvenciones?',
      answer:
        'Nuestro sistema analiza tu perfil empresarial, actividad económica y datos fiscales para identificar subvenciones europeas y nacionales a las que eres elegible. Recibirás notificaciones cuando se detecten nuevas oportunidades.',
    },
    {
      question: '¿Qué precisión tiene el OCR de facturas?',
      answer:
        'Nuestra tecnología OCR tiene una precisión del 98.5% en el reconocimiento de texto. Los casos que requieren revisión manual son mínimos y se notifican automáticamente.',
    },
    {
      question: '¿Puedo exportar mis datos?',
      answer:
        'Sí, puedes exportar todos tus datos desde Configuración > Datos. Incluye facturas procesadas, historial de subvenciones, reportes y configuraciones en formatos CSV y PDF.',
    },
    {
      question: '¿Cómo contacto con soporte técnico?',
      answer:
        'Puedes contactar con nuestro equipo de soporte a través del formulario de contacto en esta página, por email a soporte@tributariapp.com, o llamando al +34 900 123 456.',
    },
  ];

  const supportTickets = [
    {
      id: 'TICK-2024-001',
      subject: 'Problema con OCR en factura PDF',
      status: 'Resuelto',
      priority: 'Alta',
      created: '2024-01-10',
      updated: '2024-01-12',
    },
    {
      id: 'TICK-2024-002',
      subject: 'Nueva subvención identificada',
      status: 'En Progreso',
      priority: 'Media',
      created: '2024-01-14',
      updated: '2024-01-15',
    },
    {
      id: 'TICK-2024-003',
      subject: 'Consulta sobre configuración IVA',
      status: 'Abierto',
      priority: 'Baja',
      created: '2024-01-15',
      updated: '2024-01-15',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resuelto':
        return 'bg-green-100 text-green-800';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800';
      case 'Abierto':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-100 text-red-800';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'Baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Centro de Soporte</h1>
        <p className="text-gray-600">
          Encuentra ayuda, contacta con nosotros y accede a recursos útiles
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-blue-600" />
            <h3 className="mb-2 text-lg font-semibold">Nuevo Ticket</h3>
            <p className="mb-4 text-sm text-gray-600">
              ¿Necesitas ayuda? Crea un ticket de soporte
            </p>
            <Button className="w-full">Crear Ticket</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="pt-6 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-green-600" />
            <h3 className="mb-2 text-lg font-semibold">Documentación</h3>
            <p className="mb-4 text-sm text-gray-600">Guías completas y tutoriales detallados</p>
            <Button variant="outline" className="w-full">
              Ver Documentación
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="pt-6 text-center">
            <Phone className="mx-auto mb-4 h-12 w-12 text-purple-600" />
            <h3 className="mb-2 text-lg font-semibold">Soporte Telefónico</h3>
            <p className="mb-4 text-sm text-gray-600">Llámanos para asistencia inmediata</p>
            <Button variant="outline" className="w-full">
              +34 900 123 456
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Preguntas Frecuentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contactar con Soporte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Tu nombre completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Asunto</Label>
            <Input id="subject" placeholder="Describe brevemente tu consulta" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridad</Label>
            <select
              id="priority"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Baja - Consulta general</option>
              <option value="medium">Media - Problema funcional</option>
              <option value="high">Alta - Servicio interrumpido</option>
              <option value="urgent">Urgente - Impacto crítico</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              placeholder="Describe detalladamente tu consulta o problema..."
              rows={5}
            />
          </div>

          <div className="flex items-center gap-4">
            <input type="file" id="attachment" className="hidden" />
            <label
              htmlFor="attachment"
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
            >
              Adjuntar archivo
            </label>
            <span className="text-sm text-gray-500">
              Opcional: capturas de pantalla, documentos, etc.
            </span>
          </div>

          <Button className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Enviar Consulta
          </Button>
        </CardContent>
      </Card>

      {/* Support Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Mis Tickets de Soporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportTickets.map(ticket => (
              <div
                key={ticket.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-medium">{ticket.id}</span>
                    <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                  </div>
                  <p className="mb-1 text-gray-900">{ticket.subject}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Creado: {ticket.created}</span>
                    <span>Actualizado: {ticket.updated}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">API Principal</p>
                <p className="text-sm text-gray-600">Operativo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Procesamiento OCR</p>
                <p className="text-sm text-gray-600">Operativo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">Base de Datos Subvenciones</p>
                <p className="text-sm text-gray-600">Mantenimiento programado</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nuevo Select */}
      <div className="space-y-4">
        <Label htmlFor="mi-select">Selecciona una opción:</Label>
        <select
          id="mi-select"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
        >
          <option value="opcion1">Opción 1</option>
          <option value="opcion2">Opción 2</option>
          <option value="opcion3">Opción 3</option>
        </select>
      </div>
    </div>
  );
}
