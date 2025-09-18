/**
 * Example: React frontend application with full observability
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import {
  createFrontendLogger,
  initializeWebTracer,
  LoggerProvider,
  TracingProvider,
  LoggingErrorBoundary,
  useLogger,
  useComponentLogger,
  useApiLogger,
  useInteractionLogger,
  useRouteTracing,
  useApiTracing,
  ObservableButton,
  ObservableForm,
  createFetchWrapper,
  withLogging,
  withTracing,
} from '@a4co/observability';

// Initialize observability
const logger = createFrontendLogger({
  service: 'web-app',
  environment: process.env.REACT_APP_ENV || 'development',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  endpoint: '/api/logs',
  bufferSize: 100,
  flushInterval: 5000,
  enableConsole: process.env.NODE_ENV === 'development',
});

// Initialize tracer
initializeWebTracer({
  serviceName: 'web-app',
  serviceVersion: process.env.REACT_APP_VERSION || '1.0.0',
  environment: process.env.REACT_APP_ENV || 'development',
  collectorUrl: process.env.REACT_APP_OTEL_COLLECTOR_URL || 'http://localhost:4318/v1/traces',
  logger,
});

// Create instrumented HTTP client
const httpClient = createFetchWrapper({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  logger,
  propagateTrace: true,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
});

// Product List Component with observability
const ProductList = withTracing(
  withLogging(({ onProductSelect }: { onProductSelect: (product: Product) => void }) => {
    const componentLogger = useComponentLogger('ProductList');
    const { logRequest, logResponse, logError } = useApiLogger();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

        logResponse(
          startTime,
          {
            method: 'GET',
            url: '/api/products',
          },
          response
        );

        componentLogger.info('Products loaded successfully', {
          custom: {
            productCount: data.length,
            categories: [...new Set(data.map((p: Product) => p.category))],
          },
        });

        setProducts(data);
        setError(null);
      } catch (err) {
        const error = err as Error;
        logError(
          startTime,
          {
            method: 'GET',
            url: '/api/products',
          },
          error
        );

        componentLogger.error('Failed to load products', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (loading) return <div>Loading products...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
        ))}
      </div>
    );
  }),
  { componentName: 'ProductList' }
);

// Product Card with observable interactions
function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  const logInteraction = useInteractionLogger('product.card', {
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

  return (
    <div className="product-card" onClick={handleClick}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <ObservableButton
        variant="primary"
        size="medium"
        trackingId={`add-to-cart-${product.id}`}
        trackingMetadata={{
          productId: product.id,
          productName: product.name,
          price: product.price,
          category: product.category,
        }}
        onClick={e => {
          e.stopPropagation();
          // Add to cart logic
        }}
      >
        Add to Cart
      </ObservableButton>
    </div>
  );
}

// Checkout Form with observability
function CheckoutForm({ cart }: { cart: CartItem[] }) {
  const logger = useLogger();
  const { startApiTrace, endApiTrace } = useApiTracing();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    } catch (error) {
      endApiTrace(traceId, false, {
        error: (error as Error).message,
      });

      logger.error('Order submission failed', error as Error);
      // Error handling
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ObservableForm
      formId="checkout-form"
      trackFieldChanges={true}
      trackingMetadata={{
        cartSize: cart.length,
        cartValue: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }}
      onSubmit={handleSubmit}
      onSubmitSuccess={data => {
        logger.info('Checkout form submitted', { custom: data });
      }}
      onSubmitError={error => {
        logger.error('Checkout form error', error);
      }}
    >
      <input name="email" type="email" placeholder="Email" required />
      <input name="name" type="text" placeholder="Full Name" required />
      <textarea name="address" placeholder="Shipping Address" required />

      <ObservableButton
        type="submit"
        variant="primary"
        size="large"
        loading={submitting}
        trackingId="submit-order"
        trackingMetadata={{
          formId: 'checkout-form',
          cartSize: cart.length,
        }}
      >
        Place Order
      </ObservableButton>
    </ObservableForm>
  );
}

// Main App with route tracking
function App() {
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Track route changes
  useRouteTracing(location.pathname);

  return (
    <LoggingErrorBoundary
      fallback={({ error }) => (
        <div className="error-page">
          <h1>Something went wrong</h1>
          <p>{error?.message}</p>
        </div>
      )}
    >
      <div className="app">
        <Routes>
          <Route path="/" element={<ProductList onProductSelect={setSelectedProduct} />} />
          <Route
            path="/product/:id"
            element={
              selectedProduct ? (
                <ProductDetail product={selectedProduct} />
              ) : (
                <div>Product not found</div>
              )
            }
          />
          <Route path="/checkout" element={<CheckoutForm cart={cart} />} />
        </Routes>
      </div>
    </LoggingErrorBoundary>
  );
}

// Product Detail Page
function ProductDetail({ product }: { product: Product }) {
  const componentLogger = useComponentLogger('ProductDetail', { productId: product.id });

  useEffect(() => {
    componentLogger.info('Product detail viewed', {
      custom: {
        productId: product.id,
        productName: product.name,
        price: product.price,
      },
    });
  }, [product]);

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <ObservableButton
        variant="primary"
        size="large"
        trackingId={`buy-now-${product.id}`}
        trackingMetadata={{
          productId: product.id,
          productName: product.name,
          price: product.price,
          action: 'buy-now',
        }}
      >
        Buy Now
      </ObservableButton>
    </div>
  );
}

// Root component with providers
export default function Root() {
  return (
    <TracingProvider
      serviceName="web-app"
      serviceVersion={process.env.REACT_APP_VERSION || '1.0.0'}
      environment={process.env.REACT_APP_ENV || 'development'}
    >
      <LoggerProvider logger={logger}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LoggerProvider>
    </TracingProvider>
  );
}

// Type definitions
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}
