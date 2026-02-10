import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  Dashboard,
  TableBar,
  Settings,
  Edit,
  MenuBook,
  Campaign,
  History,
  Devices,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { selectedMenuAtom } from '../context/dashboardStore';
import Sidebar from '../components/common/Sidebar';
import type { MenuSection } from '../components/common/Sidebar';
import OrderDashboardView from './OrderDashboardView';
import TableView from './TableView';
import ProductEditorView from './ProductEditorView';
import SettingsView from './SettingsView';
import MenuEditorView from './MenuEditorView';
import CampaignEditorView from './CampaignEditorView';
import OrderHistoryView from './OrderHistoryView';
import DeviceManagementView from './DeviceManagementView';

const MainView = () => {
  const { t } = useTranslation();
  const selectedMenu = useAtomValue(selectedMenuAtom);

  // Menu sections for the sidebar
  const menuSections: MenuSection[] = [
    {
      items: [
        { text: t('dashboard.menu.dashboard'), icon: <Dashboard />, badge: undefined },
        { text: t('dashboard.menu.tableMonitor'), icon: <TableBar />, badge: undefined },
        { text: t('dashboard.menu.orderHistory'), icon: <History />, badge: undefined },
      ],
    },
    {
      title: t('admin.title'),
      items: [
        { text: t('admin.menu.productEditor'), icon: <Edit />, badge: undefined },
        { text: t('admin.menu.menuEditor'), icon: <MenuBook />, badge: undefined },
        { text: t('admin.menu.campaignEditor'), icon: <Campaign />, badge: undefined },
        { text: t('admin.menu.deviceManagement'), icon: <Devices />, badge: undefined },
        { text: t('dashboard.menu.settings'), icon: <Settings />, badge: undefined },
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
      case t('dashboard.menu.orderHistory'):
        return <OrderHistoryView />;
      case t('dashboard.menu.settings'):
        return <SettingsView />;
      case t('admin.menu.productEditor'):
        return <ProductEditorView />;
      case t('admin.menu.menuEditor'):
        return <MenuEditorView />;
      case t('admin.menu.campaignEditor'):
        return <CampaignEditorView />;
      case t('admin.menu.deviceManagement'):
        return <DeviceManagementView />;
      default:
        return <OrderDashboardView />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', minWidth: '100vw' }}>
      {/* Sidebar */}
      <Sidebar menuSections={menuSections} />
      
      {/* Main Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {renderView()}
      </Box>
    </Box>
  );
};

export default MainView;
