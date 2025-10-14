'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsAndRatings = CommentsAndRatings;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const card_1 = require("@/components/ui/card");
const avatar_1 = require("@/components/ui/avatar");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const section_circles_1 = require("./section-circles");
const metrics_to_animation_1 = require("@/utils/metrics-to-animation");
function CommentsAndRatings({ metrics }) {
    const [filter, setFilter] = (0, react_1.useState)('all');
    const comments = [
        {
            id: 1,
            user: 'María González',
            avatar: '/placeholder.svg?height=40&width=40',
            rating: 5,
            comment: 'Excelente servicio, muy rápida la entrega y el producto llegó en perfectas condiciones.',
            product: 'iPhone 15 Pro',
            date: '2024-01-15',
            likes: 12,
            dislikes: 0,
            verified: true,
        },
        {
            id: 2,
            user: 'Carlos Ruiz',
            avatar: '/placeholder.svg?height=40&width=40',
            rating: 4,
            comment: 'Buen producto, aunque el precio podría ser más competitivo. La calidad es buena.',
            product: 'MacBook Air M2',
            date: '2024-01-14',
            likes: 8,
            dislikes: 2,
            verified: true,
        },
        {
            id: 3,
            user: 'Ana Martín',
            avatar: '/placeholder.svg?height=40&width=40',
            rating: 3,
            comment: 'El producto está bien pero tardó más de lo esperado en llegar. El empaque podría mejorar.',
            product: 'AirPods Pro',
            date: '2024-01-13',
            likes: 5,
            dislikes: 3,
            verified: false,
        },
        {
            id: 4,
            user: 'Luis Fernández',
            avatar: '/placeholder.svg?height=40&width=40',
            rating: 5,
            comment: 'Increíble calidad y atención al cliente. Definitivamente recomiendo esta tienda.',
            product: 'iPad Pro',
            date: '2024-01-12',
            likes: 15,
            dislikes: 0,
            verified: true,
        },
    ];
    const averageRating = comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length;
    const totalComments = comments.length;
    const verifiedComments = comments.filter(c => c.verified).length;
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => ((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: `h-4 w-4 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}` }, i)));
    };
    const animationParams = (0, metrics_to_animation_1.getCommentsAnimationParams)(metrics);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative space-y-6", children: [(0, jsx_runtime_1.jsx)(section_circles_1.SectionCircles, { section: "comments", animationParams: animationParams, metrics: { comments: metrics } }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "relative z-10", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-2 text-3xl font-bold text-gray-900", children: "Comentarios y Puntuaciones" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Gestiona las rese\u00F1as y feedback de tus usuarios" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 grid grid-cols-1 gap-4 md:grid-cols-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.05, y: -5 }, transition: { duration: 0.5, delay: 0.1 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute inset-0 opacity-5", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-pink-600/60 via-transparent to-fuchsia-500/40", animate: {
                                            opacity: [0.3, 0.8, 0.3],
                                        }, transition: {
                                            duration: 3,
                                            repeat: Number.POSITIVE_INFINITY,
                                        } }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "relative z-10 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { rotate: 360 }, transition: { duration: 0.5 }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-5 w-5 text-yellow-400" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Puntuaci\u00F3n Media" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "text-2xl font-bold", initial: { scale: 1.2 }, animate: { scale: 1 }, transition: { duration: 0.3 }, children: averageRating.toFixed(1) }, averageRating)] })] }) })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.05, y: -5 }, transition: { duration: 0.5, delay: 0.2 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute inset-0 opacity-5", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-pink-600/60 via-transparent to-fuchsia-500/40", animate: {
                                            opacity: [0.3, 0.8, 0.3],
                                        }, transition: {
                                            duration: 3,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: 0.5,
                                        } }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "relative z-10 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.2 }, transition: { duration: 0.3 }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "h-5 w-5 text-blue-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Total Comentarios" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold", children: totalComments })] })] }) })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.05, y: -5 }, transition: { duration: 0.5, delay: 0.3 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute inset-0 opacity-5", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-pink-600/60 via-transparent to-fuchsia-500/40", animate: {
                                            opacity: [0.3, 0.8, 0.3],
                                        }, transition: {
                                            duration: 3,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: 1,
                                        } }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "relative z-10 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.2 }, transition: { duration: 0.3 }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ThumbsUp, { className: "h-5 w-5 text-green-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Verificados" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold", children: verifiedComments })] })] }) })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.05, y: -5 }, transition: { duration: 0.5, delay: 0.4 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute inset-0 opacity-5", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-pink-600/60 via-transparent to-fuchsia-500/40", animate: {
                                            opacity: [0.3, 0.8, 0.3],
                                        }, transition: {
                                            duration: 3,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: 1.5,
                                        } }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "relative z-10 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { rotate: 180 }, transition: { duration: 0.5 }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-5 w-5 text-purple-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Pendientes" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold", children: "3" })] })] }) })] }) })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.01 }, transition: { duration: 0.5, delay: 0.5 }, className: "relative z-10", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "opacity-6 pointer-events-none absolute inset-0", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute inset-0 bg-gradient-to-r from-pink-50/50 via-transparent to-fuchsia-50/30", animate: {
                                    opacity: [0.3, 0.6, 0.3],
                                }, transition: {
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                } }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "relative z-10 p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: ['all', 'verified', 'high', 'low'].map((filterType, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: filter === filterType ? 'default' : 'outline', size: "sm", onClick: () => setFilter(filterType), children: [filterType === 'all' && 'Todos', filterType === 'verified' && 'Verificados', filterType === 'high' && '5 Estrellas', filterType === 'low' && '1-3 Estrellas'] }) }, filterType))) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10 space-y-4", children: comments.map((comment, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, whileHover: { scale: 1.02, y: -2 }, transition: { duration: 0.5, delay: index * 0.1 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "opacity-3 pointer-events-none absolute inset-0", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "bg-gradient-radial absolute right-0 top-0 h-12 w-12 rounded-full from-pink-500/50 to-transparent blur-lg", animate: {
                                            scale: [1, 1.3, 1],
                                            opacity: [0.3, 0.6, 0.3],
                                        }, transition: {
                                            duration: 5,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: index * 0.8,
                                        } }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "bg-gradient-radial absolute bottom-0 left-0 h-8 w-8 rounded-full from-fuchsia-400/40 to-transparent blur-lg", animate: {
                                            x: [0, 10, 0],
                                            y: [0, -5, 0],
                                            scale: [0.8, 1.2, 0.8],
                                        }, transition: {
                                            duration: 6,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: index * 0.5,
                                        } })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "relative z-10 p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.1 }, transition: { duration: 0.3 }, children: (0, jsx_runtime_1.jsxs)(avatar_1.Avatar, { children: [(0, jsx_runtime_1.jsx)(avatar_1.AvatarImage, { src: comment.avatar || '/placeholder.svg' }), (0, jsx_runtime_1.jsx)(avatar_1.AvatarFallback, { children: comment.user
                                                            .split(' ')
                                                            .map(n => n[0])
                                                            .join('') })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold", children: comment.user }), comment.verified && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 0.2 }, children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: "Verificado" }) }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-1", children: renderStars(comment.rating) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-700", children: comment.comment }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm text-gray-500", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Producto: ", comment.product] }), (0, jsx_runtime_1.jsx)("span", { children: comment.date })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { className: "flex items-center space-x-1 transition-colors hover:text-green-600", whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ThumbsUp, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: comment.likes })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { className: "flex items-center space-x-1 transition-colors hover:text-red-600", whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ThumbsDown, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: comment.dislikes })] })] })] })] })] }) })] }) }, comment.id))) })] }));
}
//# sourceMappingURL=comments-and-ratings.js.map