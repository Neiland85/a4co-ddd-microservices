'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebSocket = useWebSocket;
exports.useWebSocketNotifications = useWebSocketNotifications;
const react_1 = require("react");
const websocket_service_1 = require("@/services/websocket-service");
function useWebSocket() {
    const [connectionStatus, setConnectionStatus] = (0, react_1.useState)(websocket_service_1.webSocketService.getConnectionStatus());
    const [messages, setMessages] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        // Subscribe to connection status changes
        const unsubscribeStatus = websocket_service_1.webSocketService.subscribe('status', message => {
            setConnectionStatus(message.data);
        });
        // Subscribe to all messages for logging
        const unsubscribeAll = websocket_service_1.webSocketService.subscribe('*', message => {
            setMessages(prev => [...prev.slice(-99), message]); // Keep last 100 messages
        });
        // Connect if not already connected
        if (!connectionStatus.isConnected) {
            websocket_service_1.webSocketService.connect().catch(console.error);
        }
        return () => {
            unsubscribeStatus();
            unsubscribeAll();
        };
    }, []);
    const subscribe = (0, react_1.useCallback)((type, callback) => {
        return websocket_service_1.webSocketService.subscribe(type, callback);
    }, []);
    const send = (0, react_1.useCallback)((message) => {
        try {
            websocket_service_1.webSocketService.send(message);
        }
        catch (error) {
            console.error('Failed to send WebSocket message:', error);
        }
    }, []);
    const connect = (0, react_1.useCallback)(() => {
        return websocket_service_1.webSocketService.connect();
    }, []);
    const disconnect = (0, react_1.useCallback)(() => {
        websocket_service_1.webSocketService.disconnect();
    }, []);
    return {
        connectionStatus,
        messages,
        subscribe,
        send,
        connect,
        disconnect,
    };
}
function useWebSocketNotifications() {
    const [notifications, setNotifications] = (0, react_1.useState)([]);
    const { subscribe } = useWebSocket();
    (0, react_1.useEffect)(() => {
        const unsubscribe = subscribe('notification', message => {
            setNotifications(prev => [message, ...prev.slice(0, 9)]); // Keep last 10 notifications
        });
        return unsubscribe;
    }, [subscribe]);
    const clearNotifications = (0, react_1.useCallback)(() => {
        setNotifications([]);
    }, []);
    const removeNotification = (0, react_1.useCallback)((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);
    return {
        notifications,
        clearNotifications,
        removeNotification,
    };
}
//# sourceMappingURL=use-websocket.js.map