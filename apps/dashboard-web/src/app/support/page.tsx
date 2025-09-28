import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/Button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { HelpCircle, MessageSquare, FileText, Phone, Mail, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Support(): React.ReactElement {
  const faqs = [
    {
      question: "¿Cómo subir una nueva factura?",
      answer: "Puedes subir facturas desde el dashboard principal haciendo clic en 'Nueva Factura' o desde la sección de Facturas. Aceptamos formatos PDF, JPG y PNG. El sistema procesará automáticamente el texto con OCR."
    },
    {
      question: "¿Cómo funciona la identificación automática de subvenciones?",
      answer: "Nuestro sistema analiza tu perfil empresarial, actividad económica y datos fiscales para identificar subvenciones europeas y nacionales a las que eres elegible. Recibirás notificaciones cuando se detecten nuevas oportunidades."
    },
    {
      question: "¿Qué precisión tiene el OCR de facturas?",
      answer: "Nuestra tecnología OCR tiene una precisión del 98.5% en el reconocimiento de texto. Los casos que requieren revisión manual son mínimos y se notifican automáticamente."
    },
    {
      question: "¿Puedo exportar mis datos?",
      answer: "Sí, puedes exportar todos tus datos desde Configuración > Datos. Incluye facturas procesadas, historial de subvenciones, reportes y configuraciones en formatos CSV y PDF."
    },
    {
      question: "¿Cómo contacto con soporte técnico?",
      answer: "Puedes contactar con nuestro equipo de soporte a través del formulario de contacto en esta página, por email a soporte@tributariapp.com, o llamando al +34 900 123 456."
    }
  ];

  const supportTickets = [
    {
      id: "TICK-2024-001",
      subject: "Problema con OCR en factura PDF",
      status: "Resuelto",
      priority: "Alta",
      created: "2024-01-10",
      updated: "2024-01-12"
    },
    {
      id: "TICK-2024-002",
      subject: "Nueva subvención identificada",
      status: "En Progreso",
      priority: "Media",
      created: "2024-01-14",
      updated: "2024-01-15"
    },
    {
      id: "TICK-2024-003",
      subject: "Consulta sobre configuración IVA",
      status: "Abierto",
      priority: "Baja",
      created: "2024-01-15",
      updated: "2024-01-15"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resuelto': return 'bg-green-100 text-green-800';
      case 'En Progreso': return 'bg-blue-100 text-blue-800';
      case 'Abierto': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Centro de Soporte</h1>
        <p className="text-gray-600">Encuentra ayuda, contacta con nosotros y accede a recursos útiles</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nuevo Ticket</h3>
            <p className="text-gray-600 text-sm mb-4">¿Necesitas ayuda? Crea un ticket de soporte</p>
            <Button className="w-full">Crear Ticket</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Documentación</h3>
            <p className="text-gray-600 text-sm mb-4">Guías completas y tutoriales detallados</p>
            <Button variant="outline" className="w-full">Ver Documentación</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <Phone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Soporte Telefónico</h3>
            <p className="text-gray-600 text-sm mb-4">Llámanos para asistencia inmediata</p>
            <Button variant="outline" className="w-full">+34 900 123 456</Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Preguntas Frecuentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contactar con Soporte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
              className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Adjuntar archivo
            </label>
            <span className="text-sm text-gray-500">Opcional: capturas de pantalla, documentos, etc.</span>
          </div>

          <Button className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Enviar Consulta
          </Button>
        </CardContent>
      </Card>

      {/* Support Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Mis Tickets de Soporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{ticket.id}</span>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-900 mb-1">{ticket.subject}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Creado: {ticket.created}</span>
                    <span>Actualizado: {ticket.updated}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">Ver Detalles</Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">API Principal</p>
                <p className="text-sm text-gray-600">Operativo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Procesamiento OCR</p>
                <p className="text-sm text-gray-600">Operativo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium">Base de Datos Subvenciones</p>
                <p className="text-sm text-gray-600">Mantenimiento programado</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}