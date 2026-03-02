import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, Box, type ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmButtonColor?: ButtonProps['color'];
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmButtonColor = 'error',
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          <Typography variant="h6" fontWeight={theme.typography.fontWeights.semibold}>
            {title}
          </Typography>
          {message && <Typography variant="body2">{message}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: theme.spacing.lg, pb: theme.spacing.lg }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          {cancelLabel || t('common.cancel')}
        </Button>
        <Button variant="contained" color={confirmButtonColor} onClick={onConfirm} sx={{ textTransform: 'none' }}>
          {confirmLabel || t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;