import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  Checkbox,
  Chip,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

export const AllergenCode = {
  GlutenFree: 'G',
  LactoseFree: 'L',
  LowLactose: 'VL',
  Vegetarian: 'V',
  Vegan: 'VEG',
} as const;

export type AllergenCode = (typeof AllergenCode)[keyof typeof AllergenCode];

interface EditAllergensDialogProps {
  open: boolean;
  onClose: () => void;
  selectedAllergens: AllergenCode[];
  onSave: (allergens: AllergenCode[]) => void;
}

const ALLERGEN_OPTIONS: Array<{ code: AllergenCode; labelKey: string }> = [
  { code: AllergenCode.GlutenFree, labelKey: 'admin.productEditor.dialog.allergens.glutenFree' },
  { code: AllergenCode.LactoseFree, labelKey: 'admin.productEditor.dialog.allergens.lactoseFree' },
  { code: AllergenCode.LowLactose, labelKey: 'admin.productEditor.dialog.allergens.lowLactose' },
  { code: AllergenCode.Vegetarian, labelKey: 'admin.productEditor.dialog.allergens.vegetarian' },
  { code: AllergenCode.Vegan, labelKey: 'admin.productEditor.dialog.allergens.vegan' },
];

const EditAllergensDialog: React.FC<EditAllergensDialogProps> = ({
  open,
  onClose,
  selectedAllergens,
  onSave,
}) => {
  const { t } = useTranslation();
  const [localSelection, setLocalSelection] = useState<AllergenCode[]>(selectedAllergens);

  useEffect(() => {
    if (open) {
      setLocalSelection(selectedAllergens);
    }
  }, [open, selectedAllergens]);

  const toggleAllergen = (code: AllergenCode) => {
    setLocalSelection((previous) =>
      previous.includes(code)
        ? previous.filter((value) => value !== code)
        : [...previous, code],
    );
  };

  const handleSave = () => {
    onSave(localSelection);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          variant="h6"
          component="div"
          fontWeight={theme.typography.fontWeights.semibold}
        >
          {t('admin.productEditor.dialog.editAllergens')}
        </Typography>
        <IconButton aria-label="close allergens dialog" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          {ALLERGEN_OPTIONS.map((option) => {
            const isChecked = localSelection.includes(option.code);

            return (
              <Paper
                key={option.code}
                variant="outlined"
                sx={{
                  px: theme.spacing.md,
                  py: theme.spacing.sm,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.medium,
                  cursor: 'pointer',
                  transition: theme.transitions.normal,
                  '&:hover': {
                    borderColor: theme.colors.primary,
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => toggleAllergen(option.code)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{t(option.labelKey)}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                    <Chip label={option.code} size="small" variant="outlined" />
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleAllergen(option.code)}
                      onClick={(event) => event.stopPropagation()}
                      inputProps={{ 'aria-label': option.code }}
                    />
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: theme.spacing.lg,
          py: theme.spacing.md,
          borderTop: '1px solid',
          borderColor: theme.colors.border,
          gap: theme.spacing.sm,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            px: theme.spacing.lg,
            borderRadius: theme.borderRadius.medium,
            borderColor: theme.colors.border,
            fontWeight: theme.typography.fontWeights.medium,
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            textTransform: 'none',
            px: theme.spacing.lg,
            borderRadius: theme.borderRadius.medium,
            bgcolor: theme.colors.primary,
            fontWeight: theme.typography.fontWeights.semibold,
            '&:hover': {
              bgcolor: theme.colors.primaryHover,
            },
          }}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAllergensDialog;