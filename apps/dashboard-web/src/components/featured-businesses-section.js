'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedBusinessesSection = FeaturedBusinessesSection;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const featured_businesses_1 = require("@/data/featured-businesses");
function FeaturedBusinessesSection() {
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    const [filter, setFilter] = (0, react_1.useState)('all');
    const filteredBusinesses = featured_businesses_1.featuredBusinesses.filter(business => filter === 'all' || business.category === filter);
    const nextSlide = () => {
        setCurrentIndex(prev => (prev + 1) % filteredBusinesses.length);
    };
    const prevSlide = () => {
        setCurrentIndex(prev => (prev - 1 + filteredBusinesses.length) % filteredBusinesses.length);
    };
    const getCategoryIcon = (category) => {
        return category === 'food' ? '🍽️' : '🤖';
    };
    const getCategoryName = (category) => {
        return category === 'food' ? 'Productos Alimenticios' : 'Actividades con IA';
    };
    const getVisibleBusinesses = () => {
        const businesses = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % filteredBusinesses.length;
            businesses.push(filteredBusinesses[index]);
        }
        return businesses;
    };
    return ((0, jsx_runtime_1.jsx)("section", { className: "bg-gradient-to-br from-slate-50 to-blue-50 py-16", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-12 text-center", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h2, { className: "mb-4 text-4xl font-bold text-gray-900", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: "Negocios Destacados del Mes" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "mb-8 text-lg text-gray-600", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 }, children: "Descubre los mejores negocios locales seleccionados por nuestra comunidad" }), (0, jsx_runtime_1.jsx)("div", { className: "mb-8 flex justify-center gap-4", children: [
                                { key: 'all', label: 'Todos', icon: '🏆' },
                                { key: 'food', label: 'Productos Alimenticios', icon: '🍽️' },
                                { key: 'ai', label: 'Actividades con IA', icon: '🤖' },
                            ].map(category => ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: filter === category.key ? 'default' : 'outline', onClick: () => {
                                    setFilter(category.key);
                                    setCurrentIndex(0);
                                }, className: `rounded-full px-6 py-3 transition-all duration-300 ${filter === category.key
                                    ? 'scale-105 bg-blue-600 text-white shadow-lg'
                                    : 'hover:scale-105 hover:bg-blue-50'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: category.icon }), category.label] }, category.key))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-8 grid grid-cols-1 gap-6 md:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "rounded-lg bg-white p-6 shadow-md", whileHover: { scale: 1.05 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-blue-600", children: featured_businesses_1.featuredBusinesses.filter(b => b.category === 'food').length }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-600", children: "Productos Alimenticios" })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "rounded-lg bg-white p-6 shadow-md", whileHover: { scale: 1.05 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-purple-600", children: featured_businesses_1.featuredBusinesses.filter(b => b.category === 'ai').length }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-600", children: "Actividades con IA" })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "rounded-lg bg-white p-6 shadow-md", whileHover: { scale: 1.05 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-green-600", children: featured_businesses_1.featuredBusinesses.reduce((sum, b) => sum + b.votes, 0) }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-600", children: "Votos Totales" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "icon", className: "absolute left-4 top-1/2 z-10 -translate-y-1/2 transform bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white", onClick: prevSlide, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "icon", className: "absolute right-4 top-1/2 z-10 -translate-y-1/2 transform bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white", onClick: nextSlide, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-6 px-16 md:grid-cols-2 lg:grid-cols-3", children: (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { mode: "wait", children: getVisibleBusinesses().map((business, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 100, rotateY: 90 }, animate: { opacity: 1, x: 0, rotateY: 0 }, exit: { opacity: 0, x: -100, rotateY: -90 }, transition: {
                                        duration: 0.6,
                                        delay: index * 0.1,
                                        type: 'spring',
                                        stiffness: 100,
                                    }, whileHover: {
                                        scale: 1.05,
                                        rotateY: 5,
                                        z: 50,
                                        transition: { duration: 0.3 },
                                    }, className: "perspective-1000", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: `h-full overflow-hidden transition-all duration-300 ${business.isWinner
                                            ? 'bg-gradient-to-br from-yellow-50 to-amber-50 shadow-2xl ring-4 ring-yellow-400'
                                            : 'hover:shadow-xl'}`, children: [business.isWinner && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-4 top-4 z-10", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { rotate: 360 }, transition: {
                                                        duration: 2,
                                                        repeat: Number.POSITIVE_INFINITY,
                                                        ease: 'linear',
                                                    }, children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: "bg-yellow-500 px-3 py-1 text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trophy, { className: "mr-1 h-4 w-4" }), "Ganador del Mes"] }) }) })), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("img", { src: business.image || '/placeholder.svg', alt: business.name, className: "h-48 w-full object-cover" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute left-4 top-4", children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "secondary", className: "bg-white/90 backdrop-blur-sm", children: [getCategoryIcon(business.category), " ", getCategoryName(business.category)] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-3 flex items-start justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-gray-900", children: business.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-4 w-4 fill-current text-yellow-400" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-1 text-sm font-medium", children: business.rating })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "mb-4 line-clamp-2 text-gray-600", children: business.description }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4 grid grid-cols-3 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-1 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-blue-500" }) }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: business.stats.responseTime }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Respuesta" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-1 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ThumbsUp, { className: "h-4 w-4 text-green-500" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "font-medium", children: [business.stats.satisfaction, "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Satisfacci\u00F3n" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-1 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ShoppingBag, { className: "h-4 w-4 text-purple-500" }) }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: business.stats.orders }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Pedidos" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4 space-y-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "mr-2 h-4 w-4" }), business.contact.phone] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "mr-2 h-4 w-4" }), business.contact.email] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "mr-2 h-4 w-4" }), business.contact.website] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600", children: [business.votes, " votos"] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-xs", children: ["\u20AC", business.monthlyPayment, "/mes"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { className: "flex-1 bg-blue-600 transition-all duration-300 hover:scale-105 hover:bg-blue-700", size: "sm", children: "Explorar Mapa" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", className: "flex-1 bg-transparent transition-all duration-300 hover:scale-105 hover:bg-gray-50", size: "sm", children: "Ver Productos" })] })] })] }) }, `${business.id}-${currentIndex}-${index}`))) }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 flex justify-center space-x-2", children: filteredBusinesses.map((_, index) => ((0, jsx_runtime_1.jsx)("button", { className: `h-3 w-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'scale-125 bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`, onClick: () => setCurrentIndex(index) }, index))) })] })] }) }));
}
//# sourceMappingURL=featured-businesses-section.js.map