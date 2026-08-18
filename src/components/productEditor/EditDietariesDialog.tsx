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
import { Dietary, DietaryCode, DietaryName } from '../../types/enums';

interface EditAllergensDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDietaries: Dietary[];
  onSave: (dietaries: Dietary[]) => void;
}

const EditDietariesDialog: React.FC<EditAllergensDialogProps> = ({
  open,
  onClose,
  selectedDietaries,
  onSave,
}) => {
  const { t } = useTranslation();
  const [localSelection, setLocalSelection] = useState<Dietary[]>(selectedDietaries);

  useEffect(() => {
    if (open) {
      setLocalSelection(selectedDietaries);
    }
  }, [open, selectedDietaries]);

  const toggleDietary = (code: Dietary) => {
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
          {(Object.values(Dietary) as Array<Dietary>).map((option) => {
            const isChecked = localSelection.includes(option);

            return (
              <Paper
                key={option}
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
                onClick={() => toggleDietary(option)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{t(`admin.productEditor.dialog.dietaries.${DietaryName[option]}`)}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                    <Chip label={DietaryCode[option]} size="small" variant="outlined" />
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleDietary(option)}
                      onClick={(event) => event.stopPropagation()}
                      inputProps={{ 'aria-label': DietaryCode[option] }}
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

export default EditDietariesDialog;