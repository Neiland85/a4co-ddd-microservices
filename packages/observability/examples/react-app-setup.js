'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, 'default', { enumerable: true, value: v });
}) : function(o, v) {
    o['default'] = v;
});
var __importStar = (this && this.__importStar) || (function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== 'default') __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const jsx_runtime_1 = require('react/jsx-runtime');
const react_1 = __importStar(require('react'));
const client_1 = __importDefault(require('react-dom/client'));
const react_router_dom_1 = require('react-router-dom');
const react_2 = require('@a4co/observability/react');
// Configuración de la aplicación
const OBSERVABILITY_ENDPOINT = process.env.REACT_APP_OBSERVABILITY_ENDPOINT || '/api/observability';
// App principal con provider de observabilidad
function App() {
    const [currentUser, setCurrentUser] = (0, react_1.useState)(null);
    return ((0, jsx_runtime_1.jsx)(react_2.ObservabilityProvider, { apiEndpoint: OBSERVABILITY_ENDPOINT, userId: currentUser?.id, enablePerformanceTracking: true, enableErrorBoundary: true, onError: (error, errorInfo) => {
            // Manejo personalizado de errores
            console.error('Application error:', error, errorInfo);
        }, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: '/', element: (0, jsx_runtime_1.jsx)(HomePage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: '/products', element: (0, jsx_runtime_1.jsx)(ProductsPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: '/checkout', element: (0, jsx_runtime_1.jsx)(CheckoutPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: '/profile', element: (0, jsx_runtime_1.jsx)(ProfilePage, {}) })] }) }) }));
}
// Página de inicio con tracking de componentes
function HomePage() {
    const { logger, sessionId } = (0, react_2.useObservability)();
    const { trackClick, trackCustom } = (0, react_2.useEventTracking)();
    (0, react_2.useComponentTracking)('HomePage');
    (0, react_1.useEffect)(() => {
        logger.info('User landed on home page', { sessionId });
    }, []);
    const handleExploreClick = () => {
        trackClick('explore-button', { section: 'hero' });
    };
    return ((0, jsx_runtime_1.jsxs)('div', { className: 'home-page', children: [(0, jsx_runtime_1.jsx)(HeroSection, { onExploreClick: handleExploreClick }), (0, jsx_runtime_1.jsx)(FeaturedProducts, {}), (0, jsx_runtime_1.jsx)(NewsletterSignup, {})] }));
}
// Componente Hero con performance tracking
function HeroSection({ onExploreClick }) {
    return ((0, jsx_runtime_1.jsx)(react_2.PerformanceTracker, { name: 'HeroSection.render', children: () => ((0, jsx_runtime_1.jsxs)('section', { className: 'hero', children: [(0, jsx_runtime_1.jsx)('h1', { children: 'Welcome to A4CO Marketplace' }), (0, jsx_runtime_1.jsx)('p', { children: 'Discover unique artisan products from Colombia' }), (0, jsx_runtime_1.jsx)(react_2.TrackedButton, { variant: 'primary', size: 'large', trackingName: 'hero-explore-button', onClick: onExploreClick, children: 'Explore Products' })] })) }));
}
// Productos destacados con tracking de interacciones
function FeaturedProducts() {
    const [products, setProducts] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const { measurePerformance, logger } = (0, react_2.useObservability)();
    const { trackCustom } = (0, react_2.useEventTracking)();
    (0, react_2.useComponentTracking)('FeaturedProducts', {
        trackProps: ['productCount'],
    });
    (0, react_1.useEffect)(() => {
        loadFeaturedProducts();
    }, []);
    const loadFeaturedProducts = async() => {
        await measurePerformance('FeaturedProducts.load', async() => {
            try {
                // Usar fetch con tracing
                const tracedFetch = (0, react_2.createTracedFetch)(OBSERVABILITY_ENDPOINT, 'session-123');
                const response = await tracedFetch('/api/products/featured');
                const data = await response.json();
                setProducts(data);
                logger.info('Featured products loaded', { count: data.length });
            }
            catch (error) {
                logger.error('Failed to load featured products', error);
            }
            finally {
                setLoading(false);
            }
        });
    };
    const handleProductClick = (product) => {
        trackCustom('FeaturedProductCard', 'click', {
            productId: product.id,
            productName: product.name,
            price: product.price,
        });
    };
    if (loading) {
        return (0, jsx_runtime_1.jsx)(LoadingSpinner, {});
    }
    return ((0, jsx_runtime_1.jsxs)('section', { className: 'featured-products', children: [(0, jsx_runtime_1.jsx)('h2', { children: 'Featured Products' }), (0, jsx_runtime_1.jsx)('div', { className: 'products-grid', children: products.map(product => ((0, jsx_runtime_1.jsxs)(react_2.TrackedCard, { title: product.name, trackingName: 'featured-product-card', trackingMetadata: { productId: product.id }, onClick: () => handleProductClick(product), children: [(0, jsx_runtime_1.jsx)('img', { src: product.image, alt: product.name }), (0, jsx_runtime_1.jsxs)('p', { className: 'price', children: ['$', product.price] })] }, product.id))) })] }));
}
// Newsletter signup con form tracking
function NewsletterSignup() {
    const [email, setEmail] = (0, react_1.useState)('');
    const [subscribed, setSubscribed] = (0, react_1.useState)(false);
    const { logger } = (0, react_2.useObservability)();
    const { trackCustom } = (0, react_2.useEventTracking)();
    const handleSubmit = async(e) => {
        e.preventDefault();
        trackCustom('NewsletterForm', 'submit', { email: email.includes('@') });
        try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubscribed(true);
            logger.info('Newsletter subscription successful', { email });
        }
        catch (error) {
            logger.error('Newsletter subscription failed', error);
        }
    };
    if (subscribed) {
        return ((0, jsx_runtime_1.jsx)('section', { className: 'newsletter-success', children: (0, jsx_runtime_1.jsx)('h3', { children: 'Thanks for subscribing!' }) }));
    }
    return ((0, jsx_runtime_1.jsxs)('section', { className: 'newsletter', children: [(0, jsx_runtime_1.jsx)('h3', { children: 'Stay Updated' }), (0, jsx_runtime_1.jsxs)('form', { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)(react_2.TrackedInput, { type: 'email', placeholder: 'Enter your email', value: email, onChange: e => setEmail(e.target.value), trackingName: 'newsletter-email-input', required: true }), (0, jsx_runtime_1.jsx)(react_2.TrackedButton, { type: 'submit', variant: 'secondary', trackingName: 'newsletter-submit-button', children: 'Subscribe' })] })] }));
}
// Página de productos con filtros y búsqueda
const ProductsPage = (0, react_2.withObservability)(function ProductsPage() {
    const [filters, setFilters] = (0, react_1.useState)({
        category: 'all',
        priceRange: 'all',
        sortBy: 'relevance',
    });
    const { trackCustom } = (0, react_2.useEventTracking)();
    const handleFilterChange = (filterType, value) => {
        trackCustom('ProductFilters', 'change', {
            filterType,
            value,
            previousValue: filters[filterType],
        });
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };
    return ((0, jsx_runtime_1.jsxs)('div', { className: 'products-page', children: [(0, jsx_runtime_1.jsx)('h1', { children: 'All Products' }), (0, jsx_runtime_1.jsx)(react_2.TrackedTabs, { trackingName: 'product-categories', tabs: [
                    { id: 'all', label: 'All Products', content: (0, jsx_runtime_1.jsx)(ProductGrid, { filters: filters }) },
                    {
                        id: 'artisan',
                        label: 'Artisan Crafts',
                        content: (0, jsx_runtime_1.jsx)(ProductGrid, { filters: { ...filters, category: 'artisan' } }),
                    },
                    {
                        id: 'coffee',
                        label: 'Coffee',
                        content: (0, jsx_runtime_1.jsx)(ProductGrid, { filters: { ...filters, category: 'coffee' } }),
                    },
                    {
                        id: 'textiles',
                        label: 'Textiles',
                        content: (0, jsx_runtime_1.jsx)(ProductGrid, { filters: { ...filters, category: 'textiles' } }),
                    },
                ] })] }));
}, 'ProductsPage');
// Grid de productos con lazy loading
function ProductGrid({ filters }) {
    const [products, setProducts] = (0, react_1.useState)([]);
    const [page, setPage] = (0, react_1.useState)(1);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const { measurePerformance } = (0, react_2.useObservability)();
    const { trackCustom } = (0, react_2.useEventTracking)();
    (0, react_1.useEffect)(() => {
        loadProducts();
    }, [filters, page]);
    const loadProducts = async() => {
        setLoading(true);
        await measurePerformance('ProductGrid.loadProducts', async() => {
            try {
                // Simular carga de productos
                await new Promise(resolve => setTimeout(resolve, 500));
                const newProducts = Array.from({ length: 12 }, (_, i) => ({
                    id: `product-${page}-${i}`,
                    name: `Product ${page * 12 + i}`,
                    price: Math.floor(Math.random() * 100) + 20,
                    image: `https://via.placeholder.com/300x300?text=Product+${i}`,
                }));
                setProducts(prev => (page === 1 ? newProducts : [...prev, ...newProducts]));
            }
            finally {
                setLoading(false);
            }
        });
    };
    const handleLoadMore = () => {
        trackCustom('ProductGrid', 'load_more', { currentPage: page });
        setPage(prev => prev + 1);
    };
    return ((0, jsx_runtime_1.jsxs)('div', { className: 'product-grid', children: [products.map(product => ((0, jsx_runtime_1.jsx)(ProductCard, { product: product }, product.id))), !loading && ((0, jsx_runtime_1.jsx)(react_2.TrackedButton, { onClick: handleLoadMore, variant: 'ghost', trackingName: 'load-more-products', children: 'Load More' })), loading && (0, jsx_runtime_1.jsx)(LoadingSpinner, {})] }));
}
// Tarjeta de producto individual
function ProductCard({ product }) {
    const [showQuickView, setShowQuickView] = (0, react_1.useState)(false);
    const { trackClick } = (0, react_2.useEventTracking)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleAddToCart = (e) => {
        e.stopPropagation();
        trackClick('add-to-cart', {
            productId: product.id,
            productName: product.name,
            price: product.price,
        });
        // Lógica de agregar al carrito
    };
    const handleQuickView = (e) => {
        e.stopPropagation();
        setShowQuickView(true);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(react_2.TrackedCard, { trackingName: 'product-card', trackingMetadata: { productId: product.id }, onClick: () => navigate(`/products/${product.id}`), children: [(0, jsx_runtime_1.jsx)('img', { src: product.image, alt: product.name }), (0, jsx_runtime_1.jsx)('h3', { children: product.name }), (0, jsx_runtime_1.jsxs)('p', { className: 'price', children: ['$', product.price] }), (0, jsx_runtime_1.jsxs)('div', { className: 'actions', children: [(0, jsx_runtime_1.jsx)(react_2.TrackedButton, { size: 'small', onClick: handleAddToCart, trackingName: 'add-to-cart-button', trackingMetadata: { productId: product.id }, children: 'Add to Cart' }), (0, jsx_runtime_1.jsx)(react_2.TrackedButton, { size: 'small', variant: 'ghost', onClick: handleQuickView, trackingName: 'quick-view-button', children: 'Quick View' })] })] }), (0, jsx_runtime_1.jsxs)(react_2.TrackedModal, { isOpen: showQuickView, onClose: () => setShowQuickView(false), title: product.name, trackingName: 'product-quick-view', trackingMetadata: { productId: product.id }, children: [(0, jsx_runtime_1.jsx)('img', { src: product.image, alt: product.name }), (0, jsx_runtime_1.jsx)('p', { children: product.description || 'Beautiful artisan product from Colombia' }), (0, jsx_runtime_1.jsxs)('p', { className: 'price', children: ['$', product.price] }), (0, jsx_runtime_1.jsx)(react_2.TrackedButton, { onClick: handleAddToCart, trackingName: 'quick-view-add-to-cart', children: 'Add to Cart' })] })] }));
}
// Página de checkout con tracking detallado
function CheckoutPage() {
    const [step, setStep] = (0, react_1.useState)(1);
    const { logger } = (0, react_2.useObservability)();
    const { trackCustom } = (0, react_2.useEventTracking)();
    (0, react_2.useComponentTracking)('CheckoutPage', {
        trackProps: ['step'],
    });
    const handleStepComplete = (stepNumber) => {
        trackCustom('CheckoutFlow', 'step_completed', {
            step: stepNumber,
            nextStep: stepNumber + 1,
        });
        setStep(stepNumber + 1);
        logger.info('Checkout step completed', { step: stepNumber });
    };
    return ((0, jsx_runtime_1.jsxs)('div', { className: 'checkout-page', children: [(0, jsx_runtime_1.jsx)('h1', { children: 'Checkout' }), (0, jsx_runtime_1.jsxs)('div', { className: 'checkout-progress', children: [(0, jsx_runtime_1.jsx)('div', { className: `step ${step >= 1 ? 'active' : ''}`, children: '1. Shipping' }), (0, jsx_runtime_1.jsx)('div', { className: `step ${step >= 2 ? 'active' : ''}`, children: '2. Payment' }), (0, jsx_runtime_1.jsx)('div', { className: `step ${step >= 3 ? 'active' : ''}`, children: '3. Review' })] }), step === 1 && (0, jsx_runtime_1.jsx)(ShippingStep, { onComplete: () => handleStepComplete(1) }), step === 2 && (0, jsx_runtime_1.jsx)(PaymentStep, { onComplete: () => handleStepComplete(2) }), step === 3 && (0, jsx_runtime_1.jsx)(ReviewStep, { onComplete: () => handleStepComplete(3) })] }));
}
// Componentes auxiliares
function LoadingSpinner() {
    return (0, jsx_runtime_1.jsx)('div', { className: 'loading-spinner', children: 'Loading...' });
}
function ShippingStep({ onComplete }) {
    const [address, setAddress] = (0, react_1.useState)({
        street: '',
        city: '',
        zip: '',
    });
    return ((0, jsx_runtime_1.jsxs)('div', { className: 'shipping-step', children: [(0, jsx_runtime_1.jsx)('h2', { children: 'Shipping Information' }), (0, jsx_runtime_1.jsx)(react_2.TrackedInput, { label: 'Street Address', value: address.street, onChange: e => setAddress(prev => ({ ...prev, street: e.target.value })), trackingName: 'shipping-street' }), (0, jsx_runtime_1.jsx)(react_2.TrackedInput, { label: 'City', value: address.city, onChange: e => setAddress(prev => ({ ...prev, city: e.target.value })), trackingName: 'shipping-city' }), (0, jsx_runtime_1.jsx)(react_2.TrackedInput, { label: 'ZIP Code', value: address.zip, onChange: e => setAddress(prev => ({ ...prev, zip: e.target.value })), trackingName: 'shipping-zip' }), (0, jsx_runtime_1.jsx)(react_2.TrackedButton, { onClick: onComplete, trackingName: 'continue-to-payment', children: 'Continue to Payment' })] }));
}
function PaymentStep({ onComplete }) {
    return ((0, jsx_runtime_1.jsxs)('div', { className: 'payment-step', children: [(0, jsx_runtime_1.jsx)('h2', { children: 'Payment Information' }), (0, jsx_runtime_1.jsx)(react_2.TrackedButton, { onClick: onComplete, children: 'Continue to Review' })] }));
}
function ReviewStep({ onComplete }) {
    return ((0, jsx_runtime_1.jsxs)('div', { className: 'review-step', children: [(0, jsx_runtime_1.jsx)('h2', { children: 'Review Your Order' }), (0, jsx_runtime_1.jsx)(react_2.TrackedButton, { onClick: onComplete, variant: 'primary', children: 'Place Order' })] }));
}
function ProfilePage() {
    return (0, jsx_runtime_1.jsx)('div', { children: 'Profile Page' });
}
// Renderizar la aplicación
const root = client_1.default.createRoot(document.getElementById('root'));
root.render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(App, {}) }));
//# sourceMappingURL=react-app-setup.js.map
