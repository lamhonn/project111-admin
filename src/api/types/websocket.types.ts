/**
 * WebSocket Event Types
 * These define the real-time events that can be sent/received via WebSocket
 */

import type { OrderItemStatus } from '../../viewModels';
import type { IncomingOrder, Bill } from '../../context/dashboardStore';

/**
 * Event types for WebSocket messages
 */
export const WebSocketEventType = {
  // Order events
  ORDER_INCOMING: 'order:incoming',
  ORDER_ACCEPTED: 'order:accepted',
  ORDER_REJECTED: 'order:rejected',
  ORDER_STATUS_CHANGED: 'order:status_changed',
  ORDER_READY: 'order:ready',
  ORDER_DELIVERED: 'order:delivered',
  ORDER_CANCELLED: 'order:cancelled',
  
  // Bill events
  BILL_REQUESTED: 'bill:requested',
  BILL_PREPARED: 'bill:prepared',
  BILL_PAID: 'bill:paid',
  
  // Table events
  TABLE_STATUS_CHANGED: 'table:status_changed',
  
  // System events
  CONNECTION_ESTABLISHED: 'system:connected',
  CONNECTION_LOST: 'system:disconnected',
  HEARTBEAT: 'system:heartbeat',
} as const;

export type WebSocketEventType = typeof WebSocketEventType[keyof typeof WebSocketEventType];

/**
 * Base WebSocket message structure
 */
export interface WebSocketMessage<T = unknown> {
  type: WebSocketEventType;
  payload: T;
  timestamp: string;
  correlationId?: string;
}

/**
 * Payload types for different events
 */

export interface OrderIncomingPayload {
  order: IncomingOrder;
  tableNumber: number;
  guestName?: string;
}

export interface OrderAcceptedPayload {
  orderNo: string;
  acceptedAt: string;
  acceptedBy?: string;
}

export interface OrderRejectedPayload {
  orderNo: string;
  rejectedAt: string;
  reason?: string;
  rejectedBy?: string;
}

export interface OrderStatusChangedPayload {
  orderNo: string;
  oldStatus: OrderItemStatus;
  newStatus: OrderItemStatus;
  changedAt: string;
  changedBy?: string;
}

export interface OrderReadyPayload {
  orderNo: string;
  readyAt: string;
}

export interface OrderDeliveredPayload {
  orderNo: string;
  deliveredAt: string;
  deliveredBy?: string;
}

export interface OrderCancelledPayload {
  orderNo: string;
  cancelledAt: string;
  reason?: string;
}

export interface BillRequestedPayload {
  bill: Bill;
  requestedAt: string;
}

export interface BillPreparedPayload {
  billId: string;
  tableNumber: number;
  amount: number;
  preparedAt: string;
}

export interface BillPaidPayload {
  billId: string;
  tableNumber: number;
  amount: number;
  paidAt: string;
  paymentMethod?: string;
}

export interface TableStatusChangedPayload {
  tableId: string;
  tableNumber: number;
  oldStatus: string;
  newStatus: string;
  changedAt: string;
}

/**
 * Type-safe WebSocket message creators
 */
export type TypedWebSocketMessage =
  | WebSocketMessage<OrderIncomingPayload>
  | WebSocketMessage<OrderAcceptedPayload>
  | WebSocketMessage<OrderRejectedPayload>
  | WebSocketMessage<OrderStatusChangedPayload>
  | WebSocketMessage<OrderReadyPayload>
  | WebSocketMessage<OrderDeliveredPayload>
  | WebSocketMessage<OrderCancelledPayload>
  | WebSocketMessage<BillRequestedPayload>
  | WebSocketMessage<BillPreparedPayload>
  | WebSocketMessage<BillPaidPayload>
  | WebSocketMessage<TableStatusChangedPayload>;

/**
 * WebSocket connection configuration
 */
export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  heartbeatInterval?: number;
  debug?: boolean;
}

/**
 * WebSocket connection state
 */
export const WebSocketState = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
} as const;

export type WebSocketState = typeof WebSocketState[keyof typeof WebSocketState];

/**
 * WebSocket error types
 */
export interface WebSocketError {
  code?: number;
  message: string;
  timestamp: string;
}
