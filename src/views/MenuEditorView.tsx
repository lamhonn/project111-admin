import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import MenuEditorHeader from '../components/menuEditor/MenuEditorHeader';
import MenuList from '../components/menuEditor/MenuList';
import EditMenuDialog from '../components/menuEditor/EditMenuDialog';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { getMenusAtom, loadingAtom, menusAtom, selectedMenuIdAtom } from '../state/menuStore';

export default function MenuEditorView() {
  const { t } = useTranslation();

  const loading = useAtomValue(loadingAtom);


  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedMenuId, setSelectedMenuId] = useAtom(selectedMenuIdAtom);

  const menus = useAtomValue(menusAtom);
  const getMenus = useSetAtom(getMenusAtom);

  useEffect(() => {
    getMenus();
  }, []);

  const handleAddMenu = () => {
    setSelectedMenuId(null);
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

      {loading ?
        <CircularProgress />
        :
        (menus.length === 0 ? (
          <Typography variant="body1" sx={{ color: theme.colors.text }}>
            {t(`admin.menuEditor.dialog.noMenus`)}
          </Typography>
        ) : (
          <MenuList onMenuClick={handleMenuClick} />
        ))
      }

      {dialogOpen && (
        <EditMenuDialog
          key={selectedMenuId ?? null}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </Box>
  );
}
