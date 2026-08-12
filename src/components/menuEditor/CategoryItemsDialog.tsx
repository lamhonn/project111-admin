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
import { MenuProduct } from '../../types/models';
import { getTranslation } from '../../utils/multilingualNameUtils';

interface CategoryItemsDialogProps {
  open: boolean;
  menuProducts: MenuProduct[];
  itemSearchQuery: string;
  selectedProducts: MenuProduct[];
  onSearchChange: (value: string) => void;
  onToggleProductSelection: (product: MenuProduct) => void;
  onClose: () => void;
  onSave: () => void;
}

const CategoryItemsDialog: React.FC<CategoryItemsDialogProps> = ({
  open,
  menuProducts,
  itemSearchQuery,
  selectedProducts,
  onSearchChange,
  onToggleProductSelection,
  onClose,
  onSave,
}) => {
  const { t, i18n } = useTranslation();

  const filteredProductOptions = menuProducts.filter((product) =>
    // Works with other languages too, but might also take brackets into account 
    product.Name.toLowerCase().includes(itemSearchQuery.toLowerCase())
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
                key={product.Id}
                sx={{
                  borderBottom: `1px solid ${theme.colors.border}`,
                  '&:last-child': { borderBottom: 'none' },
                }}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    checked={selectedProducts.includes(product)}
                    onChange={() => onToggleProductSelection(product)}
                  />
                }
              >
                <ListItemText primary={getTranslation(product.Name, i18n.language)} />
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
