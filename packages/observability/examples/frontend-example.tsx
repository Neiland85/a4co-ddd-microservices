import React, { useState, useEffect } from 'react';
import {
  initializeFrontendObservability,
  useErrorLogger,
  useUILogger,
  useComponentTracing,
  createObservableFetch,
  withObservability,
} from '../src/frontend';
import {
  ObservableButton,
  ObservableInput,
  ObservableCard,
  useDSObservability,
  useDSPerformanceTracking,
  logDSError,
  logDSMetric,
} from '../src/design-system';

// Inicializar observabilidad del frontend
initializeFrontendObservability(
  {
    serviceName: 'dashboard-web',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoint: process.env.REACT_APP_LOG_ENDPOINT || 'http://localhost:3000/api/logs',
    level: 'info',
  },
  {
    serviceName: 'dashboard-web',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoint: process.env.REACT_APP_TRACE_ENDPOINT || 'http://localhost:4318/v1/traces',
    enableConsoleExporter: process.env.NODE_ENV === 'development',
  },
);

// Cliente HTTP con observabilidad
const apiClient = createObservableFetch(process.env.REACT_APP_API_BASE_URL);

// Interfaz para producto
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// Componente de lista de productos con observabilidad
const ProductList: React.FC = withObservability(
  ({
    products,
    onProductSelect,
  }: {
    products: Product[];
    onProductSelect: (product: Product) => void;
  }) => {
    const { logUIEvent } = useUILogger();
    const { createChildSpan } = useComponentTracing('ProductList');
    const { renderCount } = useDSPerformanceTracking('ProductList');

    const handleProductClick = (product: Product) => {
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

    return (
      <div className="product-list">
        <h2>Productos ({products.length})</h2>
        {products.map(product => (
          <ObservableCard
            key={product.id}
            variant="elevated"
            size="md"
            onInteraction={(action, data) => {
              logUIEvent({
                component: 'ProductCard',
                action,
                props: { productId: product.id, ...data },
              });
            }}
            onClick={() => handleProductClick(product)}
          >
            <h3>{product.name}</h3>
            <p>Precio: ${product.price}</p>
            <p>Stock: {product.stock}</p>
          </ObservableCard>
        ))}
      </div>
    );
  },
  'ProductList',
);

// Componente de formulario de producto con observabilidad
const ProductForm: React.FC = withObservability(
  ({
    onSubmit,
    initialData,
  }: {
    onSubmit: (data: Partial<Product>) => void;
    initialData?: Product;
  }) => {
    const { logUIEvent } = useUILogger();
    const { createChildSpan } = useComponentTracing('ProductForm');
    const { logInteraction } = useDSObservability('ProductForm');

    const [formData, setFormData] = useState({
      name: initialData?.name || '',
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
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

    const handleInputChange = (field: string, value: string | number) => {
      logInteraction('input_change', { field, value });
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <form onSubmit={handleSubmit} className="product-form">
        <h2>{initialData ? 'Editar Producto' : 'Crear Producto'}</h2>

        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <ObservableInput
            id="name"
            type="text"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            variant="default"
            size="md"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio:</label>
          <ObservableInput
            id="price"
            type="number"
            value={formData.price}
            onChange={e => handleInputChange('price', parseFloat(e.target.value))}
            variant="default"
            size="md"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <ObservableInput
            id="stock"
            type="number"
            value={formData.stock}
            onChange={e => handleInputChange('stock', parseInt(e.target.value))}
            variant="default"
            size="md"
            required
          />
        </div>

        <ObservableButton
          type="submit"
          variant="primary"
          size="lg"
          onInteraction={(action, data) => {
            logUIEvent({
              component: 'ProductForm',
              action: 'button_click',
              props: { buttonType: 'submit', ...data },
            });
          }}
        >
          {initialData ? 'Actualizar' : 'Crear'} Producto
        </ObservableButton>
      </form>
    );
  },
  'ProductForm',
);

// Componente principal de la aplicación
const App: React.FC = () => {
  const { logError } = useErrorLogger();
  const { logUIEvent } = useUILogger();
  const { createChildSpan } = useComponentTracing('App');
  const { renderCount } = useDSPerformanceTracking('App');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar productos al montar el componente
  useEffect(() => {
    const loadProducts = async() => {
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
        logDSMetric('App', 'products_load_time', performance.now(), {
          count: data.products?.length || 0,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logError(error, 'loadProducts');
        setError('Error al cargar productos');

        // Registrar error del DS
        logDSError('App', error, {
          operation: 'load_products',
          timestamp: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
        if (span) span.end();
      }
    };

    loadProducts();
  }, [createChildSpan, logUIEvent, logError]);

  // Manejar creación/actualización de producto
  const handleProductSubmit = async(productData: Partial<Product>) => {
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
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logError(error, 'productSubmit');
      setError('Error al guardar producto');

      logDSError('App', error, {
        operation: 'product_submit',
        productData,
      });
    } finally {
      if (span) span.end();
    }
  };

  // Manejar selección de producto
  const handleProductSelect = (product: Product) => {
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
    return (
      <div className="loading">
        <ObservableCard variant="default" size="md">
          <p>Cargando productos...</p>
        </ObservableCard>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Dashboard de Productos</h1>
        <ObservableButton
          variant="primary"
          size="md"
          onClick={handleCreateNew}
          onInteraction={(action, data) => {
            logUIEvent({
              component: 'App',
              action: 'header_button_click',
              props: data,
            });
          }}
        >
          Nuevo Producto
        </ObservableButton>
      </header>

      {error && (
        <div className="error">
          <ObservableCard variant="outlined" size="md">
            <p>Error: {error}</p>
            <ObservableButton variant="secondary" size="sm" onClick={() => setError(null)}>
              Cerrar
            </ObservableButton>
          </ObservableCard>
        </div>
      )}

      <main className="app-main">
        {showForm ? (
          <ProductForm onSubmit={handleProductSubmit} initialData={selectedProduct || undefined} />
        ) : (
          <ProductList products={products} onProductSelect={handleProductSelect} />
        )}
      </main>

      <footer className="app-footer">
        <ObservableCard variant="default" size="sm">
          <p>Renderizado {renderCount} veces</p>
          <p>Productos: {products.length}</p>
        </ObservableCard>
      </footer>
    </div>
  );
};

export default App;
