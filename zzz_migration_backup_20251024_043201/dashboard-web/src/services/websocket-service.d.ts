import type { WebSocketMessage, WebSocketConfig, ConnectionStatus } from '../types/websocket-types';
export declare class WebSocketService {
    private ws;
    private config;
    private listeners;
    private connectionStatus;
    private statusListeners;
    private heartbeatInterval;
    private reconnectTimeout;
    constructor(config: WebSocketConfig);
    connect(): Promise<void>;
    private simulateConnection;
    private startHeartbeat;
    private startDataSimulation;
    private simulateSalesUpdate;
    private simulateOrderUpdate;
    private simulateCustomerUpdate;
    private simulateProductUpdate;
    private emit;
    subscribe(eventType: WebSocketMessage['type'], callback: (data: any) => void): () => void;
    subscribeToConnectionStatus(callback: (status: ConnectionStatus) => void): () => void;
    private updateConnectionStatus;
    disconnect(): void;
    private reconnect;
    getConnectionStatus(): ConnectionStatus;
    isConnected(): boolean;
}
export declare const getWebSocketService: () => WebSocketService;
//# sourceMappingURL=websocket-service.d.ts.map