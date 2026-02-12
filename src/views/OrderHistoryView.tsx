import { useState, useMemo } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';
import { useGetOrderHistory } from '../api/hooks/orderHistory.hooks';
import OrderHistoryDialog from '../components/dashboard/OrderHistoryDialog';
import type { HistoryOrder } from '../api/mockData/orderHistory.mock';

type FilterPreset = 'today' | '3days' | 'week' | 'month' | 'custom';

export default function OrderHistoryView() {
  const { t } = useTranslation();
  const { data: allOrders } = useGetOrderHistory();
  
  const [filterPreset, setFilterPreset] = useState<FilterPreset>('week');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<HistoryOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter orders based on selected preset or custom date range
  const filteredOrders = useMemo(() => {
    const now = new Date('2026-02-12'); // Current date from context
    let filterStartDate: Date;

    if (filterPreset === 'custom') {
      if (!startDate || !endDate) return allOrders;
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      
      return allOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate <= end;
      });
    }

    // Calculate start date based on preset
    switch (filterPreset) {
      case 'today':
        filterStartDate = new Date(now);
        filterStartDate.setHours(0, 0, 0, 0);
        break;
      case '3days':
        filterStartDate = new Date(now);
        filterStartDate.setDate(filterStartDate.getDate() - 3);
        filterStartDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterStartDate = new Date(now);
        filterStartDate.setDate(filterStartDate.getDate() - 7);
        filterStartDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        filterStartDate = new Date(now);
        filterStartDate.setDate(filterStartDate.getDate() - 30);
        filterStartDate.setHours(0, 0, 0, 0);
        break;
      default:
        return allOrders;
    }

    return allOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= filterStartDate;
    });
  }, [allOrders, filterPreset, startDate, endDate]);

  const handlePresetChange = (_event: React.MouseEvent<HTMLElement>, newPreset: FilterPreset | null) => {
    if (newPreset !== null) {
      setFilterPreset(newPreset);
      // Clear custom dates when switching to a preset
      if (newPreset !== 'custom') {
        setStartDate('');
        setEndDate('');
      }
    }
  };

  const handleRowClick = (order: HistoryOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: theme.typography.fontWeights.bold,
            color: theme.colors.text,
            mb: 3,
          }}
        >
          {t('orderHistory.title')}
        </Typography>

        {/* Filter Section */}
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Preset Filters */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.colors.text,
                opacity: 0.7,
                fontWeight: theme.typography.fontWeights.medium,
              }}
            >
              {t('orderHistory.filters.showLast')}
            </Typography>
            <ToggleButtonGroup
              value={filterPreset}
              exclusive
              onChange={handlePresetChange}
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.75,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.text,
                  '&.Mui-selected': {
                    bgcolor: theme.colors.primary,
                    color: theme.colors.brandWhite,
                    '&:hover': {
                      bgcolor: theme.colors.primary,
                    },
                  },
                  '&:hover': {
                    bgcolor: theme.colors.primaryLight,
                  },
                },
              }}
            >
              <ToggleButton value="today">{t('orderHistory.filters.today')}</ToggleButton>
              <ToggleButton value="3days">{t('orderHistory.filters.threeDays')}</ToggleButton>
              <ToggleButton value="week">{t('orderHistory.filters.week')}</ToggleButton>
              <ToggleButton value="month">{t('orderHistory.filters.month')}</ToggleButton>
              <ToggleButton value="custom">{t('orderHistory.filters.custom')}</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Custom Date Range */}
          {filterPreset === 'custom' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.colors.text,
                  opacity: 0.7,
                  fontWeight: theme.typography.fontWeights.medium,
                }}
              >
                {t('orderHistory.filters.showBetween')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputProps={{
                    sx: {
                      bgcolor: theme.colors.background,
                      color: theme.colors.text,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.colors.border,
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Typography sx={{ color: theme.colors.text, opacity: 0.7 }}>{t('orderHistory.filters.to')}</Typography>
                <TextField
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputProps={{
                    sx: {
                      bgcolor: theme.colors.background,
                      color: theme.colors.text,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.colors.border,
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Results count */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'flex-end', height: '100%', pb: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.colors.text,
                opacity: 0.7,
              }}
            >
              {t('orderHistory.filters.showing', { count: filteredOrders.length })}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Order History Table */}
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
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  onClick={() => handleRowClick(order)}
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

      {/* Order History Dialog */}
      <OrderHistoryDialog
        open={dialogOpen}
        order={selectedOrder}
        onClose={handleCloseDialog}
      />
      </Box>
    </Box>
  );
}
