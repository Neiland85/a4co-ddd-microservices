'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { OrderDetail } from '@/components/orders/OrderDetail';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@dashboard/lib/context/ToastContext';
import { ordersService } from '@dashboard/lib/services';
import type { Order } from '@dashboard/lib/types';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = params.id as string;

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await ordersService.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      showToast('Error al cargar la orden', 'error');
      router.push('/dashboard/orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
          Orden no encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={() => router.push('/dashboard/orders')}
        variant="ghost"
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a órdenes
      </Button>

      <OrderDetail order={order} />
    </div>
  );
}
