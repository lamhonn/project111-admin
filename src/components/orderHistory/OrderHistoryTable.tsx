import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';
import type { HistoryOrderViewModel } from '../../viewModels';

interface OrderHistoryTableProps {
  orders: HistoryOrderViewModel[];
  onRowClick: (order: HistoryOrderViewModel) => void;
}

export default function OrderHistoryTable({ orders, onRowClick }: OrderHistoryTableProps) {
  const { t } = useTranslation();

  return (
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
              <TableCell width="35%">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('orderHistory.orderNumber')}
                </Typography>
              </TableCell>
              <TableCell width="40%">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('orderHistory.date')}
                </Typography>
              </TableCell>
              <TableCell width="25%" align="right">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('orderHistory.total')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                hover
                onClick={() => onRowClick(order)}
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
                    {order.orderNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ color: theme.colors.text }}
                  >
                    {order.date}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="body2" 
                    fontWeight={theme.typography.fontWeights.semibold}
                    sx={{ color: theme.colors.text }}
                  >
                    €{order.total.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
