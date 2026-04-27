import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

interface EditExcludablesDialogProps {
  open: boolean;
  onClose: () => void;
  excludables: string[];
  onChange: (excludables: string[]) => void;
}

const EditExcludablesDialog: React.FC<EditExcludablesDialogProps> = ({
  open,
  onClose,
  excludables,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleExcludableChange = (index: number, value: string) => {
    const nextExcludables = [...excludables];
    nextExcludables[index] = value;
    onChange(nextExcludables);
  };

  const handleRemoveRow = (index: number) => {
    if (excludables.length === 1) {
      onChange(['']);
      return;
    }

    onChange(excludables.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleAddRow = () => {
    onChange([...excludables, '']);
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
          {t('admin.productEditor.dialog.addExcludables')}
        </Typography>
        <IconButton aria-label="close excludables dialog" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          {excludables.map((excludable, index) => (
            <Box
              key={`excludable-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              <TextField
                fullWidth
                value={excludable}
                onChange={(event) => handleExcludableChange(index, event.target.value)}
                placeholder={t('admin.productEditor.dialog.addExcludablePlaceholder')}
              />
              <IconButton
                aria-label={t('admin.productEditor.dialog.removeExcludable')}
                onClick={() => handleRemoveRow(index)}
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  border: '1px solid',
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.medium,
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Box>
            <Button
              variant="outlined"
              onClick={handleAddRow}
              sx={{
                textTransform: 'none',
                borderRadius: 999,
                px: theme.spacing.md,
                borderColor: theme.colors.border,
                fontWeight: theme.typography.fontWeights.medium,
              }}
            >
              {t('admin.productEditor.dialog.addExcludableButton')}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditExcludablesDialog;