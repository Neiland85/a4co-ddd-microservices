'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBar = SearchBar;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("../ui/button");
const input_1 = require("../ui/input");
const dialog_1 = require("../ui/dialog");
const lucide_react_1 = require("lucide-react");
const framer_motion_1 = require("framer-motion");
const use_sound_effects_1 = require("../../hooks/use-sound-effects");
function SearchBar({ onSearch, placeholder = 'Buscar productos...', }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [query, setQuery] = (0, react_1.useState)('');
    const [results, setResults] = (0, react_1.useState)([]);
    const [recentSearches, setRecentSearches] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const inputRef = (0, react_1.useRef)(null);
    const { playClick, playHover } = (0, use_sound_effects_1.useSoundEffects)();
    // Mock search results
    const mockResults = [
        {
            id: '1',
            title: 'Ochío Tradicional de Jaén',
            type: 'product',
            url: '/productos/ochio-tradicional',
            description: 'Pan artesanal tradicional',
        },
        {
            id: '2',
            title: 'Aceite de Oliva Virgen Extra',
            type: 'product',
            url: '/productos/aceite-oliva',
            description: 'Aceite premium de olivas seleccionadas',
        },
        {
            id: '3',
            title: 'Queso de Cabra Artesanal',
            type: 'product',
            url: '/productos/queso-cabra',
            description: 'Queso cremoso de cabras locales',
        },
        {
            id: '4',
            title: 'Catálogo de Productos',
            type: 'page',
            url: '/catalogo',
            description: 'Explora todos nuestros productos',
        },
    ];
    const trendingSearches = ['ochío', 'aceite oliva', 'queso artesanal', 'jamón ibérico'];
    (0, react_1.useEffect)(() => {
        const saved = localStorage.getItem('recent-searches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);
    (0, react_1.useEffect)(() => {
        if (query.length > 2) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                const filtered = mockResults.filter(result => result.title.toLowerCase().includes(query.toLowerCase()) ||
                    result.description?.toLowerCase().includes(query.toLowerCase()));
                setResults(filtered);
                setIsLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        }
        else {
            setResults([]);
            setIsLoading(false);
        }
    }, [query]);
    const handleSearch = (searchQuery) => {
        if (searchQuery.trim()) {
            onSearch(searchQuery);
            // Add to recent searches
            const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recent-searches', JSON.stringify(updated));
            setIsOpen(false);
            setQuery('');
            playClick();
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(query);
        }
        else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };
    const openSearch = () => {
        setIsOpen(true);
        playClick();
        setTimeout(() => inputRef.current?.focus(), 100);
    };
    // Helper functions to render different content sections
    const renderSearchResults = () => {
        if (isLoading) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "border-a4co-olive-600 h-6 w-6 animate-spin rounded-full border-b-2" }) }));
        }
        if (results.length > 0) {
            return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-3 text-sm font-medium text-gray-600", children: "Resultados" }), results.map((result, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, onClick: () => handleSearch(result.title), onMouseEnter: () => playHover(), className: "hover:bg-a4co-olive-50 flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "text-a4co-olive-600 mt-0.5 h-4 w-4 flex-shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "truncate font-medium text-gray-900", children: result.title }), result.description && ((0, jsx_runtime_1.jsx)("div", { className: "truncate text-sm text-gray-600", children: result.description })), (0, jsx_runtime_1.jsx)("div", { className: "text-a4co-olive-600 text-xs capitalize", children: result.type })] })] }, result.id)))] }));
        }
        return ((0, jsx_runtime_1.jsxs)("div", { className: "py-8 text-center text-gray-500", children: ["No se encontraron resultados para \"", query, "\""] }));
    };
    const renderSuggestions = () => {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [recentSearches.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "mb-3 flex items-center gap-2 text-sm font-medium text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" }), "B\u00FAsquedas recientes"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: recentSearches.map((search, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, onClick: () => handleSearch(search), onMouseEnter: () => playHover(), className: "hover:bg-a4co-olive-50 flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-700", children: search })] }, search))) })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "mb-3 flex items-center gap-2 text-sm font-medium text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4" }), "B\u00FAsquedas populares"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: trendingSearches.map((trend, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.1 }, onClick: () => handleSearch(trend), onMouseEnter: () => playHover(), className: "bg-a4co-olive-100 text-a4co-olive-700 hover:bg-a4co-olive-200 rounded-full px-3 py-1.5 text-sm transition-colors", children: trend }, trend))) })] })] }));
    };
    const renderMainContent = () => {
        if (query.length > 2) {
            return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "space-y-2", children: renderSearchResults() }, "results"));
        }
        return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "space-y-4", children: renderSuggestions() }, "suggestions"));
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: openSearch, onMouseEnter: () => playHover(), className: "hover:bg-a4co-olive-50 h-9 border-none bg-transparent px-3 transition-colors", "aria-label": "Abrir b\u00FAsqueda", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "text-a4co-olive-600 h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden text-sm text-gray-600 sm:inline", children: "Buscar..." })] }) }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: isOpen, onOpenChange: setIsOpen, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "border-a4co-olive-200 max-w-2xl bg-white/95 p-0 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { className: "p-6 pb-0", children: (0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { className: "sr-only", children: "B\u00FAsqueda" }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "p-6 pt-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative mb-6", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" }), (0, jsx_runtime_1.jsx)(input_1.Input, { ref: inputRef, value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: handleKeyDown, placeholder: placeholder, className: "border-a4co-olive-200 focus:border-a4co-olive-400 h-12 pl-10 pr-10 text-lg" }), query && ((0, jsx_runtime_1.jsx)(button_1.Button, { onClick: () => setQuery(''), className: "absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 transform border-none bg-transparent p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) }))] }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { mode: "wait", children: renderMainContent() })] })] }) })] }));
}
//# sourceMappingURL=search-bar.js.map