'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebSocket = useWebSocket;
exports.useRealTimeData = useRealTimeData;
const react_1 = require("react");
const websocket_service_1 = require("../services/websocket-service");
function useWebSocket() {
    const [connectionStatus, setConnectionStatus] = (0, react_1.useState)({
        connected: false,
        reconnecting: false,
        reconnectAttempts: 0,
    });
    const wsService = (0, react_1.useRef)((0, websocket_service_1.getWebSocketService)());
    const [isInitialized, setIsInitialized] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const service = wsService.current;
        // Subscribe to connection status
        const unsubscribeStatus = service.subscribeToConnectionStatus(setConnectionStatus);
        // Initialize connection
        if (!isInitialized) {
            service.connect().catch(console.error);
            setIsInitialized(true);
        }
        return () => {
            unsubscribeStatus();
        };
    }, [isInitialized]);
    const subscribe = (0, react_1.useCallback)((eventType, callback) => {
        return wsService.current.subscribe(eventType, callback);
    }, []);
    const disconnect = (0, react_1.useCallback)(() => {
        wsService.current.disconnect();
    }, []);
    return {
        connectionStatus,
        subscribe,
        disconnect,
        isConnected: connectionStatus.connected,
    };
}
function useRealTimeData(eventType) {
    const [data, setData] = (0, react_1.useState)([]);
    const [lastUpdate, setLastUpdate] = (0, react_1.useState)(null);
    const { subscribe, isConnected } = useWebSocket();
    (0, react_1.useEffect)(() => {
        const unsubscribe = subscribe(eventType, (newData) => {
            setData(prevData => {
                // Keep only last 100 items for performance
                const updatedData = [newData, ...prevData].slice(0, 100);
                return updatedData;
            });
            setLastUpdate(new Date());
        });
        return unsubscribe;
    }, [eventType, subscribe]);
    const clearData = (0, react_1.useCallback)(() => {
        setData([]);
        setLastUpdate(null);
    }, []);
    return {
        data,
        lastUpdate,
        isConnected,
        clearData,
    };
}
//# sourceMappingURL=use-websocket.js.map