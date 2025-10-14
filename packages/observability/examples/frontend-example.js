<<<<<<< HEAD
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const jsx_runtime_1 = require('react/jsx-runtime');
const react_1 = require('react');
const frontend_1 = require('../src/frontend');
const design_system_1 = require('../src/design-system');
=======
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const frontend_1 = require("../src/frontend");
const design_system_1 = require("../src/design-system");
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
// Inicializar observabilidad del frontend
(0, frontend_1.initializeFrontendObservability)({
    serviceName: 'dashboard-web',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoint: process.env.REACT_APP_LOG_ENDPOINT || 'http://localhost:3000/api/logs',
    level: 'info',
}, {
    serviceName: 'dashboard-web',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoint: process.env.REACT_APP_TRACE_ENDPOINT || 'http://localhost:4318/v1/traces',
    enableConsoleExporter: process.env.NODE_ENV === 'development',
});
// Cliente HTTP con observabilidad
const apiClient = (0, frontend_1.createObservableFetch)(process.env.REACT_APP_API_BASE_URL);
// Componente de lista de productos con observabilidad
<<<<<<< HEAD
const ProductList = (0, frontend_1.withObservability)(({ products, onProductSelect }) => {
=======
const ProductList = (0, frontend_1.withObservability)(({ products, onProductSelect, }) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    const { logUIEvent } = (0, frontend_1.useUILogger)();
    const { createChildSpan } = (0, frontend_1.useComponentTracing)('ProductList');
    const { renderCount } = (0, design_system_1.useDSPerformanceTracking)('ProductList');
    const handleProductClick = (product) => {
        const span = createChildSpan('product_select');
        if (span) {
            span.setAttributes({
                'product.id': product.id,
                'product.name': product.name,
                'product.price': product.price,
            });
            span.end();
        }
        logUIEvent({
            component: 'ProductList',
            action: 'product_select',
            props: {
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
            },
        });
        onProductSelect(product);
    };
<<<<<<< HEAD
    return ((0, jsx_runtime_1.jsxs)('div', { className: 'product-list', children: [(0, jsx_runtime_1.jsxs)('h2', { children: ['Productos (', products.length, ')'] }), products.map(product => ((0, jsx_runtime_1.jsxs)(design_system_1.ObservableCard, { variant: 'elevated', size: 'md', onInteraction: (action, data) => {
=======
    return ((0, jsx_runtime_1.jsxs)("div", { className: "product-list", children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Productos (", products.length, ")"] }), products.map(product => ((0, jsx_runtime_1.jsxs)(design_system_1.ObservableCard, { variant: "elevated", size: "md", onInteraction: (action, data) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
                    logUIEvent({
                        component: 'ProductCard',
                        action,
                        props: { productId: product.id, ...data },
                    });
<<<<<<< HEAD
                }, onClick: () => handleProductClick(product), children: [(0, jsx_runtime_1.jsx)('h3', { children: product.name }), (0, jsx_runtime_1.jsxs)('p', { children: ['Precio: $', product.price] }), (0, jsx_runtime_1.jsxs)('p', { children: ['Stock: ', product.stock] })] }, product.id)))] }));
}, 'ProductList');
// Componente de formulario de producto con observabilidad
const ProductForm = (0, frontend_1.withObservability)(({ onSubmit, initialData }) => {
=======
                }, onClick: () => handleProductClick(product), children: [(0, jsx_runtime_1.jsx)("h3", { children: product.name }), (0, jsx_runtime_1.jsxs)("p", { children: ["Precio: $", product.price] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Stock: ", product.stock] })] }, product.id)))] }));
}, 'ProductList');
// Componente de formulario de producto con observabilidad
const ProductForm = (0, frontend_1.withObservability)(({ onSubmit, initialData, }) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    const { logUIEvent } = (0, frontend_1.useUILogger)();
    const { createChildSpan } = (0, frontend_1.useComponentTracing)('ProductForm');
    const { logInteraction } = (0, design_system_1.useDSObservability)('ProductForm');
    const [formData, setFormData] = (0, react_1.useState)({
        name: initialData?.name || '',
        price: initialData?.price || 0,
        stock: initialData?.stock || 0,
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        const span = createChildSpan('form_submit');
        if (span) {
            span.setAttributes({
                'form.data': JSON.stringify(formData),
            });
            span.end();
        }
        logUIEvent({
            component: 'ProductForm',
            action: 'form_submit',
            props: formData,
        });
        onSubmit(formData);
    };
    const handleInputChange = (field, value) => {
        logInteraction('input_change', { field, value });
        setFormData(prev => ({ ...prev, [field]: value }));
    };
<<<<<<< HEAD
    return ((0, jsx_runtime_1.jsxs)('form', { onSubmit: handleSubmit, className: 'product-form', children: [(0, jsx_runtime_1.jsx)('h2', { children: initialData ? 'Editar Producto' : 'Crear Producto' }), (0, jsx_runtime_1.jsxs)('div', { className: 'form-group', children: [(0, jsx_runtime_1.jsx)('label', { htmlFor: 'name', children: 'Nombre:' }), (0, jsx_runtime_1.jsx)(design_system_1.ObservableInput, { id: 'name', type: 'text', value: formData.name, onChange: e => handleInputChange('name', e.target.value), variant: 'default', size: 'md', required: true })] }), (0, jsx_runtime_1.jsxs)('div', { className: 'form-group', children: [(0, jsx_runtime_1.jsx)('label', { htmlFor: 'price', children: 'Precio:' }), (0, jsx_runtime_1.jsx)(design_system_1.ObservableInput, { id: 'price', type: 'number', value: formData.price, onChange: e => handleInputChange('price', parseFloat(e.target.value)), variant: 'default', size: 'md', required: true })] }), (0, jsx_runtime_1.jsxs)('div', { className: 'form-group', children: [(0, jsx_runtime_1.jsx)('label', { htmlFor: 'stock', children: 'Stock:' }), (0, jsx_runtime_1.jsx)(design_system_1.ObservableInput, { id: 'stock', type: 'number', value: formData.stock, onChange: e => handleInputChange('stock', parseInt(e.target.value)), variant: 'default', size: 'md', required: true })] }), (0, jsx_runtime_1.jsxs)(design_system_1.ObservableButton, { type: 'submit', variant: 'primary', size: 'lg', onInteraction: (action, data) => {
=======
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "product-form", children: [(0, jsx_runtime_1.jsx)("h2", { children: initialData ? 'Editar Producto' : 'Crear Producto' }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "name", children: "Nombre:" }), (0, jsx_runtime_1.jsx)(design_system_1.ObservableInput, { id: "name", type: "text", value: formData.name, onChange: e => handleInputChange('name', e.target.value), variant: "default", size: "md", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "price", children: "Precio:" }), (0, jsx_runtime_1.jsx)(design_system_1.ObservableInput, { id: "price", type: "number", value: formData.price, onChange: e => handleInputChange('price', parseFloat(e.target.value)), variant: "default", size: "md", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "stock", children: "Stock:" }), (0, jsx_runtime_1.jsx)(design_system_1.ObservableInput, { id: "stock", type: "number", value: formData.stock, onChange: e => handleInputChange('stock', parseInt(e.target.value)), variant: "default", size: "md", required: true })] }), (0, jsx_runtime_1.jsxs)(design_system_1.ObservableButton, { type: "submit", variant: "primary", size: "lg", onInteraction: (action, data) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
                    logUIEvent({
                        component: 'ProductForm',
                        action: 'button_click',
                        props: { buttonType: 'submit', ...data },
                    });
<<<<<<< HEAD
                }, children: [initialData ? 'Actualizar' : 'Crear', ' Producto'] })] }));
=======
                }, children: [initialData ? 'Actualizar' : 'Crear', " Producto"] })] }));
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
}, 'ProductForm');
// Componente principal de la aplicación
const App = () => {
    const { logError } = (0, frontend_1.useErrorLogger)();
    const { logUIEvent } = (0, frontend_1.useUILogger)();
    const { createChildSpan } = (0, frontend_1.useComponentTracing)('App');
    const { renderCount } = (0, design_system_1.useDSPerformanceTracking)('App');
    const [products, setProducts] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [selectedProduct, setSelectedProduct] = (0, react_1.useState)(null);
    const [showForm, setShowForm] = (0, react_1.useState)(false);
    // Cargar productos al montar el componente
    (0, react_1.useEffect)(() => {
<<<<<<< HEAD
        const loadProducts = async() => {
=======
        const loadProducts = async () => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
            const span = createChildSpan('load_products');
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient('/products');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data.products || []);
                logUIEvent({
                    component: 'App',
                    action: 'products_loaded',
                    props: { count: data.products?.length || 0 },
                });
                // Registrar métrica de performance
                (0, design_system_1.logDSMetric)('App', 'products_load_time', performance.now(), {
                    count: data.products?.length || 0,
                });
            }
            catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                logError(error, 'loadProducts');
                setError('Error al cargar productos');
                // Registrar error del DS
                (0, design_system_1.logDSError)('App', error, {
                    operation: 'load_products',
                    timestamp: new Date().toISOString(),
                });
            }
            finally {
                setLoading(false);
                if (span)
                    span.end();
            }
        };
        loadProducts();
    }, [createChildSpan, logUIEvent, logError]);
    // Manejar creación/actualización de producto
<<<<<<< HEAD
    const handleProductSubmit = async(productData) => {
=======
    const handleProductSubmit = async (productData) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        const span = createChildSpan('product_submit');
        try {
            const url = selectedProduct ? `/products/${selectedProduct.id}` : '/products';
            const method = selectedProduct ? 'PUT' : 'POST';
            const response = await apiClient(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            logUIEvent({
                component: 'App',
                action: selectedProduct ? 'product_updated' : 'product_created',
                props: { productId: result.productId },
            });
            // Recargar productos
            const productsResponse = await apiClient('/products');
            const productsData = await productsResponse.json();
            setProducts(productsData.products || []);
            setShowForm(false);
            setSelectedProduct(null);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            logError(error, 'productSubmit');
            setError('Error al guardar producto');
            (0, design_system_1.logDSError)('App', error, {
                operation: 'product_submit',
                productData,
            });
        }
        finally {
            if (span)
                span.end();
        }
    };
    // Manejar selección de producto
    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setShowForm(true);
        logUIEvent({
            component: 'App',
            action: 'product_selected',
            props: { productId: product.id },
        });
    };
    // Manejar creación de nuevo producto
    const handleCreateNew = () => {
        setSelectedProduct(null);
        setShowForm(true);
        logUIEvent({
            component: 'App',
            action: 'create_new_product',
        });
    };
    if (loading) {
<<<<<<< HEAD
        return ((0, jsx_runtime_1.jsx)('div', { className: 'loading', children: (0, jsx_runtime_1.jsx)(design_system_1.ObservableCard, { variant: 'default', size: 'md', children: (0, jsx_runtime_1.jsx)('p', { children: 'Cargando productos...' }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)('div', { className: 'app', children: [(0, jsx_runtime_1.jsxs)('header', { className: 'app-header', children: [(0, jsx_runtime_1.jsx)('h1', { children: 'Dashboard de Productos' }), (0, jsx_runtime_1.jsx)(design_system_1.ObservableButton, { variant: 'primary', size: 'md', onClick: handleCreateNew, onInteraction: (action, data) => {
=======
        return ((0, jsx_runtime_1.jsx)("div", { className: "loading", children: (0, jsx_runtime_1.jsx)(design_system_1.ObservableCard, { variant: "default", size: "md", children: (0, jsx_runtime_1.jsx)("p", { children: "Cargando productos..." }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app", children: [(0, jsx_runtime_1.jsxs)("header", { className: "app-header", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Dashboard de Productos" }), (0, jsx_runtime_1.jsx)(design_system_1.ObservableButton, { variant: "primary", size: "md", onClick: handleCreateNew, onInteraction: (action, data) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
                            logUIEvent({
                                component: 'App',
                                action: 'header_button_click',
                                props: data,
                            });
<<<<<<< HEAD
                        }, children: 'Nuevo Producto' })] }), error && ((0, jsx_runtime_1.jsx)('div', { className: 'error', children: (0, jsx_runtime_1.jsxs)(design_system_1.ObservableCard, { variant: 'outlined', size: 'md', children: [(0, jsx_runtime_1.jsxs)('p', { children: ['Error: ', error] }), (0, jsx_runtime_1.jsx)(design_system_1.ObservableButton, { variant: 'secondary', size: 'sm', onClick: () => setError(null), children: 'Cerrar' })] }) })), (0, jsx_runtime_1.jsx)('main', { className: 'app-main', children: showForm ? ((0, jsx_runtime_1.jsx)(ProductForm, { onSubmit: handleProductSubmit, initialData: selectedProduct || undefined })) : ((0, jsx_runtime_1.jsx)(ProductList, { products: products, onProductSelect: handleProductSelect })) }), (0, jsx_runtime_1.jsx)('footer', { className: 'app-footer', children: (0, jsx_runtime_1.jsxs)(design_system_1.ObservableCard, { variant: 'default', size: 'sm', children: [(0, jsx_runtime_1.jsxs)('p', { children: ['Renderizado ', renderCount, ' veces'] }), (0, jsx_runtime_1.jsxs)('p', { children: ['Productos: ', products.length] })] }) })] }));
};
exports.default = App;
//# sourceMappingURL=frontend-example.js.map
=======
                        }, children: "Nuevo Producto" })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "error", children: (0, jsx_runtime_1.jsxs)(design_system_1.ObservableCard, { variant: "outlined", size: "md", children: [(0, jsx_runtime_1.jsxs)("p", { children: ["Error: ", error] }), (0, jsx_runtime_1.jsx)(design_system_1.ObservableButton, { variant: "secondary", size: "sm", onClick: () => setError(null), children: "Cerrar" })] }) })), (0, jsx_runtime_1.jsx)("main", { className: "app-main", children: showForm ? ((0, jsx_runtime_1.jsx)(ProductForm, { onSubmit: handleProductSubmit, initialData: selectedProduct || undefined })) : ((0, jsx_runtime_1.jsx)(ProductList, { products: products, onProductSelect: handleProductSelect })) }), (0, jsx_runtime_1.jsx)("footer", { className: "app-footer", children: (0, jsx_runtime_1.jsxs)(design_system_1.ObservableCard, { variant: "default", size: "sm", children: [(0, jsx_runtime_1.jsxs)("p", { children: ["Renderizado ", renderCount, " veces"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Productos: ", products.length] })] }) })] }));
};
exports.default = App;
//# sourceMappingURL=frontend-example.js.map
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
