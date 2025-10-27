import type { WebSocketMessage, ConnectionStatus } from '../types/websocket-types';
export declare function useWebSocket(): {
    connectionStatus: ConnectionStatus;
    subscribe: (eventType: WebSocketMessage["type"], callback: (data: any) => void) => () => void;
    disconnect: () => void;
    isConnected: boolean;
};
export declare function useRealTimeData<T>(eventType: WebSocketMessage['type']): {
    data: T[];
    lastUpdate: Date | null;
    isConnected: boolean;
    clearData: () => void;
};
//# sourceMappingURL=use-websocket.d.ts.map