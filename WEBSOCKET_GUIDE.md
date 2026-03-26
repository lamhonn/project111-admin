# WebSocket Integration Guide

This document explains how to use the WebSocket system for real-time updates in the admin dashboard.

## Overview

The WebSocket system provides real-time bidirectional communication for events like:
- Order status changes (incoming, accepted, rejected, ready, delivered)
- Bill requests and payments
- Table status updates
- Delivery statistics

## Architecture

The WebSocket implementation follows these principles:
1. **Separation of Concerns**: WebSocket logic is separate from UI components
2. **Easy Migration**: Same API interface whether using mock data, WebSocket, or REST
3. **Type Safety**: Full TypeScript support for all events
4. **Resilience**: Automatic reconnection and error handling

## Files Structure

```
src/api/
├── types/
│   └── websocket.types.ts       # WebSocket event types and payloads
├── hooks/
│   ├── websocket.hooks.ts       # Base WebSocket connection hook
│   ├── dashboardWebSocket.hooks.ts  # Dashboard-specific WebSocket integration
│   └── dashboard.hooks.ts       # Dashboard data hooks (updated with WS support)
```

## Usage Examples

### 1. Basic WebSocket Connection

The simplest way to connect is using the `useAdminWebSocket` hook:

```tsx
import { useAdminWebSocket } from '../api/hooks/dashboardWebSocket.hooks';

function DashboardView() {
  const ws = useAdminWebSocket();

  useEffect(() => {
    console.log('WebSocket state:', ws.state);
    console.log('Is connected:', ws.isConnected);
  }, [ws.state, ws.isConnected]);

  return <div>Dashboard content...</div>;
}
```

### 2. Accepting an Order (With Real-time Notification)

When you accept an order, the WebSocket sends a notification to the other end:

```tsx
import { useAdminWebSocket } from '../api/hooks/dashboardWebSocket.hooks';
import { useSetAtom } from 'jotai';
import { updateOrderStatusAtom, OrderItemStatus } from '../context/dashboardStore';

function OrderCard({ order }) {
  const ws = useAdminWebSocket();
  const updateOrderStatus = useSetAtom(updateOrderStatusAtom);

  const handleAcceptOrder = () => {
    // Send WebSocket notification
    if (ws.isConnected) {
      ws.acceptOrder(order.orderNo, 'admin-user-123');
    }

    // Update local state
    updateOrderStatus({
      orderNo: order.orderNo,
      newStatus: OrderItemStatus.Preparing,
    });
  };

  return (
    <button onClick={handleAcceptOrder}>
      Accept Order
    </button>
  );
}
```

### 3. Rejecting an Order

```tsx
const handleRejectOrder = (reason: string) => {
  if (ws.isConnected) {
    ws.rejectOrder(order.orderNo, reason, 'admin-user-123');
  }

  // Remove from incoming orders (handled automatically by WebSocket subscription)
};
```

### 4. Listening to Incoming Orders

The WebSocket automatically updates the state atoms when events are received. You don't need to manually subscribe in components - just use the atoms:

```tsx
import { useAtomValue } from 'jotai';
import { incomingOrdersAtom } from '../context/dashboardStore';

function IncomingOrdersList() {
  // This automatically updates when WebSocket receives new orders
  const incomingOrders = useAtomValue(incomingOrdersAtom);

  return (
    <div>
      {incomingOrders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

### 5. Custom Event Subscriptions

If you need to react to specific WebSocket events:

```tsx
import { useEffect } from 'react';
import { useAdminWebSocket } from '../api/hooks/dashboardWebSocket.hooks';
import { WebSocketEventType } from '../api/types/websocket.types';

function CustomComponent() {
  const ws = useAdminWebSocket();

  useEffect(() => {
    if (!ws.isConnected) return;

    const unsubscribe = ws.subscribe(
      WebSocketEventType.ORDER_INCOMING,
      (payload) => {
        // Custom logic here
        console.log('New order received:', payload);
        playNotificationSound();
      }
    );

    return () => unsubscribe();
  }, [ws.isConnected]);
}
```

## Configuration

WebSocket configuration is set in `dashboardWebSocket.hooks.ts`:

```tsx
const config: WebSocketConfig = {
  url: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080',
  reconnectInterval: 3000,      // Time between reconnect attempts (ms)
  reconnectAttempts: 5,          // Max reconnection attempts
  heartbeatInterval: 30000,      // Keepalive ping interval (ms)
  debug: import.meta.env.DEV,    // Enable debug logging in dev
};
```

### Environment Variables

Add to your `.env` file:

```env
VITE_WEBSOCKET_URL=ws://localhost:8080
```

Or for production:

```env
VITE_WEBSOCKET_URL=wss://your-backend.com/ws
```

## Event Types

All available WebSocket events are defined in `websocket.types.ts`:

### Order Events
- `ORDER_INCOMING` - New order received
- `ORDER_ACCEPTED` - Order accepted by admin
- `ORDER_REJECTED` - Order rejected by admin
- `ORDER_STATUS_CHANGED` - Order status updated
- `ORDER_READY` - Order is ready for pickup/delivery
- `ORDER_DELIVERED` - Order has been delivered
- `ORDER_CANCELLED` - Order was cancelled

### Bill Events
- `BILL_REQUESTED` - Customer requested bill
- `BILL_PREPARED` - Bill prepared by system
- `BILL_PAID` - Bill has been paid

### Table Events
- `TABLE_STATUS_CHANGED` - Table status updated

### System Events
- `CONNECTION_ESTABLISHED` - WebSocket connected
- `CONNECTION_LOST` - WebSocket disconnected
- `HEARTBEAT` - Keepalive ping

## Message Format

All WebSocket messages follow this structure:

```typescript
{
  type: WebSocketEventType,
  payload: { /* event-specific data */ },
  timestamp: string,           // ISO 8601 timestamp
  correlationId?: string       // Optional ID for request/response tracking
}
```

Example message:

```json
{
  "type": "order:accepted",
  "payload": {
    "orderNo": "1001",
    "acceptedAt": "2026-03-03T10:30:00Z",
    "acceptedBy": "admin-user-123"
  },
  "timestamp": "2026-03-03T10:30:00Z",
  "correlationId": "abc-123"
}
```

## Migration Path

### Current State (Mock Data)
```tsx
const { data, loading, error } = useGetIncomingOrders();
```

### With WebSocket (Current Implementation)
```tsx
const ws = useAdminWebSocket();  // Connects and manages real-time updates
const incomingOrders = useAtomValue(incomingOrdersAtom);  // Automatically updated
```

### Future (REST API + WebSocket)
```tsx
// Initial load from REST API
const { data, loading, error } = useGetIncomingOrders();  // Fetches from /api/orders

// Real-time updates via WebSocket
const ws = useAdminWebSocket();  // Pushes updates to atoms

// Same component code, different data sources!
const incomingOrders = useAtomValue(incomingOrdersAtom);
```

## Testing Without Backend

For development without a WebSocket server, you can:

1. **Use Mock Mode**: WebSocket attempts to connect but falls back gracefully
2. **Local Mock Server**: Create a simple WebSocket server for testing
3. **Browser Console**: Manually emit events for testing

### Console Testing Example

```javascript
// In browser console, simulate receiving an order
const mockOrder = {
  type: 'order:incoming',
  payload: {
    order: {
      id: 'test-1',
      name: 'Test Order',
      orderNo: 9999,
      image: 'https://via.placeholder.com/160'
    },
    tableNumber: 5
  },
  timestamp: new Date().toISOString()
};

// This would be received from WebSocket in real scenario
// For testing, you can manually trigger state updates
```

## Error Handling

The WebSocket hook handles common errors automatically:

- **Connection Failed**: Attempts to reconnect with exponential backoff
- **Connection Lost**: Automatically reconnects (up to `reconnectAttempts`)
- **Invalid Messages**: Logged and ignored, doesn't crash the app
- **Send Failures**: Logged with error details

You can access error state:

```tsx
const ws = useAdminWebSocket();

if (ws.error) {
  console.error('WebSocket error:', ws.error);
}

// Check connection state
switch (ws.state) {
  case WebSocketState.CONNECTED:
    // All good
    break;
  case WebSocketState.CONNECTING:
  case WebSocketState.RECONNECTING:
    // Show loading indicator
    break;
  case WebSocketState.ERROR:
  case WebSocketState.DISCONNECTED:
    // Show error message
    break;
}
```

## Best Practices

1. **Always check `ws.isConnected`** before sending messages
2. **Provide fallbacks** for when WebSocket is unavailable
3. **Use optimistic updates** for better UX (update local state immediately)
4. **Subscribe in useEffect** and return cleanup function
5. **Don't send sensitive data** without encryption (use WSS in production)
6. **Rate limit** user actions to prevent spam
7. **Handle reconnection** gracefully in UI

## Production Checklist

- [ ] Use WSS (WebSocket Secure) in production
- [ ] Configure proper CORS/authentication on backend
- [ ] Set up monitoring for WebSocket connections
- [ ] Implement proper error boundaries
- [ ] Add user-facing connection status indicator
- [ ] Test reconnection scenarios
- [ ] Load test WebSocket server
- [ ] Set up logging/analytics for WebSocket events

## Troubleshooting

**WebSocket won't connect:**
- Check `VITE_WEBSOCKET_URL` environment variable
- Ensure WebSocket server is running
- Check browser console for connection errors
- Verify CORS configuration on backend

**Messages not received:**
- Check WebSocket state (`ws.state`)
- Verify event type names match server
- Check browser Network tab for WebSocket frames
- Enable debug mode: `debug: true` in config

**Reconnection issues:**
- Increase `reconnectAttempts` in config
- Check network stability
- Verify server accepts reconnections
- Review browser console logs

## Next Steps

1. **Set up WebSocket Server**: Create backend WebSocket endpoint
2. **Authentication**: Add token-based auth to WebSocket connection
3. **Room/Channel System**: Separate channels for different admins/locations
4. **Message Queue**: Handle offline messages
5. **Analytics**: Track WebSocket events for insights
