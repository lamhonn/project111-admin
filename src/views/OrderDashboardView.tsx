import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  activeOrderCountAtom,
  inProcessOrderCountAtom,
} from '../context/dashboardStore';
import { useGetDashboardData } from '../api/hooks/dashboard.hooks';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import IncomingOrdersCard from '../components/dashboard/IncomingOrdersCard';
import InProcessOrdersCard from '../components/dashboard/InProcessOrdersCard';
import DeliveryStatsCard from '../components/dashboard/DeliveryStatsCard';

export default function OrderDashboardView() {
  const activeOrderCount = useAtomValue(activeOrderCountAtom);
  const inProcessOrderCount = useAtomValue(inProcessOrderCountAtom);

  // Fetch dashboard data using hook
  const { data: dashboardData, loading } = useGetDashboardData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ color: 'white' }}>Loading...</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      {/* Header */}
      {/* <DashboardHeader
        userName="Margot Crouch"
        date="24 September 2022"
        lastLogin="13:22"
      /> */}

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* New Active Orders */}
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

        {/* Delivery Status */}
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <DeliveryStatsCard
            deliveryStats={dashboardData.deliveryStats}
            orderStats={dashboardData.orderStats}
          />
        </Box>
      </Box>
    </Box>
  );
}
