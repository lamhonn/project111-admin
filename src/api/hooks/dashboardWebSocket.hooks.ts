import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useWebSocket } from './websocket.hooks';
import {
  WebSocketEventType,
  type OrderIncomingPayload,
  type OrderAcceptedPayload,
  type OrderRejectedPayload,
  type OrderStatusChangedPayload,
  type BillRequestedPayload,
  type BillPaidPayload,
  type WebSocketConfig,
} from '../types/websocket.types';
import {
  incomingOrdersAtom,
  inProcessOrdersAtom,
  billsAtom,
  updateOrderStatusAtom,
  deliveryStatsAtom,
  orderStatsAtom,
} from '../../context/dashboardStore';
import { apiConfig } from '../config';
import type { OrderItemStatus } from '../../viewModels';

/**
 * Hook to manage dashboard real-time updates via WebSocket
 * This connects WebSocket events to the dashboard state atoms
 */
export const useDashboardWebSocket = (config: WebSocketConfig) => {
  const ws = useWebSocket(config, true);
  
  const setIncomingOrders = useSetAtom(incomingOrdersAtom);
  const setInProcessOrders = useSetAtom(inProcessOrdersAtom);
  const setBills = useSetAtom(billsAtom);
  const setDeliveryStats = useSetAtom(deliveryStatsAtom);
  const setOrderStats = useSetAtom(orderStatsAtom);
  const updateOrderStatus = useSetAtom(updateOrderStatusAtom);

  useEffect(() => {
    if (!ws.isConnected) return;

    // Handle incoming order
    const unsubscribeIncoming = ws.subscribe<OrderIncomingPayload>(
      WebSocketEventType.ORDER_INCOMING,
      (payload) => {
        console.log('[Dashboard WS] New incoming order:', payload.order);
        
        setIncomingOrders((prev) => {
          // Check if order already exists
          if (prev.some((o) => o.id === payload.order.id)) {
            return prev;
          }
          return [...prev, payload.order];
        });

        // Update order stats
        setOrderStats((prev) => ({
          ...prev,
          today: prev.today + 1,
        }));

        // Show notification (could integrate with a notification system)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Order', {
            body: `Order #${payload.order.orderNo} from Table ${payload.tableNumber}`,
            icon: payload.order.image,
          });
        }
      }
    );

    // Handle order accepted
    const unsubscribeAccepted = ws.subscribe<OrderAcceptedPayload>(
      WebSocketEventType.ORDER_ACCEPTED,
      (payload) => {
        console.log('[Dashboard WS] Order accepted:', payload.orderNo);
        
        // Remove from incoming orders
        setIncomingOrders((prev) => 
          prev.filter((order) => order.orderNo.toString() !== payload.orderNo)
        );
      }
    );

    // Handle order rejected
    const unsubscribeRejected = ws.subscribe<OrderRejectedPayload>(
      WebSocketEventType.ORDER_REJECTED,
      (payload) => {
        console.log('[Dashboard WS] Order rejected:', payload.orderNo, payload.reason);
        
        // Remove from incoming orders
        setIncomingOrders((prev) => 
          prev.filter((order) => order.orderNo.toString() !== payload.orderNo)
        );
      }
    );

    // Handle order status changed
    const unsubscribeStatusChange = ws.subscribe<OrderStatusChangedPayload>(
      WebSocketEventType.ORDER_STATUS_CHANGED,
      (payload) => {
        console.log('[Dashboard WS] Order status changed:', payload);
        
        updateOrderStatus({
          orderNo: payload.orderNo,
          newStatus: payload.newStatus,
        });
      }
    );

    // Handle bill requested
    const unsubscribeBillRequest = ws.subscribe<BillRequestedPayload>(
      WebSocketEventType.BILL_REQUESTED,
      (payload) => {
        console.log('[Dashboard WS] Bill requested:', payload.bill);
        
        setBills((prev) => {
          // Check if bill already exists
          if (prev.some((b) => b.id === payload.bill.id)) {
            return prev;
          }
          return [...prev, payload.bill];
        });

        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Bill Requested', {
            body: `Table ${payload.bill.tableNumber} - ${payload.bill.guestName}`,
          });
        }
      }
    );

    // Handle bill paid
    const unsubscribeBillPaid = ws.subscribe<BillPaidPayload>(
      WebSocketEventType.BILL_PAID,
      (payload) => {
        console.log('[Dashboard WS] Bill paid:', payload.billId);
        
        // Remove from bills list
        setBills((prev) => prev.filter((bill) => bill.id !== payload.billId));
      }
    );

    // Handle order delivered
    const unsubscribeDelivered = ws.subscribe(
      WebSocketEventType.ORDER_DELIVERED,
      () => {
        setDeliveryStats((prev) => ({
          ...prev,
          delivered: prev.delivered + 1,
        }));
      }
    );

    // Handle order cancelled
    const unsubscribeCancelled = ws.subscribe(
      WebSocketEventType.ORDER_CANCELLED,
      () => {
        setDeliveryStats((prev) => ({
          ...prev,
          cancelled: prev.cancelled + 1,
        }));
      }
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeIncoming();
      unsubscribeAccepted();
      unsubscribeRejected();
      unsubscribeStatusChange();
      unsubscribeBillRequest();
      unsubscribeBillPaid();
      unsubscribeDelivered();
      unsubscribeCancelled();
    };
  }, [
    ws.isConnected,
    ws.subscribe,
    setIncomingOrders,
    setInProcessOrders,
    setBills,
    setDeliveryStats,
    setOrderStats,
    updateOrderStatus,
  ]);

  /**
   * Send order acceptance notification
   */
  const acceptOrder = (orderNo: string, acceptedBy?: string) => {
    console.log('[Dashboard WS] Accepting order:', orderNo);
    
    ws.send<OrderAcceptedPayload>(
      WebSocketEventType.ORDER_ACCEPTED,
      {
        orderNo,
        acceptedAt: new Date().toISOString(),
        acceptedBy,
      }
    );

    // Also update local state immediately for optimistic update
    setIncomingOrders((prev) => 
      prev.filter((order) => order.orderNo.toString() !== orderNo)
    );
  };

  /**
   * Send order rejection notification
   */
  const rejectOrder = (orderNo: string, reason?: string, rejectedBy?: string) => {
    console.log('[Dashboard WS] Rejecting order:', orderNo, reason);
    
    ws.send<OrderRejectedPayload>(
      WebSocketEventType.ORDER_REJECTED,
      {
        orderNo,
        rejectedAt: new Date().toISOString(),
        reason,
        rejectedBy,
      }
    );

    // Also update local state immediately for optimistic update
    setIncomingOrders((prev) => 
      prev.filter((order) => order.orderNo.toString() !== orderNo)
    );
  };

  /**
   * Send order status change notification
   */
  const changeOrderStatus = (
    orderNo: string,
    oldStatus: OrderItemStatus,
    newStatus: OrderItemStatus,
    changedBy?: string
  ) => {
    console.log('[Dashboard WS] Changing order status:', orderNo, oldStatus, '->', newStatus);
    
    ws.send<OrderStatusChangedPayload>(
      WebSocketEventType.ORDER_STATUS_CHANGED,
      {
        orderNo,
        oldStatus,
        newStatus,
        changedAt: new Date().toISOString(),
        changedBy,
      }
    );
  };

  return {
    ...ws,
    acceptOrder,
    rejectOrder,
    changeOrderStatus,
  };
};

/**
 * Hook for WebSocket connection with configuration defaults
 * This provides sensible defaults for the admin dashboard
 */
export const useAdminWebSocket = () => {
  const config: WebSocketConfig = {
    url: apiConfig.websocketUrl,
    reconnectInterval: 3000,
    reconnectAttempts: 5,
    heartbeatInterval: 30000,
    debug: import.meta.env.DEV,
  };

  return useDashboardWebSocket(config);
};
