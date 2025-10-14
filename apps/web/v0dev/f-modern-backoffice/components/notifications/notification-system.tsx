'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, Wifi, WifiOff, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Notification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NOTIFICATION_TEMPLATES = [
  {
    type: 'warning' as const,
    title: 'Alto uso de CPU',
    message: 'El servidor está experimentando un alto uso de CPU (85%)',
  },
  {
    type: 'error' as const,
    title: 'Error de conexión',
    message: 'Falló la conexión con el servicio de autenticación',
  },
  {
    type: 'info' as const,
    title: 'Actualización disponible',
    message: 'Nueva versión del sistema disponible (v2.1.3)',
  },
  {
    type: 'success' as const,
    title: 'Backup completado',
    message: 'El backup automático se completó exitosamente',
  },
] as const;

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Mantener solo 5 notificaciones

    // Auto-remove non-persistent notifications
    if (!notification.persistent) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Optimized notification simulation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextNotification = () => {
      // Random delay between 10-30 seconds
      const delay = Math.random() * 20000 + 10000;

      timeoutId = setTimeout(() => {
        if (Math.random() < 0.3) {
          // 30% chance
          const template =
            NOTIFICATION_TEMPLATES[Math.floor(Math.random() * NOTIFICATION_TEMPLATES.length)];
          addNotification(template);
        }
        scheduleNextNotification();
      }, delay);
    };

    scheduleNextNotification();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [addNotification]);

  // Connection status simulation
  useEffect(() => {
    let connectivityTimeoutId: NodeJS.Timeout;

    const scheduleConnectivityChange = () => {
      const delay = Math.random() * 30000 + 20000; // 20-50 seconds

      connectivityTimeoutId = setTimeout(() => {
        if (Math.random() < 0.1) {
          // 10% chance
          const newStatus = connectionStatus === 'online' ? 'offline' : 'online';
          setConnectionStatus(newStatus);

          addNotification({
            type: newStatus === 'online' ? 'success' : 'error',
            title: newStatus === 'online' ? 'Conexión restaurada' : 'Conexión perdida',
            message:
              newStatus === 'online'
                ? 'La conexión con los servicios se ha restaurado'
                : 'Se perdió la conexión con los servicios principales',
            persistent: newStatus === 'offline',
          });
        }
        scheduleConnectivityChange();
      }, delay);
    };

    scheduleConnectivityChange();

    return () => {
      if (connectivityTimeoutId) {
        clearTimeout(connectivityTimeoutId);
      }
    };
  }, [connectionStatus, addNotification]);

  const notificationIcon = useMemo(
    () => ({
      error: <AlertTriangle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />,
    }),
    []
  );

  const notificationColors = useMemo(
    () => ({
      error: 'border-red-500 bg-red-50 dark:bg-red-950',
      warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
      info: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
      success: 'border-green-500 bg-green-50 dark:bg-green-950',
    }),
    []
  );

  return (
    <>
      {/* Connection Status Indicator */}
      <div className="fixed right-4 top-16 z-40">
        <Badge
          variant={connectionStatus === 'online' ? 'default' : 'destructive'}
          className="flex items-center space-x-1"
        >
          {connectionStatus === 'online' ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span>{connectionStatus === 'online' ? 'En línea' : 'Sin conexión'}</span>
        </Badge>
      </div>

      {/* Notifications */}
      <div className="fixed right-4 top-20 z-50 w-80 space-y-2">
        {notifications.map(notification => (
          <Alert
            key={notification.id}
            className={`relative border-l-4 ${notificationColors[notification.type]} transition-all duration-300 ease-in-out`}
          >
            <div className="flex items-start space-x-2">
              <div className="mt-0.5 flex-shrink-0">{notificationIcon[notification.type]}</div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{notification.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <AlertDescription className="mt-1 text-xs">{notification.message}</AlertDescription>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                  {notification.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={notification.action.onClick}
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </>
  );
}
