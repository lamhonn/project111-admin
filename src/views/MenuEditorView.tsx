import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import MenuEditorHeader from '../components/menuEditor/MenuEditorHeader';
import MenuList from '../components/menuEditor/MenuList';
import EditMenuDialog from '../components/menuEditor/EditMenuDialog';
import { useAtomValue, useSetAtom } from 'jotai';
import { menusAtom, selectedMenuIdAtom, updateMenuAtom } from '../state/menuStore';
import { Menu } from '../types/models';

export default function MenuEditorView() {
  const { t, i18n } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const menus = useAtomValue(menusAtom);
  const setSelectedMenuId = useSetAtom(selectedMenuIdAtom);

  const handleAddMenu = () => {
    setSelectedMenu(null);
    setDialogOpen(true);
  };

  const handleMenuClick = (id: string) => {
    setSelectedMenuId(id);
    setDialogOpen(true);
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
          {t(`admin.menuEditor.dialog.noMenus`)}
        </Typography>
      ) : (
        <MenuList onMenuClick={handleMenuClick} />
      )}

      {dialogOpen && (
        <EditMenuDialog
          key={selectedMenu?.Id ?? null}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
{/* 
      <ErrorReportDialog
        open={Boolean(errorMessage)}
        errorMessage={errorMessage ?? ''}
        onClose={() => setErrorMessage(null)}
      /> */}
    </Box>
  );
}
