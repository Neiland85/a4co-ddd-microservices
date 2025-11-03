import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {
  ObservabilityProvider,
  useObservability,
  useEventTracking,
  useComponentTracking,
  withObservability,
  PerformanceTracker,
  createTracedFetch,
  TrackedButton,
  TrackedInput,
  TrackedModal,
  TrackedCard,
  TrackedTabs,
} from '@a4co/observability/react';

// Configuración de la aplicación
const OBSERVABILITY_ENDPOINT = process.env.REACT_APP_OBSERVABILITY_ENDPOINT || '/api/observability';

// App principal con provider de observabilidad
function App() {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);

  return (
    <ObservabilityProvider
      apiEndpoint={OBSERVABILITY_ENDPOINT}
      userId={currentUser?.id}
      enablePerformanceTracking={true}
      enableErrorBoundary={true}
      onError={(error, errorInfo) => {
        // Manejo personalizado de errores
        console.error('Application error:', error, errorInfo);
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </ObservabilityProvider>
  );
}

// Página de inicio con tracking de componentes
function HomePage() {
  const { logger, sessionId } = useObservability();
  const { trackClick, trackCustom } = useEventTracking();

  useComponentTracking('HomePage');

  useEffect(() => {
    logger.info('User landed on home page', { sessionId });
  }, []);

  const handleExploreClick = () => {
    trackClick('explore-button', { section: 'hero' });
  };

  return (
    <div className="home-page">
      <HeroSection onExploreClick={handleExploreClick} />
      <FeaturedProducts />
      <NewsletterSignup />
    </div>
  );
}

// Componente Hero con performance tracking
function HeroSection({ onExploreClick }: { onExploreClick: () => void }) {
  return (
    <PerformanceTracker name="HeroSection.render">
      {() => (
        <section className="hero">
          <h1>Welcome to A4CO Marketplace</h1>
          <p>Discover unique artisan products from Colombia</p>
          <TrackedButton
            variant="primary"
            size="large"
            trackingName="hero-explore-button"
            onClick={onExploreClick}
          >
            Explore Products
          </TrackedButton>
        </section>
      )}
    </PerformanceTracker>
  );
}

// Productos destacados con tracking de interacciones
function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { measurePerformance, logger } = useObservability();
  const { trackCustom } = useEventTracking();

  useComponentTracking('FeaturedProducts', {
    trackProps: ['productCount'],
  });

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async() => {
    await measurePerformance('FeaturedProducts.load', async() => {
      try {
        // Usar fetch con tracing
        const tracedFetch = createTracedFetch(OBSERVABILITY_ENDPOINT, 'session-123');
        const response = await tracedFetch('/api/products/featured');
        const data = await response.json();

        setProducts(data);
        logger.info('Featured products loaded', { count: data.length });
      } catch (error) {
        logger.error('Failed to load featured products', error);
      } finally {
        setLoading(false);
      }
    });
  };

  const handleProductClick = (product: any) => {
    trackCustom('FeaturedProductCard', 'click', {
      productId: product.id,
      productName: product.name,
      price: product.price,
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <TrackedCard
            key={product.id}
            title={product.name}
            trackingName="featured-product-card"
            trackingMetadata={{ productId: product.id }}
            onClick={() => handleProductClick(product)}
          >
            <img src={product.image} alt={product.name} />
            <p className="price">${product.price}</p>
          </TrackedCard>
        ))}
      </div>
    </section>
  );
}

// Newsletter signup con form tracking
function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { logger } = useObservability();
  const { trackCustom } = useEventTracking();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    trackCustom('NewsletterForm', 'submit', { email: email.includes('@') });

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubscribed(true);
      logger.info('Newsletter subscription successful', { email });
    } catch (error) {
      logger.error('Newsletter subscription failed', error);
    }
  };

  if (subscribed) {
    return (
      <section className="newsletter-success">
        <h3>Thanks for subscribing!</h3>
      </section>
    );
  }

  return (
    <section className="newsletter">
      <h3>Stay Updated</h3>
      <form onSubmit={handleSubmit}>
        <TrackedInput
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          trackingName="newsletter-email-input"
          required
        />
        <TrackedButton type="submit" variant="secondary" trackingName="newsletter-submit-button">
          Subscribe
        </TrackedButton>
      </form>
    </section>
  );
}

// Página de productos con filtros y búsqueda
const ProductsPage = withObservability(function ProductsPage() {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sortBy: 'relevance',
  });
  const { trackCustom } = useEventTracking();

  const handleFilterChange = (filterType: string, value: string) => {
    trackCustom('ProductFilters', 'change', {
      filterType,
      value,
      previousValue: filters[filterType as keyof typeof filters],
    });

    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="products-page">
      <h1>All Products</h1>

      <TrackedTabs
        trackingName="product-categories"
        tabs={[
          { id: 'all', label: 'All Products', content: <ProductGrid filters={filters} /> },
          {
            id: 'artisan',
            label: 'Artisan Crafts',
            content: <ProductGrid filters={{ ...filters, category: 'artisan' }} />,
          },
          {
            id: 'coffee',
            label: 'Coffee',
            content: <ProductGrid filters={{ ...filters, category: 'coffee' }} />,
          },
          {
            id: 'textiles',
            label: 'Textiles',
            content: <ProductGrid filters={{ ...filters, category: 'textiles' }} />,
          },
        ]}
      />
    </div>
  );
}, 'ProductsPage');

// Grid de productos con lazy loading
function ProductGrid({ filters }: { filters: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { measurePerformance } = useObservability();
  const { trackCustom } = useEventTracking();

  useEffect(() => {
    loadProducts();
  }, [filters, page]);

  const loadProducts = async() => {
    setLoading(true);

    await measurePerformance('ProductGrid.loadProducts', async() => {
    await measurePerformance('ProductGrid.loadProducts', async () => {
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
      } finally {
        setLoading(false);
      }
    });
  };

  const handleLoadMore = () => {
    trackCustom('ProductGrid', 'load_more', { currentPage: page });
    setPage(prev => prev + 1);
  };

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}

      {!loading && (
        <TrackedButton onClick={handleLoadMore} variant="ghost" trackingName="load-more-products">
          Load More
        </TrackedButton>
      )}

      {loading && <LoadingSpinner />}
    </div>
  );
}

// Tarjeta de producto individual
function ProductCard({ product }: { product: any }) {
  const [showQuickView, setShowQuickView] = useState(false);
  const { trackClick } = useEventTracking();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackClick('add-to-cart', {
      productId: product.id,
      productName: product.name,
      price: product.price,
    });

    // Lógica de agregar al carrito
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <TrackedCard
        trackingName="product-card"
        trackingMetadata={{ productId: product.id }}
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>

        <div className="actions">
          <TrackedButton
            size="small"
            onClick={handleAddToCart}
            trackingName="add-to-cart-button"
            trackingMetadata={{ productId: product.id }}
          >
            Add to Cart
          </TrackedButton>

          <TrackedButton
            size="small"
            variant="ghost"
            onClick={handleQuickView}
            trackingName="quick-view-button"
          >
            Quick View
          </TrackedButton>
        </div>
      </TrackedCard>

      <TrackedModal
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        title={product.name}
        trackingName="product-quick-view"
        trackingMetadata={{ productId: product.id }}
      >
        <img src={product.image} alt={product.name} />
        <p>{product.description || 'Beautiful artisan product from Colombia'}</p>
        <p className="price">${product.price}</p>

        <TrackedButton onClick={handleAddToCart} trackingName="quick-view-add-to-cart">
          Add to Cart
        </TrackedButton>
      </TrackedModal>
    </>
  );
}

// Página de checkout con tracking detallado
function CheckoutPage() {
  const [step, setStep] = useState(1);
  const { logger } = useObservability();
  const { trackCustom } = useEventTracking();

  useComponentTracking('CheckoutPage', {
    trackProps: ['step'],
  });

  const handleStepComplete = (stepNumber: number) => {
    trackCustom('CheckoutFlow', 'step_completed', {
      step: stepNumber,
      nextStep: stepNumber + 1,
    });

    setStep(stepNumber + 1);
    logger.info('Checkout step completed', { step: stepNumber });
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-progress">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Shipping</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Payment</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Review</div>
      </div>

      {step === 1 && <ShippingStep onComplete={() => handleStepComplete(1)} />}
      {step === 2 && <PaymentStep onComplete={() => handleStepComplete(2)} />}
      {step === 3 && <ReviewStep onComplete={() => handleStepComplete(3)} />}
    </div>
  );
}

// Componentes auxiliares
function LoadingSpinner() {
  return <div className="loading-spinner">Loading...</div>;
}

function ShippingStep({ onComplete }: { onComplete: () => void }) {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    zip: '',
  });

  return (
    <div className="shipping-step">
      <h2>Shipping Information</h2>

      <TrackedInput
        label="Street Address"
        value={address.street}
        onChange={e => setAddress(prev => ({ ...prev, street: e.target.value }))}
        trackingName="shipping-street"
      />

      <TrackedInput
        label="City"
        value={address.city}
        onChange={e => setAddress(prev => ({ ...prev, city: e.target.value }))}
        trackingName="shipping-city"
      />

      <TrackedInput
        label="ZIP Code"
        value={address.zip}
        onChange={e => setAddress(prev => ({ ...prev, zip: e.target.value }))}
        trackingName="shipping-zip"
      />

      <TrackedButton onClick={onComplete} trackingName="continue-to-payment">
        Continue to Payment
      </TrackedButton>
    </div>
  );
}

function PaymentStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="payment-step">
      <h2>Payment Information</h2>
      {/* Payment form implementation */}
      <TrackedButton onClick={onComplete}>Continue to Review</TrackedButton>
    </div>
  );
}

function ReviewStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="review-step">
      <h2>Review Your Order</h2>
      {/* Order review implementation */}
      <TrackedButton onClick={onComplete} variant="primary">
        Place Order
      </TrackedButton>
    </div>
  );
}

function ProfilePage() {
  return <div>Profile Page</div>;
}

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  </React.StrictMode>
);
