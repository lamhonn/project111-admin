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
import CampaignCategoryNameDialog from './CampaignCategoryNameDialog';
import CampaignSettingsDialog from './CampaignSettingsDialog';
import CampaignCategoryItemsDialog from './CampaignCategoryItemsDialog';
import type { CampaignCategory, CampaignData, ProductOption } from './types';

interface EditCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CampaignData) => void;
  onDelete?: () => void;
  initialData?: CampaignData;
}

const defaultCategories: CampaignCategory[] = [
  {
    id: '1',
    name: 'New Orders',
    items: [
      { id: '1', name: 'Classic Burger' },
      { id: '2', name: 'Chicken Caesar Salad' },
    ],
  },
  {
    id: '2',
    name: 'Preparing',
    items: [
      { id: '3', name: 'Margherita Pizza' },
      { id: '4', name: 'Pasta Carbonara' },
    ],
  },
  {
    id: '3',
    name: 'Bill Requests',
    items: [{ id: '5', name: 'Tiramisu' }],
  },
];

const buildInitialFormData = (initialData?: CampaignData): CampaignData => ({
  campaignName: initialData?.campaignName || '',
  description: initialData?.description || '',
  isActive: initialData?.isActive || false,
  activeDays: initialData?.activeDays || [],
  activeFrom: initialData?.activeFrom || '09:00',
  activeTo: initialData?.activeTo || '17:00',
  categories: initialData?.categories || defaultCategories,
  ...(initialData || {}),
});

const EditCampaignDialog: React.FC<EditCampaignDialogProps> = ({ 
  open, 
  onClose, 
  onSave, 
  onDelete,
  initialData
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CampaignData>(() => buildInitialFormData(initialData));
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
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

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData(buildInitialFormData(initialData));
  }, [open, initialData]);

  const handleSettingsInputChange = (field: keyof CampaignData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSettingsSwitchChange = (field: keyof CampaignData) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setCategoryDialogOpen(true);
  };

  const handleOpenEditCategory = (category: CampaignCategory) => {
    setEditingCategoryId(category.id);
    setCategoryNameInput(category.name);
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
        items: [],
      });
    } else {
      const updated = categories.map((category) =>
        category.id === editingCategoryId ? { ...category, name: trimmedName } : category
      );
      setFormData({
        ...formData,
        categories: updated,
      });
      setCategoryDialogOpen(false);
      setCategoryNameInput('');
      setEditingCategoryId(null);
      return;
    }

    setFormData({
      ...formData,
      categories,
    });
    setCategoryDialogOpen(false);
    setCategoryNameInput('');
    setEditingCategoryId(null);
  };

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
          {t('admin.campaignEditor.dialog.title')}
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
            {t('admin.campaignEditor.dialog.campaignSettings')}
          </Button>
          <Button
            variant="outlined"
            onClick={handleOpenAddCategory}
            sx={{
              borderRadius: theme.borderRadius.large,
              textTransform: 'none',
            }}
          >
            {t('admin.campaignEditor.dialog.addCategory')}
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
              {(formData.categories || []).map((category) => (
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
                          {t('admin.campaignEditor.dialog.item')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}

                  {category.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ py: 1.5 }}>
                        <Typography variant="body2" sx={{ color: theme.colors.text, opacity: 0.65 }}>
                          {t('admin.campaignEditor.dialog.noCategoryItems')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CampaignCategoryNameDialog
          open={categoryDialogOpen}
          editingCategoryId={editingCategoryId}
          categoryNameInput={categoryNameInput}
          onCategoryNameChange={setCategoryNameInput}
          onClose={() => setCategoryDialogOpen(false)}
          onSave={handleSaveCategory}
          onOpenItemsDialog={handleOpenItemsDialog}
        />

        <CampaignSettingsDialog
          open={settingsDialogOpen}
          formData={formData}
          weekdays={weekdays}
          onClose={() => setSettingsDialogOpen(false)}
          onInputChange={handleSettingsInputChange}
          onSwitchChange={handleSettingsSwitchChange}
          onToggleDay={handleToggleDay}
        />

        <CampaignCategoryItemsDialog
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
              {t('admin.campaignEditor.dialog.delete')}
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
            {t('admin.campaignEditor.dialog.cancel')}
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
            {t('admin.campaignEditor.dialog.save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditCampaignDialog;
