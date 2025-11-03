"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketService = void 0;
class WebSocketService {
    ws = null;
    config;
    listeners = new Map();
    connectionStatus = {
        isConnected: false,
        reconnectAttempts: 0,
    };
    reconnectTimer = null;
    heartbeatTimer = null;
    constructor(config) {
        this.config = config;
    }
    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.config.url);
                this.ws.onopen = () => {
                    this.connectionStatus = {
                        isConnected: true,
                        lastConnected: new Date(),
                        reconnectAttempts: 0,
                    };
                    this.startHeartbeat();
                    this.notifyStatusChange();
                    resolve();
                };
                this.ws.onmessage = event => {
                    try {
                        const message = JSON.parse(event.data);
                        this.handleMessage(message);
                    }
                    catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };
                this.ws.onclose = () => {
                    this.connectionStatus.isConnected = false;
                    this.stopHeartbeat();
                    this.notifyStatusChange();
                    this.scheduleReconnect();
                };
                this.ws.onerror = error => {
                    this.connectionStatus.error = 'WebSocket connection error';
                    this.notifyStatusChange();
                    reject(error);
                };
            }
            catch (error) {
                reject(error);
            }
        });
    }
    disconnect() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.stopHeartbeat();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.connectionStatus.isConnected = false;
        this.notifyStatusChange();
    }
    send(message) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');
        }
        const fullMessage = {
            ...message,
            id: this.generateId(),
            timestamp: new Date(),
        };
        this.ws.send(JSON.stringify(fullMessage));
    }
    subscribe(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type).push(callback);
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(type);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
    }
    getConnectionStatus() {
        return { ...this.connectionStatus };
    }
    handleMessage(message) {
        // Handle heartbeat responses
        if (message.type === 'heartbeat') {
            return;
        }
        // Notify type-specific listeners
        const typeListeners = this.listeners.get(message.type);
        if (typeListeners) {
            typeListeners.forEach(callback => callback(message));
        }
        // Notify global listeners
        const globalListeners = this.listeners.get('*');
        if (globalListeners) {
            globalListeners.forEach(callback => callback(message));
        }
    }
    scheduleReconnect() {
        if (this.connectionStatus.reconnectAttempts >= this.config.maxReconnectAttempts) {
            this.connectionStatus.error = 'Max reconnection attempts reached';
            this.notifyStatusChange();
            return;
        }
        this.reconnectTimer = setTimeout(() => {
            this.connectionStatus.reconnectAttempts++;
            this.connect().catch(() => {
                // Reconnection failed, will be handled by onclose
            });
        }, this.config.reconnectInterval);
    }
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({
                    type: 'heartbeat',
                    data: { timestamp: Date.now() },
                });
            }
        }, this.config.heartbeatInterval);
    }
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    notifyStatusChange() {
        const statusListeners = this.listeners.get('status');
        if (statusListeners) {
            statusListeners.forEach(callback => callback({
                type: 'update',
                data: this.connectionStatus,
                timestamp: new Date(),
                id: this.generateId(),
            }));
        }
    }
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
// Default configuration
const defaultConfig = {
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080',
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000,
};
exports.webSocketService = new WebSocketService(defaultConfig);
//# sourceMappingURL=websocket-service.js.map