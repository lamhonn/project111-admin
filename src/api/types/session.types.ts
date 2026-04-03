import { OrderStatus } from './enums/orderStatus.types.js';

/**
 * Represents an active dining session for a tablet/table
 */
export type DiningSession = {
  sessionId: string;           // Unique session identifier
  tabletId: string;            // Associated tablet ID
  tableNumber: number;         // Table number
  organizationId: string;      // Restaurant organization
  orderId?: string;            // Current order for this session (if any)
  orderStatus?: OrderStatus;   // Status of current order
  orderIds?: string[];         // All order IDs in the session
  totalOrders?: number;        // Total number of orders
  totalSpent?: number;         // Sum of all order totals
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Represents an order status update event
 */
export type OrderStatusUpdate = {
  orderId: string;
  tabletId: string;
  tableNumber: number;
  organizationId: string;
  previousStatus?: OrderStatus;
  newStatus: OrderStatus;
  timestamp: Date;
  message?: string;            // Optional status message (e.g., "preparing your meal")
};

/**
 * Represents a new order event
 */
export type NewOrderEvent = {
  orderId: string;
  tabletId: string;
  tableNumber: number;
  organizationId: string;
  totalPrice: number;
  productCount: number;        // Number of products in order
  timestamp: Date;
};

/**
 * Represents a new order event with full order detail
 */
export type OrderPlacedEvent = {
  orderId: string;
  tabletId: string;
  tableNumber: number;
  organizationId: string;
  order: {
    id: string;
    organizationId: string;
    totalPrice: number;
    tabletId: string;
    tableNumber: number;
    created: Date;
  };
  orderProducts: Array<{
    id: string;
    orderId: string;
    productId: string;
    campaignProductId?: string | null;
    totalPrice: number;
    created: Date;
  }>;
  timestamp: Date;
};

/**
 * Represents a bill request event from a tablet
 */
export type BillRequestEvent = {
  sessionId: string;
  tabletId: string;
  tableNumber: number;
  organizationId: string;
  totalOrders: number;
  totalSpent: number;
  timestamp: Date;
  message?: string;
};

/**
 * Represents a closed dining session event
 */
export type SessionClosedEvent = {
  sessionId: string;
  tabletId: string;
  tableNumber: number;
  organizationId: string;
  totalOrders: number;
  totalSpent: number;
  closedAt: Date;
};

/**
 * Represents a tablet PIN issued event
 */
export type TabletPinIssuedEvent = {
  pairingSessionId: string;
  organizationId: string;
  userId: string;
  tableNumber: number;
  pin: string;
  expiresAt: Date;
};
