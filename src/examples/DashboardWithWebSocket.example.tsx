/**
 * Example Dashboard View with WebSocket Integration
 * 
 * This is a reference implementation showing how to integrate
 * WebSocket functionality into your dashboard views.
 */

import React, { useEffect } from 'react';
import { Box, Typography, Chip, Alert } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAdminWebSocket } from '../api/hooks/dashboardWebSocket.hooks';
import { WebSocketState } from '../api/types/websocket.types';
import {
  incomingOrdersAtom,
  billsAtom,
  orderStatsAtom,
  deliveryStatsAtom,
} from '../context/dashboardStore';

/**
 * WebSocket connection status indicator component
 */
const WebSocketStatus: React.FC<{ state: WebSocketState; isConnected: boolean }> = ({
  state,
  isConnected,
}) => {
  const getStatusColor = () => {
    switch (state) {
      case WebSocketState.CONNECTED:
        return 'success';
      case WebSocketState.CONNECTING:
      case WebSocketState.RECONNECTING:
        return 'warning';
      case WebSocketState.ERROR:
      case WebSocketState.DISCONNECTED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = () => {
    switch (state) {
      case WebSocketState.CONNECTED:
        return 'Connected';
      case WebSocketState.CONNECTING:
        return 'Connecting...';
      case WebSocketState.RECONNECTING:
        return 'Reconnecting...';
      case WebSocketState.DISCONNECTED:
        return 'Disconnected';
      case WebSocketState.ERROR:
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Real-time Status:
      </Typography>
      <Chip
        label={getStatusLabel()}
        color={getStatusColor()}
        size="small"
        variant={isConnected ? 'filled' : 'outlined'}
      />
    </Box>
  );
};

/**
 * Example Dashboard View with WebSocket
 */
export const DashboardViewWithWebSocket: React.FC = () => {
  // Initialize WebSocket connection
  const ws = useAdminWebSocket();

  // Subscribe to state atoms (automatically updated by WebSocket)
  const incomingOrders = useAtomValue(incomingOrdersAtom);
  const bills = useAtomValue(billsAtom);
  const orderStats = useAtomValue(orderStatsAtom);
  const deliveryStats = useAtomValue(deliveryStatsAtom);

  // Log connection state changes
  useEffect(() => {
    console.log('[Dashboard] WebSocket state changed:', ws.state);
  }, [ws.state]);

  // Request notification permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Example: Handle order acceptance
  const handleAcceptOrder = (orderNo: string) => {
    if (ws.isConnected) {
      ws.acceptOrder(orderNo, 'admin-user-123');
      console.log(`[Dashboard] Accepted order ${orderNo}`);
    } else {
      console.warn('[Dashboard] Cannot accept order - WebSocket not connected');
      // Fallback: Still update local state
    }
  };

  // Example: Handle order rejection
  const handleRejectOrder = (orderNo: string, reason: string) => {
    if (ws.isConnected) {
      ws.rejectOrder(orderNo, reason, 'admin-user-123');
      console.log(`[Dashboard] Rejected order ${orderNo}:`, reason);
    } else {
      console.warn('[Dashboard] Cannot reject order - WebSocket not connected');
      // Fallback: Still update local state
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* WebSocket Status */}
      <WebSocketStatus state={ws.state} isConnected={ws.isConnected} />

      {/* Error Alert */}
      {ws.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          WebSocket Error: {ws.error.message}
        </Alert>
      )}

      {/* Warning when disconnected */}
      {!ws.isConnected && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Real-time updates are currently unavailable. You can still manage orders, but changes
          won't be synchronized with other devices.
        </Alert>
      )}

      {/* Dashboard Stats */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5">Dashboard Statistics</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Incoming Orders
            </Typography>
            <Typography variant="h6">{incomingOrders.length}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Bills Pending
            </Typography>
            <Typography variant="h6">{bills.length}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Orders Today
            </Typography>
            <Typography variant="h6">{orderStats.today}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Delivered
            </Typography>
            <Typography variant="h6">{deliveryStats.delivered}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Example: Incoming Orders List */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Incoming Orders</Typography>
        {incomingOrders.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            No incoming orders
          </Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            {incomingOrders.map((order) => (
              <Box
                key={order.id}
                sx={{
                  p: 2,
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="body1">{order.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order #{order.orderNo}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <button
                    onClick={() => handleAcceptOrder(order.orderNo.toString())}
                    disabled={!ws.isConnected}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectOrder(order.orderNo.toString(), 'Out of stock')}
                    disabled={!ws.isConnected}
                  >
                    Reject
                  </button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Debug Info (remove in production) */}
      {import.meta.env.DEV && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" component="pre">
            {JSON.stringify({ 
              wsState: ws.state, 
              isConnected: ws.isConnected,
              incomingOrdersCount: incomingOrders.length,
              billsCount: bills.length,
            }, null, 2)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DashboardViewWithWebSocket;
