import { Box } from '@mui/material';
import { theme } from '../theme';
import { useState } from 'react';
import MenuEditorHeader from '../components/menuEditor/MenuEditorHeader';
import MenuList from '../components/menuEditor/MenuList';

export default function MenuEditorView() {
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data - replace with actual data fetching
  const mockMenus = [
    { id: 1, name: 'Breakfast Menu', productCount: 12 },
    { id: 2, name: 'Lunch Menu', productCount: 24 },
    { id: 3, name: 'Dinner Menu', productCount: 32 },
    { id: 4, name: 'Drinks Menu', productCount: 18 },
    { id: 5, name: 'Desserts Menu', productCount: 8 },
    { id: 6, name: 'Specials Menu', productCount: 6 },
  ];

  const handleAddMenu = () => {
    // TODO: Implement add menu functionality
    console.log('Add menu clicked');
  };

  const handleMenuClick = (id: number) => {
    // TODO: Implement menu click/edit functionality
    console.log('Menu clicked:', id);
  };

  return (
    <Box sx={{ p: theme.spacing.lg, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      <MenuEditorHeader
        onAddMenu={handleAddMenu}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <MenuList menus={mockMenus} onMenuClick={handleMenuClick} />
    </Box>
  );
}
