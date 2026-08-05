import { Box } from '@mui/material';
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
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import Sidebar from '../components/common/Sidebar';
import type { MenuSection } from '../components/common/Sidebar';
import OrderDashboardView from './OrderDashboardView';
import TableView from './TableView';
import ProductEditorView from './ProductEditorView';
import SettingsView from './SettingsView';
import MenuEditorView from './MenuEditorView';
import OrderHistoryView from './OrderHistoryView';
import DeviceManagementView from './DeviceManagementView';
import { useAtomValue } from 'jotai';
import { roleAtom } from '../state/authStore';
import { UserRole } from '../types/enums';

const MainView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = useAtomValue(roleAtom);

  const menuText = useMemo(
    () => ({
      dashboard: t('dashboard.menu.dashboard'),
      tableMonitor: t('dashboard.menu.tableMonitor'),
      orderHistory: t('dashboard.menu.orderHistory'),
      settings: t('dashboard.menu.settings'),
      productEditor: t('admin.menu.productEditor'),
      menuEditor: t('admin.menu.menuEditor'),
      deviceManagement: t('admin.menu.deviceManagement'),
    }),
    [t]
  );

  const allMenuItems: MenuSection[] = useMemo(
    () => [
      {
        items: [
          {
            id: 'dashboard',
            text: menuText.dashboard,
            path: '/dashboard',
            icon: <Dashboard />,
          },
          {
            id: 'tables',
            text: menuText.tableMonitor,
            path: '/tables',
            icon: <TableBar />,
          },
          {
            id: 'history',
            text: menuText.orderHistory,
            path: '/history',
            icon: <History />,
          },
        ],
      },
      {
        title: t('admin.title'),
        items: [
          {
            id: 'products',
            text: menuText.productEditor,
            path: '/products',
            icon: <Edit />,
          },
          {
            id: 'menus',
            text: menuText.menuEditor,
            path: '/menus',
            icon: <MenuBook />,
          },
          {
            id: 'devices',
            text: menuText.deviceManagement,
            path: '/devices',
            icon: <Devices />,
          },
          {
            id: 'settings',
            text: menuText.settings,
            path: '/settings',
            icon: <Settings />,
          },
        ],
      },
    ],
    [menuText, t]
  );

  const allowedMenuIds = useMemo(() => {
    switch (currentRole) {
      case UserRole.SUPERUSER:
        return null;

      case UserRole.RESTAURANT_MANAGER:
        return new Set([
          'products',
          'menus',
          'settings',
        ]);

      case UserRole.RESTAURANT_STAFF:
        return new Set([
          'dashboard',
          'tables',
          'history',
          'devices',
          'settings',
        ]);

      default:
        return new Set(['dashboard']);
    }
  }, [currentRole]);

  const menuSections = useMemo(
    () =>
      allMenuItems
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (item) => !allowedMenuIds || allowedMenuIds.has(item.id)
          ),
        }))
        .filter((section) => section.items.length > 0),
    [allMenuItems, allowedMenuIds]
  );

  // Default route for the current user role
  const defaultRoute =
    menuSections[0]?.items[0]?.path ?? '/dashboard';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', minWidth: '100vw' }}>
      <Sidebar menuSections={menuSections} />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Navigate to={defaultRoute} replace />} />

          <Route path="/dashboard" element={<OrderDashboardView />} />
          <Route path="/tables" element={<TableView />} />
          <Route path="/history" element={<OrderHistoryView />} />
          <Route path="/products" element={<ProductEditorView />} />
          <Route path="/menus" element={<MenuEditorView />} />
          <Route path="/devices" element={<DeviceManagementView />} />
          <Route path="/settings" element={<SettingsView />} />

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default MainView;