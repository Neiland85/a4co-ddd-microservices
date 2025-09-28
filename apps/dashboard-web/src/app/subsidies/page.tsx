import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Target, Euro, Calendar, CheckCircle, Clock, AlertTriangle, Search, Filter } from "lucide-react";

export default function Subsidies(): React.ReactElement {
  const availableSubsidies = [
    {
      id: "SUB-2024-001",
      name: "Digitalización PYMEs 2024",
      description: "Subvención para transformación digital de pequeñas y medianas empresas",
      amount: "€12,000 - €50,000",
      deadline: "2024-03-15",
      matchScore: 95,
      status: "Disponible"
    },
    {
      id: "SUB-2024-002",
      name: "Formación Profesional",
      description: "Bonificaciones para formación continua del personal",
      amount: "€2,000 - €8,000",
      deadline: "2024-04-30",
      matchScore: 87,
      status: "Disponible"
    },
    {
      id: "SUB-2024-003",
      name: "I+D+i Industrial",
      description: "Subvención para proyectos de investigación y desarrollo",
      amount: "€25,000 - €200,000",
      deadline: "2024-02-28",
      matchScore: 78,
      status: "Disponible"
    }
  ];

  const activeApplications = [
    {
      id: "APP-2024-001",
      subsidyName: "Digitalización PYMEs 2024",
      status: "En Revisión",
      submittedDate: "2024-01-10",
      progress: 75
    },
    {
      id: "APP-2024-002",
      subsidyName: "Formación Profesional",
      status: "Aprobada",
      submittedDate: "2024-01-05",
      progress: 100
    }
  ];

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprobada': return 'bg-green-100 text-green-800';
      case 'En Revisión': return 'bg-blue-100 text-blue-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Rechazada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subvenciones</h1>
          <p className="text-gray-600">Identificación automática y gestión de subvenciones</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Buscar Subvenciones
          </Button>
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Target className="w-4 h-4" />
            Escanear Elegibilidad
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subvenciones Encontradas</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monto Potencial</p>
                <p className="text-2xl font-bold text-green-600">€127K</p>
              </div>
              <Euro className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Solicitudes Activas</p>
                <p className="text-2xl font-bold text-purple-600">2</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold text-orange-600">1</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Subsidies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Subvenciones Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {availableSubsidies.map((subsidy) => (
            <div key={subsidy.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{subsidy.name}</h3>
                    <Badge className={getMatchScoreColor(subsidy.matchScore)}>
                      {subsidy.matchScore}% match
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{subsidy.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Euro className="w-4 h-4" />
                      {subsidy.amount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Plazo: {subsidy.deadline}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">Ver Detalles</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Solicitar</Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Solicitudes Activas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeApplications.map((application) => (
            <div key={application.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{application.subsidyName}</h4>
                  <p className="text-sm text-gray-600">Enviada: {application.submittedDate}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso</span>
                      <span>{application.progress}%</span>
                    </div>
                    <Progress value={application.progress} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                  <Button variant="outline" size="sm">Ver Detalles</Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <AlertTriangle className="w-5 h-5" />
            Recomendaciones IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="text-blue-800 font-medium">Nueva subvención detectada</p>
            <p className="text-blue-600 text-sm">Basado en tu perfil, eres elegible para la subvención "Transición Ecológica 2024"</p>
            <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">Explorar</Button>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="text-blue-800 font-medium">Documentación pendiente</p>
            <p className="text-blue-600 text-sm">Falta certificado de autónomos para completar la solicitud de Digitalización PYMEs</p>
            <Button size="sm" variant="outline" className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100">Subir Documento</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}