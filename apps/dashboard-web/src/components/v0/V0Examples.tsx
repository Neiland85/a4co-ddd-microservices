// 📚 Ejemplo de uso del V0ComponentTemplate
// Demostrando cómo usar el template base para componentes V0

import React, { useState } from 'react';
import V0ComponentTemplate, {
  V0CardTemplate,
  V0ModalTemplate,
  useV0State,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from './V0ComponentTemplate';
import { useProducts } from '../../hooks/useProducts';

// 🎨 Ejemplo 1: Componente básico con template
export const ProductDisplayExample: React.FC = () => {
  const { products, loading, error } = useProducts();

  return (
    <V0ComponentTemplate
      title="Productos Locales"
      description="Catálogo de productos artesanales de Jaén"
      variant="primary"
      size="md"
      loading={loading}
      onAction={() => console.log('Acción ejecutada')}
      onCancel={() => console.log('Operación cancelada')}
    >
      {error && <ErrorMessage message={error} />}

      {products.length === 0 && !loading && (
        <EmptyState
          title="No hay productos"
          description="No se encontraron productos disponibles"
          icon="🛒"
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <V0CardTemplate
            key={product.id}
            title={product.name}
            content={
              <div>
                <p className="text-gray-600 text-sm mb-3">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    €{product.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.producer}
                  </span>
                </div>
              </div>
            }
            footer={
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Ver Detalles
              </button>
            }
          />
        ))}
      </div>
    </V0ComponentTemplate>
  );
};

// 🎨 Ejemplo 2: Modal con template
export const ProductModalExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { value: selectedProduct } = useV0State<any>(null);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Abrir Modal de Producto
      </button>

      <V0ModalTemplate
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Detalles del Producto"
        size="lg"
      >
        <V0ComponentTemplate
          title={selectedProduct?.name || 'Producto'}
          description="Información detallada del producto seleccionado"
          variant="default"
          size="sm"
        >
          {selectedProduct ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Descripción</h4>
                <p className="text-gray-600">{selectedProduct.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Productor</h4>
                <p className="text-gray-600">{selectedProduct.producer}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Precio</h4>
                <p className="text-2xl font-bold text-green-600">
                  €{selectedProduct.price}
                </p>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Selecciona un producto"
              description="Elige un producto para ver sus detalles"
              icon="📦"
            />
          )}
        </V0ComponentTemplate>
      </V0ModalTemplate>
    </>
  );
};

// 🎨 Ejemplo 3: Componente con estado avanzado
export const AdvancedV0Example: React.FC = () => {
  const {
    value: formData,
    updateValue: setFormData,
    isLoading,
    error,
  } = useV0State({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async () => {
    // Simular envío de formulario
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Formulario enviado:', formData);
  };

  return (
    <V0ComponentTemplate
      title="Contacto con Productores"
      description="Envía un mensaje directo a los productores locales"
      variant="accent"
      size="lg"
      loading={isLoading}
      onAction={handleSubmit}
      onCancel={() => setFormData({ name: '', email: '', message: '' })}
    >
      {error && <ErrorMessage message={error} />}

      <form className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mensaje
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Escribe tu mensaje aquí..."
          />
        </div>
      </form>
    </V0ComponentTemplate>
  );
};

// 🎨 Ejemplo 4: Lista con loading states
export const LoadingStateExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    // Simular carga de datos
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setData(['Elemento 1', 'Elemento 2', 'Elemento 3']);
    setIsLoading(false);
  };

  return (
    <V0ComponentTemplate
      title="Estados de Carga"
      description="Ejemplo de manejo de estados de loading"
      variant="secondary"
      onAction={loadData}
    >
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Cargando datos...</span>
        </div>
      )}

      {!isLoading && data.length === 0 && (
        <EmptyState
          title="No hay datos"
          description="Haz clic en 'Acción' para cargar datos"
          icon="📊"
        />
      )}

      {!isLoading && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={`item-${item}`} className="bg-gray-50 p-3 rounded border">
              {item}
            </li>
          ))}
        </ul>
      )}
    </V0ComponentTemplate>
  );
};

// 💡 Instrucciones de uso:
/*
1. Importa el V0ComponentTemplate y sus componentes auxiliares
2. Usa el template principal para envolver tu contenido V0
3. Utiliza los componentes auxiliares (V0CardTemplate, V0ModalTemplate) según necesites
4. Aprovecha los hooks (useV0State, useLoadingState) para manejar estados
5. Personaliza las variantes y tamaños según tu diseño

Ejemplos de integración:
- ProductDisplayExample: Muestra cómo integrar con hooks existentes
- ProductModalExample: Demuestra el uso de modales
- AdvancedV0Example: Manejo de formularios con estado
- LoadingStateExample: Diferentes estados de carga
*/
