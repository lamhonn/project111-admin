import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  Dashboard,
  TableBar,
  Settings,
  Edit,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { selectedMenuAtom } from '../context/dashboardStore';
import DashboardSidebar from '../components/common/Sidebar';
import type { MenuSection } from '../components/common/Sidebar';
import OrderDashboardView from './OrderDashboardView';
import TableView from './TableView';
import ProductEditorView from './ProductEditorView';

const MainView = () => {
  const { t } = useTranslation();
  const selectedMenu = useAtomValue(selectedMenuAtom);

  // Menu sections for the sidebar
  const menuSections: MenuSection[] = [
    {
      items: [
        { text: t('dashboard.menu.dashboard'), icon: <Dashboard />, badge: undefined },
        { text: t('dashboard.menu.tableMonitor'), icon: <TableBar />, badge: undefined },
        { text: t('dashboard.menu.settings'), icon: <Settings />, badge: undefined },
      ],
    },
    {
      title: t('admin.title'),
      items: [
        { text: t('admin.menu.productEditor'), icon: <Edit />, badge: undefined },
      ],
    },
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
      case t('admin.menu.productEditor'):
        return <ProductEditorView />;
      default:
        return <OrderDashboardView />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', minWidth: '100vw' }}>
      {/* Sidebar */}
      <DashboardSidebar menuSections={menuSections} />
      
      {/* Main Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {renderView()}
      </Box>
    </Box>
  );
};

export default MainView;
