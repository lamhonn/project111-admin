import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';

export interface PairingPinData {
  pairingSessionId?: string;
  tableNumber: number;
  pin: string;
  expiresAt: string;
}

interface PairDeviceDialogProps {
  open: boolean;
  onClose: () => void;
  livePinUpdate?: PairingPinData | null;
}

export default function PairDeviceDialog({
  open,
  onClose,
  livePinUpdate = null,
}: PairDeviceDialogProps) {
  const { t } = useTranslation();
  const [pairingPin, setPairingPin] = useState<PairingPinData | null>(null);
  const [countdownMs, setCountdownMs] = useState<number>(0);

  useEffect(() => {
    if (open) {
      setPairingPin(livePinUpdate);
      if (livePinUpdate) {
        setCountdownMs(Math.max(0, new Date(livePinUpdate.expiresAt).getTime() - Date.now()));
      } else {
        setCountdownMs(0);
      }
    }
  }, [open, livePinUpdate]);

  const isSamePinStream = (current: PairingPinData, incoming: PairingPinData) => {
    if (current.pairingSessionId && incoming.pairingSessionId) {
      return current.pairingSessionId === incoming.pairingSessionId;
    }

    return current.tableNumber === incoming.tableNumber;
  };

  useEffect(() => {
    if (!livePinUpdate) {
      return;
    }

    setPairingPin((previous) => {
      if (!previous) {
        return livePinUpdate;
      }

      if (!isSamePinStream(previous, livePinUpdate)) {
        return previous;
      }

      return livePinUpdate;
    });
  }, [livePinUpdate]);

  useEffect(() => {
    if (!open || !pairingPin) {
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, new Date(pairingPin.expiresAt).getTime() - Date.now());
      setCountdownMs(remaining);
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [open, pairingPin]);

  const formatPin = (pin: string): string => {
    if (pin.length < 8) {
      return pin;
    }

    return `${pin.slice(0, 4)} ${pin.slice(4, 8)}`;
  };

  const remainingSeconds = Math.ceil(countdownMs / 1000);

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
                  {formatPin(pairingPin.pin)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: theme.colors.text, opacity: 0.8 }}>
                  {remainingSeconds > 0
                    ? t('deviceManagement.pinExpiresIn', { defaultValue: 'PIN expires in {{seconds}}s', seconds: remainingSeconds })
                    : t('deviceManagement.waitingPinRotation', { defaultValue: 'Waiting for server PIN rotation...' })}
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
