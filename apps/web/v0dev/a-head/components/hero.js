'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Hero;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const use_performance_monitor_1 = require("../hooks/use-performance-monitor");
const performance_monitor_1 = require("./performance-monitor");
function FragmentButton({ children, onClick, variant = 'default', size = 'md', className = '', href, imageUrl = '/placeholder.svg?height=200&width=200&text=Fragment', disabled = false, }) {
    const [isPressed, setIsPressed] = (0, react_1.useState)(false);
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const [isTouched, setIsTouched] = (0, react_1.useState)(false);
    const [clickCount, setClickCount] = (0, react_1.useState)(0);
    const [fragments, setFragments] = (0, react_1.useState)([]);
    const buttonRef = (0, react_1.useRef)(null);
    const timeoutRef = (0, react_1.useRef)(null);
    const lastClickTime = (0, react_1.useRef)(0);
    const [isTouchDevice, setIsTouchDevice] = (0, react_1.useState)(false);
    const [performanceMode, setPerformanceMode] = (0, react_1.useState)('normal');
    // Performance monitoring
    const { metrics, incrementAnimationCount, decrementAnimationCount } = (0, use_performance_monitor_1.usePerformanceMonitor)({
        enableMemoryMonitoring: true,
        fpsThreshold: 30,
        stressTestMode: true,
    });
    // Detect touch device
    (0, react_1.useEffect)(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouchDevice();
        window.addEventListener('resize', checkTouchDevice);
        return () => window.removeEventListener('resize', checkTouchDevice);
    }, []);
    // Monitor performance and adjust animations dynamically
    (0, react_1.useEffect)(() => {
        let newMode = 'normal';
        // Critical performance - disable all effects
        if (metrics.fps < 15 || metrics.frameTime > 66.67) {
            newMode = 'disabled';
        }
        // Poor performance - minimal effects only
        else if (metrics.fps < 20 || metrics.frameTime > 50) {
            newMode = 'minimal';
        }
        // Low performance - reduced effects
        else if (metrics.fps < 30 || metrics.frameTime > 33.33 || metrics.animationCount > 8) {
            newMode = 'reduced';
        }
        // Mobile devices get reduced effects by default
        else if (isTouchDevice && window.innerWidth < 768) {
            newMode = 'reduced';
        }
        setPerformanceMode(newMode);
    }, [metrics, isTouchDevice]);
    const createFragments = (0, react_1.useCallback)(() => {
        if (disabled || performanceMode === 'disabled')
            return;
        const now = Date.now();
        const timeSinceLastClick = now - lastClickTime.current;
        // Prevent rapid clicking spam
        if (timeSinceLastClick < 100)
            return;
        lastClickTime.current = now;
        // Track animation start
        incrementAnimationCount();
        const newFragments = [];
        // Adjust fragment count based on performance mode
        let fragmentCount = 8;
        switch (performanceMode) {
            case 'disabled':
                fragmentCount = 0;
                break;
            case 'minimal':
                fragmentCount = 2;
                break;
            case 'reduced':
                fragmentCount = 4;
                break;
            case 'normal':
                fragmentCount = window.innerWidth < 768 ? 6 : Math.min(16, 8 + clickCount * 2);
                break;
        }
        const intensity = Math.min(clickCount + 1, performanceMode === 'minimal' ? 1 : performanceMode === 'reduced' ? 2 : 3);
        for (let i = 0; i < fragmentCount; i++) {
            const angle = (i / fragmentCount) * Math.PI * 2;
            const distance = (50 + Math.random() * 100) * intensity;
            const x = Math.cos(angle) * distance + (Math.random() - 0.5) * 50;
            const y = Math.sin(angle) * distance + (Math.random() - 0.5) * 50;
            newFragments.push({
                id: i,
                x: window.innerWidth < 768 ? x * 0.7 : x,
                y: window.innerWidth < 768 ? y * 0.7 : y,
                rotation: Math.random() *
                    (performanceMode === 'minimal' ? 180 : performanceMode === 'reduced' ? 360 : 720) *
                    intensity,
                scale: 0.2 + Math.random() * 0.3,
                delay: Math.random() *
                    (performanceMode === 'minimal' ? 50 : performanceMode === 'reduced' ? 100 : 200),
            });
        }
        setFragments(newFragments);
        setIsPressed(true);
        setClickCount(prev => prev + 1);
        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Reset after animation with performance-adjusted timing
        const animationDuration = performanceMode === 'minimal'
            ? 400
            : performanceMode === 'reduced'
                ? 600
                : 800 + intensity * 200;
        timeoutRef.current = setTimeout(() => {
            setIsPressed(false);
            setFragments([]);
            setClickCount(0);
            decrementAnimationCount();
        }, animationDuration);
    }, [disabled, clickCount, performanceMode, incrementAnimationCount, decrementAnimationCount]);
    const handleClick = (0, react_1.useCallback)(() => {
        createFragments();
        if (onClick) {
            const delay = performanceMode === 'minimal' ? 100 : performanceMode === 'reduced' ? 200 : 300;
            setTimeout(onClick, delay);
        }
    }, [createFragments, onClick, performanceMode]);
    // Touch-optimized event handlers
    const handleTouchStart = (0, react_1.useCallback)(() => {
        if (!disabled) {
            setIsTouched(true);
            setIsHovered(true);
        }
    }, [disabled]);
    const handleTouchEnd = (0, react_1.useCallback)(() => {
        setIsTouched(false);
        setTimeout(() => setIsHovered(false), 150);
    }, []);
    const handleMouseEnter = (0, react_1.useCallback)(() => {
        if (!disabled && !isTouchDevice) {
            setIsHovered(true);
        }
    }, [disabled, isTouchDevice]);
    const handleMouseLeave = (0, react_1.useCallback)(() => {
        if (!isTouchDevice) {
            setIsHovered(false);
        }
    }, [isTouchDevice]);
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-2 text-sm min-h-[44px]';
            case 'lg':
                return 'px-8 py-4 text-lg min-h-[48px]';
            default:
                return 'px-6 py-3 text-base min-h-[44px]';
        }
    };
    const getVariantClasses = () => {
        if (disabled) {
            return 'bg-gray-300 text-gray-500 cursor-not-allowed';
        }
        const transitionDuration = performanceMode === 'minimal'
            ? 'duration-150'
            : performanceMode === 'reduced'
                ? 'duration-200'
                : 'duration-300';
        const baseClasses = `transition-all ${transitionDuration} transform`;
        const hoverScale = isHovered && !disabled && performanceMode !== 'disabled' ? 'scale-105' : '';
        const touchScale = isTouched ? 'scale-95' : '';
        const pressedScale = isPressed && performanceMode !== 'disabled' ? 'animate-pulse' : '';
        if (variant === 'outline') {
            return `${baseClasses} border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent hover:shadow-lg active:shadow-md ${hoverScale} ${touchScale} ${pressedScale}`;
        }
        return `${baseClasses} bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-xl active:shadow-lg ${hoverScale} ${touchScale} ${pressedScale}`;
    };
    const buttonContent = ((0, jsx_runtime_1.jsxs)("button", { ref: buttonRef, onClick: handleClick, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd, disabled: disabled, className: `
        group relative overflow-hidden
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-xl shadow-lg
        ${className}
      `, style: {
            WebkitTapHighlightColor: 'transparent',
        }, children: [(0, jsx_runtime_1.jsx)("div", { className: `absolute inset-0 transition-all ${performanceMode === 'minimal'
                    ? 'duration-200'
                    : performanceMode === 'reduced'
                        ? 'duration-300'
                        : 'duration-500'} ${(isHovered || isTouched) && performanceMode !== 'disabled' ? 'scale-110 opacity-30' : 'opacity-10'}`, children: (0, jsx_runtime_1.jsx)(image_1.default, { src: imageUrl || '/placeholder.svg', alt: "Button background", fill: true, className: `object-cover transition-transform ${performanceMode === 'minimal'
                        ? 'duration-200'
                        : performanceMode === 'reduced'
                            ? 'duration-300'
                            : 'duration-500'}` }) }), (isHovered || isTouched) && !disabled && performanceMode === 'normal' && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 animate-pulse bg-gradient-to-r from-green-400/20 to-emerald-400/20" })), (0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute inset-0", children: fragments.map(fragment => ((0, jsx_runtime_1.jsx)("div", { className: `absolute inset-0 transition-all ${performanceMode === 'minimal'
                        ? 'duration-500'
                        : performanceMode === 'reduced'
                            ? 'duration-700'
                            : 'duration-1000'} ease-out ${isPressed ? 'opacity-0' : 'opacity-100'}`, style: {
                        transform: isPressed
                            ? `translate(${fragment.x}px, ${fragment.y}px) rotate(${fragment.rotation}deg) scale(${fragment.scale})`
                            : 'translate(0, 0) rotate(0deg) scale(1)',
                        transitionDelay: `${fragment.delay}ms`,
                    }, children: (0, jsx_runtime_1.jsx)(image_1.default, { src: imageUrl || '/placeholder.svg', alt: "", fill: true, className: "object-cover opacity-80", style: {
                            clipPath: `polygon(
                  ${(fragment.id % 4) * 25}% ${Math.floor(fragment.id / 4) * 25}%,
                  ${((fragment.id % 4) + 1) * 25}% ${Math.floor(fragment.id / 4) * 25}%,
                  ${((fragment.id % 4) + 1) * 25}% ${(Math.floor(fragment.id / 4) + 1) * 25}%,
                  ${(fragment.id % 4) * 25}% ${(Math.floor(fragment.id / 4) + 1) * 25}%
                )`,
                        } }) }, fragment.id))) }), (0, jsx_runtime_1.jsx)("span", { className: "relative z-10 flex items-center justify-center gap-2 transition-transform duration-200", children: children }), isPressed && performanceMode === 'normal' && ((0, jsx_runtime_1.jsxs)("div", { className: "pointer-events-none absolute inset-0", children: [[...Array(Math.min(clickCount * 2 + 4, 8))].map((_, i) => ((0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: `absolute h-3 w-3 animate-ping text-yellow-400 sm:h-4 sm:w-4`, style: {
                            left: `${10 + ((i * 15) % 80)}%`,
                            top: `${20 + ((i * 13) % 60)}%`,
                            animationDelay: `${i * 50}ms`,
                            animationDuration: `${600 + Math.random() * 200}ms`,
                        } }, i))), clickCount > 2 && ((0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform animate-pulse text-yellow-300" }))] })), (isHovered || isTouched) && !disabled && performanceMode !== 'disabled' && ((0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute inset-0", children: [
                    ...Array(performanceMode === 'minimal'
                        ? 1
                        : performanceMode === 'reduced'
                            ? 2
                            : isTouchDevice
                                ? 2
                                : 3),
                ].map((_, i) => ((0, jsx_runtime_1.jsx)("div", { className: "absolute h-1 w-1 animate-ping rounded-full bg-white opacity-60", style: {
                        left: `${25 + i * 25}%`,
                        top: `${30 + (i % 2) * 40}%`,
                        animationDelay: `${i * 200}ms`,
                    } }, i))) })), isTouched && isTouchDevice && performanceMode !== 'disabled' && ((0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute inset-0", children: (0, jsx_runtime_1.jsx)("div", { className: "absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 transform animate-ping rounded-full bg-white/20", style: { animation: 'ping 0.6s cubic-bezier(0, 0, 0.2, 1)' } }) })), process.env.NODE_ENV === 'development' && performanceMode !== 'normal' && ((0, jsx_runtime_1.jsx)("div", { className: `absolute right-0 top-0 h-2 w-2 rounded-full opacity-75 ${performanceMode === 'disabled'
                    ? 'bg-red-500'
                    : performanceMode === 'minimal'
                        ? 'bg-orange-500'
                        : 'bg-yellow-500'}` }))] }));
    if (href && !disabled) {
        return ((0, jsx_runtime_1.jsx)(link_1.default, { href: href, className: "inline-block", children: buttonContent }));
    }
    return buttonContent;
}
function Hero() {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [showPerformanceMonitor, setShowPerformanceMonitor] = (0, react_1.useState)(false);
    // Show performance monitor in development
    (0, react_1.useEffect)(() => {
        if (process.env.NODE_ENV === 'development') {
            setShowPerformanceMonitor(true);
        }
    }, []);
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/mapa?search=${encodeURIComponent(searchQuery)}`;
        }
    };
    const stats = [
        {
            icon: lucide_react_1.Users,
            label: 'Productores',
            value: '150+',
            color: 'from-blue-500 to-cyan-500',
            image: '/placeholder.svg?height=100&width=100&text=Productores',
        },
        {
            icon: lucide_react_1.MapPin,
            label: 'Ubicaciones',
            value: '45',
            color: 'from-green-500 to-emerald-500',
            image: '/placeholder.svg?height=100&width=100&text=Ubicaciones',
        },
        {
            icon: lucide_react_1.Star,
            label: 'Valoración',
            value: '4.8',
            color: 'from-yellow-500 to-orange-500',
            image: '/placeholder.svg?height=100&width=100&text=Valoracion',
        },
        {
            icon: lucide_react_1.TrendingUp,
            label: 'Crecimiento',
            value: '+25%',
            color: 'from-purple-500 to-pink-500',
            image: '/placeholder.svg?height=100&width=100&text=Crecimiento',
        },
    ];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("section", { className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-amber-50 pb-16 pt-20", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 opacity-5", children: (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", style: {
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            } }) }), (0, jsx_runtime_1.jsx)("div", { className: "container relative z-10 mx-auto px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-4xl text-center", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "mb-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl", children: ["Descubre los", ' ', (0, jsx_runtime_1.jsx)("span", { className: "bg-gradient-to-r from-green-600 to-amber-500 bg-clip-text text-transparent", children: "Sabores Aut\u00E9nticos" }), ' ', "de Ja\u00E9n"] }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto mb-8 max-w-2xl px-4 text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl", children: "Conecta directamente con productores locales, descubre productos artesanales \u00FAnicos y apoya la econom\u00EDa local de nuestra hermosa provincia." }), (0, jsx_runtime_1.jsx)("form", { onSubmit: handleSearch, className: "mx-auto mb-12 max-w-2xl px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "text", placeholder: "Buscar productores, productos...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), className: "rounded-full border-2 border-gray-200 py-3 pl-10 pr-4 text-sm shadow-lg focus:border-green-500 focus:ring-green-500 sm:py-4 sm:pl-12 sm:text-lg" }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", className: "absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-green-600 to-amber-500 px-4 py-2 text-sm text-white shadow-md transition-all duration-300 hover:from-green-700 hover:to-amber-600 hover:shadow-lg sm:px-6 sm:text-base", children: "Buscar" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-16 flex flex-col justify-center gap-4 px-4 sm:flex-row", children: [(0, jsx_runtime_1.jsxs)(FragmentButton, { size: "lg", href: "/mapa", imageUrl: "/placeholder.svg?height=200&width=300&text=Mapa+Interactivo", className: "w-full sm:w-auto", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4 sm:h-5 sm:w-5" }), "Explorar Mapa"] }), (0, jsx_runtime_1.jsxs)(FragmentButton, { variant: "outline", size: "lg", href: "/productores", imageUrl: "/placeholder.svg?height=200&width=300&text=Productores+Locales", className: "w-full sm:w-auto", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-4 w-4 sm:h-5 sm:w-5" }), "Ver Productores"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mx-auto grid max-w-4xl grid-cols-2 gap-4 px-4 sm:gap-6 lg:grid-cols-4", children: stats.map((stat, index) => {
                                        const Icon = stat.icon;
                                        return ((0, jsx_runtime_1.jsxs)(FragmentButton, { size: "sm", variant: "outline", imageUrl: stat.image, className: "h-auto flex-col gap-3 !border-gray-200 !bg-white/80 p-4 !text-gray-900 !shadow-lg !backdrop-blur-sm !transition-all !duration-300 hover:!border-green-300 hover:!text-green-700 hover:!shadow-xl sm:p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: `h-8 w-8 bg-gradient-to-r sm:h-12 sm:w-12 ${stat.color} mx-auto mb-2 flex items-center justify-center rounded-xl sm:mb-4`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4 text-white sm:h-6 sm:w-6" }) }), (0, jsx_runtime_1.jsx)("div", { className: "mb-1 text-xl font-bold sm:text-2xl lg:text-3xl", children: stat.value }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs font-medium sm:text-sm", children: stat.label })] }, index));
                                    }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute left-4 top-20 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-10 sm:left-10 sm:h-20 sm:w-20" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-20 right-4 h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-10 delay-1000 sm:right-10 sm:h-32 sm:w-32" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute left-4 top-1/2 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 opacity-10 delay-500 sm:left-20 sm:h-16 sm:w-16" })] }), (0, jsx_runtime_1.jsx)(performance_monitor_1.PerformanceMonitor, { isVisible: showPerformanceMonitor, onToggle: () => setShowPerformanceMonitor(!showPerformanceMonitor) })] }));
}
//# sourceMappingURL=hero.js.map