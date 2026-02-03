import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  activeOrderCountAtom,
  inProcessOrderCountAtom,
  billCountAtom,
} from '../context/dashboardStore';
import { useGetDashboardData } from '../api/hooks/dashboard.hooks';
import IncomingOrdersCard from '../components/dashboard/IncomingOrdersCard';
import InProcessOrdersCard from '../components/dashboard/InProcessOrdersCard';
import IncomingBillsCard from '../components/dashboard/IncomingBillsCard';
import { theme } from '../theme';

export default function OrderDashboardView() {
  const activeOrderCount = useAtomValue(activeOrderCountAtom);
  const inProcessOrderCount = useAtomValue(inProcessOrderCountAtom);
  const billCount = useAtomValue(billCountAtom);

  // Fetch dashboard data using hook
  const { data: dashboardData, loading } = useGetDashboardData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ color: theme.colors.brandWhite }}>Loading...</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Incoming Orders */}
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <IncomingOrdersCard
            orders={dashboardData.incomingOrders}
            activeOrderCount={activeOrderCount}
          />
        </Box>

        {/* In Process Orders */}
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <InProcessOrdersCard
            orders={dashboardData.inProcessOrders}
            inProcessOrderCount={inProcessOrderCount}
          />
        </Box>

        {/* Incoming Bills */}
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <IncomingBillsCard
            bills={dashboardData.bills}
            billCount={billCount}
          />
        </Box>
      </Box>
    </Box>
  );
}
