import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';
import { selectedTabletIdAtom, tabletsAtom } from '../../state/tabletStore';
import { useAtomValue, useSetAtom } from 'jotai';
import DeviceDialog from './DeviceDialog';
import { useState } from 'react';

export default function DeviceList() {
  const { t, i18n } = useTranslation();
  const tablets = useAtomValue(tabletsAtom);
  const [tabletDialogOpen, setTabletDialogOpen] = useState<boolean>(false);
  const setSelectedTablet = useSetAtom(selectedTabletIdAtom);

  const handleRowClick = (tabletId: string) => {
    setSelectedTablet(tabletId);
    setTabletDialogOpen(true);
  }

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
            {tablets.length > 0 ? (
              <>
                {tablets.map((tablet) => (
                  <TableRow
                    key={tablet.id}
                    hover
                    onClick={() => handleRowClick(tablet.id)}
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
                        {tablet.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ color: theme.colors.text }}
                      >
                        {tablet.tableNumber}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )
            :
            (
              <TableRow>
                <TableCell>
                  <Typography variant="body1" sx={{ color: theme.colors.text }}>
                    {t('deviceManagement.noDevicesConfigured', { defaultValue: 'No devices configured' })}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Device Dialog */}
      <DeviceDialog 
        isOpen={tabletDialogOpen}
        onClose={() => {
          setTabletDialogOpen(false);
        }}
      />
    </Box>
  );
}
