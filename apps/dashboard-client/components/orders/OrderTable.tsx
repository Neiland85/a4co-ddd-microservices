'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';
import type { Order, OrderStatus } from '@dashboard/lib/types';

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-2">
          No hay órdenes registradas
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Las órdenes que crees aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              ID de Orden
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Fecha
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Total
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => router.push(`/dashboard/orders/${order.id}`)}
              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <td className="py-3 px-4 text-sm font-mono text-slate-900 dark:text-white">
                {order.orderId || order.id}
              </td>
              <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="py-3 px-4 text-sm text-right font-semibold text-slate-900 dark:text-white">
                €{order.totalAmount.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-center">
                <OrderStatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    <Badge variant={variants[status] || 'default'}>
      {labels[status] || status}
    </Badge>
  );
}
