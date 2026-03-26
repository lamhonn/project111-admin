import { Box } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Dashboard,
  TableBar,
  Settings,
  Edit,
  MenuBook,
  History,
  Devices,
} from '@mui/icons-material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { selectedMenuAtom } from '../context/dashboardStore';
import Sidebar from '../components/common/Sidebar';
import type { MenuSection } from '../components/common/Sidebar';
import { useAuthorization } from '../api/hooks/auth.hooks';
import OrderDashboardView from './OrderDashboardView';
import TableView from './TableView';
import ProductEditorView from './ProductEditorView';
import SettingsView from './SettingsView';
import MenuEditorView from './MenuEditorView';
import OrderHistoryView from './OrderHistoryView';
import DeviceManagementView from './DeviceManagementView';

const MainView = () => {
  const { t } = useTranslation();
  const { getCurrentRole } = useAuthorization();
  const selectedMenu = useAtomValue(selectedMenuAtom);
  const setSelectedMenu = useSetAtom(selectedMenuAtom);

  const currentRole = getCurrentRole();

  const menuText = useMemo(() => ({
    dashboard: t('dashboard.menu.dashboard'),
    tableMonitor: t('dashboard.menu.tableMonitor'),
    orderHistory: t('dashboard.menu.orderHistory'),
    settings: t('dashboard.menu.settings'),
    productEditor: t('admin.menu.productEditor'),
    menuEditor: t('admin.menu.menuEditor'),
    deviceManagement: t('admin.menu.deviceManagement'),
  }), [t]);

  const allMenuItems: MenuSection[] = useMemo(() => [
    {
      items: [
        { text: menuText.dashboard, icon: <Dashboard />, badge: undefined },
        { text: menuText.tableMonitor, icon: <TableBar />, badge: undefined },
        { text: menuText.orderHistory, icon: <History />, badge: undefined },
      ],
    },
    {
      title: t('admin.title'),
      items: [
        { text: menuText.productEditor, icon: <Edit />, badge: undefined },
        { text: menuText.menuEditor, icon: <MenuBook />, badge: undefined },
        { text: menuText.deviceManagement, icon: <Devices />, badge: undefined },
        { text: menuText.settings, icon: <Settings />, badge: undefined },
      ],
    },
  ], [menuText, t]);

  const allowedMenuTexts = useMemo(() => {
    if (currentRole === 'Superuser') {
      return new Set(allMenuItems.flatMap((section) => section.items.map((item) => item.text)));
    }

    if (currentRole === 'RestaurantAdmin') {
      return new Set([
        menuText.dashboard,
        menuText.tableMonitor,
        menuText.orderHistory,
        menuText.settings,
        menuText.deviceManagement,
      ]);
    }

    if (currentRole === 'RestaurantManager') {
      return new Set([
        menuText.menuEditor,
        menuText.productEditor,
        menuText.settings,
      ]);
    }

    return new Set([menuText.dashboard]);
  }, [allMenuItems, currentRole, menuText.dashboard, menuText.deviceManagement, menuText.menuEditor, menuText.orderHistory, menuText.productEditor, menuText.settings, menuText.tableMonitor]);

  const menuSections: MenuSection[] = useMemo(
    () =>
      allMenuItems
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => allowedMenuTexts.has(item.text)),
        }))
        .filter((section) => section.items.length > 0),
    [allMenuItems, allowedMenuTexts]
  );

  useEffect(() => {
    if (allowedMenuTexts.size === 0) {
      return;
    }

    if (!allowedMenuTexts.has(selectedMenu)) {
      const firstAllowed = menuSections[0]?.items[0]?.text;
      if (firstAllowed) {
        setSelectedMenu(firstAllowed);
      }
    }
  }, [allowedMenuTexts, menuSections, selectedMenu, setSelectedMenu]);

  // Render the appropriate view based on selected menu
  const renderView = () => {
    const fallbackMenu = menuSections[0]?.items[0]?.text ?? menuText.dashboard;
    const effectiveMenu = allowedMenuTexts.has(selectedMenu) ? selectedMenu : fallbackMenu;

    switch (effectiveMenu) {
      case menuText.dashboard:
        return <OrderDashboardView />;
      case menuText.tableMonitor:
        return <TableView />;
      case menuText.orderHistory:
        return <OrderHistoryView />;
      case menuText.settings:
        return <SettingsView />;
      case menuText.productEditor:
        return <ProductEditorView />;
      case menuText.menuEditor:
        return <MenuEditorView />;
      case menuText.deviceManagement:
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
