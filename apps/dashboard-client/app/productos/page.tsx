'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAnime } from '@/hooks/useAnime';
import { ProductForm } from '@/components/forms/ProductForm';
import { ProductDetails } from '@/components/forms/ProductDetails';
import Image from 'next/image';

interface Product {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
  categoria?: string;
  imagen?: string;
}

export default function ProductosPage() {
  const gridRef = useAnime({
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    delay: 100, // Simple delay instead of stagger
  });

  // Estado para modales
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  // Datos mock para productos
  const [productos, setProductos] = useState<Product[]>([
    {
      id: 1,
      nombre: 'Jarrón de Cerámica',
      precio: 45,
      stock: 10,
      imagen: '/placeholder.jpg',
      categoria: 'ceramica',
      descripcion: 'Jarrón artesanal hecho a mano',
    },
    {
      id: 2,
      nombre: 'Bolso Tejido',
      precio: 80,
      stock: 5,
      imagen: '/placeholder.jpg',
      categoria: 'tejido',
      descripcion: 'Bolso tejido con lana natural',
    },
  ]);

  // Handlers para botones
  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleSaveProduct = (productData: Product) => {
    if (selectedProduct?.id) {
      // Editar producto existente
      setProductos((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...productData, id: selectedProduct.id } : p,
        ),
      );
    } else {
      // Agregar nuevo producto
      const newProduct = { ...productData, id: Date.now() };
      setProductos((prev) => [...prev, newProduct]);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Productos</h1>
        <Button onClick={handleAddProduct}>Agregar Producto</Button>
      </div>
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((producto) => (
          <Card
            key={producto.id}
            className="shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_6px_rgba(0,0,0,0.07)]"
          >
            <CardHeader>
              <CardTitle>{producto.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={producto.imagen || '/placeholder.jpg'}
                alt={producto.nombre}
                width={200}
                height={150}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <p>Precio: ${producto.precio}</p>
              <Badge variant="secondary">Stock: {producto.stock}</Badge>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => handleEditProduct(producto)}>
                  Editar
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleViewProduct(producto)}>
                  Ver
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modales */}
      <ProductForm
        product={selectedProduct}
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
        onSave={handleSaveProduct}
      />

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          isOpen={showProductDetails}
          onClose={() => setShowProductDetails(false)}
        />
      )}
    </div>
  );
}
