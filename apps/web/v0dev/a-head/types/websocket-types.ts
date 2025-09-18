export interface WebSocketMessage {
  type:
    | 'SALES_UPDATE'
    | 'ORDER_UPDATE'
    | 'CUSTOMER_UPDATE'
    | 'PRODUCT_UPDATE'
    | 'ANALYTICS_UPDATE'
    | 'notification'
    | 'update'
    | 'alert'
    | 'heartbeat';
  data: any;
  timestamp: Date | string;
  id: string;
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'notification';
  data: {
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error' | 'success';
    action?: {
      label: string;
      url: string;
    };
  };
}

export interface UpdateMessage extends WebSocketMessage {
  type: 'update';
  data: {
    entity: 'order' | 'product' | 'user';
    entityId: string;
    changes: Record<string, any>;
  };
}

export interface AlertMessage extends WebSocketMessage {
  type: 'alert';
  data: {
    level: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    source: string;
  };
}

export interface RealTimeSalesUpdate {
  revenue: number;
  orders: number;
  customers: number;
  timestamp: string;
  change: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

export interface RealTimeOrderUpdate {
  orderId: string;
  productName: string;
  category: string;
  amount: number;
  customerId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  timestamp: string;
}

export interface RealTimeCustomerUpdate {
  customerId: string;
  type: 'new' | 'returning';
  location?: string;
  totalSpent: number;
  timestamp: string;
}

export interface RealTimeProductUpdate {
  productId: string;
  name: string;
  category: string;
  salesCount: number;
  revenue: number;
  stockLevel: number;
  timestamp: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastConnected?: Date;
  reconnectAttempts: number;
  error?: string;
}
