import React from 'react';
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
import { newOrdersAtom, preparingOrdersAtom, selectedOrderIdAtom } from '../../state/orderStore';
import { orderOptionsDialogOpenAtom } from '../../state/orderStore';
import { OrderViewModel } from '../../types/viewModels/orderViewModel';

const OrderList: React.FC = () => {
  const { t } = useTranslation();
  const setSelectedOrder = useSetAtom(selectedOrderIdAtom);
  const setDialogOpen = useSetAtom(orderOptionsDialogOpenAtom);
  const newOrders = useAtomValue(newOrdersAtom);
  const preparingOrders = useAtomValue(preparingOrdersAtom);

  // Handle row click to open dialog
  const handleRowClick = (orderId: string) => {
    setSelectedOrder(orderId);
    setDialogOpen(true);
  };

  const renderSection = (section: string, orders: OrderViewModel[]) => (
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
          key={`${order.Id}-${idx}`}
          hover
          onClick={() => handleRowClick(order.Id)}
          sx={{ 
            '&:last-child td, &:last-child th': { border: 0 },
            transition: theme.transitions.fast,
            cursor: 'pointer',
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
              {order.Id}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography 
              variant="body2" 
              fontWeight={theme.typography.fontWeights.medium}
              sx={{ color: theme.colors.text }}
            >
              {t('dashboard.orderList.tableLabel', { number: order.TableNumber })}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography 
              variant="caption" 
              sx={{ color: theme.colors.text, opacity: 0.6 }}
            >
              {order.Created.toLocaleDateString()}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography 
              variant="body2" 
              fontWeight={theme.typography.fontWeights.semibold}
              sx={{ color: theme.colors.text }}
            >
              {order.OrderProducts.length}
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
              {t(`dashboard.orderList.actions.${order.OrderStatus}`)}
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
