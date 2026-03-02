import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { theme } from '../../theme/theme';
import ConfirmationDialog from '../common/ConfirmationDialog';
import CategoryNameDialog from './CategoryNameDialog';
import MenuSettingsDialog from './MenuSettingsDialog';
import CategoryItemsDialog from './CategoryItemsDialog';
import { useGetProducts } from '../../api/hooks/product.hooks';
import {
  menuEditorStateAtom,
  initializeMenuEditorStateAtom,
  upsertMenuEditorCategoryAtom,
  setMenuEditorCategoryProductsAtom,
  deleteMenuEditorCategoryAtom,
} from '../../context/menuEditorStore';
import type { MenuCategory, MenuData, ProductOption } from './types';

interface EditMenuDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MenuData) => void;
  onDelete?: () => void;
  initialData?: MenuData;
}

const buildInitialFormData = (initialData?: MenuData): MenuData => ({
  menuName: initialData?.menuName || '',
  description: initialData?.description || '',
  isActive: initialData?.isActive || false,
  activePeriodStart: initialData?.activePeriodStart || '',
  activePeriodEnd: initialData?.activePeriodEnd || '',
  activeDays: initialData?.activeDays || [],
  activeFrom: initialData?.activeFrom || '09:00',
  activeTo: initialData?.activeTo || '17:00',
  categories: initialData?.categories || [],
  ...(initialData || {}),
});

const EditMenuDialog: React.FC<EditMenuDialogProps> = ({ 
  open, 
  onClose, 
  onSave, 
  onDelete,
  initialData
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<MenuData>(() => buildInitialFormData(initialData));
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [categoryShowTopmostInput, setCategoryShowTopmostInput] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [pendingProductDelete, setPendingProductDelete] = useState<{
    categoryId: string;
    productId: string;
    productName: string;
  } | null>(null);
  const [menuDeleteConfirmOpen, setMenuDeleteConfirmOpen] = useState(false);
  const [categoryDeleteConfirmOpen, setCategoryDeleteConfirmOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const menuEditorState = useAtomValue(menuEditorStateAtom);
  const initializeMenuEditorState = useSetAtom(initializeMenuEditorStateAtom);
  const upsertMenuEditorCategory = useSetAtom(upsertMenuEditorCategoryAtom);
  const setMenuEditorCategoryProducts = useSetAtom(setMenuEditorCategoryProductsAtom);
  const deleteMenuEditorCategory = useSetAtom(deleteMenuEditorCategoryAtom);
  const { data: productsData = [] } = useGetProducts();

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const productOptions: ProductOption[] = useMemo(
    () => productsData.map((product) => ({ id: product.id, name: product.name })),
    [productsData]
  );

  const productOptionsById = useMemo(
    () => new Map(productOptions.map((product) => [product.id, product.name])),
    [productOptions]
  );

  const initialSnapshotRef = useRef<string>('');

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextFormData = buildInitialFormData(initialData);
    setFormData(nextFormData);
    initializeMenuEditorState(initialData?.categories || []);
    initialSnapshotRef.current = JSON.stringify({
      menu: nextFormData,
      categories: (initialData?.categories || []).map((category) => ({
        id: category.id,
        name: category.name,
        showTopmost: Boolean(category.showTopmost),
        items: (category.items || []).map((item) => item.id),
      })),
    });
  }, [open, initialData, initializeMenuEditorState]);

  const handleSettingsInputChange = (field: keyof MenuData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSettingsSwitchChange = (field: keyof MenuData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.checked,
    });
  };

  const handleToggleDay = (day: string) => {
    const currentDays = formData.activeDays || [];
    const hasDay = currentDays.includes(day);
    const nextDays = hasDay
      ? currentDays.filter((currentDay) => currentDay !== day)
      : [...currentDays, day];

    setFormData({
      ...formData,
      activeDays: nextDays,
    });
  };

  const handleOpenItemsDialog = (categoryId: string) => {
    const selectedIds = menuEditorState.productsByCategoryId[categoryId] || [];

    setEditingCategoryId(categoryId);
    setSelectedProductIds(selectedIds);
    setItemSearchQuery('');
    setItemsDialogOpen(true);
  };

  const handleToggleProductSelection = (productId: string) => {
    setSelectedProductIds((currentSelectedIds) =>
      currentSelectedIds.includes(productId)
        ? currentSelectedIds.filter((id) => id !== productId)
        : [...currentSelectedIds, productId]
    );
  };

  const handleSaveCategoryItems = () => {
    if (editingCategoryId === null) {
      return;
    }

    setMenuEditorCategoryProducts({ categoryId: editingCategoryId, productIds: selectedProductIds });
    setItemsDialogOpen(false);
  };

  const handleRequestDeleteProduct = (categoryId: string, productId: string, productName: string) => {
    setPendingProductDelete({ categoryId, productId, productName });
  };

  const handleConfirmDeleteProduct = () => {
    if (!pendingProductDelete) {
      return;
    }

    const currentCategoryProducts = menuEditorState.productsByCategoryId[pendingProductDelete.categoryId] || [];
    const nextCategoryProducts = currentCategoryProducts.filter((productId) => productId !== pendingProductDelete.productId);

    setMenuEditorCategoryProducts({
      categoryId: pendingProductDelete.categoryId,
      productIds: nextCategoryProducts,
    });
    setPendingProductDelete(null);
  };

  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryNameInput('');
    setCategoryShowTopmostInput(false);
    setCategoryDialogOpen(true);
  };

  const handleOpenEditCategory = (category: MenuCategory) => {
    setEditingCategoryId(category.id);
    setCategoryNameInput(category.name);
    setCategoryShowTopmostInput(Boolean(category.showTopmost));
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = () => {
    const trimmedName = categoryNameInput.trim();
    if (!trimmedName) {
      return;
    }

    if (editingCategoryId === null) {
      upsertMenuEditorCategory({
        showTopmost: categoryShowTopmostInput,
        name: trimmedName,
      });
    } else {
      upsertMenuEditorCategory({
        id: editingCategoryId,
        name: trimmedName,
        showTopmost: categoryShowTopmostInput,
      });
      setCategoryDialogOpen(false);
      setCategoryNameInput('');
      setCategoryShowTopmostInput(false);
      setEditingCategoryId(null);
      return;
    }

    setCategoryDialogOpen(false);
    setCategoryNameInput('');
    setCategoryShowTopmostInput(false);
    setEditingCategoryId(null);
  };

  const handleRequestDeleteCategory = () => {
    if (editingCategoryId === null) {
      return;
    }

    setCategoryDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteCategory = () => {
    if (editingCategoryId === null) {
      return;
    }

    deleteMenuEditorCategory(editingCategoryId);
    setCategoryDeleteConfirmOpen(false);
    setCategoryDialogOpen(false);
    setCategoryNameInput('');
    setCategoryShowTopmostInput(false);
    setEditingCategoryId(null);
  };

  const sortedCategories: MenuCategory[] = useMemo(
    () =>
      menuEditorState.categories
        .map((category) => {
          const categoryProductIds = menuEditorState.productsByCategoryId[category.id] || [];
          return {
            id: category.id,
            name: category.name,
            showTopmost: category.showTopmost,
            items: categoryProductIds.map((productId) => ({
              id: productId,
              name: productOptionsById.get(productId) || productId,
            })),
          };
        })
        .sort(
          (firstCategory, secondCategory) =>
            Number(Boolean(secondCategory.showTopmost)) - Number(Boolean(firstCategory.showTopmost))
        ),
    [menuEditorState, productOptionsById]
  );

  const handleSave = () => {
    if (!isDirty) {
      onClose();
      return;
    }

    const menuNameValue = formData.menuName?.trim();
    const resolvedMenuName = menuNameValue ? menuNameValue : t('admin.menuEditor.dialog.defaultMenuName');

    onSave({
      ...formData,
      menuName: resolvedMenuName,
      categories: sortedCategories,
    });
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setMenuDeleteConfirmOpen(false);
      onClose();
    }
  };

  const isDirty = useMemo(() => {
    if (!open) {
      return false;
    }

    const currentSnapshot = JSON.stringify({
      menu: formData,
      categories: menuEditorState.categories.map((category) => ({
        id: category.id,
        name: category.name,
        showTopmost: Boolean(category.showTopmost),
        items: menuEditorState.productsByCategoryId[category.id] || [],
      })),
    });

    return currentSnapshot !== initialSnapshotRef.current;
  }, [formData, menuEditorState, open]);

  const handleAttemptClose = () => {
    if (isDirty) {
      setCancelConfirmOpen(true);
      return;
    }

    onClose();
  };

  const handleClose = () => {
    handleAttemptClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.medium,
          boxShadow: theme.shadows.lg,
          maxHeight: '90vh',
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
          onClick={handleAttemptClose}
          sx={{
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: theme.spacing.lg, overflowY: 'auto' }}>
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
              {sortedCategories.map((category) => (
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
                          {category.name} ({category.items.length})
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditCategory(category)}
                            sx={{ color: theme.colors.text }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenItemsDialog(category.id)}
                            sx={{ color: theme.colors.text }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {category.items.map((item) => (
                    <TableRow key={`${category.id}-${item.id}`} hover>
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
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          py: 1.5,
                          borderBottom: `1px solid ${theme.colors.border}`,
                        }}
                      >
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRequestDeleteProduct(category.id, item.id, item.name)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  {category.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ py: 1.5 }}>
                        <Typography variant="body2" sx={{ color: theme.colors.text, opacity: 0.65 }}>
                          {t('admin.menuEditor.dialog.noCategoryItems')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}

              {sortedCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} sx={{ py: 2 }}>
                    <Typography variant="body2" sx={{ color: theme.colors.text, opacity: 0.65 }}>
                      {t('admin.menuEditor.dialog.addCategory')}
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
          categoryShowTopmost={categoryShowTopmostInput}
          onCategoryNameChange={setCategoryNameInput}
          onCategoryShowTopmostChange={setCategoryShowTopmostInput}
          onClose={() => setCategoryDialogOpen(false)}
          onSave={handleSaveCategory}
          onDeleteCategory={handleRequestDeleteCategory}
        />

        <MenuSettingsDialog
          open={settingsDialogOpen}
          formData={formData}
          weekdays={weekdays}
          onClose={() => setSettingsDialogOpen(false)}
          onInputChange={handleSettingsInputChange}
          onSwitchChange={handleSettingsSwitchChange}
          onToggleDay={handleToggleDay}
        />

        <CategoryItemsDialog
          open={itemsDialogOpen}
          productOptions={productOptions}
          itemSearchQuery={itemSearchQuery}
          selectedProductIds={selectedProductIds}
          onSearchChange={setItemSearchQuery}
          onToggleProductSelection={handleToggleProductSelection}
          onClose={() => setItemsDialogOpen(false)}
          onSave={handleSaveCategoryItems}
        />

        <ConfirmationDialog
          open={pendingProductDelete !== null}
          title={t('admin.menuEditor.dialog.deleteItemTitle')}
          message={
            pendingProductDelete
              ? t('admin.menuEditor.dialog.deleteItemMessage', { itemName: pendingProductDelete.productName })
              : ''
          }
          confirmLabel={t('common.confirm')}
          cancelLabel={t('common.cancel')}
          onClose={() => setPendingProductDelete(null)}
          onConfirm={handleConfirmDeleteProduct}
        />

        <ConfirmationDialog
          open={menuDeleteConfirmOpen}
          title={t('admin.menuEditor.dialog.deleteMenuTitle')}
          message={t('admin.menuEditor.dialog.deleteMenuMessage')}
          confirmLabel={t('common.confirm')}
          cancelLabel={t('common.cancel')}
          onClose={() => setMenuDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
        />

        <ConfirmationDialog
          open={categoryDeleteConfirmOpen}
          title={t('admin.menuEditor.dialog.deleteCategoryTitle')}
          message={t('admin.menuEditor.dialog.deleteCategoryMessage')}
          confirmLabel={t('common.confirm')}
          cancelLabel={t('common.cancel')}
          onClose={() => setCategoryDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDeleteCategory}
        />

        <ConfirmationDialog
          open={cancelConfirmOpen}
          title={t('admin.menuEditor.dialog.cancelEditTitle')}
          message={t('admin.menuEditor.dialog.cancelEditMessage')}
          confirmLabel={t('common.confirm')}
          cancelLabel={t('common.cancel')}
          onClose={() => setCancelConfirmOpen(false)}
          onConfirm={() => {
            setCancelConfirmOpen(false);
            onClose();
          }}
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
          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setMenuDeleteConfirmOpen(true)}
              sx={{
                borderRadius: theme.borderRadius.large,
                textTransform: 'none',
              }}
            >
              {t('admin.menuEditor.dialog.delete')}
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: theme.spacing.sm }}>
          <Button 
            onClick={handleAttemptClose}
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
