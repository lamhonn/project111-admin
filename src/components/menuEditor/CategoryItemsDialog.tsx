import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Checkbox,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import type { ProductOption } from './types';

interface CategoryItemsDialogProps {
  open: boolean;
  productOptions: ProductOption[];
  itemSearchQuery: string;
  selectedProductIds: string[];
  onSearchChange: (value: string) => void;
  onToggleProductSelection: (productId: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const CategoryItemsDialog: React.FC<CategoryItemsDialogProps> = ({
  open,
  productOptions,
  itemSearchQuery,
  selectedProductIds,
  onSearchChange,
  onToggleProductSelection,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();

  const filteredProductOptions = productOptions.filter((product) =>
    product.name.toLowerCase().includes(itemSearchQuery.toLowerCase())
  );

  const sortedProductOptions = filteredProductOptions;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          <Typography
            variant="h6"
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ color: theme.colors.text }}
          >
            {t('admin.menuEditor.dialog.addRemoveItemsFromMenu')}
          </Typography>

          <TextField
            fullWidth
            placeholder={t('admin.menuEditor.dialog.searchProductsPlaceholder')}
            value={itemSearchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />

          <Box
            sx={{
              maxHeight: '60vh',
              overflow: 'auto',
              pr: theme.spacing.xs,
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm,
            }}
          >
            {sortedProductOptions.map((product) => {
              const isSelected = selectedProductIds.includes(product.id);

              return (
              <Paper
                key={product.id}
                elevation={0}
                sx={{
                  border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.border}`,
                  borderRadius: 999,
                  px: theme.spacing.md,
                  py: theme.spacing.xs,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: isSelected ? theme.colors.primaryLight : 'transparent',
                }}
              >
                <Typography variant="body2" fontWeight={theme.typography.fontWeights.medium}>
                  {product.name}
                </Typography>
                <Checkbox
                  edge="end"
                  checked={isSelected}
                  onChange={() => onToggleProductSelection(product.id)}
                />
              </Paper>
            )})}

            {sortedProductOptions.length === 0 && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('admin.menuEditor.dialog.noProductsFound')}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: theme.spacing.lg, pb: theme.spacing.lg }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained" onClick={onSave} sx={{ textTransform: 'none' }}>
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryItemsDialog;
