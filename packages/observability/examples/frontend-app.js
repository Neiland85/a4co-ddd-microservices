"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Root;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Example: React frontend application with full observability
 */
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const observability_1 = require("@a4co/observability");
// Initialize observability
const logger = (0, observability_1.createFrontendLogger)({
    service: 'web-app',
    environment: process.env.REACT_APP_ENV || 'development',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    endpoint: '/api/logs',
    bufferSize: 100,
    flushInterval: 5000,
    enableConsole: process.env.NODE_ENV === 'development',
});
// Initialize tracer
(0, observability_1.initializeWebTracer)({
    serviceName: 'web-app',
    serviceVersion: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.REACT_APP_ENV || 'development',
    collectorUrl: process.env.REACT_APP_OTEL_COLLECTOR_URL || 'http://localhost:4318/v1/traces',
    logger,
});
// Create instrumented HTTP client
const httpClient = (0, observability_1.createFetchWrapper)({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    logger,
    propagateTrace: true,
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
});
// Product List Component with observability
const ProductList = (0, observability_1.withTracing)((0, observability_1.withLogging)(({ onProductSelect }) => {
    const componentLogger = (0, observability_1.useComponentLogger)('ProductList');
    const { logRequest, logResponse, logError } = (0, observability_1.useApiLogger)();
    const [products, setProducts] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        fetchProducts();
    }, []);
    const fetchProducts = async () => {
        const startTime = logRequest({
            method: 'GET',
            url: '/api/products',
        });
        try {
            setLoading(true);
            const response = await httpClient.get('/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            logResponse(startTime, {
                method: 'GET',
                url: '/api/products',
            }, response);
            componentLogger.info('Products loaded successfully', {
                custom: {
                    productCount: data.length,
                    categories: [...new Set(data.map((p) => p.category))],
                },
            });
            setProducts(data);
            setError(null);
        }
        catch (err) {
            const error = err;
            logError(startTime, {
                method: 'GET',
                url: '/api/products',
            }, error);
            componentLogger.error('Failed to load products', error);
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return (0, jsx_runtime_1.jsx)("div", { children: "Loading products..." });
    if (error)
        return (0, jsx_runtime_1.jsxs)("div", { children: ["Error: ", error] });
    return ((0, jsx_runtime_1.jsx)("div", { className: "product-grid", children: products.map(product => ((0, jsx_runtime_1.jsx)(ProductCard, { product: product, onSelect: onProductSelect }, product.id))) }));
}), { componentName: 'ProductList' });
// Product Card with observable interactions
function ProductCard({ product, onSelect, }) {
    const logInteraction = (0, observability_1.useInteractionLogger)('product.card', {
        throttle: 1000,
    });
    const handleClick = () => {
        logInteraction({
            action: 'select',
            productId: product.id,
            productName: product.name,
            price: product.price,
        });
        onSelect(product);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "product-card", onClick: handleClick, children: [(0, jsx_runtime_1.jsx)("img", { src: product.image, alt: product.name }), (0, jsx_runtime_1.jsx)("h3", { children: product.name }), (0, jsx_runtime_1.jsxs)("p", { children: ["$", product.price] }), (0, jsx_runtime_1.jsx)(observability_1.ObservableButton, { variant: "primary", size: "medium", trackingId: `add-to-cart-${product.id}`, trackingMetadata: {
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    category: product.category,
                }, onClick: e => {
                    e.stopPropagation();
                    // Add to cart logic
                }, children: "Add to Cart" })] }));
}
// Checkout Form with observability
function CheckoutForm({ cart }) {
    const logger = (0, observability_1.useLogger)();
    const { startApiTrace, endApiTrace } = (0, observability_1.useApiTracing)();
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const orderData = {
            items: cart,
            customer: {
                email: formData.get('email'),
                name: formData.get('name'),
                address: formData.get('address'),
            },
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
        const traceId = startApiTrace('create-order', {
            itemCount: cart.length,
            orderTotal: orderData.total,
        });
        try {
            setSubmitting(true);
            const response = await httpClient.post('/api/orders', orderData);
            const result = await response.json();
            endApiTrace(traceId, true, {
                orderId: result.orderId,
                status: result.status,
            });
            logger.info('Order placed successfully', {
                custom: {
                    orderId: result.orderId,
                    itemCount: cart.length,
                    total: orderData.total,
                },
            });
            // Success handling
        }
        catch (error) {
            endApiTrace(traceId, false, {
                error: error.message,
            });
            logger.error('Order submission failed', error);
            // Error handling
        }
        finally {
            setSubmitting(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(observability_1.ObservableForm, { formId: "checkout-form", trackFieldChanges: true, trackingMetadata: {
            cartSize: cart.length,
            cartValue: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }, onSubmit: handleSubmit, onSubmitSuccess: data => {
            logger.info('Checkout form submitted', { custom: data });
        }, onSubmitError: error => {
            logger.error('Checkout form error', error);
        }, children: [(0, jsx_runtime_1.jsx)("input", { name: "email", type: "email", placeholder: "Email", required: true }), (0, jsx_runtime_1.jsx)("input", { name: "name", type: "text", placeholder: "Full Name", required: true }), (0, jsx_runtime_1.jsx)("textarea", { name: "address", placeholder: "Shipping Address", required: true }), (0, jsx_runtime_1.jsx)(observability_1.ObservableButton, { type: "submit", variant: "primary", size: "large", loading: submitting, trackingId: "submit-order", trackingMetadata: {
                    formId: 'checkout-form',
                    cartSize: cart.length,
                }, children: "Place Order" })] }));
}
// Main App with route tracking
function App() {
    const location = (0, react_router_dom_1.useLocation)();
    const [selectedProduct, setSelectedProduct] = (0, react_1.useState)(null);
    const [cart, setCart] = (0, react_1.useState)([]);
    // Track route changes
    (0, observability_1.useRouteTracing)(location.pathname);
    return ((0, jsx_runtime_1.jsx)(observability_1.LoggingErrorBoundary, { fallback: ({ error }) => ((0, jsx_runtime_1.jsxs)("div", { className: "error-page", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Something went wrong" }), (0, jsx_runtime_1.jsx)("p", { children: error?.message })] })), children: (0, jsx_runtime_1.jsx)("div", { className: "app", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(ProductList, { onProductSelect: setSelectedProduct }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/product/:id", element: selectedProduct ? ((0, jsx_runtime_1.jsx)(ProductDetail, { product: selectedProduct })) : ((0, jsx_runtime_1.jsx)("div", { children: "Product not found" })) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/checkout", element: (0, jsx_runtime_1.jsx)(CheckoutForm, { cart: cart }) })] }) }) }));
}
// Product Detail Page
function ProductDetail({ product }) {
    const componentLogger = (0, observability_1.useComponentLogger)('ProductDetail', { productId: product.id });
    (0, react_1.useEffect)(() => {
        componentLogger.info('Product detail viewed', {
            custom: {
                productId: product.id,
                productName: product.name,
                price: product.price,
            },
        });
    }, [product]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "product-detail", children: [(0, jsx_runtime_1.jsx)("img", { src: product.image, alt: product.name }), (0, jsx_runtime_1.jsx)("h1", { children: product.name }), (0, jsx_runtime_1.jsx)("p", { children: product.description }), (0, jsx_runtime_1.jsxs)("p", { className: "price", children: ["$", product.price] }), (0, jsx_runtime_1.jsx)(observability_1.ObservableButton, { variant: "primary", size: "large", trackingId: `buy-now-${product.id}`, trackingMetadata: {
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    action: 'buy-now',
                }, children: "Buy Now" })] }));
}
// Root component with providers
function Root() {
    return ((0, jsx_runtime_1.jsx)(observability_1.TracingProvider, { serviceName: "web-app", serviceVersion: process.env.REACT_APP_VERSION || '1.0.0', environment: process.env.REACT_APP_ENV || 'development', children: (0, jsx_runtime_1.jsx)(observability_1.LoggerProvider, { logger: logger, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(App, {}) }) }) }));
}
//# sourceMappingURL=frontend-app.js.map