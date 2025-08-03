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
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_router_dom_1 = require("react-router-dom");
var react_2 = require("@a4co/observability/react");
// Configuración de la aplicación
var OBSERVABILITY_ENDPOINT = process.env.REACT_APP_OBSERVABILITY_ENDPOINT || '/api/observability';
// App principal con provider de observabilidad
function App() {
    var _a = (0, react_1.useState)(null), currentUser = _a[0], setCurrentUser = _a[1];
    return (<react_2.ObservabilityProvider apiEndpoint={OBSERVABILITY_ENDPOINT} userId={currentUser === null || currentUser === void 0 ? void 0 : currentUser.id} enablePerformanceTracking={true} enableErrorBoundary={true} onError={function (error, errorInfo) {
            // Manejo personalizado de errores
            console.error('Application error:', error, errorInfo);
        }}>
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<HomePage />}/>
          <react_router_dom_1.Route path="/products" element={<ProductsPage />}/>
          <react_router_dom_1.Route path="/checkout" element={<CheckoutPage />}/>
          <react_router_dom_1.Route path="/profile" element={<ProfilePage />}/>
        </react_router_dom_1.Routes>
      </react_router_dom_1.BrowserRouter>
    </react_2.ObservabilityProvider>);
}
// Página de inicio con tracking de componentes
function HomePage() {
    var _a = (0, react_2.useObservability)(), logger = _a.logger, sessionId = _a.sessionId;
    var _b = (0, react_2.useEventTracking)(), trackClick = _b.trackClick, trackCustom = _b.trackCustom;
    (0, react_2.useComponentTracking)('HomePage');
    (0, react_1.useEffect)(function () {
        logger.info('User landed on home page', { sessionId: sessionId });
    }, []);
    var handleExploreClick = function () {
        trackClick('explore-button', { section: 'hero' });
    };
    return (<div className="home-page">
      <HeroSection onExploreClick={handleExploreClick}/>
      <FeaturedProducts />
      <NewsletterSignup />
    </div>);
}
// Componente Hero con performance tracking
function HeroSection(_a) {
    var onExploreClick = _a.onExploreClick;
    return (<react_2.PerformanceTracker name="HeroSection.render">
      {function () { return (<section className="hero">
          <h1>Welcome to A4CO Marketplace</h1>
          <p>Discover unique artisan products from Colombia</p>
          <react_2.TrackedButton variant="primary" size="large" trackingName="hero-explore-button" onClick={onExploreClick}>
            Explore Products
          </react_2.TrackedButton>
        </section>); }}
    </react_2.PerformanceTracker>);
}
// Productos destacados con tracking de interacciones
function FeaturedProducts() {
    var _this = this;
    var _a = (0, react_1.useState)([]), products = _a[0], setProducts = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_2.useObservability)(), measurePerformance = _c.measurePerformance, logger = _c.logger;
    var trackCustom = (0, react_2.useEventTracking)().trackCustom;
    (0, react_2.useComponentTracking)('FeaturedProducts', {
        trackProps: ['productCount'],
    });
    (0, react_1.useEffect)(function () {
        loadFeaturedProducts();
    }, []);
    var loadFeaturedProducts = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, measurePerformance('FeaturedProducts.load', function () { return __awaiter(_this, void 0, void 0, function () {
                        var tracedFetch, response, data, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, 4, 5]);
                                    tracedFetch = (0, react_2.createTracedFetch)(OBSERVABILITY_ENDPOINT, 'session-123');
                                    return [4 /*yield*/, tracedFetch('/api/products/featured')];
                                case 1:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.json()];
                                case 2:
                                    data = _a.sent();
                                    setProducts(data);
                                    logger.info('Featured products loaded', { count: data.length });
                                    return [3 /*break*/, 5];
                                case 3:
                                    error_1 = _a.sent();
                                    logger.error('Failed to load featured products', error_1);
                                    return [3 /*break*/, 5];
                                case 4:
                                    setLoading(false);
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleProductClick = function (product) {
        trackCustom('FeaturedProductCard', 'click', {
            productId: product.id,
            productName: product.name,
            price: product.price,
        });
    };
    if (loading) {
        return <LoadingSpinner />;
    }
    return (<section className="featured-products">
      <h2>Featured Products</h2>
      <div className="products-grid">
        {products.map(function (product) { return (<react_2.TrackedCard key={product.id} title={product.name} trackingName="featured-product-card" trackingMetadata={{ productId: product.id }} onClick={function () { return handleProductClick(product); }}>
            <img src={product.image} alt={product.name}/>
            <p className="price">${product.price}</p>
          </react_2.TrackedCard>); })}
      </div>
    </section>);
}
// Newsletter signup con form tracking
function NewsletterSignup() {
    var _this = this;
    var _a = (0, react_1.useState)(''), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(false), subscribed = _b[0], setSubscribed = _b[1];
    var logger = (0, react_2.useObservability)().logger;
    var trackCustom = (0, react_2.useEventTracking)().trackCustom;
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    trackCustom('NewsletterForm', 'submit', { email: email.includes('@') });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Simular API call
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    // Simular API call
                    _a.sent();
                    setSubscribed(true);
                    logger.info('Newsletter subscription successful', { email: email });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger.error('Newsletter subscription failed', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (subscribed) {
        return (<section className="newsletter-success">
        <h3>Thanks for subscribing!</h3>
      </section>);
    }
    return (<section className="newsletter">
      <h3>Stay Updated</h3>
      <form onSubmit={handleSubmit}>
        <react_2.TrackedInput type="email" placeholder="Enter your email" value={email} onChange={function (e) { return setEmail(e.target.value); }} trackingName="newsletter-email-input" required/>
        <react_2.TrackedButton type="submit" variant="secondary" trackingName="newsletter-submit-button">
          Subscribe
        </react_2.TrackedButton>
      </form>
    </section>);
}
// Página de productos con filtros y búsqueda
var ProductsPage = (0, react_2.withObservability)(function ProductsPage() {
    var _a = (0, react_1.useState)({
        category: 'all',
        priceRange: 'all',
        sortBy: 'relevance',
    }), filters = _a[0], setFilters = _a[1];
    var trackCustom = (0, react_2.useEventTracking)().trackCustom;
    var handleFilterChange = function (filterType, value) {
        trackCustom('ProductFilters', 'change', {
            filterType: filterType,
            value: value,
            previousValue: filters[filterType],
        });
        setFilters(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[filterType] = value, _a)));
        });
    };
    return (<div className="products-page">
      <h1>All Products</h1>
      
      <react_2.TrackedTabs trackingName="product-categories" tabs={[
            { id: 'all', label: 'All Products', content: <ProductGrid filters={filters}/> },
            { id: 'artisan', label: 'Artisan Crafts', content: <ProductGrid filters={__assign(__assign({}, filters), { category: 'artisan' })}/> },
            { id: 'coffee', label: 'Coffee', content: <ProductGrid filters={__assign(__assign({}, filters), { category: 'coffee' })}/> },
            { id: 'textiles', label: 'Textiles', content: <ProductGrid filters={__assign(__assign({}, filters), { category: 'textiles' })}/> },
        ]}/>
    </div>);
}, 'ProductsPage');
// Grid de productos con lazy loading
function ProductGrid(_a) {
    var _this = this;
    var filters = _a.filters;
    var _b = (0, react_1.useState)([]), products = _b[0], setProducts = _b[1];
    var _c = (0, react_1.useState)(1), page = _c[0], setPage = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    var measurePerformance = (0, react_2.useObservability)().measurePerformance;
    var trackCustom = (0, react_2.useEventTracking)().trackCustom;
    (0, react_1.useEffect)(function () {
        loadProducts();
    }, [filters, page]);
    var loadProducts = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    return [4 /*yield*/, measurePerformance('ProductGrid.loadProducts', function () { return __awaiter(_this, void 0, void 0, function () {
                            var newProducts_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, , 2, 3]);
                                        // Simular carga de productos
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                                    case 1:
                                        // Simular carga de productos
                                        _a.sent();
                                        newProducts_1 = Array.from({ length: 12 }, function (_, i) { return ({
                                            id: "product-".concat(page, "-").concat(i),
                                            name: "Product ".concat(page * 12 + i),
                                            price: Math.floor(Math.random() * 100) + 20,
                                            image: "https://via.placeholder.com/300x300?text=Product+".concat(i),
                                        }); });
                                        setProducts(function (prev) { return page === 1 ? newProducts_1 : __spreadArray(__spreadArray([], prev, true), newProducts_1, true); });
                                        return [3 /*break*/, 3];
                                    case 2:
                                        setLoading(false);
                                        return [7 /*endfinally*/];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleLoadMore = function () {
        trackCustom('ProductGrid', 'load_more', { currentPage: page });
        setPage(function (prev) { return prev + 1; });
    };
    return (<div className="product-grid">
      {products.map(function (product) { return (<ProductCard key={product.id} product={product}/>); })}
      
      {!loading && (<react_2.TrackedButton onClick={handleLoadMore} variant="ghost" trackingName="load-more-products">
          Load More
        </react_2.TrackedButton>)}
      
      {loading && <LoadingSpinner />}
    </div>);
}
// Tarjeta de producto individual
function ProductCard(_a) {
    var product = _a.product;
    var _b = (0, react_1.useState)(false), showQuickView = _b[0], setShowQuickView = _b[1];
    var trackClick = (0, react_2.useEventTracking)().trackClick;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleAddToCart = function (e) {
        e.stopPropagation();
        trackClick('add-to-cart', {
            productId: product.id,
            productName: product.name,
            price: product.price,
        });
        // Lógica de agregar al carrito
    };
    var handleQuickView = function (e) {
        e.stopPropagation();
        setShowQuickView(true);
    };
    return (<>
      <react_2.TrackedCard trackingName="product-card" trackingMetadata={{ productId: product.id }} onClick={function () { return navigate("/products/".concat(product.id)); }}>
        <img src={product.image} alt={product.name}/>
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
        
        <div className="actions">
          <react_2.TrackedButton size="small" onClick={handleAddToCart} trackingName="add-to-cart-button" trackingMetadata={{ productId: product.id }}>
            Add to Cart
          </react_2.TrackedButton>
          
          <react_2.TrackedButton size="small" variant="ghost" onClick={handleQuickView} trackingName="quick-view-button">
            Quick View
          </react_2.TrackedButton>
        </div>
      </react_2.TrackedCard>

      <react_2.TrackedModal isOpen={showQuickView} onClose={function () { return setShowQuickView(false); }} title={product.name} trackingName="product-quick-view" trackingMetadata={{ productId: product.id }}>
        <img src={product.image} alt={product.name}/>
        <p>{product.description || 'Beautiful artisan product from Colombia'}</p>
        <p className="price">${product.price}</p>
        
        <react_2.TrackedButton onClick={handleAddToCart} trackingName="quick-view-add-to-cart">
          Add to Cart
        </react_2.TrackedButton>
      </react_2.TrackedModal>
    </>);
}
// Página de checkout con tracking detallado
function CheckoutPage() {
    var _a = (0, react_1.useState)(1), step = _a[0], setStep = _a[1];
    var logger = (0, react_2.useObservability)().logger;
    var trackCustom = (0, react_2.useEventTracking)().trackCustom;
    (0, react_2.useComponentTracking)('CheckoutPage', {
        trackProps: ['step'],
    });
    var handleStepComplete = function (stepNumber) {
        trackCustom('CheckoutFlow', 'step_completed', {
            step: stepNumber,
            nextStep: stepNumber + 1,
        });
        setStep(stepNumber + 1);
        logger.info('Checkout step completed', { step: stepNumber });
    };
    return (<div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-progress">
        <div className={"step ".concat(step >= 1 ? 'active' : '')}>1. Shipping</div>
        <div className={"step ".concat(step >= 2 ? 'active' : '')}>2. Payment</div>
        <div className={"step ".concat(step >= 3 ? 'active' : '')}>3. Review</div>
      </div>

      {step === 1 && <ShippingStep onComplete={function () { return handleStepComplete(1); }}/>}
      {step === 2 && <PaymentStep onComplete={function () { return handleStepComplete(2); }}/>}
      {step === 3 && <ReviewStep onComplete={function () { return handleStepComplete(3); }}/>}
    </div>);
}
// Componentes auxiliares
function LoadingSpinner() {
    return <div className="loading-spinner">Loading...</div>;
}
function ShippingStep(_a) {
    var onComplete = _a.onComplete;
    var _b = (0, react_1.useState)({
        street: '',
        city: '',
        zip: '',
    }), address = _b[0], setAddress = _b[1];
    return (<div className="shipping-step">
      <h2>Shipping Information</h2>
      
      <react_2.TrackedInput label="Street Address" value={address.street} onChange={function (e) { return setAddress(function (prev) { return (__assign(__assign({}, prev), { street: e.target.value })); }); }} trackingName="shipping-street"/>
      
      <react_2.TrackedInput label="City" value={address.city} onChange={function (e) { return setAddress(function (prev) { return (__assign(__assign({}, prev), { city: e.target.value })); }); }} trackingName="shipping-city"/>
      
      <react_2.TrackedInput label="ZIP Code" value={address.zip} onChange={function (e) { return setAddress(function (prev) { return (__assign(__assign({}, prev), { zip: e.target.value })); }); }} trackingName="shipping-zip"/>
      
      <react_2.TrackedButton onClick={onComplete} trackingName="continue-to-payment">
        Continue to Payment
      </react_2.TrackedButton>
    </div>);
}
function PaymentStep(_a) {
    var onComplete = _a.onComplete;
    return (<div className="payment-step">
      <h2>Payment Information</h2>
      {/* Payment form implementation */}
      <react_2.TrackedButton onClick={onComplete}>Continue to Review</react_2.TrackedButton>
    </div>);
}
function ReviewStep(_a) {
    var onComplete = _a.onComplete;
    return (<div className="review-step">
      <h2>Review Your Order</h2>
      {/* Order review implementation */}
      <react_2.TrackedButton onClick={onComplete} variant="primary">Place Order</react_2.TrackedButton>
    </div>);
}
function ProfilePage() {
    return <div>Profile Page</div>;
}
// Renderizar la aplicación
var root = client_1.default.createRoot(document.getElementById('root'));
root.render(<react_1.default.StrictMode>
    <App />
  </react_1.default.StrictMode>);
