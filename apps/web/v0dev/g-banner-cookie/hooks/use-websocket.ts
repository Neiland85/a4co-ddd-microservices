"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { getWebSocketService } from "../services/websocket-service"
import type { WebSocketMessage, ConnectionStatus } from "../types/websocket-types"

export function useWebSocket() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    reconnecting: false,
    reconnectAttempts: 0,
  })
  const wsService = useRef(getWebSocketService())
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const service = wsService.current

    // Subscribe to connection status
    const unsubscribeStatus = service.subscribeToConnectionStatus(setConnectionStatus)

    // Initialize connection
    if (!isInitialized) {
      service.connect().catch(console.error)
      setIsInitialized(true)
    }

    return () => {
      unsubscribeStatus()
    }
  }, [isInitialized])

  const subscribe = useCallback((eventType: WebSocketMessage["type"], callback: (data: any) => void) => {
    return wsService.current.subscribe(eventType, callback)
  }, [])

  const disconnect = useCallback(() => {
    wsService.current.disconnect()
  }, [])

  return {
    connectionStatus,
    subscribe,
    disconnect,
    isConnected: connectionStatus.connected,
  }
}

export function useRealTimeData<T>(eventType: WebSocketMessage["type"]) {
  const [data, setData] = useState<T[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const { subscribe, isConnected } = useWebSocket()

  useEffect(() => {
    const unsubscribe = subscribe(eventType, (newData: T) => {
      setData((prevData) => {
        // Keep only last 100 items for performance
        const updatedData = [newData, ...prevData].slice(0, 100)
        return updatedData
      })
      setLastUpdate(new Date())
    })

    return unsubscribe
  }, [eventType, subscribe])

  const clearData = useCallback(() => {
    setData([])
    setLastUpdate(null)
  }, [])

  return {
    data,
    lastUpdate,
    isConnected,
    clearData,
  }
}
