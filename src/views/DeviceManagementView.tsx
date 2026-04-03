import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';
import DeviceList, { type Device } from '../components/deviceManagement/DeviceList';
import DeviceDialog from '../components/deviceManagement/DeviceDialog';
import PairDeviceDialog, { type PairingPinData } from '../components/deviceManagement/PairDeviceDialog';
import { useDeviceManagement } from '../api/hooks/device.hooks';

export default function DeviceManagementView() {
  const { t } = useTranslation();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pairDialogOpen, setPairDialogOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [requestedPin, setRequestedPin] = useState<PairingPinData | null>(null);
  const hasRequestedPinForOpenRef = useRef(false);

  const {
    devices,
    loading,
    error,
    requestPairingPin,
    latestPinIssued,
    updateDevice,
    deleteDevice,
    isRequestingPin,
    isUpdating,
    isDeleting,
  } = useDeviceManagement();

  const handlePairDevice = () => {
    setActionError(null);
    setRequestedPin(null);
    setPairDialogOpen(true);
  };

  const resolveDefaultTableNumber = useCallback(() => {
    const tableNumbers = devices
      .map((device) => Number.parseInt(device.tableNumber, 10))
      .filter((value) => Number.isFinite(value) && value > 0);

    if (tableNumbers.length === 0) {
      return 1;
    }

    return Math.max(...tableNumbers) + 1;
  }, [devices]);

  useEffect(() => {
    if (!pairDialogOpen) {
      hasRequestedPinForOpenRef.current = false;
      return;
    }

    if (hasRequestedPinForOpenRef.current) {
      return;
    }

    hasRequestedPinForOpenRef.current = true;

    const run = async () => {
      try {
        const pin = await requestPairingPin(resolveDefaultTableNumber());
        setRequestedPin(pin);
        setActionError(null);
      } catch (requestError) {
        setActionError((requestError as Error).message);
      }
    };

    void run();
  }, [pairDialogOpen, requestPairingPin, resolveDefaultTableNumber]);

  const dialogPin = useMemo(() => {
    if (!requestedPin) {
      return null;
    }

    if (latestPinIssued) {
      const samePairingSession = Boolean(
        latestPinIssued.pairingSessionId &&
          requestedPin.pairingSessionId &&
          latestPinIssued.pairingSessionId === requestedPin.pairingSessionId
      );
      const sameTableNumber = latestPinIssued.tableNumber === requestedPin.tableNumber;

      if (samePairingSession || sameTableNumber) {
        return latestPinIssued;
      }
    }

    return requestedPin;
  }, [latestPinIssued, requestedPin]);

  const handleRowClick = (device: Device) => {
    setActionError(null);
    setSelectedDevice(device);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEditDevice = async (updatedDevice: Device) => {
    const parsedTableNumber = Number.parseInt(updatedDevice.tableNumber, 10);

    if (!Number.isFinite(parsedTableNumber) || parsedTableNumber <= 0) {
      setActionError(t('deviceManagement.invalidTableNumber', { defaultValue: 'Enter a valid table number' }));
      return;
    }

    try {
      await updateDevice(updatedDevice.id, parsedTableNumber);
      setSelectedDevice(updatedDevice);
      setActionError(null);
    } catch (updateError) {
      setActionError((updateError as Error).message);
    }
  };

  const handleForgetDevice = async (device: Device) => {
    try {
      await deleteDevice(device.id);
      setDialogOpen(false);
      setSelectedDevice(null);
      setActionError(null);
    } catch (deleteError) {
      setActionError((deleteError as Error).message);
    }
  };

  return (
    <Box sx={{ p: theme.spacing.lg, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        mb: theme.spacing.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
        flexWrap: 'wrap',
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: theme.typography.fontWeights.bold,
          }}
        >
          {t('deviceManagement.title')}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handlePairDevice}
          sx={{
            borderRadius: theme.borderRadius.large,
            textTransform: 'none',
            bgcolor: theme.colors.primary,
            '&:hover': {
              bgcolor: theme.colors.primaryHover,
            },
          }}
        >
          {t('deviceManagement.pairDevice')}
        </Button>
      </Box>

      {actionError && (
        <Alert severity="error" sx={{ mb: theme.spacing.md }}>
          {actionError}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: theme.spacing.md }}>
          {error.message}
        </Alert>
      )}

      {/* Device List */}
      {loading ? (
        <Box sx={{ py: theme.spacing.xl, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : devices.length === 0 ? (
        <Typography variant="body1" sx={{ color: theme.colors.text }}>
          {t('deviceManagement.noDevicesConfigured', { defaultValue: 'No devices configured' })}
        </Typography>
      ) : (
        <DeviceList
          devices={devices}
          onRowClick={handleRowClick}
        />
      )}

      {/* Device Dialog */}
      <DeviceDialog
        open={dialogOpen}
        device={selectedDevice}
        onClose={handleCloseDialog}
        onEdit={handleEditDevice}
        onForgetDevice={handleForgetDevice}
      />

      {/* Pair Device Dialog */}
      <PairDeviceDialog
        open={pairDialogOpen}
        onClose={() => {
          setPairDialogOpen(false);
          setRequestedPin(null);
        }}
        livePinUpdate={dialogPin}
      />

      {(isUpdating || isDeleting || (pairDialogOpen && isRequestingPin && !requestedPin)) && (
        <Box sx={{ pt: theme.spacing.sm, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={20} />
        </Box>
      )}
    </Box>
  );
}
