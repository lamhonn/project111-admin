import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';

interface PairDeviceDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PairDeviceDialog({ open, onClose }: PairDeviceDialogProps) {
  const { t } = useTranslation();
  const [pin, setPin] = useState<string>('');

  // Generate random 8-digit PIN when dialog opens
  useEffect(() => {
    if (open) {
      const randomPin = Math.random().toString().slice(2, 10).padStart(8, '0');
      setPin(randomPin);
    }
  }, [open]);

  // Format PIN with space between 4th and 5th digit
  const formattedPin = `${pin.slice(0, 4)} ${pin.slice(4, 8)}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.medium,
          bgcolor: theme.colors.background,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.colors.primaryLight,
          fontWeight: theme.typography.fontWeights.bold,
          color: theme.colors.text,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{t('deviceManagement.pairDevice')}</span>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.colors.text,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          {/* Instructions */}
          <Typography
            variant="body1"
            sx={{
              color: theme.colors.text,
              opacity: 0.8,
            }}
          >
            {t('deviceManagement.pairInstructions')}
          </Typography>

          {/* PIN Display */}
          <Box
            sx={{
              bgcolor: theme.colors.primaryLight,
              padding: '24px 32px',
              borderRadius: theme.borderRadius.medium,
              border: `2px solid ${theme.colors.primary}`,
            }}
          >
            <Typography
              sx={{
                fontSize: '3.5rem',
                fontWeight: theme.typography.fontWeights.bold,
                color: theme.colors.primary,
                letterSpacing: '8px',
                fontFamily: 'monospace',
              }}
            >
              {formattedPin}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          gap: 1,
          p: 2,
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: 'none',
            bgcolor: theme.colors.primary,
            '&:hover': {
              bgcolor: theme.colors.primaryHover,
            },
          }}
        >
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
