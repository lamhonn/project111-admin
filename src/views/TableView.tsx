import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { ActiveTablesGrid, AvailableTablesGrid, TableDialog } from '../components/tableManagement';
import type { Table } from '../components/tableManagement';
import { useGetTableMonitor, useGetTableSessionOrders, useCloseTableSession } from '../api/hooks/table.hooks';

export default function TableView() {
  const { data: tableMonitor, loading, error } = useGetTableMonitor();
  const { t } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lockedTables, setLockedTables] = useState<Set<string>>(new Set());
  const [finalizeErrorMessage, setFinalizeErrorMessage] = useState<string | null>(null);
  const { closeSession, closing: finalizing } = useCloseTableSession();
  const selectedSessionId = dialogOpen ? selectedTable?.sessionId : undefined;
  const {
    data: sessionOrders,
    loading: sessionOrdersLoading,
    error: sessionOrdersError,
    refetch: refetchSessionOrders,
  } = useGetTableSessionOrders(selectedSessionId, {
    enabled: dialogOpen,
  });

  const activeTables = tableMonitor
    .filter((table) => table.status === 'active')
    .map((table) => ({ ...table, locked: lockedTables.has(table.id) }));
  const inactiveTables = tableMonitor.filter((table) => table.status === 'inactive');

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

  const handleFinalize = async () => {
    if (!selectedTable?.sessionId) return;
    const result = await closeSession(selectedTable.sessionId);
    if (result.success) {
      handleDialogClose();
    } else {
      setFinalizeErrorMessage(result.message);
    }
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

      {loading ? (
        <Typography variant="body1" sx={{ color: theme.colors.text }}>
          Loading tables...
        </Typography>
      ) : error ? (
        <Typography variant="body1" sx={{ color: 'error.main' }}>
          Failed to load table monitor data
        </Typography>
      ) : tableMonitor.length === 0 ? (
        <Typography variant="body1" sx={{ color: theme.colors.text }}>
          No tables configured
        </Typography>
      ) : (
        <>
          {/* Active Tables Section */}
          <ActiveTablesGrid 
            tables={activeTables} 
            onTableClick={handleTableClick}
          />

          {/* Available Tables Section */}
          <AvailableTablesGrid 
            tables={inactiveTables}
          />
        </>
      )}

      {/* Table Dialog */}
      <TableDialog 
        open={dialogOpen} 
        table={selectedTable} 
        onClose={handleDialogClose}
        onDiscard={handleDiscard}
        onFinalize={handleFinalize}
        onToggleLock={handleToggleLock}
        sessionOrders={sessionOrders}
        sessionOrdersLoading={sessionOrdersLoading}
        sessionOrdersError={sessionOrdersError?.message}
        onRefreshSessionOrders={refetchSessionOrders}
        finalizing={finalizing}
        finalizeErrorMessage={finalizeErrorMessage}
        onFinalizeErrorClose={() => setFinalizeErrorMessage(null)}
      />
    </Box>
  );
}
