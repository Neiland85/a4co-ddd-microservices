'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManagementDashboard = UserManagementDashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const avatar_1 = require("@/components/ui/avatar");
const tabs_1 = require("@/components/ui/tabs");
const select_1 = require("@/components/ui/select");
const table_1 = require("@/components/ui/table");
const chart_1 = require("@/components/ui/chart");
const recharts_1 = require("recharts");
const lucide_react_1 = require("lucide-react");
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
function UserManagementDashboard() {
    const [businessUsers, setBusinessUsers] = (0, react_1.useState)([
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
    const [customerUsers, setCustomerUsers] = (0, react_1.useState)([
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
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    const [categoryFilter, setCategoryFilter] = (0, react_1.useState)('all');
    const getStatusColor = (status) => {
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
    const getLoyaltyColor = (level) => {
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Total Negocios" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Store, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: businessUsers.length }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-green-500" }), "+12% este mes"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Usuarios Activos" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: customerUsers.length }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-green-500" }), "+8% este mes"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Negocios Premium" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Crown, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: businessUsers.filter(u => u.isPremium).length }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-green-500" }), "+25% conversi\u00F3n"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Ingresos Totales" }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: "\u20AC56,470" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-green-500" }), "+15% este mes"] })] })] })] }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "businesses", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-3", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "businesses", children: "Negocios y Artesanos" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "customers", children: "Usuarios Principales" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "analytics", children: "An\u00E1lisis" })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "businesses", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Store, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Gesti\u00F3n de Negocios y Artesanos" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserCheck, { className: "mr-2 h-4 w-4" }), "Nuevo Negocio"] })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Administra todos los negocios registrados en la plataforma" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex space-x-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "text-muted-foreground absolute left-2 top-2.5 h-4 w-4" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar negocios...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: "pl-8" })] }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: statusFilter, onValueChange: setStatusFilter, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-40", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Estado" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "active", children: "Activos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "pending", children: "Pendientes" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "suspended", children: "Suspendidos" })] })] }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-40", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Categor\u00EDa" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "artesanias", children: "Artesan\u00EDas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "alimentacion", children: "Alimentaci\u00F3n" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "jardineria", children: "Jardiner\u00EDa" })] })] })] }), (0, jsx_runtime_1.jsxs)(table_1.Table, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHeader, { children: (0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Negocio" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Propietario" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Categor\u00EDa" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Ubicaci\u00F3n" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Rating" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Ventas" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Estado" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Acciones" })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableBody, { children: businessUsers.map(business => ((0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsxs)(avatar_1.Avatar, { className: "h-8 w-8", children: [(0, jsx_runtime_1.jsx)(avatar_1.AvatarImage, { src: business.avatar || '/placeholder.svg' }), (0, jsx_runtime_1.jsx)(avatar_1.AvatarFallback, { children: business.businessName.charAt(0) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: business.businessName }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-sm", children: [business.isPremium && ((0, jsx_runtime_1.jsx)(lucide_react_1.Crown, { className: "mr-1 h-3 w-3 text-yellow-500" })), business.isPremium ? 'Premium' : 'Básico'] })] })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: business.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-sm", children: business.email })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: business.category }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "mr-1 h-3 w-3" }), business.location] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "mr-1 h-3 w-3 fill-current text-yellow-500" }), business.rating] }) }), (0, jsx_runtime_1.jsxs)(table_1.TableCell, { children: ["\u20AC", business.totalSales.toLocaleString()] }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getStatusColor(business.status), children: business.status }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { className: "h-4 w-4" }) }) })] }, business.id))) })] })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "customers", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserCheck, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Gesti\u00F3n de Usuarios Principales" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "mr-2 h-4 w-4" }), "Nuevo Usuario"] })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Administra todos los usuarios clientes de la plataforma" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex space-x-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "text-muted-foreground absolute left-2 top-2.5 h-4 w-4" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar usuarios...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: "pl-8" })] }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: statusFilter, onValueChange: setStatusFilter, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-40", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Estado" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "active", children: "Activos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "inactive", children: "Inactivos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "banned", children: "Bloqueados" })] })] })] }), (0, jsx_runtime_1.jsxs)(table_1.Table, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHeader, { children: (0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Usuario" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Contacto" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Ubicaci\u00F3n" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Pedidos" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Gastado" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Nivel" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Estado" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Acciones" })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableBody, { children: customerUsers.map(customer => ((0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsxs)(avatar_1.Avatar, { className: "h-8 w-8", children: [(0, jsx_runtime_1.jsx)(avatar_1.AvatarImage, { src: customer.avatar || '/placeholder.svg' }), (0, jsx_runtime_1.jsx)(avatar_1.AvatarFallback, { children: customer.name.charAt(0) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: customer.name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground text-sm", children: ["Desde ", customer.joinDate.toLocaleDateString('es-ES')] })] })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "mr-1 h-3 w-3" }), customer.email] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "mr-1 h-3 w-3" }), customer.phone] })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "mr-1 h-3 w-3" }), customer.location] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: customer.totalOrders }), (0, jsx_runtime_1.jsxs)(table_1.TableCell, { children: ["\u20AC", customer.totalSpent.toLocaleString()] }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: `${getLoyaltyColor(customer.loyaltyLevel)} text-white`, children: customer.loyaltyLevel }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getStatusColor(customer.status), children: customer.status }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { className: "h-4 w-4" }) }) })] }, customer.id))) })] })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "analytics", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Crecimiento de Usuarios" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Evoluci\u00F3n mensual de registros" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                                    businesses: { label: 'Negocios', color: 'hsl(var(--chart-1))' },
                                                    customers: { label: 'Clientes', color: 'hsl(var(--chart-2))' },
                                                }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: userGrowthData, children: [(0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "month" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "businesses", stroke: "var(--color-businesses)", strokeWidth: 2 }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "customers", stroke: "var(--color-customers)", strokeWidth: 2 })] }) }) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Distribuci\u00F3n por Categor\u00EDas" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Negocios por tipo de actividad" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                                    value: { label: 'Porcentaje', color: 'hsl(var(--chart-1))' },
                                                }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.PieChart, { children: [(0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: categoryDistribution, cx: "50%", cy: "50%", labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: categoryDistribution.map((entry, index) => ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, {})] }) }) }) })] })] }) })] })] }));
}
//# sourceMappingURL=user-management-dashboard.js.map