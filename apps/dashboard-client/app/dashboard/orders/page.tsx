'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { OrderTable } from '@/components/orders/OrderTable';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@dashboard/lib/context/ToastContext';
import { ordersService } from '@dashboard/lib/services';
import type { Order } from '@dashboard/lib/types';

export default function OrdersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      showToast('Error al cargar órdenes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await ordersService.getMyOrders();
      setOrders(data);
      showToast('Órdenes actualizadas', 'success');
    } catch (error) {
      console.error('Error refreshing orders:', error);
      showToast('Error al actualizar órdenes', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Órdenes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Historial de tus pedidos realizados
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <OrderTable orders={orders} />
      </div>
    </div>
  );
}
