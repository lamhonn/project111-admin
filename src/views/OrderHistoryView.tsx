import { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { theme } from '../theme';
import OrderHistoryDialog from '../components/dashboard/OrderHistoryDialog';
import OrderHistoryHeader from '../components/orderHistory/OrderHistoryHeader';
import OrderHistoryFilters, { type FilterPreset } from '../components/orderHistory/OrderHistoryFilters';
import OrderHistoryTable from '../components/orderHistory/OrderHistoryTable';
import { OrderViewModel } from '../types/viewModels/orderViewModel';

export default function OrderHistoryView() {  
  const [filterPreset, setFilterPreset] = useState<FilterPreset>('week');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderViewModel | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter orders based on selected preset or custom date range
  const filteredOrders = useMemo(() => {
    const now = new Date();
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

  const handlePresetChange = (newPreset: FilterPreset) => {
    setFilterPreset(newPreset);
    // Clear custom dates when switching to a preset
    if (newPreset !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleRowClick = (order: HistoryOrderViewModel) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <OrderHistoryHeader />

      {/* Filter Section */}
      <Box sx={{ mb: 4 }}>
        <OrderHistoryFilters
          filterPreset={filterPreset}
          startDate={startDate}
          endDate={endDate}
          filteredOrdersCount={filteredOrders.length}
          onPresetChange={handlePresetChange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </Box>

      {/* Order History Table */}
      <OrderHistoryTable
        orders={filteredOrders}
        onRowClick={handleRowClick}
      />

      {/* Order History Dialog */}
      <OrderHistoryDialog
        open={dialogOpen}
        order={selectedOrder}
        onClose={handleCloseDialog}
      />
    </Box>
  );
}
