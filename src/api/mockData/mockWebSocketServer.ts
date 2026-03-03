/**
 * Mock WebSocket Server for Development
 * 
 * This simulates a WebSocket server for testing without a real backend.
 * It generates fake events and responds to client messages.
 * 
 * Usage:
 * 1. Run this in a separate terminal: `node src/api/mockData/mockWebSocketServer.js`
 * 2. Or import and use in development: `import { startMockWebSocketServer } from './mockWebSocketServer'`
 */

// NOTE: This is a TypeScript file but for actual use, you'd run it with Node.js
// or use a tool like tsx/ts-node. For production-like testing, use a real WebSocket server.

import type {
  OrderIncomingPayload,
  BillRequestedPayload,
} from '../types/websocket.types';

/**
 * Generates a random mock order
 */
export const generateMockOrder = (orderNo: number): OrderIncomingPayload => {
  const pizzas = [
    { name: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160' },
    { name: 'Pepperoni Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=160' },
    { name: 'BBQ Chicken Pizza', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=160' },
  ];

  const guestNames = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];
  const pizza = pizzas[Math.floor(Math.random() * pizzas.length)];

  return {
    order: {
      id: `order-${orderNo}`,
      name: pizza.name,
      orderNo,
      image: pizza.image,
    },
    tableNumber: Math.floor(Math.random() * 20) + 1,
    guestName: guestNames[Math.floor(Math.random() * guestNames.length)],
  };
};

/**
 * Generates a random bill request
 */
export const generateMockBill = (billId: string): BillRequestedPayload => {
  const guestNames = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];

  return {
    bill: {
      id: billId,
      tableNumber: Math.floor(Math.random() * 20) + 1,
      guestName: guestNames[Math.floor(Math.random() * guestNames.length)],
      amount: Math.floor(Math.random() * 100) + 20,
      items: Math.floor(Math.random() * 8) + 1,
    },
    requestedAt: new Date().toISOString(),
  };
};

/**
 * Simple mock WebSocket server implementation
 * For real development, use a proper WebSocket library like 'ws'
 */
export const createMockWebSocketServerInstructions = () => {
  return `
# Mock WebSocket Server Setup

## Option 1: Using 'ws' library (Recommended)

1. Install the WebSocket library:
   \`\`\`bash
   npm install ws
   # or
   pnpm add ws
   \`\`\`

2. Create server file \`mockWsServer.js\`:
   \`\`\`javascript
   const WebSocket = require('ws');
   const wss = new WebSocket.Server({ port: 8080 });

   console.log('Mock WebSocket server running on ws://localhost:8080');

   let orderCounter = 1000;
   let billCounter = 0;

   wss.on('connection', (ws) => {
     console.log('Client connected');

     // Send welcome message
     ws.send(JSON.stringify({
       type: 'system:connected',
       payload: { message: 'Connected to mock server' },
       timestamp: new Date().toISOString(),
     }));

     // Simulate events every 10 seconds
     const interval = setInterval(() => {
       const events = [
         // New order
         {
           type: 'order:incoming',
           payload: {
             order: {
               id: \`order-\${orderCounter}\`,
               name: 'Margherita Pizza',
               orderNo: orderCounter++,
               image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160',
             },
             tableNumber: Math.floor(Math.random() * 20) + 1,
             guestName: 'John Doe',
           },
           timestamp: new Date().toISOString(),
         },
         // Bill request
         {
           type: 'bill:requested',
           payload: {
             bill: {
               id: \`bill-\${billCounter++}\`,
               tableNumber: Math.floor(Math.random() * 20) + 1,
               guestName: 'Jane Smith',
               amount: Math.floor(Math.random() * 100) + 20,
               items: Math.floor(Math.random() * 8) + 1,
             },
             requestedAt: new Date().toISOString(),
           },
           timestamp: new Date().toISOString(),
         },
       ];

       // Send random event
       const event = events[Math.floor(Math.random() * events.length)];
       ws.send(JSON.stringify(event));
       console.log('Sent event:', event.type);
     }, 10000);

     // Handle incoming messages
     ws.on('message', (data) => {
       try {
         const message = JSON.parse(data.toString());
         console.log('Received from client:', message.type);

         // Echo back accepted/rejected orders
         if (message.type === 'order:accepted' || message.type === 'order:rejected') {
           console.log(\`Order \${message.payload.orderNo} was \${message.type.split(':')[1]}\`);
         }
       } catch (err) {
         console.error('Error parsing message:', err);
       }
     });

     ws.on('close', () => {
       console.log('Client disconnected');
       clearInterval(interval);
     });

     ws.on('error', (err) => {
       console.error('WebSocket error:', err);
     });
   });
   \`\`\`

3. Run the server:
   \`\`\`bash
   node mockWsServer.js
   \`\`\`

4. Update your .env file:
   \`\`\`
   VITE_WEBSOCKET_URL=ws://localhost:8080
   \`\`\`

## Option 2: Using Online WebSocket Test Service

For quick testing without setting up a server:

1. Use a service like: https://www.piesocket.com/websocket-tester
2. Create a free channel
3. Use the provided WebSocket URL in your .env
4. Manually send test messages through their interface

## Option 3: Browser Extension

Some browser extensions can simulate WebSocket servers:
- Simple WebSocket Client (Chrome)
- WebSocket King (Firefox)

## Testing Commands

Once connected, you can test by sending these JSON messages from your mock server:

### New Order
\`\`\`json
{
  "type": "order:incoming",
  "payload": {
    "order": {
      "id": "test-order-1",
      "name": "Test Pizza",
      "orderNo": 9999,
      "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160"
    },
    "tableNumber": 5,
    "guestName": "Test User"
  },
  "timestamp": "${new Date().toISOString()}"
}
\`\`\`

### Bill Request
\`\`\`json
{
  "type": "bill:requested",
  "payload": {
    "bill": {
      "id": "bill-test-1",
      "tableNumber": 7,
      "guestName": "Test User",
      "amount": 45.50,
      "items": 3
    },
    "requestedAt": "${new Date().toISOString()}"
  },
  "timestamp": "${new Date().toISOString()}"
}
\`\`\`

### Order Status Change
\`\`\`json
{
  "type": "order:status_changed",
  "payload": {
    "orderNo": "1001",
    "oldStatus": "new",
    "newStatus": "preparing",
    "changedAt": "${new Date().toISOString()}"
  },
  "timestamp": "${new Date().toISOString()}"
}
\`\`\`
`;
};

// Export instruction function
export const printMockServerInstructions = () => {
  console.log(createMockWebSocketServerInstructions());
};
