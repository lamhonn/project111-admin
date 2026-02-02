import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  Dashboard,
  Restaurant,
  KitchenOutlined,
  TableBar,
  BarChart,
  Payment,
  People,
  Star,
  Settings,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { selectedMenuAtom } from '../context/dashboardStore';
import DashboardSidebar from '../components/common/DashboardSidebar';
import type { MenuItem } from '../components/common/DashboardSidebar';
import OrderDashboardView from './OrderDashboardView';

const MainView = () => {
  const { t } = useTranslation();
  const selectedMenu = useAtomValue(selectedMenuAtom);

  // Menu items for the sidebar
  const menuItems: MenuItem[] = [
    { text: t('dashboard.menu.dashboard'), icon: <Dashboard />, badge: undefined },
    { text: t('dashboard.menu.allOrders'), icon: <Restaurant />, badge: undefined },
    { text: t('dashboard.menu.foodMenu'), icon: <Restaurant />, badge: undefined },
    { text: t('dashboard.menu.liveKitchen'), icon: <KitchenOutlined />, badge: 'NEW', badgeColor: 'error' },
    { text: t('dashboard.menu.deliveriesStaff'), icon: <People />, badge: undefined },
    { text: t('dashboard.menu.tableBooking'), icon: <TableBar />, badge: undefined },
    { text: t('dashboard.menu.analytics'), icon: <BarChart />, badge: undefined },
    { text: t('dashboard.menu.payments'), icon: <Payment />, badge: undefined },
    { text: t('dashboard.menu.manageStaff'), icon: <People />, badge: undefined },
    { text: t('dashboard.menu.customerReviews'), icon: <Star />, badge: undefined },
    { text: t('dashboard.menu.settings'), icon: <Settings />, badge: undefined },
  ];

  // Render the appropriate view based on selected menu
  const renderView = () => {
    switch (selectedMenu) {
      case 'Dashboard':
        return <OrderDashboardView />;
      case 'Orders':
        return <OrderDashboardView />;
      // TODO: Add more views as they are implemented
      default:
        return <OrderDashboardView />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <DashboardSidebar menuItems={menuItems} />
      
      {/* Main Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {renderView()}
      </Box>
    </Box>
  );
};

export default MainView;
