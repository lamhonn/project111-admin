import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
} from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import OrderOptionsDialog from './OrderOptionsDialog';
import { getAllOrdersAtom, getNewOrdersAtom, preparingOrdersAtom, selectedOrderIdAtom } from '../../state/orderStore';
import { orderOptionsDialogOpenAtom } from '../../state/orderStore';
import { Order } from '../../types/models';
import { OrderWebSocket } from '../../api/websocket/orderSocket';
import { userIdAtom } from '../../state/authStore';

const OrderList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const setSelectedOrder = useSetAtom(selectedOrderIdAtom);
  const setDialogOpen = useSetAtom(orderOptionsDialogOpenAtom);
  const newOrders = useAtomValue(getNewOrdersAtom);
  const preparingOrders = useAtomValue(preparingOrdersAtom);
  const getOrders = useSetAtom(getNewOrdersAtom);
  const userId = useAtomValue(userIdAtom);
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const spawnTimersRef = useRef<Map<string, number>>(new Map());
  const [highlightedOrderIds, setHighlightedOrderIds] = useState<Set<string>>(new Set());

  useEffect(() =>  {
    if (!userId) return;

    getOrders();
    
    return OrderWebSocket.subscribeToOrdersCreated(userId, getOrders);
  }, [userId, getOrders])

  useEffect(() => {
    const currentOrders = [...newOrders, ...preparingOrders];

    if (knownOrderIdsRef.current.size === 0) {
      knownOrderIdsRef.current = new Set(currentOrders.map(order => order.id));
      return;
    }

    const spawnedOrders = currentOrders.filter(order => !knownOrderIdsRef.current.has(order.id));

    if (spawnedOrders.length === 0) {
      knownOrderIdsRef.current = new Set(currentOrders.map(order => order.id));
      return;
    }

    setHighlightedOrderIds(prev => {
      const next = new Set(prev);
      spawnedOrders.forEach(order => next.add(order.id));
      return next;
    });

    spawnedOrders.forEach(order => {
      const existing = spawnTimersRef.current.get(order.id);
      if (existing) {
        window.clearTimeout(existing);
      }

      const timeoutId = window.setTimeout(() => {
        setHighlightedOrderIds(prev => {
          const next = new Set(prev);
          next.delete(order.id);
          return next;
        });
        spawnTimersRef.current.delete(order.id);
      }, 3200);

      spawnTimersRef.current.set(order.id, timeoutId);
    });

    knownOrderIdsRef.current = new Set(currentOrders.map(order => order.id));
  }, [newOrders, preparingOrders]);

  useEffect(() => {
    return () => {
      spawnTimersRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
      spawnTimersRef.current.clear();
    };
  }, []);

  // Handle row click to open dialog
  const handleRowClick = (orderId: string) => {
    setSelectedOrder(orderId);
    setDialogOpen(true);
  };

  const renderSection = (section: string, orders: Order[]) => (
    <React.Fragment key={section}>  
      <TableRow>
        <TableCell 
          colSpan={5} 
          sx={{ 
            bgcolor: theme.colors.primaryLight, 
            py: 1.5,
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <Typography 
            variant="subtitle2" 
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ color: theme.colors.text }}
          >
            {t(`dashboard.orderList.sections.${section}`)} ({orders.length})
          </Typography>
        </TableCell>
      </TableRow>
      {orders.map((order, idx) => (
        <TableRow
          key={`${order.id}-${idx}`}
          hover
          onClick={() => handleRowClick(order.id)}
          sx={{ 
            '&:last-child td, &:last-child th': { border: 0 },
            transition: theme.transitions.fast,
            cursor: 'pointer',
            animation: highlightedOrderIds.has(order.id) ? 'newOrderPulse 1000ms ease-out' : undefined,
            '@keyframes newOrderPulse': {
              '0%': {
                backgroundColor: 'rgba(77, 128, 230, 0.28)',
                boxShadow: 'inset 0 0 0 1px rgba(77, 128, 230, 0.45)',
              },
              '35%': {
                backgroundColor: 'rgba(77, 128, 230, 0.16)',
              },
              '100%': {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
            },
            '&:hover': {
              bgcolor: theme.colors.primaryLight,
            }
          }}
        >
          <TableCell>
            <Typography 
              variant="body2" 
              fontWeight={theme.typography.fontWeights.semibold}
              sx={{ color: theme.colors.text }}
            >
              {order.id}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography 
              variant="body2" 
              fontWeight={theme.typography.fontWeights.medium}
              sx={{ color: theme.colors.text }}
            >
              {t('dashboard.orderList.tableLabel', { number: order.tableNumber })}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography 
              variant="caption" 
              sx={{ color: theme.colors.text, opacity: 0.6 }}
            >
              {new Date(order.created).toLocaleString(i18n.language, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography 
              variant="body2" 
              fontWeight={theme.typography.fontWeights.semibold}
              sx={{ color: theme.colors.text }}
            >
              {order.orderProducts.length}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Button
              variant="contained"
              size="small"
              sx={{
                borderRadius: theme.borderRadius.xlarge,
                textTransform: 'none',
                px: 3,
                fontWeight: theme.typography.fontWeights.semibold,
                boxShadow: theme.shadows.sm,
                transition: theme.transitions.fast,
                '&:hover': {
                  boxShadow: theme.shadows.md,
                }
              }}
            >
              {t('dashboard.orderList.viewOrder', { defaultValue: 'View Order' })}
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </React.Fragment>
  );

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <TableContainer 
          component={Paper} 
          elevation={0} 
          sx={{ 
            borderRadius: theme.borderRadius.medium,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.sm,
          }}
        >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.colors.primaryLight }}>
              <TableCell width="20%">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('dashboard.orderList.headers.orderNo')}
                </Typography>
              </TableCell>
              <TableCell width="15%">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('dashboard.orderList.headers.table')}
                </Typography>
              </TableCell>
              <TableCell width="15%">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('dashboard.orderList.headers.time')}
                </Typography>
              </TableCell>
              <TableCell width="15%">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('dashboard.orderList.headers.amount')}
                </Typography>
              </TableCell>
              <TableCell align="right" width="20%">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('dashboard.orderList.headers.action')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderSection("newOrders", newOrders)}
            {renderSection("preparing", preparingOrders)}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
      
      {/* Order Options Dialog */}
      <OrderOptionsDialog />
    </>
  );
};

export default OrderList;
