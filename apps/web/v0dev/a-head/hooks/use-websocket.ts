'use client';

import { useEffect, useState, useCallback } from 'react';
import type { WebSocketMessage, ConnectionStatus } from '@/types/websocket-types';
import { webSocketService } from '@/services/websocket-service';

export function useWebSocket() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    webSocketService.getConnectionStatus()
  );
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    // Subscribe to connection status changes
    const unsubscribeStatus = webSocketService.subscribe('status', message => {
      setConnectionStatus(message.data as ConnectionStatus);
    });

    // Subscribe to all messages for logging
    const unsubscribeAll = webSocketService.subscribe('*', message => {
      setMessages(prev => [...prev.slice(-99), message]); // Keep last 100 messages
    });

    // Connect if not already connected
    if (!connectionStatus.isConnected) {
      webSocketService.connect().catch(console.error);
    }

    return () => {
      unsubscribeStatus();
      unsubscribeAll();
    };
  }, []);

  const subscribe = useCallback((type: string, callback: (message: WebSocketMessage) => void) => {
    return webSocketService.subscribe(type, callback);
  }, []);

  const send = useCallback((message: Omit<WebSocketMessage, 'id' | 'timestamp'>) => {
    try {
      webSocketService.send(message);
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
    }
  }, []);

  const connect = useCallback(() => {
    return webSocketService.connect();
  }, []);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
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

export function useWebSocketNotifications() {
  const [notifications, setNotifications] = useState<WebSocketMessage[]>([]);
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe('notification', message => {
      setNotifications(prev => [message, ...prev.slice(0, 9)]); // Keep last 10 notifications
    });

    return unsubscribe;
  }, [subscribe]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    clearNotifications,
    removeNotification,
  };
}
