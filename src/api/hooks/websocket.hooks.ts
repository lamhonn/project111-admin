import { useEffect, useRef, useCallback, useState } from 'react';
import type {
  WebSocketConfig,
  WebSocketEventType,
  WebSocketMessage,
  WebSocketError,
  TypedWebSocketMessage,
} from '../types/websocket.types';
import { WebSocketState } from '../types/websocket.types';

/**
 * WebSocket hook for managing real-time connections
 * This provides a clean abstraction that can be:
 * 1. Used with mock WebSocket server during development
 * 2. Connected to real backend WebSocket when ready
 * 3. Easily disabled/replaced with polling if needed
 */

type EventHandler<T = unknown> = (payload: T, message: WebSocketMessage<T>) => void;

interface UseWebSocketReturn {
  state: WebSocketState;
  error: WebSocketError | null;
  send: <T>(type: WebSocketEventType, payload: T, correlationId?: string) => void;
  subscribe: <T>(eventType: WebSocketEventType, handler: EventHandler<T>) => () => void;
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
}

/**
 * Main WebSocket hook
 * @param config WebSocket configuration
 * @param autoConnect Whether to automatically connect on mount (default: true)
 */
export const useWebSocket = (
  config: WebSocketConfig,
  autoConnect = true
): UseWebSocketReturn => {
  const [state, setState] = useState<WebSocketState>(WebSocketState.DISCONNECTED);
  const [error, setError] = useState<WebSocketError | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventHandlersRef = useRef<Map<WebSocketEventType, Set<EventHandler>>>(new Map());
  const isManualDisconnectRef = useRef(false);

  const log = useCallback((message: string, ...args: unknown[]) => {
    if (config.debug) {
      console.log(`[WebSocket] ${message}`, ...args);
    }
  }, [config.debug]);

  /**
   * Subscribe to a specific event type
   */
  const subscribe = useCallback(<T,>(
    eventType: WebSocketEventType,
    handler: EventHandler<T>
  ): (() => void) => {
    if (!eventHandlersRef.current.has(eventType)) {
      eventHandlersRef.current.set(eventType, new Set());
    }
    
    const handlers = eventHandlersRef.current.get(eventType)!;
    handlers.add(handler as EventHandler);

    log(`Subscribed to event: ${eventType}`);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        eventHandlersRef.current.delete(eventType);
      }
      log(`Unsubscribed from event: ${eventType}`);
    };
  }, [log]);

  /**
   * Emit event to all subscribers
   */
  const emit = useCallback((message: WebSocketMessage<unknown>) => {
    const handlers = eventHandlersRef.current.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(message.payload, message);
        } catch (err) {
          console.error(`Error in event handler for ${message.type}:`, err);
        }
      });
    }
  }, []);

  /**
   * Send a message through WebSocket
   */
  const send = useCallback(<T,>(
    type: WebSocketEventType,
    payload: T,
    correlationId?: string
  ) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send message - not connected');
      return;
    }

    const message: WebSocketMessage<T> = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      correlationId,
    };

    try {
      wsRef.current.send(JSON.stringify(message));
      log('Sent message:', message);
    } catch (err) {
      console.error('[WebSocket] Error sending message:', err);
      setError({
        message: `Failed to send message: ${err}`,
        timestamp: new Date().toISOString(),
      });
    }
  }, [log]);

  /**
   * Start heartbeat to keep connection alive
   */
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    const interval = config.heartbeatInterval || 30000; // Default 30 seconds
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        send('system:heartbeat' as WebSocketEventType, { timestamp: Date.now() });
      }
    }, interval);

    log('Heartbeat started');
  }, [config.heartbeatInterval, send, log]);

  /**
   * Stop heartbeat
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
      log('Heartbeat stopped');
    }
  }, [log]);

  /**
   * Handle incoming WebSocket messages
   */
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data) as TypedWebSocketMessage;
      log('Received message:', message);
      emit(message);
    } catch (err) {
      console.error('[WebSocket] Error parsing message:', err);
    }
  }, [emit, log]);

  /**
   * Handle WebSocket errors
   */
  const handleError = useCallback((event: Event) => {
    const errorMsg: WebSocketError = {
      message: 'WebSocket error occurred',
      timestamp: new Date().toISOString(),
    };
    
    console.error('[WebSocket] Error:', event);
    setError(errorMsg);
    setState(WebSocketState.ERROR);
  }, []);

  /**
   * Handle WebSocket close
   */
  const handleClose = useCallback((event: CloseEvent) => {
    log('Connection closed:', event.code, event.reason);
    
    stopHeartbeat();
    setState(WebSocketState.DISCONNECTED);
    wsRef.current = null;

    // Attempt reconnection if not manual disconnect
    if (!isManualDisconnectRef.current) {
      const maxAttempts = config.reconnectAttempts || 5;
      const interval = config.reconnectInterval || 3000;

      if (reconnectAttemptsRef.current < maxAttempts) {
        reconnectAttemptsRef.current++;
        setState(WebSocketState.RECONNECTING);
        log(`Reconnecting... (attempt ${reconnectAttemptsRef.current}/${maxAttempts})`);

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, interval);
      } else {
        log('Max reconnection attempts reached');
        setError({
          message: 'Failed to reconnect after maximum attempts',
          timestamp: new Date().toISOString(),
        });
      }
    }
  }, [config.reconnectAttempts, config.reconnectInterval, stopHeartbeat, log]);

  /**
   * Handle WebSocket open
   */
  const handleOpen = useCallback(() => {
    log('Connection established');
    
    setState(WebSocketState.CONNECTED);
    setError(null);
    reconnectAttemptsRef.current = 0;
    
    startHeartbeat();

    // Emit connection established event
    emit({
      type: 'system:connected' as WebSocketEventType,
      payload: { timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString(),
    });
  }, [emit, startHeartbeat, log]);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(() => {
    // Clean up existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    isManualDisconnectRef.current = false;
    setState(WebSocketState.CONNECTING);
    log(`Connecting to ${config.url}...`);

    try {
      const ws = new WebSocket(config.url);
      
      ws.onopen = handleOpen;
      ws.onmessage = handleMessage;
      ws.onerror = handleError;
      ws.onclose = handleClose;
      
      wsRef.current = ws;
    } catch (err) {
      console.error('[WebSocket] Connection error:', err);
      setError({
        message: `Failed to connect: ${err}`,
        timestamp: new Date().toISOString(),
      });
      setState(WebSocketState.ERROR);
    }
  }, [config.url, handleOpen, handleMessage, handleError, handleClose, log]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    log('Disconnecting...');
    
    isManualDisconnectRef.current = true;
    stopHeartbeat();
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect');
      wsRef.current = null;
    }

    setState(WebSocketState.DISCONNECTED);
  }, [stopHeartbeat, log]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [autoConnect]); // Only run on mount/unmount

  return {
    state,
    error,
    send,
    subscribe,
    connect,
    disconnect,
    isConnected: state === WebSocketState.CONNECTED,
  };
};

/**
 * Create a mock WebSocket server for development
 * This simulates a WebSocket connection for testing without a real backend
 */
export const createMockWebSocketServer = () => {
  // This would be implemented in a separate development tool
  // For now, it's a placeholder to show the pattern
  console.log('[Mock WebSocket] Server would be created here for development');
};
