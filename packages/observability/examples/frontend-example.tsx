import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  initializeFrontendObservability,
  useComponentTracking,
  useNavigationTracking,
  useAPITracking,
  usePerformanceTracking,
  withTracking,
  ErrorBoundaryWithTracking,
  TrackedButton,
  TrackedInput,
  TrackedCard,
  trackFormEvent,
  trackUserNavigation,
  trackUserInteraction,
} from '@a4co/observability';

// Inicializar observabilidad del frontend
if (typeof window !== 'undefined') {
  initializeFrontendObservability({
    serviceName: 'dashboard-web',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoint: process.env.NEXT_PUBLIC_OTEL_ENDPOINT || 'http://localhost:4318/v1/traces',
    enableConsoleExporter: process.env.NODE_ENV === 'development',
    enableAutoInstrumentation: true,
    enableUserTracking: true,
    enablePerformanceTracking: true,
    enableErrorTracking: true,
  });
}

// Componente de formulario de orden con tracking
const OrderForm: React.FC = () => {
  const { trackEvent, trackError } = useComponentTracking('OrderForm');
  const { trackAPICall } = useAPITracking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    trackEvent('submit', { formType: 'order' });
    
    const formData = new FormData(e.target as HTMLFormElement);
    const orderData = {
      customerId: formData.get('customerId') as string,
      items: formData.get('items') as string,
      totalAmount: parseFloat(formData.get('totalAmount') as string),
    };

    try {
      const startTime = Date.now();
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData }),
      });

      const duration = Date.now() - startTime;
      
      trackAPICall('POST', '/api/orders', response.status, duration);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      trackFormEvent('order-form', 'success', {
        orderId: result.order.id,
        totalAmount: orderData.totalAmount,
      });
      
      trackEvent('success', { orderId: result.order.id });
      
    } catch (error) {
      trackError(error as Error, { orderData });
      trackFormEvent('order-form', 'validation_error', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  return (
    <TrackedCard variant="elevated">
      <form onSubmit={handleSubmit}>
        <h2>Create New Order</h2>
        
        <TrackedInput
          name="customerId"
          placeholder="Customer ID"
          required
          variant="outlined"
          size="md"
        />
        
        <TrackedInput
          name="items"
          placeholder="Items (JSON)"
          required
          variant="outlined"
          size="md"
        />
        
        <TrackedInput
          name="totalAmount"
          type="number"
          placeholder="Total Amount"
          required
          variant="outlined"
          size="md"
        />
        
        <TrackedButton
          type="submit"
          variant="primary"
          size="lg"
        >
          Create Order
        </TrackedButton>
      </form>
    </TrackedCard>
  );
};

// Componente de navegación con tracking
const Navigation: React.FC = () => {
  const router = useRouter();
  const { trackPageView, trackRouteChange } = useNavigationTracking();

  useEffect(() => {
    // Trackear vista de página inicial
    trackPageView(router.pathname, router.asPath);
  }, [router.pathname, router.asPath]);

  const handleNavigation = (path: string) => {
    const currentPath = router.pathname;
    trackUserNavigation(currentPath, path, 'click');
    router.push(path);
  };

  return (
    <nav>
      <TrackedButton
        onClick={() => handleNavigation('/orders')}
        variant="text"
        size="md"
      >
        Orders
      </TrackedButton>
      
      <TrackedButton
        onClick={() => handleNavigation('/customers')}
        variant="text"
        size="md"
      >
        Customers
      </TrackedButton>
      
      <TrackedButton
        onClick={() => handleNavigation('/analytics')}
        variant="text"
        size="md"
      >
        Analytics
      </TrackedButton>
    </nav>
  );
};

// Componente de dashboard con tracking de performance
const Dashboard: React.FC = () => {
  const { trackMetric, trackWebVitals } = usePerformanceTracking();
  const { trackEvent } = useComponentTracking('Dashboard');

  useEffect(() => {
    // Inicializar tracking de Web Vitals
    trackWebVitals();
    
    // Trackear métricas de performance personalizadas
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            trackMetric({
              name: entry.name,
              value: entry.duration,
              unit: 'ms',
              metadata: { entryType: entry.entryType },
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['measure'] });
      
      // Medir tiempo de carga del dashboard
      performance.mark('dashboard-start');
      performance.measure('dashboard-load', 'dashboard-start');
    }
    
    trackEvent('mount');
    
    return () => {
      trackEvent('unmount');
    };
  }, []);

  const handleUserInteraction = (interactionType: string) => {
    trackUserInteraction('Dashboard', interactionType, {
      variant: 'main',
      size: 'full',
    }, {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    });
  };

  return (
    <div>
      <h1>A4CO Dashboard</h1>
      
      <TrackedCard variant="default">
        <h2>Quick Actions</h2>
        <TrackedButton
          onClick={() => handleUserInteraction('quick-action')}
          variant="secondary"
          size="md"
        >
          Quick Action
        </TrackedButton>
      </TrackedCard>
      
      <OrderForm />
    </div>
  );
};

// Componente principal de la aplicación
const App: React.FC = () => {
  return (
    <ErrorBoundaryWithTracking componentName="App">
      <div className="app">
        <Navigation />
        <Dashboard />
      </div>
    </ErrorBoundaryWithTracking>
  );
};

// HOC para tracking automático de la aplicación
const TrackedApp = withTracking(App, 'App', {
  trackProps: true,
  trackEvents: ['mount', 'unmount'],
  trackErrors: true,
});

export default TrackedApp;