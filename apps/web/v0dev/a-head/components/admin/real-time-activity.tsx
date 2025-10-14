'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Package, ShoppingCart, User, X } from 'lucide-react';
import { useWebSocketNotifications } from '@/hooks/use-websocket';
import type { WebSocketMessage } from '@/types/websocket-types';

export function RealTimeActivity() {
  const { notifications, clearNotifications, removeNotification } = useWebSocketNotifications();
  const [activities, setActivities] = useState<WebSocketMessage[]>([]);

  // Simulate real-time activities for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const mockActivities = [
        {
          id: Math.random().toString(),
          type: 'notification' as const,
          data: {
            title: 'Nuevo pedido',
            message: 'Pedido #1234 recibido de María García',
            severity: 'info' as const,
            icon: 'ShoppingCart',
          },
          timestamp: new Date(),
        },
        {
          id: Math.random().toString(),
          type: 'notification' as const,
          data: {
            title: 'Producto agotado',
            message: 'Aceite de Oliva Virgen Extra sin stock',
            severity: 'warning' as const,
            icon: 'Package',
          },
          timestamp: new Date(),
        },
        {
          id: Math.random().toString(),
          type: 'notification' as const,
          data: {
            title: 'Nuevo usuario',
            message: 'Carlos López se ha registrado',
            severity: 'success' as const,
            icon: 'User',
          },
          timestamp: new Date(),
        },
      ];

      const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
      setActivities(prev => [randomActivity, ...prev.slice(0, 19)]); // Keep last 20
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (iconName: string, severity: string) => {
    const iconProps = {
      className: `w-4 h-4 ${
        severity === 'error'
          ? 'text-red-600'
          : severity === 'warning'
            ? 'text-yellow-600'
            : severity === 'success'
              ? 'text-green-600'
              : 'text-blue-600'
      }`,
    };

    switch (iconName) {
      case 'ShoppingCart':
        return <ShoppingCart {...iconProps} />;
      case 'Package':
        return <Package {...iconProps} />;
      case 'User':
        return <User {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const allActivities = [...notifications, ...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            Actividad en Tiempo Real
            {allActivities.length > 0 && (
              <Badge className="bg-orange-100 text-orange-800">{allActivities.length}</Badge>
            )}
          </CardTitle>
          {allActivities.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
              className="text-gray-600 hover:text-gray-900"
            >
              Limpiar todo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {allActivities.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">No hay actividad reciente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allActivities.map(activity => (
                <div
                  key={activity.id}
                  className="group flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {getActivityIcon(activity.data.icon || 'Bell', activity.data.severity)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.data.title}</p>
                        <p className="text-sm text-gray-600">{activity.data.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(activity.data.severity)}>
                          {activity.data.severity}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(activity.id)}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
