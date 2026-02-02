import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
} from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedMenuAtom } from '../../context/dashboardStore';
import { theme } from '../../theme/theme';

export interface MenuItem {
  text: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: 'error' | 'warning' | 'success' | 'info';
}

interface DashboardSidebarProps {
  menuItems: MenuItem[];
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ menuItems }) => {
  const selectedMenu = useAtomValue(selectedMenuAtom);
  const setSelectedMenu = useSetAtom(selectedMenuAtom);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          bgcolor: theme.colors.brandBlue,
          color: theme.colors.brandWhite,
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ color: theme.colors.brandWhite, fontWeight: theme.typography.fontWeights.bold }}>
          soljuu.
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={selectedMenu === item.text}
            onClick={() => setSelectedMenu(item.text)}
            sx={{
              mx: 1,
              borderRadius: theme.borderRadius.medium,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: '#1a1f45',
                color: theme.colors.primary,
              },
              '&:hover': {
                bgcolor: '#1a1f45',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }} />
            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                color={item.badgeColor || 'default'}
                sx={{ height: 20, fontSize: '0.65rem' }}
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default DashboardSidebar;
