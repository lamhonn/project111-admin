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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import type { ProductOption } from './types';

interface CategoryItemsDialogProps {
  open: boolean;
  productOptions: ProductOption[];
  itemSearchQuery: string;
  selectedProductIds: number[];
  onSearchChange: (value: string) => void;
  onToggleProductSelection: (productId: number) => void;
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

          <List
            sx={{
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.medium,
              maxHeight: 320,
              overflow: 'auto',
              p: 0,
            }}
          >
            {filteredProductOptions.map((product) => (
              <ListItem
                key={product.id}
                sx={{
                  borderBottom: `1px solid ${theme.colors.border}`,
                  '&:last-child': { borderBottom: 'none' },
                }}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => onToggleProductSelection(product.id)}
                  />
                }
              >
                <ListItemText primary={product.name} />
              </ListItem>
            ))}

            {filteredProductOptions.length === 0 && (
              <ListItem>
                <ListItemText
                  primary={t('admin.menuEditor.dialog.noProductsFound')}
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            )}
          </List>
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
