'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { LoadingButton } from '../common/LoadingSpinner';
import { useToast } from '@dashboard/lib/context/ToastContext';
import { ordersService } from '@dashboard/lib/services';
import type { Product } from '@dashboard/lib/types';

interface BuyModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BuyModal({ product, isOpen, onClose }: BuyModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!product) return null;

  const totalPrice = product.price * quantity;
  const maxQuantity = Math.min(product.stock, 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingAddress.trim()) {
      showToast('Por favor ingresa una dirección de entrega', 'warning');
      return;
    }

    if (quantity > product.stock) {
      showToast('Cantidad no disponible en stock', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await ordersService.createOrder({
        items: [
          {
            productId: product.id,
            quantity,
          },
        ],
        shippingAddress,
      });

      showToast('¡Orden creada exitosamente!', 'success');
      onClose();
      router.push(`/dashboard/orders/${response.orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      showToast(
        error instanceof Error ? error.message : 'Error al crear la orden',
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setQuantity(1);
      setShippingAddress('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Confirmar Compra" size="md">
      <form onSubmit={handleSubmit}>
        {/* Product Summary */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {product.description}
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            €{product.price.toFixed(2)} / unidad
          </p>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Cantidad
          </label>
          <input
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            disabled={isLoading}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Máximo: {product.stock} unidades
          </p>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Dirección de Entrega
          </label>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            placeholder="Calle, número, ciudad, código postal..."
            disabled={isLoading}
            required
          />
        </div>

        {/* Total */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Total a pagar:
            </span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              €{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? <LoadingButton>Procesando...</LoadingButton> : 'Confirmar Compra'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
