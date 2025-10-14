'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveRecommendations = InteractiveRecommendations;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const progress_1 = require("@/components/ui/progress");
const lucide_react_1 = require("lucide-react");
const section_circles_1 = require("./section-circles");
const metrics_to_animation_1 = require("@/utils/metrics-to-animation");
function InteractiveRecommendations({ metrics }) {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [sentOffers, setSentOffers] = (0, react_1.useState)(0);
    const recommendations = [
        {
            id: 1,
            title: 'Oferta Flash iPhone 15',
            description: 'Usuarios que vieron iPhone 14 en los últimos 7 días',
            targetUsers: 1247,
            estimatedConversion: 8.5,
            category: 'Tecnología',
            priority: 'Alta',
        },
        {
            id: 2,
            title: 'Descuento MacBook Pro',
            description: 'Usuarios con carrito abandonado de productos Apple',
            targetUsers: 892,
            estimatedConversion: 12.3,
            category: 'Computadoras',
            priority: 'Media',
        },
        {
            id: 3,
            title: 'Bundle AirPods + Funda',
            description: 'Compradores recientes de iPhone',
            targetUsers: 634,
            estimatedConversion: 15.7,
            category: 'Accesorios',
            priority: 'Alta',
        },
    ];
    const handleSendOffer = async (recommendationId) => {
        setIsLoading(true);
        // Simulación de envío de oferta
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSentOffers(prev => prev + 1);
        setIsLoading(false);
    };
    const handleSendAllOffers = async () => {
        setIsLoading(true);
        // Simulación de envío masivo
        await new Promise(resolve => setTimeout(resolve, 3000));
        setSentOffers(prev => prev + recommendations.length);
        setIsLoading(false);
    };
    const animationParams = (0, metrics_to_animation_1.getRecommendationsAnimationParams)(metrics);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative space-y-6", children: [(0, jsx_runtime_1.jsx)(section_circles_1.SectionCircles, { section: "recommendations", animationParams: animationParams, metrics: { recommendations: metrics } }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "relative z-10", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-2 text-3xl font-bold text-gray-900", children: "Recomendaciones Interactivas" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Env\u00EDa ofertas personalizadas basadas en el comportamiento de usuarios" })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10 grid grid-cols-1 gap-4 md:grid-cols-4", children: [
                    { label: 'Ofertas Enviadas', value: sentOffers, icon: lucide_react_1.Send, color: 'text-blue-600' },
                    { label: 'Usuarios Objetivo', value: '2.8K', icon: lucide_react_1.Target, color: 'text-green-600' },
                    { label: 'Tasa Conversión', value: '12.1%', icon: lucide_react_1.TrendingUp, color: 'text-purple-600' },
                    { label: 'ROI Estimado', value: '340%', icon: lucide_react_1.ShoppingCart, color: 'text-orange-600' },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, whileHover: { scale: 1.05, y: -5 }, transition: { duration: 0.5, delay: index * 0.1 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "opacity-6 pointer-events-none absolute inset-0", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-amber-500/50 to-orange-400/30", animate: {
                                            x: ['-100%', '100%', '-100%'],
                                            opacity: [0.3, 0.8, 0.3],
                                        }, transition: {
                                            duration: 3,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: index * 0.5,
                                        } }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "relative z-10 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: stat.label }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "text-2xl font-bold", initial: { scale: 1.2 }, animate: { scale: 1 }, transition: { duration: 0.3 }, children: stat.value }, stat.value)] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { rotate: 360, scale: 1.2 }, transition: { duration: 0.5 }, children: (0, jsx_runtime_1.jsx)(Icon, { className: `h-8 w-8 ${stat.color}` }) })] }) })] }) }, stat.label));
                }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, whileHover: { scale: 1.02 }, transition: { duration: 0.5, delay: 0.2 }, className: "relative z-10", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-orange-200/60 bg-gradient-to-r from-orange-50/80 via-yellow-50/30 to-amber-50/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "opacity-8 pointer-events-none absolute inset-0", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "bg-gradient-radial absolute right-0 top-0 h-32 w-32 rounded-full from-yellow-500/40 via-orange-400/20 to-transparent blur-2xl", animate: {
                                        scale: [1, 1.3, 1],
                                        x: [0, 20, 0],
                                        y: [0, -10, 0],
                                    }, transition: {
                                        duration: 6,
                                        repeat: Number.POSITIVE_INFINITY,
                                    } }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "bg-gradient-radial absolute bottom-0 left-0 h-24 w-24 rounded-full from-amber-400/30 to-transparent blur-2xl", animate: {
                                        scale: [0.8, 1.2, 0.8],
                                        rotate: [0, 180, 360],
                                    }, transition: {
                                        duration: 8,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: 2,
                                    } })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "rounded-full bg-orange-100 p-3", whileHover: { rotate: 360 }, transition: { duration: 0.5 }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-6 w-6 text-orange-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: "Campa\u00F1a Autom\u00E1tica" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Enviar todas las ofertas recomendadas" })] })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleSendAllOffers, disabled: isLoading, size: "lg", className: "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700", children: isLoading ? 'Enviando...' : 'Enviar Todo' }) })] }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3", children: recommendations.map((rec, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, whileHover: { scale: 1.03, y: -5 }, transition: { duration: 0.5, delay: index * 0.1 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "opacity-4 pointer-events-none absolute inset-0", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute right-0 top-0 h-8 w-8 rounded-full bg-gradient-to-bl from-amber-600/60 to-transparent", animate: {
                                        scale: [1, 1.5, 1],
                                        opacity: [0.4, 0.8, 0.4],
                                    }, transition: {
                                        duration: 4,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: index * 0.7,
                                    } }) }), (0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: rec.title }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { className: "mt-1", children: rec.description })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: rec.priority === 'Alta' ? 'destructive' : 'secondary', children: rec.priority })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Usuarios objetivo" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: rec.targetUsers.toLocaleString() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Conversi\u00F3n estimada" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium text-green-600", children: [rec.estimatedConversion, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: rec.estimatedConversion, className: "h-2" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: rec.category }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: () => handleSendOffer(rec.id), disabled: isLoading, size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "mr-2 h-4 w-4" }), "Enviar Oferta"] }) })] })] })] }) }, rec.id))) })] }));
}
//# sourceMappingURL=interactive-recommendations.js.map