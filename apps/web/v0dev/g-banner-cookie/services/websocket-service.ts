import type {
  WebSocketMessage,
  WebSocketConfig,
  ConnectionStatus,
  RealTimeSalesUpdate,
  RealTimeOrderUpdate,
  RealTimeCustomerUpdate,
  RealTimeProductUpdate,
} from "../types/websocket-types"

export class WebSocketService {
  private ws: WebSocket | null = null
  private config: WebSocketConfig
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private connectionStatus: ConnectionStatus = {
    connected: false,
    reconnecting: false,
    reconnectAttempts: 0,
  }
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set()
  private heartbeatInterval: NodeJS.Timeout | null = null
  private reconnectTimeout: NodeJS.Timeout | null = null

  constructor(config: WebSocketConfig) {
    this.config = config
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // For demo purposes, we'll simulate a WebSocket connection
        // In production, this would be: this.ws = new WebSocket(this.config.url)
        this.simulateConnection()

        this.updateConnectionStatus({
          connected: true,
          reconnecting: false,
          lastConnected: new Date(),
          reconnectAttempts: 0,
          error: undefined,
        })

        this.startHeartbeat()
        this.startDataSimulation()
        resolve()
      } catch (error) {
        this.updateConnectionStatus({
          connected: false,
          reconnecting: false,
          reconnectAttempts: this.connectionStatus.reconnectAttempts,
          error: error instanceof Error ? error.message : "Connection failed",
        })
        reject(error)
      }
    })
  }

  private simulateConnection() {
    // Simulate WebSocket connection for demo
    console.log("🔌 WebSocket connection established (simulated)")
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.connectionStatus.connected) {
        // Send heartbeat
        console.log("💓 Heartbeat sent")
      }
    }, this.config.heartbeatInterval)
  }

  private startDataSimulation() {
    // Simulate real-time sales updates
    setInterval(() => {
      if (this.connectionStatus.connected) {
        this.simulateSalesUpdate()
      }
    }, 5000)

    // Simulate real-time order updates
    setInterval(() => {
      if (this.connectionStatus.connected) {
        this.simulateOrderUpdate()
      }
    }, 8000)

    // Simulate real-time customer updates
    setInterval(() => {
      if (this.connectionStatus.connected) {
        this.simulateCustomerUpdate()
      }
    }, 12000)

    // Simulate real-time product updates
    setInterval(() => {
      if (this.connectionStatus.connected) {
        this.simulateProductUpdate()
      }
    }, 15000)
  }

  private simulateSalesUpdate() {
    const salesUpdate: RealTimeSalesUpdate = {
      revenue: Math.random() * 100 + 50,
      orders: Math.floor(Math.random() * 5) + 1,
      customers: Math.floor(Math.random() * 3) + 1,
      timestamp: new Date().toISOString(),
      change: {
        revenue: (Math.random() - 0.5) * 20,
        orders: Math.floor((Math.random() - 0.5) * 4),
        customers: Math.floor((Math.random() - 0.5) * 2),
      },
    }

    this.emit("SALES_UPDATE", salesUpdate)
  }

  private simulateOrderUpdate() {
    const products = [
      "Ochío Tradicional",
      "Aceite de Oliva Virgen",
      "Queso Semicurado",
      "Miel de Azahar",
      "Jamón Ibérico",
      "Pan de Pueblo",
    ]
    const categories = ["panaderia", "aceite", "queseria", "miel", "embutidos"]

    const orderUpdate: RealTimeOrderUpdate = {
      orderId: `ORD-${Date.now()}`,
      productName: products[Math.floor(Math.random() * products.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      amount: Math.random() * 50 + 10,
      customerId: `CUST-${Math.floor(Math.random() * 1000)}`,
      status: Math.random() > 0.8 ? "pending" : "confirmed",
      timestamp: new Date().toISOString(),
    }

    this.emit("ORDER_UPDATE", orderUpdate)
  }

  private simulateCustomerUpdate() {
    const customerUpdate: RealTimeCustomerUpdate = {
      customerId: `CUST-${Date.now()}`,
      type: Math.random() > 0.6 ? "new" : "returning",
      location: ["Madrid", "Barcelona", "Valencia", "Sevilla"][Math.floor(Math.random() * 4)],
      totalSpent: Math.random() * 200 + 25,
      timestamp: new Date().toISOString(),
    }

    this.emit("CUSTOMER_UPDATE", customerUpdate)
  }

  private simulateProductUpdate() {
    const products = [
      { name: "Ochío Tradicional", category: "panaderia" },
      { name: "Aceite de Oliva Virgen", category: "aceite" },
      { name: "Queso Semicurado", category: "queseria" },
      { name: "Miel de Azahar", category: "miel" },
    ]

    const product = products[Math.floor(Math.random() * products.length)]

    const productUpdate: RealTimeProductUpdate = {
      productId: `PROD-${Date.now()}`,
      name: product.name,
      category: product.category,
      salesCount: Math.floor(Math.random() * 10) + 1,
      revenue: Math.random() * 100 + 20,
      stockLevel: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date().toISOString(),
    }

    this.emit("PRODUCT_UPDATE", productUpdate)
  }

  private emit(type: WebSocketMessage["type"], data: any) {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: new Date().toISOString(),
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    const listeners = this.listeners.get(type)
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data)
        } catch (error) {
          console.error("Error in WebSocket listener:", error)
        }
      })
    }

    // Also emit to general analytics listeners
    const analyticsListeners = this.listeners.get("ANALYTICS_UPDATE")
    if (analyticsListeners) {
      analyticsListeners.forEach((listener) => {
        try {
          listener({ type, data, timestamp: message.timestamp })
        } catch (error) {
          console.error("Error in analytics listener:", error)
        }
      })
    }
  }

  subscribe(eventType: WebSocketMessage["type"], callback: (data: any) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }

    this.listeners.get(eventType)!.add(callback)

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType)
      if (listeners) {
        listeners.delete(callback)
        if (listeners.size === 0) {
          this.listeners.delete(eventType)
        }
      }
    }
  }

  subscribeToConnectionStatus(callback: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(callback)

    // Send current status immediately
    callback(this.connectionStatus)

    return () => {
      this.statusListeners.delete(callback)
    }
  }

  private updateConnectionStatus(status: Partial<ConnectionStatus>) {
    this.connectionStatus = { ...this.connectionStatus, ...status }
    this.statusListeners.forEach((listener) => {
      try {
        listener(this.connectionStatus)
      } catch (error) {
        console.error("Error in connection status listener:", error)
      }
    })
  }

  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.updateConnectionStatus({
      connected: false,
      reconnecting: false,
      reconnectAttempts: 0,
    })

    console.log("🔌 WebSocket disconnected")
  }

  private async reconnect() {
    if (this.connectionStatus.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.updateConnectionStatus({
        connected: false,
        reconnecting: false,
        error: "Max reconnection attempts reached",
      })
      return
    }

    this.updateConnectionStatus({
      connected: false,
      reconnecting: true,
      reconnectAttempts: this.connectionStatus.reconnectAttempts + 1,
    })

    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect()
      } catch (error) {
        console.error("Reconnection failed:", error)
        this.reconnect()
      }
    }, this.config.reconnectInterval)
  }

  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus }
  }

  isConnected(): boolean {
    return this.connectionStatus.connected
  }
}

// Singleton instance
let wsService: WebSocketService | null = null

export const getWebSocketService = (): WebSocketService => {
  if (!wsService) {
    wsService = new WebSocketService({
      url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws",
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
    })
  }
  return wsService
}
