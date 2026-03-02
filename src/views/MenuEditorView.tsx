import { Box, Typography } from '@mui/material';
import { theme } from '../theme';
import { useEffect, useMemo, useState } from 'react';
import MenuEditorHeader from '../components/menuEditor/MenuEditorHeader';
import MenuList from '../components/menuEditor/MenuList';
import EditMenuDialog from '../components/menuEditor/EditMenuDialog';
import type { MenuDataViewModel, MenuListItemViewModel } from '../viewModels';
import { useGetMenus } from '../api/hooks/menu.hooks';

export default function MenuEditorView() {
  const { data: menuListItems } = useGetMenus();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuDataViewModel | null>(null);
  const [menus, setMenus] = useState<MenuDataViewModel[]>([]);

  useEffect(() => {
    setMenus(
      menuListItems.map<MenuDataViewModel>((menu) => ({
        menuId: menu.id,
        menuName: menu.name,
        description: menu.description,
        isActive: menu.isActive,
        categories: [],
      }))
    );
  }, [menuListItems]);

  const filteredMenus = menus.filter((menu) =>
    (menu.menuName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMenuListItems = filteredMenus.map<MenuListItemViewModel>((menu, index) => ({
    id: menu.menuId || `menu-${index}`,
    name: menu.menuName || '',
    description: menu.description || '',
    isActive: Boolean(menu.isActive),
  }));

  const initialMenuData = useMemo(() => selectedMenu ?? undefined, [selectedMenu]);

  const handleAddMenu = () => {
    setSelectedMenu(null);
    setDialogOpen(true);
  };

  const handleMenuClick = (id: string) => {
    const menu = menus.find((item) => item.menuId === id);
    if (menu) {
      setSelectedMenu(menu);
      setDialogOpen(true);
    }
  };

  const handleSaveMenu = (data: MenuDataViewModel) => {
    setMenus((currentMenus) => {
      if (selectedMenu?.menuId) {
        return currentMenus.map((menu) =>
          menu.menuId === selectedMenu.menuId
            ? { ...menu, ...data, menuId: selectedMenu.menuId }
            : menu
        );
      }

      const nextId = `menu-${Date.now()}`;
      return [...currentMenus, { ...data, menuId: nextId }];
    });
  };

  const handleDeleteMenu = () => {
    if (selectedMenu) {
      setMenus((currentMenus) =>
        currentMenus.filter((menu) => menu.menuId !== selectedMenu.menuId)
      );
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
        <MenuList menus={filteredMenuListItems} onMenuClick={handleMenuClick} />
      )}

      {dialogOpen && (
        <EditMenuDialog
          key={selectedMenu?.menuId ?? 'new-menu'}
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
