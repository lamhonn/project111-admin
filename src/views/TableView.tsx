import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import ActiveTablesGrid from '../components/tableManagement/ActiveTablesGrid';
import TableDialog from '../components/tableManagement/TableDialog';
import AvailableTablesGrid from '../components/tableManagement/AvailableTablesGrid';
import { errorAtom, loadingAtom, tabletsAtom } from '../state/tabletStore';
import { useAtomValue, useSetAtom } from 'jotai';
import { currentSessionsAtom, getLatestSessionsAtom } from '../state/sessionStore';
import { Tablet } from '../types/models';
import { userIdAtom } from '../state/authStore';
import { SessionWebSocket } from '../api/websocket/sessionSocket';

export default function TableView() {
  const { t } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<Tablet | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loading = useAtomValue(loadingAtom);
  const error = useAtomValue(errorAtom);

  const tables = useAtomValue(tabletsAtom);
  const sessions = useAtomValue(currentSessionsAtom);
  const getSessions = useSetAtom(getLatestSessionsAtom);

  const activeTables = tables.filter(table => sessions.some(session => session.TabletId === table.Id));
  const inactiveTables = tables.filter(table => !sessions.some(session => session.TabletId === table.Id));

  const userId = useAtomValue(userIdAtom);

  useEffect(() => {
    if (!userId) return;

    getSessions();

    return SessionWebSocket.subscribeToSessionCreated(userId, getSessions);
  }, [userId, getSessions])

  const handleTableClick = (table: Tablet) => {
    setSelectedTable(table);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTable(null);
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: theme.typography.fontWeights.semibold }}>
        {t('tableManagement.tableMonitor')}
      </Typography>

      {loading ? (
        <Typography variant="body1" sx={{ color: theme.colors.text }}>
          {t('tableDialog.loadingTables')}
        </Typography>
      ) : error ? (
        <Typography variant="body1" sx={{ color: 'error.main' }}>
          {t('tableDialog.error')}
        </Typography>
      ) : tables.length === 0 ? (
        <Typography variant="body1" sx={{ color: theme.colors.text }}>
          {t('tableDialog.noTables')}
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
        isOpen={dialogOpen} 
        table={selectedTable} 
        onClose={handleDialogClose}
      />
    </Box>
  );
}
