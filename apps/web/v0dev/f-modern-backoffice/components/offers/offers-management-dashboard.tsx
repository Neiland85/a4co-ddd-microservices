"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Crown,
  Tag,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  MapPin,
  Euro,
  BarChart3,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

interface FeaturedOffer {
  id: string
  businessId: string
  businessName: string
  title: string
  description: string
  originalPrice: number
  discountPrice: number
  discountPercentage: number
  category: string
  location: string
  startDate: Date
  endDate: Date
  status: "active" | "pending" | "expired" | "paused"
  priority: "low" | "medium" | "high" | "premium"
  views: number
  clicks: number
  conversions: number
  revenue: number
  image?: string
}

interface PromotionCampaign {
  id: string
  name: string
  type: "featured" | "banner" | "spotlight" | "boost"
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  startDate: Date
  endDate: Date
  status: "active" | "paused" | "completed"
  businesses: string[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function OffersManagementDashboard() {
  const [featuredOffers, setFeaturedOffers] = useState<FeaturedOffer[]>([
    {
      id: "1",
      businessId: "b1",
      businessName: "Artesanías La Esperanza",
      title: "Descuento 30% en Cerámicas Artesanales",
      description: "Hermosas piezas de cerámica hechas a mano con técnicas tradicionales",
      originalPrice: 50,
      discountPrice: 35,
      discountPercentage: 30,
      category: "Artesanías",
      location: "Madrid, España",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-02-15"),
      status: "active",
      priority: "premium",
      views: 2450,
      clicks: 245,
      conversions: 23,
      revenue: 805,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "2",
      businessId: "b2",
      businessName: "Panadería San Miguel",
      title: "Oferta Especial: Pan Artesanal",
      description: "Pan recién horneado todos los días con ingredientes naturales",
      originalPrice: 15,
      discountPrice: 12,
      discountPercentage: 20,
      category: "Alimentación",
      location: "Barcelona, España",
      startDate: new Date("2024-01-20"),
      endDate: new Date("2024-02-20"),
      status: "active",
      priority: "high",
      views: 1890,
      clicks: 189,
      conversions: 45,
      revenue: 540,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "3",
      businessId: "b3",
      businessName: "Flores del Campo",
      title: "Ramos de Temporada -25%",
      description: "Flores frescas de temporada para cualquier ocasión especial",
      originalPrice: 40,
      discountPrice: 30,
      discountPercentage: 25,
      category: "Jardinería",
      location: "Valencia, España",
      startDate: new Date("2024-01-10"),
      endDate: new Date("2024-01-31"),
      status: "expired",
      priority: "medium",
      views: 1234,
      clicks: 98,
      conversions: 12,
      revenue: 360,
      image: "/placeholder.svg?height=60&width=60",
    },
  ])

  const [campaigns, setCampaigns] = useState<PromotionCampaign[]>([
    {
      id: "1",
      name: "Campaña Artesanías Enero",
      type: "featured",
      budget: 1000,
      spent: 650,
      impressions: 15000,
      clicks: 450,
      conversions: 45,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      status: "active",
      businesses: ["b1", "b4", "b7"],
    },
    {
      id: "2",
      name: "Boost Alimentación",
      type: "boost",
      budget: 500,
      spent: 320,
      impressions: 8500,
      clicks: 280,
      conversions: 28,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-02-15"),
      status: "active",
      businesses: ["b2", "b5"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "expired":
        return "destructive"
      case "paused":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "premium":
        return "bg-purple-500"
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-500" />
      case "expired":
        return <XCircle className="h-3 w-3 text-red-500" />
      case "paused":
        return <XCircle className="h-3 w-3 text-gray-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  const performanceData = [
    { month: "Ene", revenue: 2400, conversions: 45, clicks: 890 },
    { month: "Feb", revenue: 1398, conversions: 32, clicks: 650 },
    { month: "Mar", revenue: 9800, conversions: 78, clicks: 1200 },
    { month: "Abr", revenue: 3908, conversions: 56, clicks: 980 },
    { month: "May", revenue: 4800, conversions: 67, clicks: 1100 },
    { month: "Jun", revenue: 3800, conversions: 89, clicks: 1350 },
  ]

  const categoryPerformance = [
    { name: "Artesanías", value: 35, revenue: 12500 },
    { name: "Alimentación", value: 28, revenue: 8900 },
    { name: "Jardinería", value: 20, revenue: 6700 },
    { name: "Otros", value: 17, revenue: 4200 },
  ]

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ofertas Activas</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredOffers.filter((o) => o.status === "active").length}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% este mes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{featuredOffers.reduce((sum, offer) => sum + offer.revenue, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +18% este mes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {featuredOffers.reduce((sum, offer) => sum + offer.conversions, 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Tasa: 9.2%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizaciones</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {featuredOffers.reduce((sum, offer) => sum + offer.views, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +25% este mes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="featured" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="featured">Puestos Destacados</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas Promocionales</TabsTrigger>
          <TabsTrigger value="analytics">Análisis de Rendimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5" />
                  <span>Gestión de Puestos Destacados</span>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Oferta Destacada
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crear Nueva Oferta Destacada</DialogTitle>
                      <DialogDescription>Configura una nueva oferta para destacar en la plataforma</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título de la Oferta</Label>
                        <Input id="title" placeholder="Ej: Descuento 30% en Cerámicas" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business">Negocio</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar negocio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="b1">Artesanías La Esperanza</SelectItem>
                            <SelectItem value="b2">Panadería San Miguel</SelectItem>
                            <SelectItem value="b3">Flores del Campo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" placeholder="Describe la oferta..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Precio Original (€)</Label>
                        <Input id="originalPrice" type="number" placeholder="50.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discountPrice">Precio con Descuento (€)</Label>
                        <Input id="discountPrice" type="number" placeholder="35.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="artesanias">Artesanías</SelectItem>
                            <SelectItem value="alimentacion">Alimentación</SelectItem>
                            <SelectItem value="jardineria">Jardinería</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Prioridad</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar prioridad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="medium">Media</SelectItem>
                            <SelectItem value="low">Baja</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Fecha de Inicio</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">Fecha de Fin</Label>
                        <Input id="endDate" type="date" />
                      </div>
                      <div className="col-span-2 flex items-center space-x-2">
                        <Switch id="autoActivate" />
                        <Label htmlFor="autoActivate">Activar automáticamente</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setIsCreateDialogOpen(false)}>Crear Oferta</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>Administra las ofertas destacadas y su rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar ofertas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activas</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="expired">Expiradas</SelectItem>
                    <SelectItem value="paused">Pausadas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="artesanias">Artesanías</SelectItem>
                    <SelectItem value="alimentacion">Alimentación</SelectItem>
                    <SelectItem value="jardineria">Jardinería</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabla de ofertas */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oferta</TableHead>
                    <TableHead>Negocio</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Rendimiento</TableHead>
                    <TableHead>Fechas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featuredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={offer.image || "/placeholder.svg"} />
                            <AvatarFallback>{offer.title.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{offer.title}</div>
                            <div className="text-sm text-muted-foreground">{offer.category}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{offer.businessName}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {offer.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-green-600">€{offer.discountPrice}</div>
                          <div className="text-sm text-muted-foreground line-through">€{offer.originalPrice}</div>
                          <Badge variant="outline" className="text-xs">
                            -{offer.discountPercentage}%
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(offer.priority)} text-white`}>{offer.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {offer.views.toLocaleString()}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Target className="h-3 w-3 mr-1" />
                            {offer.conversions} conv.
                          </div>
                          <div className="flex items-center text-green-600">
                            <Euro className="h-3 w-3 mr-1" />€{offer.revenue}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{offer.startDate.toLocaleDateString("es-ES")}</div>
                          <div className="text-muted-foreground">{offer.endDate.toLocaleDateString("es-ES")}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(offer.status)}
                          <Badge variant={getStatusColor(offer.status)}>{offer.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Campañas Promocionales</span>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Campaña
                </Button>
              </CardTitle>
              <CardDescription>Gestiona campañas de promoción y publicidad</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaña</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Presupuesto</TableHead>
                    <TableHead>Rendimiento</TableHead>
                    <TableHead>Fechas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.businesses.length} negocios</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {campaign.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            €{campaign.spent} / €{campaign.budget}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{campaign.impressions.toLocaleString()} impresiones</div>
                          <div>{campaign.clicks} clics</div>
                          <div className="text-green-600">{campaign.conversions} conversiones</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{campaign.startDate.toLocaleDateString("es-ES")}</div>
                          <div className="text-muted-foreground">{campaign.endDate.toLocaleDateString("es-ES")}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Ofertas</CardTitle>
                <CardDescription>Evolución de ingresos y conversiones</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Ingresos (€)", color: "hsl(var(--chart-1))" },
                    conversions: { label: "Conversiones", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                      <Line type="monotone" dataKey="conversions" stroke="var(--color-conversions)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Categoría</CardTitle>
                <CardDescription>Distribución de ingresos por tipo de negocio</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Porcentaje", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Métricas detalladas */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas Detalladas</CardTitle>
              <CardDescription>Análisis completo del rendimiento de ofertas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Top Categorías</h4>
                  <div className="space-y-2">
                    {categoryPerformance.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <div className="text-sm font-medium">€{category.revenue.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Estadísticas Clave</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tasa de Conversión</span>
                      <span className="font-medium">9.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">CTR Promedio</span>
                      <span className="font-medium">12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Valor Promedio</span>
                      <span className="font-medium">€35.20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ROI</span>
                      <span className="font-medium text-green-600">+245%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Acciones Rápidas</h4>
                  <div className="space-y-2">
                    <Button className="w-full" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generar Reporte
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Optimizar Ofertas
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      <Target className="h-4 w-4 mr-2" />
                      Crear Campaña
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
