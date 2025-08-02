"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, Activity, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

export function RealTimeStatus() {
  const { connectionStatus, connect, disconnect } = useWebSocket()

  const getStatusIcon = () => {
    if (connectionStatus.isConnected) {
      return <CheckCircle className="w-4 h-4 text-green-600" />
    } else if (connectionStatus.error) {
      return <AlertCircle className="w-4 h-4 text-red-600" />
    } else {
      return <WifiOff className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusText = () => {
    if (connectionStatus.isConnected) {
      return "Conectado"
    } else if (connectionStatus.error) {
      return "Error de conexión"
    } else {
      return "Desconectado"
    }
  }

  const getStatusColor = () => {
    if (connectionStatus.isConnected) {
      return "bg-green-100 text-green-800"
    } else if (connectionStatus.error) {
      return "bg-red-100 text-red-800"
    } else {
      return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
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
          <Badge className={getStatusColor()}>{connectionStatus.isConnected ? "Online" : "Offline"}</Badge>
        </div>

        {connectionStatus.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{connectionStatus.error}</p>
          </div>
        )}

        {connectionStatus.reconnectAttempts > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">Intentos de reconexión: {connectionStatus.reconnectAttempts}</p>
          </div>
        )}

        <div className="flex gap-2">
          {connectionStatus.isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={disconnect}
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              <WifiOff className="w-4 h-4 mr-2" />
              Desconectar
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={connect}
              className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
            >
              <Wifi className="w-4 h-4 mr-2" />
              Conectar
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
