import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';
import DeviceList from '../components/deviceManagement/DeviceList';
import PairDeviceDialog from '../components/deviceManagement/PairDeviceDialog';
import { errorAtom, getTabletsAtom, loadingAtom } from '../state/tabletStore';
import { useAtomValue, useSetAtom } from 'jotai';
import { userIdAtom } from '../state/authStore';
import { TabletWebSocket } from '../api/websocket/tabletSocket';

export default function DeviceManagementView() {
  const { t } = useTranslation();
  const [pairDialogOpen, setPairDialogOpen] = useState(false);
  const loading = useAtomValue(loadingAtom);
  const error = useAtomValue(errorAtom);

  const getTablets = useSetAtom(getTabletsAtom);
  const userId = useAtomValue(userIdAtom);

  useEffect(() => {
    if (!userId) return;

    getTablets();

    return TabletWebSocket.subscribeToTabletCreated(userId, getTablets);
  }, [userId, getTablets]);

  const handlePairDevice = () => {
    setPairDialogOpen(true);
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

      {error && (
        <Alert severity="error" sx={{ mb: theme.spacing.md }}>
          {error}
        </Alert>
      )}

      {/* Device List */}
      {loading ? (
        <Box sx={{ py: theme.spacing.xl, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <DeviceList />
      )}

      {/* Pair Device Dialog */}
      <PairDeviceDialog
        isOpen={pairDialogOpen}
        onClose={() => {
          setPairDialogOpen(false);
        }}
      />

    </Box>
  );
}
