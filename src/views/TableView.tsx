import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import TableDialog from '../components/dashboard/TableDialog';

interface Table {
  id: string;
  number: number;
  status: 'active' | 'inactive';
  progress: number;
  items: number;
  value: number;
  guestName?: string;
}

export default function TableView() {
  const { t } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // TODO: Replace with actual data from Jotai atoms and API hooks
  const tables: Table[] = [
    { id: 'T001', number: 1, status: 'active', progress: 100, items: 12, value: 290, guestName: 'Smith' },
    { id: 'T002', number: 2, status: 'active', progress: 75, items: 4, value: 180, guestName: 'Johnson' },
    { id: 'T003', number: 3, status: 'active', progress: 60, items: 6, value: 190, guestName: 'Brown' },
    { id: 'T004', number: 4, status: 'active', progress: 40, items: 3, value: 90, guestName: 'Davis' },
    { id: 'T005', number: 5, status: 'active', progress: 18, items: 6, value: 102, guestName: 'Wilson' },
    { id: 'T006', number: 6, status: 'inactive', progress: 0, items: 0, value: 0 },
    { id: 'T007', number: 7, status: 'inactive', progress: 0, items: 0, value: 0 },
    { id: 'T008', number: 8, status: 'inactive', progress: 0, items: 0, value: 0 },
  ];

  const activeTables = tables.filter(t => t.status === 'active');
  const inactiveTables = tables.filter(t => t.status === 'inactive');

  const handleTableClick = (table: Table) => {
    if (table.status === 'active') {
      setSelectedTable(table);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTable(null);
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: theme.typography.fontWeights.semibold }}>
        Table Monitor
      </Typography>

      {/* Active Tables Grid */}
      {activeTables.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
            Active Tables
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}>
            {activeTables.map((table) => (
              <Paper
                key={table.id}
                onClick={() => handleTableClick(table)}
                sx={{
                  p: 3,
                  bgcolor: theme.colors.primary,
                  color: 'white',
                  borderRadius: theme.borderRadius.medium,
                  cursor: 'pointer',
                  transition: theme.transitions.normal,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows.lg,
                    bgcolor: theme.colors.primaryHover,
                  },
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'rgba(255,255,255,0.3)', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'rgba(255,255,255,0.3)', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'rgba(255,255,255,0.3)', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                </Box>
                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: theme.typography.fontWeights.semibold }}>
                  {t('common.table')} {table.number}
                </Typography>
                {table.guestName && (
                  <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.9, mt: 1 }}>
                    {table.guestName}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'rgba(255,255,255,0.3)', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'rgba(255,255,255,0.3)', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'rgba(255,255,255,0.3)', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {/* Inactive Tables Grid */}
      {inactiveTables.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
            Available Tables
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}>
            {inactiveTables.map((table) => (
              <Paper
                key={table.id}
                sx={{
                  p: 3,
                  bgcolor: 'background.paper',
                  color: 'text.secondary',
                  borderRadius: theme.borderRadius.medium,
                  border: `1px solid ${theme.colors.border}`,
                  cursor: 'default',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'grey.300', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'grey.300', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'grey.300', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                </Box>
                <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: theme.typography.fontWeights.medium }}>
                  {t('common.table')} {table.number}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'grey.300', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'grey.300', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'grey.300', 
                    borderRadius: theme.borderRadius.small 
                  }} />
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {/* Table Dialog */}
      <TableDialog open={dialogOpen} table={selectedTable} onClose={handleDialogClose} />
    </Box>
  );
}
