'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
  Euro,
  CloudyIcon as Clear,
  Pause,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRealTimeData } from '../../hooks/use-websocket';
import type {
  RealTimeSalesUpdate,
  RealTimeOrderUpdate,
  RealTimeCustomerUpdate,
  RealTimeProductUpdate,
} from '../../types/websocket-types';

interface ActivityItem {
  id: string;
  type: 'sale' | 'order' | 'customer' | 'product';
  title: string;
  description: string;
  amount?: number;
  timestamp: Date;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

export default function RealTimeActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [maxItems, setMaxItems] = useState(50);

  const salesData = useRealTimeData<RealTimeSalesUpdate>('SALES_UPDATE');
  const orderData = useRealTimeData<RealTimeOrderUpdate>('ORDER_UPDATE');
  const customerData = useRealTimeData<RealTimeCustomerUpdate>('CUSTOMER_UPDATE');
  const productData = useRealTimeData<RealTimeProductUpdate>('PRODUCT_UPDATE');

  // Process sales updates
  useEffect(() => {
    if (isPaused || salesData.data.length === 0) return;

    const latestSale = salesData.data[0];
    const activity: ActivityItem = {
      id: `sale-${Date.now()}`,
      type: 'sale',
      title: 'Nueva Venta Registrada',
      description: `€${latestSale.revenue.toFixed(2)} en ${latestSale.orders} pedido${latestSale.orders > 1 ? 's' : ''}`,
      amount: latestSale.revenue,
      timestamp: new Date(latestSale.timestamp),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    };

    setActivities(prev => [activity, ...prev].slice(0, maxItems));
  }, [salesData.data, isPaused, maxItems]);

  // Process order updates
  useEffect(() => {
    if (isPaused || orderData.data.length === 0) return;

    const latestOrder = orderData.data[0];
    const activity: ActivityItem = {
      id: `order-${latestOrder.orderId}`,
      type: 'order',
      title: `Pedido ${latestOrder.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}`,
      description: `${latestOrder.productName} - €${latestOrder.amount.toFixed(2)}`,
      amount: latestOrder.amount,
      timestamp: new Date(latestOrder.timestamp),
      icon: ShoppingCart,
      color: latestOrder.status === 'confirmed' ? 'text-blue-600' : 'text-yellow-600',
      bgColor: latestOrder.status === 'confirmed' ? 'bg-blue-50' : 'bg-yellow-50',
    };

    setActivities(prev => [activity, ...prev].slice(0, maxItems));
  }, [orderData.data, isPaused, maxItems]);

  // Process customer updates
  useEffect(() => {
    if (isPaused || customerData.data.length === 0) return;

    const latestCustomer = customerData.data[0];
    const activity: ActivityItem = {
      id: `customer-${latestCustomer.customerId}`,
      type: 'customer',
      title: latestCustomer.type === 'new' ? 'Nuevo Cliente' : 'Cliente Recurrente',
      description: `${latestCustomer.location || 'Ubicación desconocida'} - €${latestCustomer.totalSpent.toFixed(2)}`,
      amount: latestCustomer.totalSpent,
      timestamp: new Date(latestCustomer.timestamp),
      icon: Users,
      color: latestCustomer.type === 'new' ? 'text-purple-600' : 'text-indigo-600',
      bgColor: latestCustomer.type === 'new' ? 'bg-purple-50' : 'bg-indigo-50',
    };

    setActivities(prev => [activity, ...prev].slice(0, maxItems));
  }, [customerData.data, isPaused, maxItems]);

  // Process product updates
  useEffect(() => {
    if (isPaused || productData.data.length === 0) return;

    const latestProduct = productData.data[0];
    const activity: ActivityItem = {
      id: `product-${latestProduct.productId}`,
      type: 'product',
      title: 'Actualización de Producto',
      description: `${latestProduct.name} - ${latestProduct.salesCount} ventas`,
      amount: latestProduct.revenue,
      timestamp: new Date(latestProduct.timestamp),
      icon: Package,
      color: 'text-a4co-olive-600',
      bgColor: 'bg-a4co-olive-50',
    };

    setActivities(prev => [activity, ...prev].slice(0, maxItems));
  }, [productData.data, isPaused, maxItems]);

  const clearActivities = () => {
    setActivities([]);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `hace ${seconds}s`;
    if (minutes < 60) return `hace ${minutes}m`;
    if (hours < 24) return `hace ${hours}h`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Card className="shadow-natural-lg hover:shadow-natural-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="text-a4co-olive-600 mr-2 h-5 w-5" />
              Actividad en Tiempo Real
            </CardTitle>
            <CardDescription>Actualizaciones en vivo de ventas, pedidos y clientes</CardDescription>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
              <Activity className="mr-1 h-3 w-3 animate-pulse" />
              {activities.length} eventos
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={togglePause}
              className={cn(
                'transition-all duration-300 hover:scale-105',
                isPaused
                  ? 'border-green-200 text-green-600 hover:bg-green-50'
                  : 'border-yellow-200 text-yellow-600 hover:bg-yellow-50'
              )}
            >
              {isPaused ? <Play className="mr-1 h-3 w-3" /> : <Pause className="mr-1 h-3 w-3" />}
              {isPaused ? 'Reanudar' : 'Pausar'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={clearActivities}
              className="border-red-200 bg-transparent text-red-600 transition-all duration-300 hover:scale-105 hover:bg-red-50"
            >
              <Clear className="mr-1 h-3 w-3" />
              Limpiar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isPaused && (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="flex items-center space-x-2">
              <Pause className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                Actualizaciones pausadas - Haz clic en "Reanudar" para continuar
              </span>
            </div>
          </div>
        )}

        <ScrollArea className="h-96">
          {activities.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-gray-500">
              <Activity className="mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">No hay actividad reciente</p>
              <p className="text-xs">Las actualizaciones aparecerán aquí en tiempo real</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className={cn(
                      'hover:shadow-natural-md group flex cursor-pointer items-start space-x-3 rounded-lg border p-3 transition-all duration-300',
                      activity.bgColor,
                      index === 0 && !isPaused ? 'animate-pulse border-2' : 'border'
                    )}
                  >
                    <div className={cn('rounded-lg p-2', activity.bgColor)}>
                      <Icon className={cn('h-4 w-4', activity.color)} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="group-hover:text-a4co-olive-600 font-medium text-gray-900 transition-colors">
                          {activity.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {activity.amount && (
                            <Badge variant="outline" className="bg-white/50">
                              <Euro className="mr-1 h-3 w-3" />
                              {activity.amount.toFixed(2)}
                            </Badge>
                          )}
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-1 text-sm text-gray-600">{activity.description}</p>

                      <div className="mt-2 flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={cn('text-xs', {
                            'border-green-200 bg-green-50 text-green-700': activity.type === 'sale',
                            'border-blue-200 bg-blue-50 text-blue-700': activity.type === 'order',
                            'border-purple-200 bg-purple-50 text-purple-700':
                              activity.type === 'customer',
                            'bg-a4co-olive-50 text-a4co-olive-700 border-a4co-olive-200':
                              activity.type === 'product',
                          })}
                        >
                          {activity.type === 'sale' && 'Venta'}
                          {activity.type === 'order' && 'Pedido'}
                          {activity.type === 'customer' && 'Cliente'}
                          {activity.type === 'product' && 'Producto'}
                        </Badge>

                        <span className="text-xs text-gray-400">
                          {activity.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {activities.length > 0 && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Mostrando {activities.length} de {maxItems} eventos máximos
              </span>
              <div className="flex items-center space-x-2">
                <span>Límite:</span>
                <select
                  value={maxItems}
                  onChange={e => setMaxItems(Number(e.target.value))}
                  className="rounded border border-gray-300 px-2 py-1 text-xs"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
