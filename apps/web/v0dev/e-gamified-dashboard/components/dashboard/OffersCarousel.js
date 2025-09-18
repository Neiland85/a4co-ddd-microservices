'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OffersCarousel;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const offers = [
    {
        id: 1,
        title: 'Pizza Suprema',
        description: 'La mejor pizza de la ciudad con ingredientes premium',
        discount: '50%',
        image: '/placeholder.svg?height=200&width=300',
        category: 'Comida',
        isFavorite: true,
    },
    {
        id: 2,
        title: 'Spa Relajante',
        description: 'Masajes y tratamientos de lujo para tu bienestar',
        discount: '30%',
        image: '/placeholder.svg?height=200&width=300',
        category: 'Bienestar',
        isFavorite: true,
    },
    {
        id: 3,
        title: 'Aventura Extrema',
        description: 'Deportes de aventura y experiencias únicas',
        discount: '40%',
        image: '/placeholder.svg?height=200&width=300',
        category: 'Aventura',
        isFavorite: false,
    },
    {
        id: 4,
        title: 'Cine Premium',
        description: 'Películas en 4D con asientos VIP',
        discount: '25%',
        image: '/placeholder.svg?height=200&width=300',
        category: 'Entretenimiento',
        isFavorite: true,
    },
];
function OffersCarousel({ onOfferExplosion }) {
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    const [heartbeats, setHeartbeats] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            offers.forEach(offer => {
                if (offer.isFavorite) {
                    setHeartbeats(prev => ({
                        ...prev,
                        [offer.id]: !prev[offer.id],
                    }));
                }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const nextSlide = () => {
        setCurrentIndex(prev => (prev + 1) % offers.length);
    };
    const prevSlide = () => {
        setCurrentIndex(prev => (prev - 1 + offers.length) % offers.length);
    };
    const handleOfferClick = (event, offer) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        onOfferExplosion(x, y);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border-4 border-yellow-400 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 p-6 shadow-2xl", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { scale: 0.8 }, animate: { scale: 1 }, className: "mb-6 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "flex items-center text-3xl font-bold text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "mr-3 h-8 w-8 text-red-400" }), "Ofertas Favoritas", (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "ml-2 h-6 w-6 text-yellow-400" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: prevSlide, variant: "outline", size: "icon", className: "border-white/30 bg-white/20 hover:bg-white/30", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4 text-white" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: nextSlide, variant: "outline", size: "icon", className: "border-white/30 bg-white/20 hover:bg-white/30", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4 text-white" }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative overflow-hidden rounded-2xl", children: (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { mode: "wait", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { x: 300, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -300, opacity: 0 }, transition: { duration: 0.5, type: 'spring' }, className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: offers.slice(currentIndex, currentIndex + 2).map(offer => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05, rotateY: 5 }, whileTap: { scale: 0.95 }, onClick: e => handleOfferClick(e, offer), className: "relative cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-xl", animate: offer.isFavorite && heartbeats[offer.id]
                                ? {
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                        '0 0 0 0 rgba(255, 0, 0, 0.7)',
                                        '0 0 0 10px rgba(255, 0, 0, 0)',
                                        '0 0 0 0 rgba(255, 0, 0, 0)',
                                    ],
                                }
                                : {}, transition: { duration: 0.6 }, children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { animate: { rotate: [0, 5, -5, 0] }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY }, className: "absolute right-2 top-2 z-10 rounded-full bg-red-500 px-3 py-1 text-lg font-bold text-white", children: ["-", offer.discount] }), offer.isFavorite && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: heartbeats[offer.id]
                                        ? {
                                            scale: [1, 1.3, 1],
                                            color: ['#ef4444', '#dc2626', '#ef4444'],
                                        }
                                        : {}, transition: { duration: 0.6 }, className: "absolute left-2 top-2 z-10", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "h-6 w-6 fill-current text-red-500" }) })), (0, jsx_runtime_1.jsx)("img", { src: offer.image || '/placeholder.svg', alt: offer.title, className: "mb-3 h-32 w-full rounded-lg object-cover" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-gray-800", children: offer.title }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800", children: offer.category })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: offer.description }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, className: "flex items-center justify-between pt-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-1", children: [...Array(5)].map((_, i) => ((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-4 w-4 fill-current text-yellow-400" }, i))) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white", children: "\u00A1Explotar!" })] })] })] }, offer.id))) }, currentIndex) }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 flex justify-center space-x-2", children: offers.map((_, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { onClick: () => setCurrentIndex(index), className: `h-3 w-3 rounded-full transition-all ${index === currentIndex ? 'bg-yellow-400' : 'bg-white/50'}`, whileHover: { scale: 1.2 }, whileTap: { scale: 0.8 } }, index))) })] }));
}
//# sourceMappingURL=OffersCarousel.js.map