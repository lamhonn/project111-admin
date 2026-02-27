import React, { useState } from 'react';
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
import type { MenuCategory, MenuData, ProductOption } from './types';

interface EditMenuDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MenuData) => void;
  onDelete?: () => void;
  initialData?: MenuData;
}

const defaultCategories: MenuCategory[] = [
  {
    id: '1',
    name: 'New Orders',
    showTopmost: false,
    items: [
      { id: '1', name: 'Classic Burger' },
      { id: '2', name: 'Chicken Caesar Salad' },
    ],
  },
  {
    id: '2',
    name: 'Preparing',
    showTopmost: false,
    items: [
      { id: '3', name: 'Margherita Pizza' },
      { id: '4', name: 'Pasta Carbonara' },
    ],
  },
  {
    id: '3',
    name: 'Bill Requests',
    showTopmost: false,
    items: [{ id: '5', name: 'Tiramisu' }],
  },
];

const buildInitialFormData = (initialData?: MenuData): MenuData => ({
  menuName: initialData?.menuName || '',
  description: initialData?.description || '',
  isActive: initialData?.isActive || false,
  activePeriodStart: initialData?.activePeriodStart || '',
  activePeriodEnd: initialData?.activePeriodEnd || '',
  activeDays: initialData?.activeDays || [],
  activeFrom: initialData?.activeFrom || '09:00',
  activeTo: initialData?.activeTo || '17:00',
  categories: initialData?.categories || defaultCategories,
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

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const productOptions: ProductOption[] = [
    { id: '1', name: 'Product 1' },
    { id: '2', name: 'Product 2' },
    { id: '3', name: 'Product 3' },
    { id: '4', name: 'Product 4' },
    { id: '5', name: 'Product 5' },
    { id: '6', name: 'Product 6' },
  ];

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

  const handleOpenItemsDialog = () => {
    if (editingCategoryId === null) {
      return;
    }

    const category = (formData.categories || []).find((item) => item.id === editingCategoryId);
    const selectedIds = (category?.items || [])
      .map((item) => {
        const product = productOptions.find((option) => option.name === item.name);
        return product?.id;
      })
      .filter((id): id is string => id !== undefined);

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

    const selectedItems = productOptions
      .filter((product) => selectedProductIds.includes(product.id))
      .map((product) => ({ id: product.id, name: product.name }));

    const updatedCategories = (formData.categories || []).map((category) =>
      category.id === editingCategoryId ? { ...category, items: selectedItems } : category
    );

    setFormData({
      ...formData,
      categories: updatedCategories,
    });
    setItemsDialogOpen(false);
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

    const categories = (formData.categories || []).slice();

    if (editingCategoryId === null) {
      const nextId =
        categories.length > 0
          ? Math.max(...categories.map((category) => Number(category.id))) + 1
          : 1;
      categories.push({
        id: String(nextId),
        name: trimmedName,
        showTopmost: categoryShowTopmostInput,
        items: [],
      });
    } else {
      const updated = categories.map((category) =>
        category.id === editingCategoryId
          ? { ...category, name: trimmedName, showTopmost: categoryShowTopmostInput }
          : category
      );
      setFormData({
        ...formData,
        categories: updated,
      });
      setCategoryDialogOpen(false);
      setCategoryNameInput('');
      setCategoryShowTopmostInput(false);
      setEditingCategoryId(null);
      return;
    }

    setFormData({
      ...formData,
      categories,
    });
    setCategoryDialogOpen(false);
    setCategoryNameInput('');
    setCategoryShowTopmostInput(false);
    setEditingCategoryId(null);
  };

  const sortedCategories = (formData.categories || [])
    .slice()
    .sort((firstCategory, secondCategory) => Number(Boolean(secondCategory.showTopmost)) - Number(Boolean(firstCategory.showTopmost)));

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
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
                        <Typography
                          variant="caption"
                          sx={{ color: theme.colors.text, opacity: 0.65 }}
                        >
                          {t('admin.menuEditor.dialog.item')}
                        </Typography>
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
          onOpenItemsDialog={handleOpenItemsDialog}
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
              onClick={handleDelete}
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
