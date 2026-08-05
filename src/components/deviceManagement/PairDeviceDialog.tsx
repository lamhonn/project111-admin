import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';
import { startTabletPairingAtom, tabletPairingPinAtom } from '../../state/tabletStore';
import { useAtomValue, useSetAtom } from 'jotai';

interface PairDeviceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PairDeviceDialog({
  isOpen,
  onClose,
}: PairDeviceDialogProps) {
  const { t } = useTranslation();

  const startPairing = useSetAtom(startTabletPairingAtom);
  const pairingPin = useAtomValue(tabletPairingPinAtom);

  useEffect(() => {
    startPairing();
  }, []);

  const formatPin = (pin: string): string => {
    if (pin.length < 8) {
      return pin;
    }

    return `${pin.slice(0, 4)} ${pin.slice(4, 8)}`;
  };

  return (
    <Dialog
      open={isOpen}
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
          <Typography
            variant="body1"
            sx={{
              color: theme.colors.text,
              opacity: 0.8,
            }}
          >
            {pairingPin
              ? t('deviceManagement.pairPinInstructions', { defaultValue: 'Enter this PIN on the tablet to complete pairing.' })
              : t('deviceManagement.waitingPinRotation', { defaultValue: 'Waiting for server PIN rotation...' })}
          </Typography>

          <Box
            sx={{
              bgcolor: theme.colors.primaryLight,
              padding: '20px 24px',
              borderRadius: theme.borderRadius.medium,
              border: `2px solid ${theme.colors.primary}`,
              width: '100%',
              maxWidth: 360,
            }}
          >
            {pairingPin ? (
              <>
                <Typography
                  sx={{
                    fontSize: '3rem',
                    fontWeight: theme.typography.fontWeights.bold,
                    color: theme.colors.primary,
                    letterSpacing: '4px',
                    fontFamily: 'monospace',
                  }}
                >
                  {formatPin(pairingPin)}
                </Typography>
              </>
            ) : (
              <CircularProgress size={36} />
            )}
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
          sx={{
            textTransform: 'none',
            color: theme.colors.text,
            '&:hover': {
              bgcolor: theme.colors.primaryLight,
            },
          }}
        >
          {t('common.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
