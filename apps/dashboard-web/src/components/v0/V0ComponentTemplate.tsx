// 🎨 Template Simple para Componentes V0
// Ejemplo de cómo integrar un componente generado en V0.dev

import React from 'react';
import { useProducts } from '../../hooks/useProducts';

// 🔗 Ejemplo de componente V0 integrado
export default function V0ComponentExample() {
  // Conectar con nuestros hooks
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent"></div>
        <span className="ml-2 text-amber-700">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

  // Placeholder para el código de V0
  return (
    <div className="v0-component-placeholder bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-xl border-2 border-dashed border-amber-300">
      <div className="text-center">
        <span className="text-4xl">🫒</span>
        <h3 className="text-xl font-bold text-amber-800 mt-2">
          Componente V0 Placeholder
        </h3>
        <p className="text-amber-600 mt-1 mb-4">
          Aquí se pega el código generado en V0.dev
        </p>
        <div className="text-sm text-amber-500">
          <p>Productos cargados: {products.length}</p>
          <p>Hook conectado: ✅</p>
        </div>
      </div>
    </div>
  );
}
