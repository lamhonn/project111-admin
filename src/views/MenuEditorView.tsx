import { Box, Typography } from '@mui/material';
import { theme } from '../theme';
import { useMemo, useState } from 'react';
import MenuEditorHeader from '../components/menuEditor/MenuEditorHeader';
import MenuList from '../components/menuEditor/MenuList';
import EditMenuDialog from '../components/menuEditor/EditMenuDialog';
import ErrorReportDialog from '../components/common/ErrorReportDialog';
import type { MenuDataViewModel, MenuListItemViewModel } from '../viewModels';
import { useGetMenus } from '../api/hooks/menu.hooks';

export default function MenuEditorView() {
  const { editorData: menus, createMenu, updateMenu, deleteMenu } = useGetMenus();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuDataViewModel | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  };

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

  const handleSaveMenu = async (data: MenuDataViewModel) => {
    try {
      const categories = data.categories ?? [];
      const serializedCategories = JSON.stringify(
        categories.map((category) => ({
          id: category.id,
          name: category.name,
          showTopmost: Boolean(category.showTopmost),
          productIds: (category.items ?? []).map((item) => item.id),
        }))
      );

      const topmostCategory = categories.some((category) => Boolean(category.showTopmost));
      const payload = {
        name: data.menuName?.trim() || 'Menu',
        enabled: Boolean(data.isActive),
        categories: serializedCategories,
        topmostCategory,
      };

      if (selectedMenu?.menuId) {
        const result = await updateMenu({
          id: selectedMenu.menuId,
          ...payload,
        });
        if (!result.success) {
          throw new Error(result.message);
        }
        return;
      }

      const result = await createMenu(payload);
      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
      throw error;
    }
  };

  const handleDeleteMenu = async () => {
    try {
      if (selectedMenu?.menuId) {
        const result = await deleteMenu(selectedMenu.menuId);
        if (!result.success) {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
      throw error;
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

      <ErrorReportDialog
        open={Boolean(errorMessage)}
        errorMessage={errorMessage ?? ''}
        onClose={() => setErrorMessage(null)}
      />
    </Box>
  );
}
