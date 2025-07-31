export interface WebSocketMessage {
  type: "SALES_UPDATE" | "ORDER_UPDATE" | "CUSTOMER_UPDATE" | "PRODUCT_UPDATE" | "ANALYTICS_UPDATE"
  data: any
  timestamp: string
  id: string
}

export interface RealTimeSalesUpdate {
  revenue: number
  orders: number
  customers: number
  timestamp: string
  change: {
    revenue: number
    orders: number
    customers: number
  }
}

export interface RealTimeOrderUpdate {
  orderId: string
  productName: string
  category: string
  amount: number
  customerId: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  timestamp: string
}

export interface RealTimeCustomerUpdate {
  customerId: string
  type: "new" | "returning"
  location?: string
  totalSpent: number
  timestamp: string
}

export interface RealTimeProductUpdate {
  productId: string
  name: string
  category: string
  salesCount: number
  revenue: number
  stockLevel: number
  timestamp: string
}

export interface WebSocketConfig {
  url: string
  reconnectInterval: number
  maxReconnectAttempts: number
  heartbeatInterval: number
}

export interface ConnectionStatus {
  connected: boolean
  reconnecting: boolean
  lastConnected?: Date
  reconnectAttempts: number
  error?: string
}
