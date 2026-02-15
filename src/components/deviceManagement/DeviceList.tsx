import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';

export interface Device {
  id: number;
  deviceId: string;
  deviceName: string;
  tableNumber: string;
  status: string;
  lastSeen: string;
  batteryLevel: number;
  model: string;
}

interface DeviceListProps {
  devices: Device[];
  onRowClick: (device: Device) => void;
}

export default function DeviceList({ devices, onRowClick }: DeviceListProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    return status === 'Connected' ? 'success' : 'default';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          borderRadius: theme.borderRadius.medium,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.sm,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.colors.primaryLight }}>
              <TableCell width="35%">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('deviceManagement.deviceId')}
                </Typography>
              </TableCell>
              <TableCell width="35%">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('deviceManagement.tableNumber')}
                </Typography>
              </TableCell>
              <TableCell width="30%">
                <Typography 
                  variant="subtitle2" 
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ color: theme.colors.text }}
                >
                  {t('deviceManagement.status')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => (
              <TableRow
                key={device.id}
                hover
                onClick={() => onRowClick(device)}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: theme.transitions.fast,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: theme.colors.primaryLight,
                  }
                }}
              >
                <TableCell>
                  <Typography 
                    variant="body2" 
                    fontWeight={theme.typography.fontWeights.semibold}
                    sx={{ color: theme.colors.text }}
                  >
                    {device.deviceId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ color: theme.colors.text }}
                  >
                    {device.tableNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={device.status}
                    color={getStatusColor(device.status)}
                    size="small"
                    sx={{
                      borderRadius: theme.borderRadius.large,
                      fontWeight: theme.typography.fontWeights.semibold,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
