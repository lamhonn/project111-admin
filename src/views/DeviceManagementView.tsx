import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';

export default function DeviceManagementView() {
  const { t } = useTranslation();

  const handlePairDevice = () => {
    // TODO: Implement pair device functionality
    console.log('Pair device clicked');
  };

  // Define table columns
  const columns: GridColDef[] = [
    { 
      field: 'deviceId', 
      headerName: t('deviceManagement.deviceId'), 
      width: 200,
      sortable: true,
    },
    { 
      field: 'deviceName', 
      headerName: t('deviceManagement.deviceName'), 
      width: 180,
      sortable: true,
    },
    { 
      field: 'tableNumber', 
      headerName: t('deviceManagement.tableNumber'), 
      width: 150,
      sortable: true,
    },
    { 
      field: 'status', 
      headerName: t('deviceManagement.status'), 
      width: 130,
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Connected' ? 'success' : 'default'}
          size="small"
          sx={{
            borderRadius: theme.borderRadius.large,
            fontWeight: theme.typography.fontWeights.semibold,
          }}
        />
      ),
    },
    { 
      field: 'lastSeen', 
      headerName: t('deviceManagement.lastSeen'), 
      width: 180,
      sortable: true,
    },
    { 
      field: 'batteryLevel', 
      headerName: t('deviceManagement.batteryLevel'), 
      width: 130,
      sortable: true,
      renderCell: (params) => `${params.value}%`,
    },
    { 
      field: 'model', 
      headerName: t('deviceManagement.model'), 
      width: 150,
      sortable: true,
    },
  ];

  // Mock data - replace with actual data fetching
  const mockDevices = [
    { id: 1, deviceId: 'TAB-001', deviceName: 'Table A1 Tablet', tableNumber: 'A1', status: 'Connected', lastSeen: '2026-02-10 15:30', batteryLevel: 87, model: 'iPad Pro 12.9' },
    { id: 2, deviceId: 'TAB-002', deviceName: 'Table A2 Tablet', tableNumber: 'A2', status: 'Connected', lastSeen: '2026-02-10 15:29', batteryLevel: 92, model: 'iPad Pro 12.9' },
    { id: 3, deviceId: 'TAB-003', deviceName: 'Table B1 Tablet', tableNumber: 'B1', status: 'Connected', lastSeen: '2026-02-10 15:28', batteryLevel: 65, model: 'Samsung Tab S8' },
    { id: 4, deviceId: 'TAB-004', deviceName: 'Table B2 Tablet', tableNumber: 'B2', status: 'Offline', lastSeen: '2026-02-10 14:45', batteryLevel: 34, model: 'Samsung Tab S8' },
    { id: 5, deviceId: 'TAB-005', deviceName: 'Table C1 Tablet', tableNumber: 'C1', status: 'Connected', lastSeen: '2026-02-10 15:30', batteryLevel: 78, model: 'iPad Air' },
    { id: 6, deviceId: 'TAB-006', deviceName: 'Table C2 Tablet', tableNumber: 'C2', status: 'Connected', lastSeen: '2026-02-10 15:27', batteryLevel: 95, model: 'iPad Air' },
    { id: 7, deviceId: 'TAB-007', deviceName: 'Table D1 Tablet', tableNumber: 'D1', status: 'Connected', lastSeen: '2026-02-10 15:31', batteryLevel: 58, model: 'Samsung Tab S8' },
    { id: 8, deviceId: 'TAB-008', deviceName: 'Table D2 Tablet', tableNumber: 'D2', status: 'Offline', lastSeen: '2026-02-10 13:20', batteryLevel: 12, model: 'iPad Pro 12.9' },
  ];

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

      {/* Data Grid */}
      <Paper
        sx={{
          width: '100%',
          borderRadius: theme.borderRadius.small,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: 1,
          overflow: 'hidden',
        }}
      >
        <DataGrid
          rows={mockDevices}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: theme.colors.border,
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: theme.colors.primaryLight,
              borderColor: theme.colors.border,
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: theme.colors.border,
            },
          }}
        />
      </Paper>
    </Box>
  );
}
