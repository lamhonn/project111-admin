# REST API vs WebSocket: What Does What?

## 🔄 Traditional REST API Pattern (What You're Familiar With)

### How REST Works

```
┌──────────────┐                    ┌──────────────┐                    ┌──────────────┐
│   Frontend   │                    │   Backend    │                    │   Database   │
│  (React)     │                    │   (API)      │                    │              │
└──────────────┘                    └──────────────┘                    └──────────────┘
       │                                    │                                    │
       │ 1. GET /api/orders                 │                                    │
       │─────────────────────────────────>  │                                    │
       │                                    │ 2. SELECT * FROM orders            │
       │                                    │─────────────────────────────────>  │
       │                                    │                                    │
       │                                    │ 3. Return rows                     │
       │                                    │ <──────────────────────────────────│
       │ 4. Return JSON { orders: [...] }   │                                    │
       │ <──────────────────────────────────│                                    │
       │                                    │                                    │
       │ 5. Wait 5 seconds...               │                                    │
       │                                    │                                    │
       │ 6. GET /api/orders (polling)       │                                    │
       │─────────────────────────────────>  │                                    │
       │                                    │ 7. SELECT * FROM orders            │
       │                                    │─────────────────────────────────>  │
       │                                    │ 8. Return rows                     │
       │                                    │ <──────────────────────────────────│
       │ 9. Return JSON                     │                                    │
       │ <──────────────────────────────────│                                    │
```

### REST in Your Current Codebase

**File: `src/api/hooks/dashboard.hooks.ts`**
```typescript
export const useGetIncomingOrders = () => {
  return {
    data: EMPTY_INCOMING_ORDERS,  // Currently returns mock data
    loading: false,
    error: undefined,
  };
};
```

**When you connect to a real REST backend, this would become:**
```typescript
export const useGetIncomingOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // HTTP GET request
    fetch('https://api.example.com/orders/incoming')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => setError(err));
  }, []);

  return { data, loading, error };
};
```

### REST API Endpoints (Future Backend)

```typescript
// Read operations (GET)
GET  /api/orders/incoming     // Get all incoming orders
GET  /api/orders/:id          // Get specific order
GET  /api/bills               // Get all bills

// Write operations (POST/PUT/DELETE)
POST   /api/orders/:id/accept     // Accept an order
POST   /api/orders/:id/reject     // Reject an order
PUT    /api/orders/:id/status     // Update order status
DELETE /api/orders/:id            // Cancel order
```

### REST Characteristics

✅ **Request-Response Model**
- Client asks → Server responds → Connection closes
- Like a phone call: you call, they answer, you hang up

✅ **Stateless**
- Each request is independent
- Server doesn't remember previous requests

✅ **Pull Model**
- Client must ask for data (pull)
- Server can't send data unless asked

✅ **One-way Communication**
- Client → Server (request)
- Server → Client (response)
- Then connection ends

### Problem with REST for Real-time Updates

```typescript
// To get new orders, you'd need to poll (keep asking):
setInterval(() => {
  fetch('/api/orders/incoming')  // Ask every 5 seconds
    .then(res => res.json())     // Parse response
    .then(data => setOrders(data)); // Update UI
}, 5000);
```

**Problems:**
- ❌ Wastes bandwidth (asking even when nothing changed)
- ❌ Database hit every 5 seconds (expensive!)
- ❌ Delayed updates (up to 5 second lag)
- ❌ Not truly real-time
- ❌ Scales poorly (1000 clients = 1000 requests every 5 sec)

---

## ⚡ WebSocket Pattern (What I Just Implemented)

### How WebSocket Works

```
┌──────────────┐                    ┌──────────────┐
│   Frontend   │                    │   WebSocket  │
│  (React)     │                    │   Server     │
└──────────────┘                    └──────────────┘
       │                                    │
       │ 1. WebSocket Connection            │
       │═══════════════════════════════════>│ (Connection stays open)
       │                                    │
       │ 2. Subscribed to events            │
       │ <══════════════════════════════════│
       │                                    │
       │    (Connection stays open,         │
       │     waiting for events...)         │
       │                                    │
       │                                    │ ← New order arrives
       │ 3. PUSH: order:incoming            │    (from customer device)
       │ <──────────────────────────────────│
       │    { orderNo: 1001, table: 5 }    │
       │                                    │
       │ 4. SEND: order:accepted            │
       │ ───────────────────────────────────>│
       │    { orderNo: 1001 }              │
       │                                    │ → Broadcast to all clients
       │                                    │   (customer sees "Accepted")
       │                                    │
       │ 5. PUSH: bill:requested            │ ← New bill request
       │ <──────────────────────────────────│    (from customer)
       │    { tableNumber: 7 }             │
       │                                    │
       │    (Connection stays open forever) │
       │═══════════════════════════════════ │
```

### WebSocket in Your Current Codebase

**File: `src/api/hooks/websocket.hooks.ts`**
```typescript
// Base WebSocket connection manager
export const useWebSocket = (config, autoConnect) => {
  // Creates persistent WebSocket connection
  const ws = new WebSocket(config.url);  // Connect once
  
  ws.onmessage = (event) => {
    // Receive ANY message the server sends
    const message = JSON.parse(event.data);
    // Automatically route to subscribers
  };

  // Send a message
  const send = (type, payload) => {
    ws.send(JSON.stringify({ type, payload }));
  };

  // Listen for specific events
  const subscribe = (eventType, handler) => {
    // When message arrives, call handler
  };
};
```

**File: `src/api/hooks/dashboardWebSocket.hooks.ts`**
```typescript
// Dashboard-specific integration
export const useAdminWebSocket = () => {
  const ws = useWebSocket(config, true);  // Connect on mount
  
  // Subscribe to incoming orders
  ws.subscribe('order:incoming', (payload) => {
    // Automatically add to incomingOrdersAtom
    setIncomingOrders(prev => [...prev, payload.order]);
  });

  // Function to accept order
  const acceptOrder = (orderNo) => {
    // Send WebSocket message
    ws.send('order:accepted', { orderNo });
    // Update local state immediately (optimistic)
  };

  return { ...ws, acceptOrder };
};
```

### WebSocket Characteristics

✅ **Persistent Connection**
- Connect once → Stay connected
- Like a phone call where you keep the line open

✅ **Bidirectional**
- Client → Server (send messages)
- Server → Client (push messages)
- Simultaneously, anytime

✅ **Push Model**
- Server can push data without being asked
- Client doesn't need to poll

✅ **Event-Driven**
- Subscribe to events you care about
- Get notified when they happen

✅ **Real-time**
- Updates arrive instantly (milliseconds)
- No polling delay

---

## 📊 Side-by-Side Comparison

### REST API
```typescript
// Component polls for updates every 5 seconds
function DashboardView() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/orders/incoming');
      const data = await res.json();
      setOrders(data);
    };

    fetchOrders();  // Initial load
    const interval = setInterval(fetchOrders, 5000);  // Poll
    return () => clearInterval(interval);
  }, []);

  const acceptOrder = async (orderNo) => {
    await fetch(`/api/orders/${orderNo}/accept`, {
      method: 'POST'
    });
    // Wait 5 seconds for next poll to see the change
  };

  return <div>{orders.map(...)}</div>;
}
```

**Data Flow:**
1. Component mounts → HTTP GET /api/orders
2. Wait 5 seconds → HTTP GET /api/orders
3. Wait 5 seconds → HTTP GET /api/orders
4. New order arrives at backend
5. Wait up to 5 seconds → HTTP GET /api/orders (finally see it!)

### WebSocket
```typescript
// Component receives updates automatically
function DashboardView() {
  const ws = useAdminWebSocket();  // Opens WebSocket
  const orders = useAtomValue(incomingOrdersAtom);  // Auto-updated!

  const acceptOrder = (orderNo) => {
    ws.acceptOrder(orderNo);  // Send via WebSocket
    // Customer sees "Accepted" immediately!
  };

  return <div>{orders.map(...)}</div>;
}
```

**Data Flow:**
1. Component mounts → WebSocket connects
2. Listening for events...
3. New order arrives → WebSocket pushes event
4. `incomingOrdersAtom` updates automatically
5. Component re-renders with new order instantly!

---

## 🎯 When to Use What

### Use REST API For:

✅ **CRUD Operations** (Create, Read, Update, Delete)
```typescript
// Fetching data that doesn't change often
GET  /api/menu/items           // Get menu items
GET  /api/products/:id         // Get product details
POST /api/products             // Create new product
PUT  /api/products/:id         // Update product
```

✅ **Data That Changes Infrequently**
- Menu items
- Product catalog
- Settings
- User profiles
- Historical data

✅ **Operations That Need Confirmation**
- Upload image → Return URL
- Process payment → Return receipt
- Generate report → Return PDF link

✅ **One-time Actions**
- Login → Get token
- Download file → Get file
- Search → Get results

### Use WebSocket For:

✅ **Real-time Status Updates**
```typescript
// Things that happen and need instant notification
order:incoming      // New order arrives
order:accepted      // Admin accepted order
order:status        // Order status changed
bill:requested      // Customer wants bill
```

✅ **Events That Need Instant Broadcasting**
- Order acceptance (customer should know immediately)
- Bill preparation (table should be notified)
- Kitchen status (orders ready)
- Live notifications

✅ **Frequent Small Updates**
- Presence indicators (who's online)
- Live counters (active orders)
- Real-time stats (orders per hour)

✅ **Two-way Interaction**
- Chat messages
- Live collaboration
- Real-time sync

---

## 🏗️ Your Architecture (With Both!)

### The Hybrid Approach (Recommended)

```typescript
// ═══════════════════════════════════════════════════════════
// Use REST for CRUD operations
// ═══════════════════════════════════════════════════════════

// Initial data load
const { data: menu } = useGetMenu();              // REST: GET /api/menu
const { data: products } = useGetProducts();      // REST: GET /api/products
const { data: settings } = useGetSettings();      // REST: GET /api/settings

// Create/Update operations
const createProduct = (data) => {
  return fetch('/api/products', {                 // REST: POST
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// ═══════════════════════════════════════════════════════════
// Use WebSocket for real-time updates
// ═══════════════════════════════════════════════════════════

// Real-time events
const ws = useAdminWebSocket();                   // WebSocket: Always connected

ws.subscribe('order:incoming', handleNewOrder);   // Pushed from server
ws.subscribe('bill:requested', handleBillRequest); // Pushed from server

// Instant actions
ws.acceptOrder(orderNo);                          // Send immediately
ws.rejectOrder(orderNo);                          // Send immediately
```

### Your Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN DASHBOARD                          │
│                                                                 │
│  ┌───────────────────┐              ┌───────────────────┐      │
│  │   REST API Hooks  │              │  WebSocket Hooks  │      │
│  │                   │              │                   │      │
│  │ useGetMenu()      │              │ useAdminWebSocket │      │
│  │ useGetProducts()  │              │   .acceptOrder()  │      │
│  │ useGetTables()    │              │   .rejectOrder()  │      │
│  └───────────────────┘              └───────────────────┘      │
│           │                                   │                 │
│           │                                   │                 │
└───────────┼───────────────────────────────────┼─────────────────┘
            │                                   │
            │ HTTP                              │ WebSocket
            │ GET/POST/PUT/DELETE               │ Bidirectional
            │ Request → Response                │ Push/Subscribe
            │                                   │
            ▼                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVER                          │
│                                                                 │
│  ┌───────────────────┐              ┌───────────────────┐      │
│  │   REST API        │              │  WebSocket Server │      │
│  │                   │              │                   │      │
│  │ /api/menu         │              │ Connections:      │      │
│  │ /api/products     │              │ - Admin clients   │      │
│  │ /api/tables       │              │ - Customer devices│      │
│  └───────────────────┘              │ - Kitchen displays│      │
│           │                         └───────────────────┘      │
│           │                                   │                 │
│           │                                   │                 │
│           ▼                                   ▼                 │
│  ┌─────────────────────┐           ┌────────────────────┐      │
│  │     Database        │           │   Event Router     │      │
│  │                     │           │                    │      │
│  │ SELECT * FROM menu  │           │ Broadcast events   │      │
│  │ INSERT INTO orders  │           │ to all clients     │      │
│  └─────────────────────┘           └────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Real-World Example: Order Acceptance

### With REST Only (Polling)

```typescript
// Admin Dashboard
const DashboardView = () => {
  const [orders, setOrders] = useState([]);

  // Poll every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/orders/incoming');
      const data = await res.json();
      setOrders(data);  // Update UI
    }, 5000);
  }, []);

  const acceptOrder = async (orderNo) => {
    // Send acceptance
    await fetch(`/api/orders/${orderNo}/accept`, { method: 'POST' });
    
    // Order status updated in DB
    // But customer won't know until THEY poll next time!
  };
};

// Customer App
const CustomerView = () => {
  const [orderStatus, setOrderStatus] = useState('pending');

  // Poll every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/orders/1001/status');
      const data = await res.json();
      setOrderStatus(data.status);  // Update UI
    }, 3000);
  }, []);
};
```

**Timeline:**
- `T+0s`: Customer places order
- `T+2s`: Admin polls → Sees new order
- `T+3s`: Admin clicks "Accept"
- `T+5s`: Customer polls → Still shows "pending" (unlucky timing)
- `T+8s`: Customer polls → Finally sees "accepted" (8 second delay!)

**Cost:** 
- Admin: 720 requests/hour (every 5 sec)
- Customer: 1,200 requests/hour (every 3 sec)
- 1,920 total requests/hour per active order!

### With WebSocket (What I Built)

```typescript
// Admin Dashboard
const DashboardView = () => {
  const ws = useAdminWebSocket();  // Opens WebSocket
  const orders = useAtomValue(incomingOrdersAtom);  // Auto-updated

  const acceptOrder = (orderNo) => {
    ws.acceptOrder(orderNo);  // Send via WebSocket
  };

  // Orders appear automatically via:
  // ws.subscribe('order:incoming', ...)
};

// Customer App  
const CustomerView = () => {
  const ws = useCustomerWebSocket();
  const [orderStatus, setOrderStatus] = useState('pending');

  useEffect(() => {
    ws.subscribe('order:accepted', ({ orderNo }) => {
      if (orderNo === myOrderNo) {
        setOrderStatus('accepted');  // Update immediately!
      }
    });
  }, []);
};
```

**Timeline:**
- `T+0s`: Customer places order
- `T+0.1s`: WebSocket pushes to admin → See order instantly
- `T+5s`: Admin clicks "Accept"
- `T+5.05s`: WebSocket pushes to customer → "Accepted" appears instantly!

**Cost:**
- 2 persistent connections
- ~2 KB for messages
- No polling overhead!

---

## 📁 Your Codebase Structure

### REST API Layer (Future)
```
src/api/hooks/
├── dashboard.hooks.ts          // REST: useGetIncomingOrders()
├── product.hooks.ts            // REST: useGetProducts()
├── menu.hooks.ts              // REST: useGetMenu()
└── table.hooks.ts             // REST: useGetTables()
```

**These will make HTTP requests:**
```typescript
GET  /api/orders/incoming       → useGetIncomingOrders()
GET  /api/products              → useGetProducts()
POST /api/products              → useCreateProduct()
PUT  /api/products/:id          → useUpdateProduct()
```

### WebSocket Layer (Just Built)
```
src/api/
├── types/
│   └── websocket.types.ts      // Event types & payloads
├── hooks/
│   ├── websocket.hooks.ts      // Base connection manager
│   └── dashboardWebSocket.hooks.ts  // Dashboard integration
```

**These manage persistent connections:**
```typescript
useAdminWebSocket()
  ├── .subscribe('order:incoming')     // Listen for events
  ├── .acceptOrder(orderNo)            // Send events
  ├── .rejectOrder(orderNo)            // Send events
  └── .isConnected                     // Check status
```

### State Management (Jotai Atoms)
```
src/context/
└── dashboardStore.ts
    ├── incomingOrdersAtom          // Updated by WebSocket
    ├── billsAtom                   // Updated by WebSocket
    ├── orderStatsAtom              // Updated by WebSocket
    └── updateOrderStatusAtom       // Writes to WebSocket
```

**Atoms are the bridge between WebSocket and UI**

---

## 💡 Key Takeaways

### REST API
- ✅ Best for CRUD operations
- ✅ Best for infrequent data
- ✅ Stateless, simple to understand
- ❌ Not real-time (needs polling)
- ❌ Wastes bandwidth with polling
- ❌ Scales poorly for frequent updates

### WebSocket
- ✅ Best for real-time updates
- ✅ Best for events/notifications
- ✅ Truly instant (milliseconds)
- ✅ Scales well (persistent connection)
- ❌ More complex to implement
- ❌ Requires persistent server resources

### Your Implementation (Hybrid)
- ✅ Use REST for data loading (GET)
- ✅ Use REST for CRUD operations (POST/PUT/DELETE)
- ✅ Use WebSocket for real-time events
- ✅ Use WebSocket for instant notifications
- ✅ Best of both worlds!

---

## 🎬 Complete Example: Order Flow

```typescript
// ════════════════════════════════════════════════════════════
// 1. PAGE LOAD - Use REST to get initial data
// ════════════════════════════════════════════════════════════
function DashboardView() {
  // REST: Load initial data (HTTP GET)
  const { data: initialOrders } = useGetIncomingOrders();
  const { data: menu } = useGetMenu();
  const { data: tables } = useGetTables();

  // WebSocket: Connect for real-time updates
  const ws = useAdminWebSocket();

  // ════════════════════════════════════════════════════════════
  // 2. REAL-TIME - WebSocket pushes new orders
  // ════════════════════════════════════════════════════════════
  // This happens automatically via useAdminWebSocket()
  // New orders appear in incomingOrdersAtom
  const orders = useAtomValue(incomingOrdersAtom);

  // ════════════════════════════════════════════════════════════
  // 3. USER ACTION - Send via WebSocket for instant feedback
  // ════════════════════════════════════════════════════════════
  const handleAccept = (orderNo) => {
    // WebSocket: Send acceptance (instant)
    ws.acceptOrder(orderNo);
    
    // Local state updates immediately
    // Customer's device receives WebSocket event
    // Customer sees "Accepted" in 50-100ms!
  };

  // ════════════════════════════════════════════════════════════
  // 4. CRUD OPERATIONS - Still use REST
  // ════════════════════════════════════════════════════════════
  const handleUpdateProduct = async (productId, data) => {
    // REST: Update product (HTTP PUT)
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    // Then optionally broadcast via WebSocket
    if (ws.isConnected) {
      ws.send('product:updated', { productId });
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {orders.map(order => (
        <OrderCard 
          key={order.id}
          order={order}
          onAccept={handleAccept}
        />
      ))}
    </div>
  );
}
```

---

Hope this clarifies the difference! **In short:**
- **REST** = Ask and receive (request/response)
- **WebSocket** = Stay connected and chat (bidirectional push)
- **Your app** = Use both for their strengths! 🚀
