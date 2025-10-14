import type { WebSocketMessage } from '@/types/websocket-types';
export declare function useWebSocket(): {
    connectionStatus: ConnectionStatus;
    messages: WebSocketMessage[];
    subscribe: (type: string, callback: (message: WebSocketMessage) => void) => any;
    send: (message: Omit<WebSocketMessage, "id" | "timestamp">) => void;
    connect: () => any;
    disconnect: () => void;
};
export declare function useWebSocketNotifications(): {
    notifications: WebSocketMessage[];
    clearNotifications: () => void;
    removeNotification: (id: string) => void;
};
//# sourceMappingURL=use-websocket.d.ts.map