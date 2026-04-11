import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

interface CategoryNameDialogProps {
  open: boolean;
  editingCategoryId: string | null;
  categoryNameInput: string;
  onCategoryNameChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  onDeleteCategory?: () => void;
}

const CategoryNameDialog: React.FC<CategoryNameDialogProps> = ({
  open,
  editingCategoryId,
  categoryNameInput,
  onCategoryNameChange,
  onClose,
  onSave,
  onDeleteCategory,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          <Typography
            variant="h6"
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ color: theme.colors.text }}
          >
            {editingCategoryId === null
              ? t('admin.menuEditor.dialog.addCategory')
              : t('admin.menuEditor.dialog.renameCategory')}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label={t('admin.menuEditor.dialog.categoryName')}
            placeholder={editingCategoryId === null ? t('admin.menuEditor.dialog.newCategoryPlaceholder') : ''}
            value={categoryNameInput}
            onChange={(event) => onCategoryNameChange(event.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: theme.spacing.lg, pb: theme.spacing.lg }}>
        {editingCategoryId !== null && onDeleteCategory && (
          <Button
            variant="outlined"
            color="error"
            onClick={onDeleteCategory}
            sx={{ textTransform: 'none', mr: 'auto' }}
          >
            {t('admin.menuEditor.dialog.deleteCategory')}
          </Button>
        )}
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

export default CategoryNameDialog;
