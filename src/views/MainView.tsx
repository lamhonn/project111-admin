import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  Dashboard,
  TableBar,
  Settings,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { selectedMenuAtom } from '../context/dashboardStore';
import DashboardSidebar from '../components/common/Sidebar';
import type { MenuItem } from '../components/common/Sidebar';
import OrderDashboardView from './OrderDashboardView';
import TableView from './TableView';

const MainView = () => {
  const { t } = useTranslation();
  const selectedMenu = useAtomValue(selectedMenuAtom);

  // Menu items for the sidebar
  const menuItems: MenuItem[] = [
    { text: t('dashboard.menu.dashboard'), icon: <Dashboard />, badge: undefined },
    { text: t('dashboard.menu.tableMonitor'), icon: <TableBar />, badge: undefined },
    { text: t('dashboard.menu.settings'), icon: <Settings />, badge: undefined },
  ];

  // Render the appropriate view based on selected menu
  const renderView = () => {
    switch (selectedMenu) {
      case t('dashboard.menu.dashboard'):
        return <OrderDashboardView />;
      case t('dashboard.menu.tableMonitor'):
        return <TableView />;
      case t('dashboard.menu.settings'):
        return <OrderDashboardView />; // TODO: Create SettingsView
      default:
        return <OrderDashboardView />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', minWidth: '100vw' }}>
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
