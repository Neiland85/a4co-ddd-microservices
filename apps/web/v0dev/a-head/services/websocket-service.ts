import type { WebSocketMessage, WebSocketConfig, ConnectionStatus } from "@/types/websocket-types"

class WebSocketService {
  private ws: WebSocket | null = null
  private config: WebSocketConfig
  private listeners: Map<string, ((message: WebSocketMessage) => void)[]> = new Map()
  private connectionStatus: ConnectionStatus = {
    isConnected: false,
    reconnectAttempts: 0,
  }
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null

  constructor(config: WebSocketConfig) {
    this.config = config
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url)

        this.ws.onopen = () => {
          this.connectionStatus = {
            isConnected: true,
            lastConnected: new Date(),
            reconnectAttempts: 0,
          }
          this.startHeartbeat()
          this.notifyStatusChange()
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error("Error parsing WebSocket message:", error)
          }
        }

        this.ws.onclose = () => {
          this.connectionStatus.isConnected = false
          this.stopHeartbeat()
          this.notifyStatusChange()
          this.scheduleReconnect()
        }

        this.ws.onerror = (error) => {
          this.connectionStatus.error = "WebSocket connection error"
          this.notifyStatusChange()
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.stopHeartbeat()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.connectionStatus.isConnected = false
    this.notifyStatusChange()
  }

  send(message: Omit<WebSocketMessage, "id" | "timestamp">): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected")
    }

    const fullMessage: WebSocketMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date(),
    }

    this.ws.send(JSON.stringify(fullMessage))
  }

  subscribe(type: string, callback: (message: WebSocketMessage) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }

    this.listeners.get(type)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(type)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus }
  }

  private handleMessage(message: WebSocketMessage): void {
    // Handle heartbeat responses
    if (message.type === "heartbeat") {
      return
    }

    // Notify type-specific listeners
    const typeListeners = this.listeners.get(message.type)
    if (typeListeners) {
      typeListeners.forEach((callback) => callback(message))
    }

    // Notify global listeners
    const globalListeners = this.listeners.get("*")
    if (globalListeners) {
      globalListeners.forEach((callback) => callback(message))
    }
  }

  private scheduleReconnect(): void {
    if (this.connectionStatus.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.connectionStatus.error = "Max reconnection attempts reached"
      this.notifyStatusChange()
      return
    }

    this.reconnectTimer = setTimeout(() => {
      this.connectionStatus.reconnectAttempts++
      this.connect().catch(() => {
        // Reconnection failed, will be handled by onclose
      })
    }, this.config.reconnectInterval)
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({
          type: "heartbeat",
          data: { timestamp: Date.now() },
        })
      }
    }, this.config.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private notifyStatusChange(): void {
    const statusListeners = this.listeners.get("status")
    if (statusListeners) {
      statusListeners.forEach((callback) =>
        callback({
          type: "update",
          data: this.connectionStatus,
          timestamp: new Date(),
          id: this.generateId(),
        }),
      )
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}

// Default configuration
const defaultConfig: WebSocketConfig = {
  url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080",
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
}

export const webSocketService = new WebSocketService(defaultConfig)
