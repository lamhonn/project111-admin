import React, { useEffect } from 'react';
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
import { 
  orderListSectionsAtom, 
  selectedOrderAtom,
  orderOptionsDialogOpenAtom,
  type OrderListSection 
} from '../../context/dashboardStore';
import { useGetOrderListSections } from '../../api/hooks/dashboard.hooks';
import { getOrderDetails } from '../../api/mockData/dashboard.mock';
import OrderOptionsDialog from './OrderOptionsDialog';

interface OrderListProps {
  // Props can be added later if needed
}

const OrderList: React.FC<OrderListProps> = () => {
  const { t } = useTranslation();
  const setOrderSections = useSetAtom(orderListSectionsAtom);
  const orderSections = useAtomValue(orderListSectionsAtom);
  const setSelectedOrder = useSetAtom(selectedOrderAtom);
  const setDialogOpen = useSetAtom(orderOptionsDialogOpenAtom);
  const { data } = useGetOrderListSections();

  // Populate atom with data from hook
  useEffect(() => {
    if (data) {
      setOrderSections(data);
    }
  }, [data, setOrderSections]);

  // Handle row click to open dialog
  const handleRowClick = (orderNo: string) => {
    const orderDetails = getOrderDetails(orderNo);
    if (orderDetails) {
      setSelectedOrder(orderDetails);
      setDialogOpen(true);
    }
  };

  const renderSection = (section: OrderListSection) => (
    <React.Fragment key={section.section}>
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
            {t(`dashboard.orderList.sections.${section.section}`)} ({section.count})
          </Typography>
        </TableCell>
      </TableRow>
      {section.orders.map((order, idx) => (
        <TableRow
          key={`${order.orderNo}-${idx}`}
          hover
          onClick={() => handleRowClick(order.orderNo)}
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
              {order.orderNo}
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
              {order.time}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography 
              variant="body2" 
              fontWeight={theme.typography.fontWeights.semibold}
              sx={{ color: theme.colors.text }}
            >
              {order.amount}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Button
              variant="contained"
              size="small"
              color={order.statusColor}
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
              {t(`dashboard.orderList.actions.${order.status}`)}
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
          <TableBody>{orderSections.map(renderSection)}</TableBody>
        </Table>
      </TableContainer>
      </Box>
      
      {/* Order Options Dialog */}
      <OrderOptionsDialog />
    </>
  );
};

export default OrderList;
