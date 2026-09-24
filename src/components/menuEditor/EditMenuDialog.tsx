import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import CategoryNameDialog from './CategoryNameDialog';
import MenuSettingsDialog from './MenuSettingsDialog';
import CategoryItemsDialog from './CategoryItemsDialog';
import { MenuViewModel } from '../../types/viewModels/menuViewModel';
import { useAtomValue, useSetAtom } from 'jotai';
import { createMenuAtom, deleteMenuAtom, getSelectedMenuAtom, getSelectedMenuCategoriesAtom, selectedMenuIdAtom, updateMenuAtom } from '../../state/menuStore';
import { MenuCategoryViewModel } from '../../types/viewModels/menuCategoryViewModel';
import { openConfirmDialogAtom } from '../../state/confirmDialogStore';
import { getTranslation } from '../../utils/multilingualNameUtils';
import { MenuProduct } from '../../types/models';
import { organizationIdAtom } from '../../state/authStore';
import { languageAtom } from '../../state/uiStore';

interface EditMenuDialogProps {
  open: boolean;
  onClose: () => void;
}

const EditMenuDialog: React.FC<EditMenuDialogProps> = ({ 
  open, 
  onClose, 
}) => {
  const { t, i18n } = useTranslation();
  const language = useAtomValue(languageAtom);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('{ "fi": "", "en": "", "sv": "" }');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<MenuProduct[]>([]);

  const menu = useAtomValue(getSelectedMenuAtom);
  const menuCategories = useAtomValue(getSelectedMenuCategoriesAtom); // TODO: add an ability to sort categories
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);

  const organizationId = useAtomValue(organizationIdAtom);

  const createMenu = useSetAtom(createMenuAtom);
  const updateMenu = useSetAtom(updateMenuAtom);
  const deleteMenu = useSetAtom(deleteMenuAtom);

  const [formData, setFormData] = useState<MenuViewModel>({
    id: crypto.randomUUID(),
    organizationId: organizationId ?? '',
    enabled: false,
    name: '',
    patternStartTime: null,
    patternEndTime: null,
    eventStartTime: null,
    eventEndTime: null,
    menuCategories: [],
    menuProducts: [],
    created: new Date(),
  });

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    parseRawMenuData();
  }, []);

  const parseRawMenuData = () => {
    if (!menu) return;

    const menuViewModel: MenuViewModel = {
      id: menu.id,
      organizationId: menu.organizationId,
      enabled: menu.enabled,
      name: menu.name,
      patternStartTime: menu.patternStartTime,
      patternEndTime: menu.patternEndTime,
      eventStartTime: menu.eventStartTime,
      eventEndTime: menu.eventEndTime,
      menuCategories: menuCategories ?? [],
      menuProducts: menu.menuProducts,
      created: menu.created,
    };

    setFormData(menuViewModel);
  }

  const handleSettingsInputChange = (field: keyof MenuViewModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSettingsSwitchChange = (field: keyof MenuViewModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: event.target.checked,
    });
  };

  // TODO: Pattern functionality
  const handleToggleDay = (day: string) => {
    // const currentDays = formData?.PatternEndTime || [];
    // const hasDay = currentDays.includes(day);
    // const nextDays = hasDay
    //   ? currentDays.filter((currentDay) => currentDay !== day)
    //   : [...currentDays, day];

    // setFormData({
    //   ...formData,
    //   activeDays: nextDays,
    // });
  };

  const handleOpenItemsDialog = () => {
    if (editingCategoryId === null || !formData) {
      return;
    }

    const category = formData.menuCategories.find(category => category.id === editingCategoryId);
    if (!category) return;

    setSelectedProducts(category.products);
    setItemSearchQuery('');
    setItemsDialogOpen(true);
  };

  const handleToggleProductSelection = (product: MenuProduct) => {
    setSelectedProducts(prev =>
      prev.includes(product)
        ? prev.filter((selectedProduct) => selectedProduct !== product)
        : [...prev, product]
    );
  };

  const handleSaveCategoryItems = () => {
    // const selectedItems = productOptions
    //   .filter((product) => selectedProductIds.includes(product.id))
    //   .map((product) => ({ id: product.id, name: product.name }));

    // const updatedCategories = (formData.categories || []).map((category) =>
    //   category.id === editingCategoryId ? { ...category, items: selectedItems } : category
    // );

    // setFormData({
    //   ...formData,
    //   categories: updatedCategories,
    // });
    // TODO: implement save category items logic
    setItemsDialogOpen(false);
  };

  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryNameInput('{ "fi": "", "en": "", "sv": "" }');
    setCategoryDialogOpen(true);
  };

  const handleOpenEditCategory = (category: MenuCategoryViewModel) => {
    setEditingCategoryId(category.id);
    setCategoryNameInput(category.name);
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = (translation?: string) => {
    if (editingCategoryId === null) {
      const newCategory: MenuCategoryViewModel = {
        id: crypto.randomUUID(),
        name: translation ?? '{ "fi": "", "en": "", "sv": "" }',
        menuId: menu?.id ?? '',
        products: [],
      }
      setFormData({
        ...formData, 
        menuCategories: [...formData.menuCategories, newCategory]
      });
    } else {
      const editingCategory = formData?.menuCategories.find(category => category.id === editingCategoryId);
      if (!editingCategory) return;

      const updated: MenuCategoryViewModel = 
      { 
        ...editingCategory, 
        name: translation ?? editingCategory.name,
        products: editingCategory.products
      }

      const updatedCategories = formData?.menuCategories.map(category => category.id === editingCategoryId ? updated : category) ;

      setFormData({
        ...formData,
        menuCategories: updatedCategories
      });
    }

    setCategoryDialogOpen(false);
    setCategoryNameInput('{ "fi": "", "en": "", "sv": "" }');
    setEditingCategoryId(null);
  };

  const handleSave = () => {
    if (selectedMenuIdAtom)
      updateMenu(formData);
    else 
      createMenu(formData);

    onClose();
  };

  const handleDelete = async () => {
        openConfirmDialog({
        title: t('admin.menuEditor.dialog.delete'),
        message: `${t('admin.menuEditor.dialog.delete')}? ${t('confirmDialog.cantBeUndone')}`,
        cancelText: t('common.cancel'),
        confirmText: t('common.confirm'),
        onConfirm: async () => {
          if (!menu) return;
          deleteMenu(menu.id);
          onClose();
        },
    });

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.medium,
          boxShadow: theme.shadows.lg,
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: theme.colors.border,
          p: theme.spacing.lg,
        }}
      >
        <Typography 
          variant="h5" 
          component="div" 
          fontWeight={theme.typography.fontWeights.semibold}
        >
          {t('admin.menuEditor.dialog.title')}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm, mb: theme.spacing.md }}>
          <Button
            variant="outlined"
            onClick={() => setSettingsDialogOpen(true)}
            sx={{
              borderRadius: theme.borderRadius.large,
              textTransform: 'none',
            }}
          >
            {t('admin.menuEditor.dialog.menuSettings')}
          </Button>
          <Button
            variant="outlined"
            onClick={handleOpenAddCategory}
            sx={{
              borderRadius: theme.borderRadius.large,
              textTransform: 'none',
            }}
          >
            {t('admin.menuEditor.dialog.addCategory')}
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: theme.borderRadius.medium,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.sm,
          }}
        >
          <Table>
            <TableBody>
              {formData.menuCategories && formData.menuCategories.length > 0 ? (
                formData.menuCategories.map((category) => (
                  <React.Fragment key={category.id}>
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        sx={{
                          bgcolor: theme.colors.primaryLight,
                          py: 1.5,
                          borderBottom: `1px solid ${theme.colors.border}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={theme.typography.fontWeights.semibold}
                            sx={{ color: theme.colors.text }}
                          >
                            {getTranslation(category.name, language)} ({category.products.length})
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditCategory(category)}
                            sx={{ color: theme.colors.text }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>

                    {category.products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ py: 1.5 }}>
                          <Typography variant="body2" sx={{ color: theme.colors.text, opacity: 0.65 }}>
                            {t('admin.menuEditor.dialog.noCategoryItems')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      )
                      :
                      (category.products.map((product) => (
                        <TableRow key={`${category.id}-${product.id}`} hover>
                          <TableCell
                            sx={{
                              py: 1.5,
                              borderBottom: `1px solid ${theme.colors.border}`,
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight={theme.typography.fontWeights.medium}
                              sx={{ color: theme.colors.text }}
                            >
                              {getTranslation(product.name, i18n.language)}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              py: 1.5,
                              borderBottom: `1px solid ${theme.colors.border}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: theme.colors.text, opacity: 0.65 }}
                            >
                              {t('admin.menuEditor.dialog.item')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ color: theme.colors.text, opacity: 0.65 }}>
                      {t('admin.menuEditor.dialog.noCategories')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <CategoryNameDialog
          open={categoryDialogOpen}
          editingCategoryId={editingCategoryId}
          categoryNameInput={categoryNameInput}
          onClose={() => setCategoryDialogOpen(false)}
          onSave={handleSaveCategory}
          onOpenItemsDialog={handleOpenItemsDialog}
        />

        <MenuSettingsDialog
          open={settingsDialogOpen}
          name={formData?.name ?? ''}
          enabled={formData?.enabled ?? false}
          weekdays={weekdays}
          onClose={() => setSettingsDialogOpen(false)}
          onInputChange={handleSettingsInputChange}
          onSwitchChange={handleSettingsSwitchChange}
          onToggleDay={handleToggleDay}
        />

        <CategoryItemsDialog
          open={itemsDialogOpen}
          menuProducts={menu?.menuProducts ?? []}
          itemSearchQuery={itemSearchQuery}
          selectedProducts={selectedProducts}
          onSearchChange={setItemSearchQuery}
          onToggleProductSelection={handleToggleProductSelection}
          onClose={() => setItemsDialogOpen(false)}
          onSave={handleSaveCategoryItems}
        />
      </DialogContent>

      {/* Actions */}
      <DialogActions 
        sx={{ 
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: theme.colors.border,
          p: theme.spacing.lg,
        }}
      >
        <Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            sx={{
              borderRadius: theme.borderRadius.large,
              textTransform: 'none',
            }}
          >
            {t('admin.menuEditor.dialog.delete')}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: theme.spacing.sm }}>
          <Button 
            onClick={handleClose}
            sx={{
              borderRadius: theme.borderRadius.large,
              textTransform: 'none',
            }}
          >
            {t('admin.menuEditor.dialog.cancel')}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{
              borderRadius: theme.borderRadius.large,
              textTransform: 'none',
              bgcolor: theme.colors.primary,
              '&:hover': {
                bgcolor: theme.colors.primaryHover,
              },
            }}
          >
            {t('admin.menuEditor.dialog.save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditMenuDialog;
