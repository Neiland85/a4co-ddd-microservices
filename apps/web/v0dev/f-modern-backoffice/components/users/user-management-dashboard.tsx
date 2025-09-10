'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Users,
  Store,
  UserCheck,
  Search,
  MoreHorizontal,
  Crown,
  Star,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

interface BusinessUser {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  rating: number;
  totalSales: number;
  joinDate: Date;
  status: 'active' | 'pending' | 'suspended';
  isPremium: boolean;
  avatar?: string;
}

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: Date;
  lastActivity: Date;
  status: 'active' | 'inactive' | 'banned';
  loyaltyLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  avatar?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function UserManagementDashboard() {
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([
    {
      id: '1',
      name: 'María González',
      businessName: 'Artesanías La Esperanza',
      email: 'maria@artesanias.com',
      phone: '+34 666 123 456',
      category: 'Artesanías',
      location: 'Madrid, España',
      rating: 4.8,
      totalSales: 15420,
      joinDate: new Date('2023-01-15'),
      status: 'active',
      isPremium: true,
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '2',
      name: 'Carlos Ruiz',
      businessName: 'Panadería San Miguel',
      email: 'carlos@panaderia.com',
      phone: '+34 677 234 567',
      category: 'Alimentación',
      location: 'Barcelona, España',
      rating: 4.6,
      totalSales: 28750,
      joinDate: new Date('2022-11-20'),
      status: 'active',
      isPremium: false,
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '3',
      name: 'Ana Martín',
      businessName: 'Flores del Campo',
      email: 'ana@flores.com',
      phone: '+34 688 345 678',
      category: 'Jardinería',
      location: 'Valencia, España',
      rating: 4.9,
      totalSales: 12300,
      joinDate: new Date('2023-03-10'),
      status: 'pending',
      isPremium: false,
      avatar: '/placeholder.svg?height=40&width=40',
    },
  ]);

  const [customerUsers, setCustomerUsers] = useState<CustomerUser[]>([
    {
      id: '1',
      name: 'Pedro Sánchez',
      email: 'pedro@email.com',
      phone: '+34 699 111 222',
      location: 'Madrid, España',
      totalOrders: 45,
      totalSpent: 1250.5,
      joinDate: new Date('2022-08-15'),
      lastActivity: new Date('2024-01-28'),
      status: 'active',
      loyaltyLevel: 'gold',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '2',
      name: 'Laura García',
      email: 'laura@email.com',
      phone: '+34 688 222 333',
      location: 'Barcelona, España',
      totalOrders: 78,
      totalSpent: 2340.75,
      joinDate: new Date('2021-12-03'),
      lastActivity: new Date('2024-01-29'),
      status: 'active',
      loyaltyLevel: 'platinum',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: '3',
      name: 'Miguel Torres',
      email: 'miguel@email.com',
      phone: '+34 677 333 444',
      location: 'Sevilla, España',
      totalOrders: 12,
      totalSpent: 340.25,
      joinDate: new Date('2023-06-20'),
      lastActivity: new Date('2024-01-15'),
      status: 'inactive',
      loyaltyLevel: 'bronze',
      avatar: '/placeholder.svg?height=40&width=40',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'suspended':
      case 'banned':
        return 'destructive';
      case 'inactive':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getLoyaltyColor = (level: string) => {
    switch (level) {
      case 'platinum':
        return 'bg-purple-500';
      case 'gold':
        return 'bg-yellow-500';
      case 'silver':
        return 'bg-gray-400';
      case 'bronze':
        return 'bg-orange-600';
      default:
        return 'bg-gray-500';
    }
  };

  const userGrowthData = [
    { month: 'Ene', businesses: 120, customers: 1200 },
    { month: 'Feb', businesses: 135, customers: 1350 },
    { month: 'Mar', businesses: 148, customers: 1480 },
    { month: 'Abr', businesses: 162, customers: 1620 },
    { month: 'May', businesses: 175, customers: 1750 },
    { month: 'Jun', businesses: 190, customers: 1900 },
  ];

  const categoryDistribution = [
    { name: 'Artesanías', value: 35, color: '#0088FE' },
    { name: 'Alimentación', value: 28, color: '#00C49F' },
    { name: 'Jardinería', value: 20, color: '#FFBB28' },
    { name: 'Otros', value: 17, color: '#FF8042' },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas generales */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Negocios</CardTitle>
            <Store className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessUsers.length}</div>
            <div className="text-muted-foreground flex items-center text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +12% este mes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerUsers.length}</div>
            <div className="text-muted-foreground flex items-center text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +8% este mes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negocios Premium</CardTitle>
            <Crown className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businessUsers.filter(u => u.isPremium).length}
            </div>
            <div className="text-muted-foreground flex items-center text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +25% conversión
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€56,470</div>
            <div className="text-muted-foreground flex items-center text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +15% este mes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="businesses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="businesses">Negocios y Artesanos</TabsTrigger>
          <TabsTrigger value="customers">Usuarios Principales</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Store className="h-5 w-5" />
                  <span>Gestión de Negocios y Artesanos</span>
                </div>
                <Button>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Nuevo Negocio
                </Button>
              </CardTitle>
              <CardDescription>
                Administra todos los negocios registrados en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="mb-4 flex space-x-2">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                  <Input
                    placeholder="Buscar negocios..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="suspended">Suspendidos</SelectItem>
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

              {/* Tabla de negocios */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Negocio</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Ventas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessUsers.map(business => (
                    <TableRow key={business.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={business.avatar || '/placeholder.svg'} />
                            <AvatarFallback>{business.businessName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{business.businessName}</div>
                            <div className="text-muted-foreground flex items-center text-sm">
                              {business.isPremium && (
                                <Crown className="mr-1 h-3 w-3 text-yellow-500" />
                              )}
                              {business.isPremium ? 'Premium' : 'Básico'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{business.name}</div>
                          <div className="text-muted-foreground text-sm">{business.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{business.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-1 h-3 w-3" />
                          {business.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                          {business.rating}
                        </div>
                      </TableCell>
                      <TableCell>€{business.totalSales.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(business.status)}>{business.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Gestión de Usuarios Principales</span>
                </div>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </CardTitle>
              <CardDescription>
                Administra todos los usuarios clientes de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="mb-4 flex space-x-2">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                    <SelectItem value="banned">Bloqueados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabla de usuarios */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Gastado</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerUsers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={customer.avatar || '/placeholder.svg'} />
                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-muted-foreground text-sm">
                              Desde {customer.joinDate.toLocaleDateString('es-ES')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center text-sm">
                            <Mail className="mr-1 h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="text-muted-foreground flex items-center text-sm">
                            <Phone className="mr-1 h-3 w-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-1 h-3 w-3" />
                          {customer.location}
                        </div>
                      </TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>€{customer.totalSpent.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={`${getLoyaltyColor(customer.loyaltyLevel)} text-white`}>
                          {customer.loyaltyLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(customer.status)}>{customer.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Crecimiento de Usuarios</CardTitle>
                <CardDescription>Evolución mensual de registros</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    businesses: { label: 'Negocios', color: 'hsl(var(--chart-1))' },
                    customers: { label: 'Clientes', color: 'hsl(var(--chart-2))' },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="businesses"
                        stroke="var(--color-businesses)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="customers"
                        stroke="var(--color-customers)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Categorías</CardTitle>
                <CardDescription>Negocios por tipo de actividad</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: 'Porcentaje', color: 'hsl(var(--chart-1))' },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryDistribution.map((entry, index) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
