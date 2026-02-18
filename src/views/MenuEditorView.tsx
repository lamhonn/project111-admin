import { Box } from '@mui/material';
import { theme } from '../theme';
import { useState } from 'react';
import MenuEditorHeader from '../components/menuEditor/MenuEditorHeader';
import MenuList from '../components/menuEditor/MenuList';
import EditMenuDialog from '../components/menuEditor/EditMenuDialog';

interface Menu {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export default function MenuEditorView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  // Placeholder data - replace with actual data fetching
  const mockMenus = [
    { 
      id: 1, 
      name: 'Breakfast Menu', 
      description: 'Morning menu with fresh pastries, eggs, and coffee',
      isActive: true 
    },
    { 
      id: 2, 
      name: 'Lunch Menu', 
      description: 'Midday selections including salads, sandwiches, and main dishes',
      isActive: true 
    },
    { 
      id: 3, 
      name: 'Dinner Menu', 
      description: 'Evening menu featuring premium entrees and specialties',
      isActive: true 
    },
    { 
      id: 4, 
      name: 'Drinks Menu', 
      description: 'Beverages, cocktails, wines, and specialty drinks',
      isActive: true 
    },
    { 
      id: 5, 
      name: 'Desserts Menu', 
      description: 'Sweet treats and after-dinner delights',
      isActive: false 
    },
    { 
      id: 6, 
      name: 'Specials Menu', 
      description: 'Limited time seasonal offerings and chef specials',
      isActive: true 
    },
  ];

  const handleAddMenu = () => {
    setSelectedMenu(null);
    setDialogOpen(true);
  };

  const handleMenuClick = (id: number) => {
    const menu = mockMenus.find(m => m.id === id);
    if (menu) {
      setSelectedMenu(menu);
      setDialogOpen(true);
    }
  };

  const handleSaveMenu = (data: any) => {
    // TODO: Implement save menu functionality
    console.log('Save menu:', data);
  };

  const handleDeleteMenu = () => {
    if (selectedMenu) {
      // TODO: Implement delete menu functionality
      console.log('Delete menu:', selectedMenu.id);
    }
  };

  return (
    <Box sx={{ p: theme.spacing.lg, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      <MenuEditorHeader
        onAddMenu={handleAddMenu}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <MenuList menus={mockMenus} onMenuClick={handleMenuClick} />

      <EditMenuDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveMenu}
        onDelete={selectedMenu ? handleDeleteMenu : undefined}
        initialData={selectedMenu ? {
          menuName: selectedMenu.name,
          description: selectedMenu.description,
          isActive: selectedMenu.isActive,
        } : undefined}
      />
    </Box>
  );
}
