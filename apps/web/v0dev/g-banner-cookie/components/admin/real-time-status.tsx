'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wifi, RefreshCw, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWebSocket } from '../../hooks/use-websocket';

interface RealTimeStatusProps {
  className?: string;
  showDetails?: boolean;
}

export default function RealTimeStatus({ className, showDetails = false }: RealTimeStatusProps) {
  const { connectionStatus, disconnect, isConnected } = useWebSocket();
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  useEffect(() => {
    if (isConnected) {
      setLastActivity(new Date());
    }
  }, [isConnected]);

  const getStatusColor = () => {
    if (connectionStatus.connected) return 'text-green-600';
    if (connectionStatus.reconnecting) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadgeVariant = () => {
    if (connectionStatus.connected) return 'default';
    if (connectionStatus.reconnecting) return 'secondary';
    return 'destructive';
  };

  const getStatusIcon = () => {
    if (connectionStatus.connected) return CheckCircle;
    if (connectionStatus.reconnecting) return RefreshCw;
    return AlertCircle;
  };

  const getStatusText = () => {
    if (connectionStatus.connected) return 'Conectado';
    if (connectionStatus.reconnecting) return 'Reconectando...';
    return 'Desconectado';
  };

  const StatusIcon = getStatusIcon();

  if (!showDetails) {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className="flex items-center space-x-1">
          <div
            className={cn('h-2 w-2 rounded-full', {
              'animate-pulse bg-green-500': connectionStatus.connected,
              'animate-pulse bg-yellow-500': connectionStatus.reconnecting,
              'bg-red-500': !connectionStatus.connected && !connectionStatus.reconnecting,
            })}
          />
          <span className={cn('text-sm font-medium', getStatusColor())}>{getStatusText()}</span>
        </div>
        {connectionStatus.connected && (
          <Activity className="h-4 w-4 animate-pulse text-green-600" />
        )}
      </div>
    );
  }

  return (
    <Card className={cn('shadow-natural-md', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={cn('rounded-lg p-2', {
                'bg-green-50': connectionStatus.connected,
                'bg-yellow-50': connectionStatus.reconnecting,
                'bg-red-50': !connectionStatus.connected && !connectionStatus.reconnecting,
              })}
            >
              <StatusIcon
                className={cn('h-5 w-5', getStatusColor(), {
                  'animate-spin': connectionStatus.reconnecting,
                })}
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">Estado de Conexión</h4>
                <Badge variant={getStatusBadgeVariant()}>{getStatusText()}</Badge>
              </div>

              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                {connectionStatus.connected && (
                  <div className="flex items-center space-x-1">
                    <Wifi className="h-3 w-3" />
                    <span>Tiempo real activo</span>
                  </div>
                )}

                {connectionStatus.lastConnected && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      Última conexión: {connectionStatus.lastConnected.toLocaleTimeString()}
                    </span>
                  </div>
                )}

                {connectionStatus.reconnectAttempts > 0 && (
                  <div className="flex items-center space-x-1">
                    <RefreshCw className="h-3 w-3" />
                    <span>Intentos: {connectionStatus.reconnectAttempts}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {connectionStatus.connected && (
              <div className="flex items-center space-x-1 text-green-600">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Live</span>
              </div>
            )}

            {connectionStatus.error && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Reintentar
              </Button>
            )}
          </div>
        </div>

        {connectionStatus.error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{connectionStatus.error}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
