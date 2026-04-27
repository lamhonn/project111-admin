import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  IconButton,
  Backdrop,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedMenuAtom } from '../../context/dashboardStore';
import { theme } from '../../theme/theme';

export interface MenuItem {
  text: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: 'error' | 'warning' | 'success' | 'info';
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

interface DashboardSidebarProps {
  menuSections: MenuSection[];
}

const COLLAPSED_WIDTH = 72; // Icon + padding
const EXPANDED_WIDTH = 240;

const Sidebar: React.FC<DashboardSidebarProps> = ({ menuSections }) => {
  const selectedMenu = useAtomValue(selectedMenuAtom);
  const setSelectedMenu = useSetAtom(selectedMenuAtom);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMenuItemClick = (text: string) => {
    setSelectedMenu(text);
    setIsExpanded(false); // Close sidebar after selection
  };

  return (
    <>
      {/* Backdrop overlay when expanded */}
      <Backdrop
        open={isExpanded}
        onClick={() => setIsExpanded(false)}
        sx={{ zIndex: 1200 }}
      />

      {/* Permanent collapsed drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: COLLAPSED_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: COLLAPSED_WIDTH,
            bgcolor: theme.colors.brandBlue,
            color: theme.colors.brandWhite,
            borderRight: 'none',
            overflow: 'hidden',
            transition: theme.transitions.normal,
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 64,
        }}>
          <IconButton
            onClick={handleToggle}
            sx={{ 
              color: theme.colors.brandWhite,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <List>
          {menuSections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              {sectionIndex > 0 && (
                <Divider 
                  sx={{ 
                    my: 1, 
                    mx: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  }} 
                />
              )}
              {section.items.map((item) => (
                <ListItemButton
                  key={item.text}
                  selected={selectedMenu === item.text}
                  onClick={() => handleMenuItemClick(item.text)}
                  sx={{
                    mx: 1,
                    borderRadius: theme.borderRadius.medium,
                    mb: 0.5,
                    justifyContent: 'center',
                    minHeight: 48,
                    '&.Mui-selected': {
                      bgcolor: '#1a1f45',
                      color: theme.colors.primary,
                    },
                    '&:hover': {
                      bgcolor: '#1a1f45',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: 'inherit', 
                    minWidth: 'unset',
                    justifyContent: 'center',
                  }}>
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              ))}
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      {/* Expanded overlay drawer */}
      <Drawer
        variant="temporary"
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        sx={{
          width: EXPANDED_WIDTH,
          flexShrink: 0,
          zIndex: 1300,
          '& .MuiDrawer-paper': {
            width: EXPANDED_WIDTH,
            bgcolor: theme.colors.brandBlue,
            color: theme.colors.brandWhite,
            borderRight: 'none',
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 3,
          gap: 2,
        }}>
          <IconButton
            onClick={handleToggle}
            sx={{ 
              color: theme.colors.brandWhite,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: theme.typography.fontWeights.bold,
            }}
          >
            soljuu.
          </Typography>
        </Box>
        <List>
          {menuSections.map((section, sectionIndex) => (
            <Box key={sectionIndex}>
              {section.title && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.colors.brandGrey,
                    px: 2,
                    pt: sectionIndex === 0 ? 0 : 2,
                    pb: 1,
                    display: 'block',
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    fontWeight: theme.typography.fontWeights.bold,
                  }}
                >
                  {section.title}
                </Typography>
              )}
              {section.items.map((item) => (
                <ListItemButton
                  key={item.text}
                  selected={selectedMenu === item.text}
                  onClick={() => handleMenuItemClick(item.text)}
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
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontSize: '0.9rem' }} 
                  />
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
            </Box>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
