'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Activity, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useWebSocket } from '@/hooks/use-websocket';

export function RealTimeStatus() {
  const { connectionStatus, connect, disconnect } = useWebSocket();

  const getStatusIcon = () => {
    if (connectionStatus.isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (connectionStatus.error) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    } else {
      return <WifiOff className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusText = () => {
    if (connectionStatus.isConnected) {
      return 'Conectado';
    } else if (connectionStatus.error) {
      return 'Error de conexión';
    } else {
      return 'Desconectado';
    }
  };

  const getStatusColor = () => {
    if (connectionStatus.isConnected) {
      return 'bg-green-100 text-green-800';
    } else if (connectionStatus.error) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Estado de Conexión en Tiempo Real
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="font-medium text-gray-900">{getStatusText()}</p>
              {connectionStatus.lastConnected && (
                <p className="text-sm text-gray-600">
                  Última conexión: {connectionStatus.lastConnected.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {connectionStatus.isConnected ? 'Online' : 'Offline'}
          </Badge>
        </div>

        {connectionStatus.error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{connectionStatus.error}</p>
          </div>
        )}

        {connectionStatus.reconnectAttempts > 0 && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
            <p className="text-sm text-yellow-700">
              Intentos de reconexión: {connectionStatus.reconnectAttempts}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {connectionStatus.isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={disconnect}
              className="border-red-200 bg-transparent text-red-600 hover:bg-red-50"
            >
              <WifiOff className="mr-2 h-4 w-4" />
              Desconectar
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={connect}
              className="border-green-200 bg-transparent text-green-600 hover:bg-green-50"
            >
              <Wifi className="mr-2 h-4 w-4" />
              Conectar
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
