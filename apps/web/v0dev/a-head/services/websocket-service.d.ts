import type { WebSocketMessage, WebSocketConfig, ConnectionStatus } from '@/types/websocket-types';
declare class WebSocketService {
    private ws;
    private config;
    private listeners;
    private connectionStatus;
    private reconnectTimer;
    private heartbeatTimer;
    constructor(config: WebSocketConfig);
    connect(): Promise<void>;
    disconnect(): void;
    send(message: Omit<WebSocketMessage, 'id' | 'timestamp'>): void;
    subscribe(type: string, callback: (message: WebSocketMessage) => void): () => void;
    getConnectionStatus(): ConnectionStatus;
    private handleMessage;
    private scheduleReconnect;
    private startHeartbeat;
    private stopHeartbeat;
    private notifyStatusChange;
    private generateId;
}
export declare const webSocketService: WebSocketService;
export {};
//# sourceMappingURL=websocket-service.d.ts.map