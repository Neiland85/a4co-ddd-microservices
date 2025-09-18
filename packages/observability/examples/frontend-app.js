"use strict";
/**
 * Example: React frontend application with full observability
 */
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Root;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var observability_1 = require("@a4co/observability");
// Initialize observability
var logger = (0, observability_1.createFrontendLogger)({
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
    logger: logger,
});
// Create instrumented HTTP client
var httpClient = (0, observability_1.createFetchWrapper)({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    logger: logger,
    propagateTrace: true,
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
});
// Product List Component with observability
var ProductList = (0, observability_1.withTracing)((0, observability_1.withLogging)(function (_a) {
    var onProductSelect = _a.onProductSelect;
    var componentLogger = (0, observability_1.useComponentLogger)('ProductList');
    var _b = (0, observability_1.useApiLogger)(), logRequest = _b.logRequest, logResponse = _b.logResponse, logError = _b.logError;
    var _c = (0, react_1.useState)([]), products = _c[0], setProducts = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)(null), error = _e[0], setError = _e[1];
    (0, react_1.useEffect)(function () {
        fetchProducts();
    }, []);
    var fetchProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
        var startTime, response, data, err_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = logRequest({
                        method: 'GET',
                        url: '/api/products',
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    setLoading(true);
                    return [4 /*yield*/, httpClient.get('/api/products')];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    logResponse(startTime, {
                        method: 'GET',
                        url: '/api/products',
                    }, response);
                    componentLogger.info('Products loaded successfully', {
                        custom: {
                            productCount: data.length,
                            categories: __spreadArray([], new Set(data.map(function (p) { return p.category; })), true),
                        },
                    });
                    setProducts(data);
                    setError(null);
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    error_1 = err_1;
                    logError(startTime, {
                        method: 'GET',
                        url: '/api/products',
                    }, error_1);
                    componentLogger.error('Failed to load products', error_1);
                    setError(error_1.message);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return <div>Loading products...</div>;
    if (error)
        return <div>Error: {error}</div>;
    return (<div className="product-grid">
        {products.map(function (product) { return (<ProductCard key={product.id} product={product} onSelect={onProductSelect}/>); })}
      </div>);
}), { componentName: 'ProductList' });
// Product Card with observable interactions
function ProductCard(_a) {
    var product = _a.product, onSelect = _a.onSelect;
    var logInteraction = (0, observability_1.useInteractionLogger)('product.card', {
        throttle: 1000,
    });
    var handleClick = function () {
        logInteraction({
            action: 'select',
            productId: product.id,
            productName: product.name,
            price: product.price,
        });
        onSelect(product);
    };
    return (<div className="product-card" onClick={handleClick}>
      <img src={product.image} alt={product.name}/>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <observability_1.ObservableButton variant="primary" size="medium" trackingId={"add-to-cart-".concat(product.id)} trackingMetadata={{
            productId: product.id,
            productName: product.name,
            price: product.price,
            category: product.category,
        }} onClick={function (e) {
            e.stopPropagation();
            // Add to cart logic
        }}>
        Add to Cart
      </observability_1.ObservableButton>
    </div>);
}
// Checkout Form with observability
function CheckoutForm(_a) {
    var _this = this;
    var cart = _a.cart;
    var logger = (0, observability_1.useLogger)();
    var _b = (0, observability_1.useApiTracing)(), startApiTrace = _b.startApiTrace, endApiTrace = _b.endApiTrace;
    var _c = (0, react_1.useState)(false), submitting = _c[0], setSubmitting = _c[1];
    var handleSubmit = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var formData, orderData, traceId, response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    formData = new FormData(event.currentTarget);
                    orderData = {
                        items: cart,
                        customer: {
                            email: formData.get('email'),
                            name: formData.get('name'),
                            address: formData.get('address'),
                        },
                        total: cart.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0),
                    };
                    traceId = startApiTrace('create-order', {
                        itemCount: cart.length,
                        orderTotal: orderData.total,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    setSubmitting(true);
                    return [4 /*yield*/, httpClient.post('/api/orders', orderData)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
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
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    endApiTrace(traceId, false, {
                        error: error_2.message,
                    });
                    logger.error('Order submission failed', error_2);
                    return [3 /*break*/, 6];
                case 5:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (<observability_1.ObservableForm formId="checkout-form" trackFieldChanges={true} trackingMetadata={{
            cartSize: cart.length,
            cartValue: cart.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0),
        }} onSubmit={handleSubmit} onSubmitSuccess={function (data) {
            logger.info('Checkout form submitted', { custom: data });
        }} onSubmitError={function (error) {
            logger.error('Checkout form error', error);
        }}>
      <input name="email" type="email" placeholder="Email" required/>
      <input name="name" type="text" placeholder="Full Name" required/>
      <textarea name="address" placeholder="Shipping Address" required/>
      
      <observability_1.ObservableButton type="submit" variant="primary" size="large" loading={submitting} trackingId="submit-order" trackingMetadata={{
            formId: 'checkout-form',
            cartSize: cart.length,
        }}>
        Place Order
      </observability_1.ObservableButton>
    </observability_1.ObservableForm>);
}
// Main App with route tracking
function App() {
    var location = (0, react_router_dom_1.useLocation)();
    var _a = (0, react_1.useState)(null), selectedProduct = _a[0], setSelectedProduct = _a[1];
    var _b = (0, react_1.useState)([]), cart = _b[0], setCart = _b[1];
    // Track route changes
    (0, observability_1.useRouteTracing)(location.pathname);
    return (<observability_1.LoggingErrorBoundary fallback={function (_a) {
            var error = _a.error;
            return (<div className="error-page">
          <h1>Something went wrong</h1>
          <p>{error === null || error === void 0 ? void 0 : error.message}</p>
        </div>);
        }}>
      <div className="app">
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<ProductList onProductSelect={setSelectedProduct}/>}/>
          <react_router_dom_1.Route path="/product/:id" element={selectedProduct ? (<ProductDetail product={selectedProduct}/>) : (<div>Product not found</div>)}/>
          <react_router_dom_1.Route path="/checkout" element={<CheckoutForm cart={cart}/>}/>
        </react_router_dom_1.Routes>
      </div>
    </observability_1.LoggingErrorBoundary>);
}
// Product Detail Page
function ProductDetail(_a) {
    var product = _a.product;
    var componentLogger = (0, observability_1.useComponentLogger)('ProductDetail', { productId: product.id });
    (0, react_1.useEffect)(function () {
        componentLogger.info('Product detail viewed', {
            custom: {
                productId: product.id,
                productName: product.name,
                price: product.price,
            },
        });
    }, [product]);
    return (<div className="product-detail">
      <img src={product.image} alt={product.name}/>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <observability_1.ObservableButton variant="primary" size="large" trackingId={"buy-now-".concat(product.id)} trackingMetadata={{
            productId: product.id,
            productName: product.name,
            price: product.price,
            action: 'buy-now',
        }}>
        Buy Now
      </observability_1.ObservableButton>
    </div>);
}
// Root component with providers
function Root() {
    return (<observability_1.TracingProvider serviceName="web-app" serviceVersion={process.env.REACT_APP_VERSION || '1.0.0'} environment={process.env.REACT_APP_ENV || 'development'}>
      <observability_1.LoggerProvider logger={logger}>
        <react_router_dom_1.BrowserRouter>
          <App />
        </react_router_dom_1.BrowserRouter>
      </observability_1.LoggerProvider>
    </observability_1.TracingProvider>);
}
