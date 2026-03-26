import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, TextField, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';

export interface PairingPinData {
  tabletId: string;
  tableNumber: number;
  pin: string;
  expiresAt: string;
}

interface PairDeviceDialogProps {
  open: boolean;
  onClose: () => void;
  onRequestPin: (tableNumber: number, existingTabletId?: string) => Promise<PairingPinData>;
  isRequestingPin?: boolean;
  livePinUpdate?: PairingPinData | null;
}

export default function PairDeviceDialog({
  open,
  onClose,
  onRequestPin,
  isRequestingPin = false,
  livePinUpdate = null,
}: PairDeviceDialogProps) {
  const { t } = useTranslation();
  const [tableNumber, setTableNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pairingPin, setPairingPin] = useState<PairingPinData | null>(null);
  const [countdownMs, setCountdownMs] = useState<number>(0);

  useEffect(() => {
    if (open) {
      setTableNumber('');
      setErrorMessage('');
      setPairingPin(null);
      setCountdownMs(0);
    }
  }, [open]);

  useEffect(() => {
    if (!livePinUpdate) {
      return;
    }

    setPairingPin((previous) => {
      if (!previous) {
        return livePinUpdate;
      }

      if (previous.tabletId !== livePinUpdate.tabletId) {
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

  const requestPin = async (existingTabletId?: string) => {
    const parsedTableNumber = Number.parseInt(tableNumber, 10);

    if (!Number.isFinite(parsedTableNumber) || parsedTableNumber <= 0) {
      setErrorMessage(t('deviceManagement.invalidTableNumber', { defaultValue: 'Enter a valid table number' }));
      return;
    }

    try {
      const result = await onRequestPin(parsedTableNumber, existingTabletId);
      setPairingPin(result);
      setErrorMessage('');
      setCountdownMs(Math.max(0, new Date(result.expiresAt).getTime() - Date.now()));
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const formatPin = (pin: string): string => {
    if (pin.length < 8) {
      return pin;
    }

    return `${pin.slice(0, 4)} ${pin.slice(4, 8)}`;
  };

  const remainingSeconds = Math.ceil(countdownMs / 1000);
  const isBusy = isRequestingPin;

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
              : t('deviceManagement.pairInstructions')}
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
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: theme.colors.text, opacity: 0.7 }}>
                  {t('deviceManagement.pairingTabletId', { defaultValue: 'Tablet ID: {{id}}', id: pairingPin.tabletId })}
                </Typography>
              </>
            ) : (
              <TextField
                fullWidth
                autoFocus
                type="number"
                label={t('deviceManagement.tableNumber')}
                value={tableNumber}
                onChange={(event) => {
                  setTableNumber(event.target.value);
                  setErrorMessage('');
                }}
                error={Boolean(errorMessage)}
                helperText={errorMessage || ' '}
                inputProps={{ min: 1 }}
              />
            )}
          </Box>

          {isBusy && <CircularProgress size={20} />}

          {errorMessage && (
            <Typography variant="body2" sx={{ color: '#d32f2f' }}>
              {errorMessage}
            </Typography>
          )}
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
          disabled={isBusy}
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
        <Button
          onClick={() => void requestPin(pairingPin?.tabletId)}
          variant="contained"
          disabled={isBusy}
          sx={{
            textTransform: 'none',
            bgcolor: theme.colors.primary,
            '&:hover': {
              bgcolor: theme.colors.primaryHover,
            },
          }}
        >
          {pairingPin
            ? t('deviceManagement.rotatePin', { defaultValue: 'Rotate PIN now' })
            : t('deviceManagement.requestPin', { defaultValue: 'Request PIN' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
