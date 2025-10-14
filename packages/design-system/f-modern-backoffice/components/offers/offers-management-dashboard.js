'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersManagementDashboard = OffersManagementDashboard;
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
const dialog_1 = require("@/components/ui/dialog");
const label_1 = require("@/components/ui/label");
const textarea_1 = require("@/components/ui/textarea");
const switch_1 = require("@/components/ui/switch");
const chart_1 = require("@/components/ui/chart");
const recharts_1 = require("recharts");
const lucide_react_1 = require("lucide-react");
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
function OffersManagementDashboard() {
    const [featuredOffers, setFeaturedOffers] = (0, react_1.useState)([
        {
            id: '1',
            businessId: 'b1',
            businessName: 'Artesanías La Esperanza',
            title: 'Descuento 30% en Cerámicas Artesanales',
            description: 'Hermosas piezas de cerámica hechas a mano con técnicas tradicionales',
            originalPrice: 50,
            discountPrice: 35,
            discountPercentage: 30,
            category: 'Artesanías',
            location: 'Madrid, España',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-02-15'),
            status: 'active',
            priority: 'premium',
            views: 2450,
            clicks: 245,
            conversions: 23,
            revenue: 805,
            image: '/placeholder.svg?height=60&width=60',
        },
        {
            id: '2',
            businessId: 'b2',
            businessName: 'Panadería San Miguel',
            title: 'Oferta Especial: Pan Artesanal',
            description: 'Pan recién horneado todos los días con ingredientes naturales',
            originalPrice: 15,
            discountPrice: 12,
            discountPercentage: 20,
            category: 'Alimentación',
            location: 'Barcelona, España',
            startDate: new Date('2024-01-20'),
            endDate: new Date('2024-02-20'),
            status: 'active',
            priority: 'high',
            views: 1890,
            clicks: 189,
            conversions: 45,
            revenue: 540,
            image: '/placeholder.svg?height=60&width=60',
        },
        {
            id: '3',
            businessId: 'b3',
            businessName: 'Flores del Campo',
            title: 'Ramos de Temporada -25%',
            description: 'Flores frescas de temporada para cualquier ocasión especial',
            originalPrice: 40,
            discountPrice: 30,
            discountPercentage: 25,
            category: 'Jardinería',
            location: 'Valencia, España',
            startDate: new Date('2024-01-10'),
            endDate: new Date('2024-01-31'),
            status: 'expired',
            priority: 'medium',
            views: 1234,
            clicks: 98,
            conversions: 12,
            revenue: 360,
            image: '/placeholder.svg?height=60&width=60',
        },
    ]);
    const [campaigns, setCampaigns] = (0, react_1.useState)([
        {
            id: '1',
            name: 'Campaña Artesanías Enero',
            type: 'featured',
            budget: 1000,
            spent: 650,
            impressions: 15000,
            clicks: 450,
            conversions: 45,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31'),
            status: 'active',
            businesses: ['b1', 'b4', 'b7'],
        },
        {
            id: '2',
            name: 'Boost Alimentación',
            type: 'boost',
            budget: 500,
            spent: 320,
            impressions: 8500,
            clicks: 280,
            conversions: 28,
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-02-15'),
            status: 'active',
            businesses: ['b2', 'b5'],
        },
    ]);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    const [categoryFilter, setCategoryFilter] = (0, react_1.useState)('all');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = (0, react_1.useState)(false);
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'expired':
                return 'destructive';
            case 'paused':
                return 'outline';
            default:
                return 'outline';
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'premium':
                return 'bg-purple-500';
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-3 w-3 text-green-500" });
            case 'pending':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3 text-yellow-500" });
            case 'expired':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-3 w-3 text-red-500" });
            case 'paused':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-3 w-3 text-gray-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3 text-gray-500" });
        }
    };
    const performanceData = [
        { month: 'Ene', revenue: 2400, conversions: 45, clicks: 890 },
        { month: 'Feb', revenue: 1398, conversions: 32, clicks: 650 },
        { month: 'Mar', revenue: 9800, conversions: 78, clicks: 1200 },
        { month: 'Abr', revenue: 3908, conversions: 56, clicks: 980 },
        { month: 'May', revenue: 4800, conversions: 67, clicks: 1100 },
        { month: 'Jun', revenue: 3800, conversions: 89, clicks: 1350 },
    ];
    const categoryPerformance = [
        { name: 'Artesanías', value: 35, revenue: 12500 },
        { name: 'Alimentación', value: 28, revenue: 8900 },
        { name: 'Jardinería', value: 20, revenue: 6700 },
        { name: 'Otros', value: 17, revenue: 4200 },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Ofertas Activas" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: featuredOffers.filter(o => o.status === 'active').length }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-green-500" }), "+12% este mes"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Ingresos Totales" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Euro, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold", children: ["\u20AC", featuredOffers.reduce((sum, offer) => sum + offer.revenue, 0).toLocaleString()] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-green-500" }), "+18% este mes"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Conversiones" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: featuredOffers.reduce((sum, offer) => sum + offer.conversions, 0) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-green-500" }), "Tasa: 9.2%"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Visualizaciones" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: featuredOffers.reduce((sum, offer) => sum + offer.views, 0).toLocaleString() }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-green-500" }), "+25% este mes"] })] })] })] }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "featured", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-3", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "featured", children: "Puestos Destacados" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "campaigns", children: "Campa\u00F1as Promocionales" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "analytics", children: "An\u00E1lisis de Rendimiento" })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "featured", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Crown, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Gesti\u00F3n de Puestos Destacados" })] }), (0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { open: isCreateDialogOpen, onOpenChange: setIsCreateDialogOpen, children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }), "Nueva Oferta Destacada"] }) }), (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: "Crear Nueva Oferta Destacada" }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: "Configura una nueva oferta para destacar en la plataforma" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "title", children: "T\u00EDtulo de la Oferta" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "title", placeholder: "Ej: Descuento 30% en Cer\u00E1micas" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "business", children: "Negocio" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Seleccionar negocio" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "b1", children: "Artesan\u00EDas La Esperanza" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "b2", children: "Panader\u00EDa San Miguel" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "b3", children: "Flores del Campo" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "col-span-2 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "description", children: "Descripci\u00F3n" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "description", placeholder: "Describe la oferta..." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "originalPrice", children: "Precio Original (\u20AC)" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "originalPrice", type: "number", placeholder: "50.00" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "discountPrice", children: "Precio con Descuento (\u20AC)" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "discountPrice", type: "number", placeholder: "35.00" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "category", children: "Categor\u00EDa" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Seleccionar categor\u00EDa" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "artesanias", children: "Artesan\u00EDas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "alimentacion", children: "Alimentaci\u00F3n" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "jardineria", children: "Jardiner\u00EDa" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "priority", children: "Prioridad" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Seleccionar prioridad" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "premium", children: "Premium" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "high", children: "Alta" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "medium", children: "Media" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "low", children: "Baja" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "startDate", children: "Fecha de Inicio" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "startDate", type: "date" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "endDate", children: "Fecha de Fin" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "endDate", type: "date" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "col-span-2 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "autoActivate" }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "autoActivate", children: "Activar autom\u00E1ticamente" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: () => setIsCreateDialogOpen(false), children: "Cancelar" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: () => setIsCreateDialogOpen(false), children: "Crear Oferta" })] })] })] })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Administra las ofertas destacadas y su rendimiento" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex space-x-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "text-muted-foreground absolute left-2 top-2.5 h-4 w-4" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar ofertas...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: "pl-8" })] }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: statusFilter, onValueChange: setStatusFilter, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-40", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Estado" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "active", children: "Activas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "pending", children: "Pendientes" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "expired", children: "Expiradas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "paused", children: "Pausadas" })] })] }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-40", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Categor\u00EDa" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "artesanias", children: "Artesan\u00EDas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "alimentacion", children: "Alimentaci\u00F3n" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "jardineria", children: "Jardiner\u00EDa" })] })] })] }), (0, jsx_runtime_1.jsxs)(table_1.Table, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHeader, { children: (0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Oferta" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Negocio" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Precio" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Prioridad" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Rendimiento" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Fechas" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Estado" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Acciones" })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableBody, { children: featuredOffers.map(offer => ((0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsxs)(avatar_1.Avatar, { className: "h-10 w-10", children: [(0, jsx_runtime_1.jsx)(avatar_1.AvatarImage, { src: offer.image || '/placeholder.svg' }), (0, jsx_runtime_1.jsx)(avatar_1.AvatarFallback, { children: offer.title.charAt(0) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: offer.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-sm", children: offer.category })] })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: offer.businessName }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "mr-1 h-3 w-3" }), offer.location] })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-medium text-green-600", children: ["\u20AC", offer.discountPrice] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground text-sm line-through", children: ["\u20AC", offer.originalPrice] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-xs", children: ["-", offer.discountPercentage, "%"] })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: `${getPriorityColor(offer.priority)} text-white`, children: offer.priority }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-1 h-3 w-3" }), offer.views.toLocaleString()] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "mr-1 h-3 w-3" }), offer.conversions, " conv."] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Euro, { className: "mr-1 h-3 w-3" }), "\u20AC", offer.revenue] })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("div", { children: offer.startDate.toLocaleDateString('es-ES') }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground", children: offer.endDate.toLocaleDateString('es-ES') })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [getStatusIcon(offer.status), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getStatusColor(offer.status), children: offer.status })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-1", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-3 w-3" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-3 w-3" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-3 w-3" }) })] }) })] }, offer.id))) })] })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "campaigns", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Campa\u00F1as Promocionales" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }), "Nueva Campa\u00F1a"] })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Gestiona campa\u00F1as de promoci\u00F3n y publicidad" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)(table_1.Table, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHeader, { children: (0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Campa\u00F1a" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Tipo" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Presupuesto" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Rendimiento" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Fechas" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Estado" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Acciones" })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableBody, { children: campaigns.map(campaign => ((0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: campaign.name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground text-sm", children: [campaign.businesses.length, " negocios"] })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "capitalize", children: campaign.type }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-medium", children: ["\u20AC", campaign.spent, " / \u20AC", campaign.budget] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-1 h-2 w-full rounded-full bg-gray-200", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full bg-blue-600", style: { width: `${(campaign.spent / campaign.budget) * 100}%` } }) })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [campaign.impressions.toLocaleString(), " impresiones"] }), (0, jsx_runtime_1.jsxs)("div", { children: [campaign.clicks, " clics"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-green-600", children: [campaign.conversions, " conversiones"] })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("div", { children: campaign.startDate.toLocaleDateString('es-ES') }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground", children: campaign.endDate.toLocaleDateString('es-ES') })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getStatusColor(campaign.status), children: campaign.status }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-1", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-3 w-3" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-3 w-3" }) })] }) })] }, campaign.id))) })] }) })] }) }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsContent, { value: "analytics", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Rendimiento de Ofertas" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Evoluci\u00F3n de ingresos y conversiones" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                                        revenue: { label: 'Ingresos (€)', color: 'hsl(var(--chart-1))' },
                                                        conversions: { label: 'Conversiones', color: 'hsl(var(--chart-2))' },
                                                    }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: performanceData, children: [(0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "month" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "revenue", stroke: "var(--color-revenue)", strokeWidth: 2 }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "conversions", stroke: "var(--color-conversions)", strokeWidth: 2 })] }) }) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Rendimiento por Categor\u00EDa" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Distribuci\u00F3n de ingresos por tipo de negocio" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                                        value: { label: 'Porcentaje', color: 'hsl(var(--chart-1))' },
                                                    }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.PieChart, { children: [(0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: categoryPerformance, cx: "50%", cy: "50%", labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: categoryPerformance.map((entry, index) => ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, {})] }) }) }) })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "M\u00E9tricas Detalladas" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "An\u00E1lisis completo del rendimiento de ofertas" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: "Top Categor\u00EDas" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: categoryPerformance.map((category, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3 rounded-full", style: { backgroundColor: COLORS[index % COLORS.length] } }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: category.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm font-medium", children: ["\u20AC", category.revenue.toLocaleString()] })] }, category.name))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: "Estad\u00EDsticas Clave" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-sm", children: "Tasa de Conversi\u00F3n" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "9.2%" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-sm", children: "CTR Promedio" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "12.5%" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-sm", children: "Valor Promedio" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "\u20AC35.20" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-sm", children: "ROI" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-green-600", children: "+245%" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: "Acciones R\u00E1pidas" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { className: "w-full", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "mr-2 h-4 w-4" }), "Generar Reporte"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "w-full bg-transparent", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-2 h-4 w-4" }), "Optimizar Ofertas"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "w-full bg-transparent", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "mr-2 h-4 w-4" }), "Crear Campa\u00F1a"] })] })] })] }) })] })] })] })] }));
}
//# sourceMappingURL=offers-management-dashboard.js.map