import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';
import DeviceList, { type Device } from '../components/deviceManagement/DeviceList';
import DeviceDialog from '../components/deviceManagement/DeviceDialog';
import PairDeviceDialog from '../components/deviceManagement/PairDeviceDialog';

export default function DeviceManagementView() {
  const { t } = useTranslation();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pairDialogOpen, setPairDialogOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([
    { id: 1, deviceId: 'TAB-001', deviceName: 'Table A1 Tablet', tableNumber: 'A1', status: 'Connected', lastSeen: '2026-02-10 15:30', batteryLevel: 87, model: 'iPad Pro 12.9' },
    { id: 2, deviceId: 'TAB-002', deviceName: 'Table A2 Tablet', tableNumber: 'A2', status: 'Connected', lastSeen: '2026-02-10 15:29', batteryLevel: 92, model: 'iPad Pro 12.9' },
    { id: 3, deviceId: 'TAB-003', deviceName: 'Table B1 Tablet', tableNumber: 'B1', status: 'Connected', lastSeen: '2026-02-10 15:28', batteryLevel: 65, model: 'Samsung Tab S8' },
    { id: 4, deviceId: 'TAB-004', deviceName: 'Table B2 Tablet', tableNumber: 'B2', status: 'Offline', lastSeen: '2026-02-10 14:45', batteryLevel: 34, model: 'Samsung Tab S8' },
    { id: 5, deviceId: 'TAB-005', deviceName: 'Table C1 Tablet', tableNumber: 'C1', status: 'Connected', lastSeen: '2026-02-10 15:30', batteryLevel: 78, model: 'iPad Air' },
    { id: 6, deviceId: 'TAB-006', deviceName: 'Table C2 Tablet', tableNumber: 'C2', status: 'Connected', lastSeen: '2026-02-10 15:27', batteryLevel: 95, model: 'iPad Air' },
    { id: 7, deviceId: 'TAB-007', deviceName: 'Table D1 Tablet', tableNumber: 'D1', status: 'Connected', lastSeen: '2026-02-10 15:31', batteryLevel: 58, model: 'Samsung Tab S8' },
    { id: 8, deviceId: 'TAB-008', deviceName: 'Table D2 Tablet', tableNumber: 'D2', status: 'Offline', lastSeen: '2026-02-10 13:20', batteryLevel: 12, model: 'iPad Pro 12.9' },
  ]);

  const handlePairDevice = () => {
    setPairDialogOpen(true);
  };

  const handleRowClick = (device: Device) => {
    setSelectedDevice(device);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEditDevice = (updatedDevice: Device) => {
    console.log('Saving device changes:', updatedDevice);
    // Update the device in state
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === updatedDevice.id ? updatedDevice : device
      )
    );
    // TODO: Persist to backend/database
    setSelectedDevice(updatedDevice);
  };

  const handleForgetDevice = (device: Device) => {
    console.log('Forgetting device:', device);
    // Remove device from state
    setDevices((prevDevices) => prevDevices.filter((d) => d.id !== device.id));
    // TODO: Persist to backend/database
    setDialogOpen(false);
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
          variant="h4" 
          sx={{ 
            color: theme.colors.brandWhite,
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

      {/* Device List */}
      <DeviceList
        devices={devices}
        onRowClick={handleRowClick}
      />

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
        onClose={() => setPairDialogOpen(false)}
      />
    </Box>
  );
}
