import { Box, Typography } from '@mui/material';
import { theme } from '../theme';
import { useMemo, useState } from 'react';
import MenuEditorHeader from '../components/menuEditor/MenuEditorHeader';
import MenuList from '../components/menuEditor/MenuList';
import EditMenuDialog from '../components/menuEditor/EditMenuDialog';
import type { MenuListItemViewModel } from '../viewModels';
import { useGetMenus } from '../api/hooks/menu.hooks';

export default function MenuEditorView() {
  const { data: menus } = useGetMenus();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuListItemViewModel | null>(null);

  const filteredMenus = menus.filter((menu) =>
    menu.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initialMenuData = useMemo(
    () =>
      selectedMenu
        ? {
            menuName: selectedMenu.name,
            description: selectedMenu.description,
            isActive: selectedMenu.isActive,
          }
        : undefined,
    [selectedMenu]
  );

  const handleAddMenu = () => {
    setSelectedMenu(null);
    setDialogOpen(true);
  };

  const handleMenuClick = (id: string) => {
    const menu = filteredMenus.find((item) => item.id === id);
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

      {menus.length === 0 ? (
        <Typography variant="body1" sx={{ color: theme.colors.text }}>
          No menus configured
        </Typography>
      ) : (
        <MenuList menus={filteredMenus} onMenuClick={handleMenuClick} />
      )}

      {dialogOpen && (
        <EditMenuDialog
          key={selectedMenu?.id ?? 'new-menu'}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveMenu}
          onDelete={selectedMenu ? handleDeleteMenu : undefined}
          initialData={initialMenuData}
        />
      )}
    </Box>
  );
}
