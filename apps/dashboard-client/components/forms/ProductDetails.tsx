'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface ProductDetailsProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetails({ product, isOpen, onClose }: ProductDetailsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Detalles del Producto
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {product.imagen && (
                <Image
                  src={product.imagen}
                  alt={product.nombre}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{product.nombre}</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  €{product.precio.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                  Stock: {product.stock}
                </Badge>
                {product.categoria && <Badge variant="secondary">{product.categoria}</Badge>}
              </div>

              {product.descripcion && (
                <div>
                  <h4 className="font-semibold mb-2">Descripción</h4>
                  <p className="text-gray-600">{product.descripcion}</p>
                </div>
              )}

              <div className="pt-4">
                <p className="text-sm text-gray-500">ID del producto: #{product.id}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
