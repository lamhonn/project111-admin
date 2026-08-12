import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';
import { OrderViewModel } from '../../types/viewModels/orderViewModel';

interface OrderHistoryTableProps {
  loading: boolean;
  orders: OrderViewModel[];
  onRowClick: (order: OrderViewModel) => void;
}

export default function OrderHistoryTable({ loading, orders, onRowClick }: OrderHistoryTableProps) {
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
            {loading ? 
              <CircularProgress size={16} sx={{ color: 'white' }} />
              :
              (orders.map((order) => (
                <TableRow
                  key={order.Id}
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
                      {order.Id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ color: theme.colors.text }}
                    >
                      {order.Created.toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      fontWeight={theme.typography.fontWeights.semibold}
                      sx={{ color: theme.colors.text }}
                    >
                      {order.TotalPrice}€
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
