"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var frontend_1 = require("../src/frontend");
var design_system_1 = require("../src/design-system");
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
var apiClient = (0, frontend_1.createObservableFetch)(process.env.REACT_APP_API_BASE_URL);
// Componente de lista de productos con observabilidad
var ProductList = (0, frontend_1.withObservability)(function (_a) {
    var products = _a.products, onProductSelect = _a.onProductSelect;
    var logUIEvent = (0, frontend_1.useUILogger)().logUIEvent;
    var createChildSpan = (0, frontend_1.useComponentTracing)('ProductList').createChildSpan;
    var renderCount = (0, design_system_1.useDSPerformanceTracking)('ProductList').renderCount;
    var handleProductClick = function (product) {
        var span = createChildSpan('product_select');
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
    return (<div className="product-list">
        <h2>Productos ({products.length})</h2>
        {products.map(function (product) { return (<design_system_1.ObservableCard key={product.id} variant="elevated" size="md" onInteraction={function (action, data) {
                logUIEvent({
                    component: 'ProductCard',
                    action: action,
                    props: __assign({ productId: product.id }, data),
                });
            }} onClick={function () { return handleProductClick(product); }}>
            <h3>{product.name}</h3>
            <p>Precio: ${product.price}</p>
            <p>Stock: {product.stock}</p>
          </design_system_1.ObservableCard>); })}
      </div>);
}, 'ProductList');
// Componente de formulario de producto con observabilidad
var ProductForm = (0, frontend_1.withObservability)(function (_a) {
    var onSubmit = _a.onSubmit, initialData = _a.initialData;
    var logUIEvent = (0, frontend_1.useUILogger)().logUIEvent;
    var createChildSpan = (0, frontend_1.useComponentTracing)('ProductForm').createChildSpan;
    var logInteraction = (0, design_system_1.useDSObservability)('ProductForm').logInteraction;
    var _b = (0, react_1.useState)({
        name: (initialData === null || initialData === void 0 ? void 0 : initialData.name) || '',
        price: (initialData === null || initialData === void 0 ? void 0 : initialData.price) || 0,
        stock: (initialData === null || initialData === void 0 ? void 0 : initialData.stock) || 0,
    }), formData = _b[0], setFormData = _b[1];
    var handleSubmit = function (e) {
        e.preventDefault();
        var span = createChildSpan('form_submit');
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
    var handleInputChange = function (field, value) {
        logInteraction('input_change', { field: field, value: value });
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
    };
    return (<form onSubmit={handleSubmit} className="product-form">
        <h2>{initialData ? 'Editar Producto' : 'Crear Producto'}</h2>
        
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <design_system_1.ObservableInput id="name" type="text" value={formData.name} onChange={function (e) { return handleInputChange('name', e.target.value); }} variant="default" size="md" required/>
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio:</label>
          <design_system_1.ObservableInput id="price" type="number" value={formData.price} onChange={function (e) { return handleInputChange('price', parseFloat(e.target.value)); }} variant="default" size="md" required/>
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <design_system_1.ObservableInput id="stock" type="number" value={formData.stock} onChange={function (e) { return handleInputChange('stock', parseInt(e.target.value)); }} variant="default" size="md" required/>
        </div>

        <design_system_1.ObservableButton type="submit" variant="primary" size="lg" onInteraction={function (action, data) {
            logUIEvent({
                component: 'ProductForm',
                action: 'button_click',
                props: __assign({ buttonType: 'submit' }, data),
            });
        }}>
          {initialData ? 'Actualizar' : 'Crear'} Producto
        </design_system_1.ObservableButton>
      </form>);
}, 'ProductForm');
// Componente principal de la aplicación
var App = function () {
    var logError = (0, frontend_1.useErrorLogger)().logError;
    var logUIEvent = (0, frontend_1.useUILogger)().logUIEvent;
    var createChildSpan = (0, frontend_1.useComponentTracing)('App').createChildSpan;
    var renderCount = (0, design_system_1.useDSPerformanceTracking)('App').renderCount;
    var _a = (0, react_1.useState)([]), products = _a[0], setProducts = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(null), selectedProduct = _d[0], setSelectedProduct = _d[1];
    var _e = (0, react_1.useState)(false), showForm = _e[0], setShowForm = _e[1];
    // Cargar productos al montar el componente
    (0, react_1.useEffect)(function () {
        var loadProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
            var span, response, data, err_1, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        span = createChildSpan('load_products');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, 5, 6]);
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, apiClient('/products')];
                    case 2:
                        response = _c.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _c.sent();
                        setProducts(data.products || []);
                        logUIEvent({
                            component: 'App',
                            action: 'products_loaded',
                            props: { count: ((_a = data.products) === null || _a === void 0 ? void 0 : _a.length) || 0 },
                        });
                        // Registrar métrica de performance
                        (0, design_system_1.logDSMetric)('App', 'products_load_time', performance.now(), {
                            count: ((_b = data.products) === null || _b === void 0 ? void 0 : _b.length) || 0,
                        });
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _c.sent();
                        error_1 = err_1 instanceof Error ? err_1 : new Error(String(err_1));
                        logError(error_1, 'loadProducts');
                        setError('Error al cargar productos');
                        // Registrar error del DS
                        (0, design_system_1.logDSError)('App', error_1, {
                            operation: 'load_products',
                            timestamp: new Date().toISOString(),
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        if (span)
                            span.end();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        loadProducts();
    }, [createChildSpan, logUIEvent, logError]);
    // Manejar creación/actualización de producto
    var handleProductSubmit = function (productData) { return __awaiter(void 0, void 0, void 0, function () {
        var span, url, method, response, result, productsResponse, productsData, err_2, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    span = createChildSpan('product_submit');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    url = selectedProduct
                        ? "/products/".concat(selectedProduct.id)
                        : '/products';
                    method = selectedProduct ? 'PUT' : 'POST';
                    return [4 /*yield*/, apiClient(url, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(productData),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    logUIEvent({
                        component: 'App',
                        action: selectedProduct ? 'product_updated' : 'product_created',
                        props: { productId: result.productId },
                    });
                    return [4 /*yield*/, apiClient('/products')];
                case 4:
                    productsResponse = _a.sent();
                    return [4 /*yield*/, productsResponse.json()];
                case 5:
                    productsData = _a.sent();
                    setProducts(productsData.products || []);
                    setShowForm(false);
                    setSelectedProduct(null);
                    return [3 /*break*/, 8];
                case 6:
                    err_2 = _a.sent();
                    error_2 = err_2 instanceof Error ? err_2 : new Error(String(err_2));
                    logError(error_2, 'productSubmit');
                    setError('Error al guardar producto');
                    (0, design_system_1.logDSError)('App', error_2, {
                        operation: 'product_submit',
                        productData: productData,
                    });
                    return [3 /*break*/, 8];
                case 7:
                    if (span)
                        span.end();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Manejar selección de producto
    var handleProductSelect = function (product) {
        setSelectedProduct(product);
        setShowForm(true);
        logUIEvent({
            component: 'App',
            action: 'product_selected',
            props: { productId: product.id },
        });
    };
    // Manejar creación de nuevo producto
    var handleCreateNew = function () {
        setSelectedProduct(null);
        setShowForm(true);
        logUIEvent({
            component: 'App',
            action: 'create_new_product',
        });
    };
    if (loading) {
        return (<div className="loading">
        <design_system_1.ObservableCard variant="default" size="md">
          <p>Cargando productos...</p>
        </design_system_1.ObservableCard>
      </div>);
    }
    return (<div className="app">
      <header className="app-header">
        <h1>Dashboard de Productos</h1>
        <design_system_1.ObservableButton variant="primary" size="md" onClick={handleCreateNew} onInteraction={function (action, data) {
            logUIEvent({
                component: 'App',
                action: 'header_button_click',
                props: data,
            });
        }}>
          Nuevo Producto
        </design_system_1.ObservableButton>
      </header>

      {error && (<div className="error">
          <design_system_1.ObservableCard variant="outlined" size="md">
            <p>Error: {error}</p>
            <design_system_1.ObservableButton variant="secondary" size="sm" onClick={function () { return setError(null); }}>
              Cerrar
            </design_system_1.ObservableButton>
          </design_system_1.ObservableCard>
        </div>)}

      <main className="app-main">
        {showForm ? (<ProductForm onSubmit={handleProductSubmit} initialData={selectedProduct || undefined}/>) : (<ProductList products={products} onProductSelect={handleProductSelect}/>)}
      </main>

      <footer className="app-footer">
        <design_system_1.ObservableCard variant="default" size="sm">
          <p>Renderizado {renderCount} veces</p>
          <p>Productos: {products.length}</p>
        </design_system_1.ObservableCard>
      </footer>
    </div>);
};
exports.default = App;
