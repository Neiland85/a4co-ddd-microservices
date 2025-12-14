'use client';

import { Badge } from '../ui/badge';
import { OrderTimeline } from './OrderTimeline';
import type { Order, OrderStatus } from '@dashboard/lib/types';

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              Orden #{order.orderId || order.id}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Creada el{' '}
              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {order.shippingAddress && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Dirección de Entrega
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{order.shippingAddress}</p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Productos
        </h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  {item.productName || `Producto ${item.productId}`}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Cantidad: {item.quantity} × €{item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                €{item.total.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-slate-900 dark:text-white">Total</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              €{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      {order.events && order.events.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Historial de Eventos
          </h3>
          <OrderTimeline events={order.events} />
        </div>
      )}
    </div>
  );
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variants: Record<OrderStatus, any> = {
    PENDING: 'pending',
    PROCESSING: 'pending',
    CONFIRMED: 'success',
    COMPLETED: 'success',
    CANCELLED: 'destructive',
    FAILED: 'failed',
  };

  const labels: Record<OrderStatus, string> = {
    PENDING: 'Pendiente',
    PROCESSING: 'Procesando',
    CONFIRMED: 'Confirmada',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
    FAILED: 'Fallida',
  };

  return (
    <Badge variant={variants[status] || 'default'} className="text-base px-3 py-1">
      {labels[status] || status}
    </Badge>
  );
}
