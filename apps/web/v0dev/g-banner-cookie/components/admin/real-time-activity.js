'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RealTimeActivity;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const scroll_area_1 = require("@/components/ui/scroll-area");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const use_websocket_1 = require("../../hooks/use-websocket");
function RealTimeActivity() {
    const [activities, setActivities] = (0, react_1.useState)([]);
    const [isPaused, setIsPaused] = (0, react_1.useState)(false);
    const [maxItems, setMaxItems] = (0, react_1.useState)(50);
    const salesData = (0, use_websocket_1.useRealTimeData)('SALES_UPDATE');
    const orderData = (0, use_websocket_1.useRealTimeData)('ORDER_UPDATE');
    const customerData = (0, use_websocket_1.useRealTimeData)('CUSTOMER_UPDATE');
    const productData = (0, use_websocket_1.useRealTimeData)('PRODUCT_UPDATE');
    // Process sales updates
    (0, react_1.useEffect)(() => {
        if (isPaused || salesData.data.length === 0)
            return;
        const latestSale = salesData.data[0];
        const activity = {
            id: `sale-${Date.now()}`,
            type: 'sale',
            title: 'Nueva Venta Registrada',
            description: `€${latestSale.revenue.toFixed(2)} en ${latestSale.orders} pedido${latestSale.orders > 1 ? 's' : ''}`,
            amount: latestSale.revenue,
            timestamp: new Date(latestSale.timestamp),
            icon: lucide_react_1.TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        };
        setActivities(prev => [activity, ...prev].slice(0, maxItems));
    }, [salesData.data, isPaused, maxItems]);
    // Process order updates
    (0, react_1.useEffect)(() => {
        if (isPaused || orderData.data.length === 0)
            return;
        const latestOrder = orderData.data[0];
        const activity = {
            id: `order-${latestOrder.orderId}`,
            type: 'order',
            title: `Pedido ${latestOrder.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}`,
            description: `${latestOrder.productName} - €${latestOrder.amount.toFixed(2)}`,
            amount: latestOrder.amount,
            timestamp: new Date(latestOrder.timestamp),
            icon: lucide_react_1.ShoppingCart,
            color: latestOrder.status === 'confirmed' ? 'text-blue-600' : 'text-yellow-600',
            bgColor: latestOrder.status === 'confirmed' ? 'bg-blue-50' : 'bg-yellow-50',
        };
        setActivities(prev => [activity, ...prev].slice(0, maxItems));
    }, [orderData.data, isPaused, maxItems]);
    // Process customer updates
    (0, react_1.useEffect)(() => {
        if (isPaused || customerData.data.length === 0)
            return;
        const latestCustomer = customerData.data[0];
        const activity = {
            id: `customer-${latestCustomer.customerId}`,
            type: 'customer',
            title: latestCustomer.type === 'new' ? 'Nuevo Cliente' : 'Cliente Recurrente',
            description: `${latestCustomer.location || 'Ubicación desconocida'} - €${latestCustomer.totalSpent.toFixed(2)}`,
            amount: latestCustomer.totalSpent,
            timestamp: new Date(latestCustomer.timestamp),
            icon: lucide_react_1.Users,
            color: latestCustomer.type === 'new' ? 'text-purple-600' : 'text-indigo-600',
            bgColor: latestCustomer.type === 'new' ? 'bg-purple-50' : 'bg-indigo-50',
        };
        setActivities(prev => [activity, ...prev].slice(0, maxItems));
    }, [customerData.data, isPaused, maxItems]);
    // Process product updates
    (0, react_1.useEffect)(() => {
        if (isPaused || productData.data.length === 0)
            return;
        const latestProduct = productData.data[0];
        const activity = {
            id: `product-${latestProduct.productId}`,
            type: 'product',
            title: 'Actualización de Producto',
            description: `${latestProduct.name} - ${latestProduct.salesCount} ventas`,
            amount: latestProduct.revenue,
            timestamp: new Date(latestProduct.timestamp),
            icon: lucide_react_1.Package,
            color: 'text-a4co-olive-600',
            bgColor: 'bg-a4co-olive-50',
        };
        setActivities(prev => [activity, ...prev].slice(0, maxItems));
    }, [productData.data, isPaused, maxItems]);
    const clearActivities = () => {
        setActivities([]);
    };
    const togglePause = () => {
        setIsPaused(!isPaused);
    };
    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (seconds < 60)
            return `hace ${seconds}s`;
        if (minutes < 60)
            return `hace ${minutes}m`;
        if (hours < 24)
            return `hace ${hours}h`;
        return timestamp.toLocaleDateString();
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "text-a4co-olive-600 mr-2 h-5 w-5" }), "Actividad en Tiempo Real"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Actualizaciones en vivo de ventas, pedidos y clientes" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "border-green-200 bg-green-50 text-green-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "mr-1 h-3 w-3 animate-pulse" }), activities.length, " eventos"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: togglePause, className: (0, utils_1.cn)('transition-all duration-300 hover:scale-105', isPaused
                                        ? 'border-green-200 text-green-600 hover:bg-green-50'
                                        : 'border-yellow-200 text-yellow-600 hover:bg-yellow-50'), children: [isPaused ? (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "mr-1 h-3 w-3" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Pause, { className: "mr-1 h-3 w-3" }), isPaused ? 'Reanudar' : 'Pausar'] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: clearActivities, className: "border-red-200 bg-transparent text-red-600 transition-all duration-300 hover:scale-105 hover:bg-red-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CloudyIcon, { className: "mr-1 h-3 w-3" }), "Limpiar"] })] })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [isPaused && ((0, jsx_runtime_1.jsx)("div", { className: "mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Pause, { className: "h-4 w-4 text-yellow-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-yellow-700", children: "Actualizaciones pausadas - Haz clic en \"Reanudar\" para continuar" })] }) })), (0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "h-96", children: activities.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-32 flex-col items-center justify-center text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "mb-2 h-8 w-8 opacity-50" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: "No hay actividad reciente" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs", children: "Las actualizaciones aparecer\u00E1n aqu\u00ED en tiempo real" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: activities.map((activity, index) => {
                                const Icon = activity.icon;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)('hover:shadow-natural-md group flex cursor-pointer items-start space-x-3 rounded-lg border p-3 transition-all duration-300', activity.bgColor, index === 0 && !isPaused ? 'animate-pulse border-2' : 'border'), children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('rounded-lg p-2', activity.bgColor), children: (0, jsx_runtime_1.jsx)(Icon, { className: (0, utils_1.cn)('h-4 w-4', activity.color) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h4", { className: "group-hover:text-a4co-olive-600 font-medium text-gray-900 transition-colors", children: activity.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [activity.amount && ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "bg-white/50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Euro, { className: "mr-1 h-3 w-3" }), activity.amount.toFixed(2)] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: getTimeAgo(activity.timestamp) })] })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-600", children: activity.description }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: (0, utils_1.cn)('text-xs', {
                                                                'border-green-200 bg-green-50 text-green-700': activity.type === 'sale',
                                                                'border-blue-200 bg-blue-50 text-blue-700': activity.type === 'order',
                                                                'border-purple-200 bg-purple-50 text-purple-700': activity.type === 'customer',
                                                                'bg-a4co-olive-50 text-a4co-olive-700 border-a4co-olive-200': activity.type === 'product',
                                                            }), children: [activity.type === 'sale' && 'Venta', activity.type === 'order' && 'Pedido', activity.type === 'customer' && 'Cliente', activity.type === 'product' && 'Producto'] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: activity.timestamp.toLocaleTimeString() })] })] })] }, activity.id));
                            }) })) }), activities.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 rounded-lg bg-gray-50 p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Mostrando ", activities.length, " de ", maxItems, " eventos m\u00E1ximos"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "L\u00EDmite:" }), (0, jsx_runtime_1.jsxs)("select", { value: maxItems, onChange: e => setMaxItems(Number(e.target.value)), className: "rounded border border-gray-300 px-2 py-1 text-xs", children: [(0, jsx_runtime_1.jsx)("option", { value: 25, children: "25" }), (0, jsx_runtime_1.jsx)("option", { value: 50, children: "50" }), (0, jsx_runtime_1.jsx)("option", { value: 100, children: "100" })] })] })] }) }))] })] }));
}
//# sourceMappingURL=real-time-activity.js.map