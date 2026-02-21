import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { ActiveTablesGrid, AvailableTablesGrid, TableDialog } from '../components/tableManagement';
import type { Table } from '../components/tableManagement';

// TODO: Replace with actual data from Jotai atoms and API hooks
const MOCK_TABLES: Table[] = [
  { id: 'T001', number: 1, status: 'active', progress: 100, items: 12, value: 290, guestName: 'Smith' },
  { id: 'T002', number: 2, status: 'active', progress: 75, items: 4, value: 180, guestName: 'Johnson' },
  { id: 'T003', number: 3, status: 'active', progress: 60, items: 6, value: 190, guestName: 'Brown' },
  { id: 'T004', number: 4, status: 'active', progress: 40, items: 3, value: 90, guestName: 'Davis' },
  { id: 'T005', number: 5, status: 'active', progress: 18, items: 6, value: 102, guestName: 'Wilson' },
  { id: 'T006', number: 6, status: 'inactive', progress: 0, items: 0, value: 0 },
  { id: 'T007', number: 7, status: 'inactive', progress: 0, items: 0, value: 0 },
  { id: 'T008', number: 8, status: 'inactive', progress: 0, items: 0, value: 0 },
];

export default function TableView() {
  const { t } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lockedTables, setLockedTables] = useState<Set<string>>(new Set());

  const activeTables = MOCK_TABLES
    .filter(t => t.status === 'active')
    .map(t => ({ ...t, locked: lockedTables.has(t.id) }));
  const inactiveTables = MOCK_TABLES.filter(t => t.status === 'inactive');

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTable(null);
  };

  const handleDiscard = () => {
    // TODO: Implement discard logic
    console.log('Discarding order for table:', selectedTable?.number);
  };

  const handleFinalize = () => {
    // TODO: Implement finalize logic
    console.log('Finalizing order for table:', selectedTable?.number);
  };

  const handleToggleLock = () => {
    if (!selectedTable) return;
    setLockedTables(prev => {
      const next = new Set(prev);
      if (next.has(selectedTable.id)) {
        next.delete(selectedTable.id);
      } else {
        next.add(selectedTable.id);
      }
      return next;
    });
    setSelectedTable(prev => prev ? { ...prev, locked: !prev.locked } : null);
    handleDialogClose();
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: theme.typography.fontWeights.semibold }}>
        {t('tableManagement.tableMonitor')}
      </Typography>

      {/* Active Tables Section */}
      <ActiveTablesGrid 
        tables={activeTables} 
        onTableClick={handleTableClick}
      />

      {/* Available Tables Section */}
      <AvailableTablesGrid 
        tables={inactiveTables}
      />

      {/* Table Dialog */}
      <TableDialog 
        open={dialogOpen} 
        table={selectedTable} 
        onClose={handleDialogClose}
        onDiscard={handleDiscard}
        onFinalize={handleFinalize}
        onToggleLock={handleToggleLock}
      />
    </Box>
  );
}
