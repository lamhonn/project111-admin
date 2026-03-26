# WebSocket Implementation Summary

## What Was Added

A complete WebSocket system for real-time bidirectional communication has been added to your admin dashboard. This enables instant status updates without database queries, perfect for scenarios like accepting/rejecting orders, bill requests, and table status changes.

## Files Created

### Core WebSocket Files
1. **`src/api/types/websocket.types.ts`**
   - TypeScript definitions for all WebSocket events
   - Event types: order events, bill events, table events, system events
   - Message structure and payload types
   - Configuration interfaces

2. **`src/api/hooks/websocket.hooks.ts`**
   - Base WebSocket connection hook (`useWebSocket`)
   - Connection management (connect, disconnect, reconnect)
   - Event subscription system
   - Error handling and automatic reconnection
   - Heartbeat/keepalive functionality

3. **`src/api/hooks/dashboardWebSocket.hooks.ts`**
   - Dashboard-specific WebSocket integration
   - Connects WebSocket events to Jotai state atoms
   - Helper functions: `acceptOrder`, `rejectOrder`, `changeOrderStatus`
   - Auto-subscribes to relevant events
   - `useAdminWebSocket` hook with sensible defaults

### Documentation & Examples
4. **`WEBSOCKET_GUIDE.md`**
   - Comprehensive usage guide
   - Code examples for all common scenarios
   - Configuration options
   - Migration path from mock data → WebSocket → REST API
   - Troubleshooting guide

5. **`src/api/mockData/mockWebSocketServer.ts`**
   - Instructions for creating a mock WebSocket server
   - Example server code using 'ws' library
   - Test message templates

6. **`src/examples/DashboardWithWebSocket.example.tsx`**
   - Complete working example component
   - Shows WebSocket status indicator
   - Demonstrates accepting/rejecting orders
   - Error handling patterns

### Updated Files
7. **`src/api/hooks/dashboard.hooks.ts`**
   - Added documentation about WebSocket integration
   - Added `useOrderActions` hook for order mutations
   - Prepared for easy migration to REST API

8. **`src/api/types/index.ts`**
   - Exports WebSocket types

## Key Features

### 1. **Type-Safe Events**
All WebSocket events are fully typed:
```typescript
WebSocketEventType.ORDER_INCOMING
WebSocketEventType.ORDER_ACCEPTED
WebSocketEventType.ORDER_REJECTED
WebSocketEventType.ORDER_STATUS_CHANGED
WebSocketEventType.BILL_REQUESTED
// ... and more
```

### 2. **Automatic Reconnection**
If connection is lost, the system automatically attempts to reconnect:
- Configurable retry attempts (default: 5)
- Configurable retry interval (default: 3 seconds)
- Exponential backoff (optional)

### 3. **Event Subscription System**
Subscribe to specific events in any component:
```typescript
const ws = useAdminWebSocket();

useEffect(() => {
  const unsubscribe = ws.subscribe(
    WebSocketEventType.ORDER_INCOMING,
    (payload) => {
      console.log('New order:', payload);
    }
  );
  return unsubscribe;
}, []);
```

### 4. **State Management Integration**
WebSocket events automatically update your Jotai atoms:
- `incomingOrdersAtom` - Updated when orders arrive
- `billsAtom` - Updated when bills are requested/paid
- `orderStatsAtom` - Updated with order statistics
- `deliveryStatsAtom` - Updated with delivery stats

### 5. **Optimistic Updates**
Actions update local state immediately, then send WebSocket notification:
```typescript
ws.acceptOrder(orderNo);  // Sends to server + updates local state
```

### 6. **Graceful Degradation**
App works fine without WebSocket:
- Falls back to local-only updates
- Shows warning to user when disconnected
- Doesn't crash or block functionality

## How to Use

### Basic Setup (in any view)

```typescript
import { useAdminWebSocket } from '../api/hooks/dashboardWebSocket.hooks';

function MyDashboardView() {
  const ws = useAdminWebSocket();
  
  // WebSocket is now connected and managing real-time updates!
  // Just use the atoms as normal - they update automatically
  const incomingOrders = useAtomValue(incomingOrdersAtom);
  
  return <div>...</div>;
}
```

### Accepting an Order

```typescript
const ws = useAdminWebSocket();

const handleAccept = () => {
  if (ws.isConnected) {
    ws.acceptOrder(orderNo, 'admin-user-123');
  }
};
```

### Rejecting an Order

```typescript
const handleReject = () => {
  if (ws.isConnected) {
    ws.rejectOrder(orderNo, 'Out of stock', 'admin-user-123');
  }
};
```

### Show Connection Status

```typescript
<Chip 
  label={ws.isConnected ? 'Connected' : 'Disconnected'} 
  color={ws.isConnected ? 'success' : 'error'} 
/>
```

## Configuration

Add to `.env` file:
```env
VITE_WEBSOCKET_URL=ws://localhost:8080
```

Or for production:
```env
VITE_WEBSOCKET_URL=wss://your-backend.com/ws
```

Default configuration:
- Reconnect interval: 3 seconds
- Reconnect attempts: 5
- Heartbeat interval: 30 seconds
- Debug logging: Enabled in development mode

## Migration Path

### Phase 1: Current (Mock Data Only)
```typescript
const { data } = useGetIncomingOrders();  // Returns mock data
```

### Phase 2: WebSocket Added (Now)
```typescript
const ws = useAdminWebSocket();  // Manages real-time updates
const orders = useAtomValue(incomingOrdersAtom);  // Auto-updated
```

### Phase 3: Future (REST API + WebSocket)
```typescript
// Initial load from REST API
const { data, loading } = useGetIncomingOrders();

// Real-time updates via WebSocket  
const ws = useAdminWebSocket();

// Use atoms - same code, different data sources!
const orders = useAtomValue(incomingOrdersAtom);
```

**No component code changes needed between phases!**

## Testing Without Backend

### Option 1: Mock WebSocket Server (Recommended)
1. Install: `npm install ws`
2. Create a simple server (see `mockWebSocketServer.ts` for code)
3. Run: `node server.js`

### Option 2: Online Service
Use https://www.piesocket.com/websocket-tester for quick testing

### Option 3: Manual Testing
WebSocket will attempt to connect and fail gracefully. You can still test all UI functionality.

## Event Flow Example

### Accepting an Order:
1. Admin clicks "Accept" button
2. `ws.acceptOrder(orderNo)` is called
3. Local state updates immediately (optimistic)
4. WebSocket sends `order:accepted` message to server
5. Server broadcasts to all connected clients
6. Customer's device receives notification instantly
7. Customer sees "Order Accepted" status

### Receiving a New Order:
1. Customer places order on their device
2. Server sends `order:incoming` WebSocket message
3. Admin dashboard receives message
4. `incomingOrdersAtom` updates automatically
5. UI re-renders with new order
6. Browser notification appears (if enabled)

## Benefits

1. **No Database Polling**: Real-time updates without constant queries
2. **Instant Feedback**: Changes reflected immediately on all devices
3. **Low Latency**: WebSocket is faster than HTTP polling
4. **Better UX**: Users see changes in real-time
5. **Easy Migration**: Same API interface regardless of backend
6. **Type Safe**: Full TypeScript support prevents errors
7. **Resilient**: Automatic reconnection and error handling

## Next Steps

1. **Set up WebSocket Server**: Create backend WebSocket endpoint
2. **Authentication**: Add auth token to WebSocket connection
3. **Room System**: Separate channels per restaurant/location
4. **Test**: Use mock server to test all scenarios
5. **Monitor**: Add logging/analytics for WebSocket events
6. **Production**: Use WSS (secure WebSocket) with SSL

## Need Help?

- See **WEBSOCKET_GUIDE.md** for detailed documentation
- Check **examples/DashboardWithWebSocket.example.tsx** for working code
- Review **api/types/websocket.types.ts** for all event types
- Look at **api/hooks/dashboardWebSocket.hooks.ts** for integration details

## Architecture Diagram

```
┌─────────────────┐         WebSocket          ┌──────────────────┐
│  Admin Client   │◄──────────────────────────►│  WebSocket       │
│  (This App)     │                             │  Server          │
│                 │    order:accepted           │                  │
│  - useWebSocket │    order:incoming           │  - Broadcast     │
│  - State Atoms  │    bill:requested           │  - Authentication│
│  - UI Components│    etc...                   │  - Room Management│
└─────────────────┘                             └──────────────────┘
                                                         ▲
                                                         │
                                                         ▼
                                                 ┌──────────────────┐
                                                 │  Customer Client │
                                                 │  (Mobile/Tablet) │
                                                 │                  │
                                                 │  Receives status │
                                                 │  updates in      │
                                                 │  real-time       │
                                                 └──────────────────┘
```

## File Structure After Implementation

```
src/
├── api/
│   ├── types/
│   │   ├── websocket.types.ts       ✨ NEW - WebSocket types
│   │   └── index.ts                 📝 UPDATED - Export WS types
│   ├── hooks/
│   │   ├── websocket.hooks.ts       ✨ NEW - Base WebSocket hook
│   │   ├── dashboardWebSocket.hooks.ts  ✨ NEW - Dashboard integration
│   │   └── dashboard.hooks.ts       📝 UPDATED - Added mutation hooks
│   └── mockData/
│       └── mockWebSocketServer.ts   ✨ NEW - Mock server instructions
├── examples/
│   └── DashboardWithWebSocket.example.tsx  ✨ NEW - Working example
└── ...
WEBSOCKET_GUIDE.md                   ✨ NEW - Documentation
WEBSOCKET_README.md                  ✨ NEW - This file
```

---

**Your API is now WebSocket-ready! 🚀**

The system is designed to work seamlessly with or without a WebSocket server, making it perfect for gradual migration to a real backend.
