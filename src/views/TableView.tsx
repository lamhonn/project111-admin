import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import ActiveTablesGrid from '../components/tableManagement/ActiveTablesGrid';
import TableDialog from '../components/tableManagement/TableDialog';
import AvailableTablesGrid from '../components/tableManagement/AvailableTablesGrid';
import { errorAtom, loadingAtom, tabletsAtom } from '../state/tabletStore';
import { useAtomValue } from 'jotai';
import { currentSessionsAtom } from '../state/sessionStore';
import { TabletViewModel } from '../types/viewModels/tabletViewModel';

export default function TableView() {
  const { t } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<TabletViewModel | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loading = useAtomValue(loadingAtom);
  const error = useAtomValue(errorAtom);

  const tables = useAtomValue(tabletsAtom);
  const sessions = useAtomValue(currentSessionsAtom);

  const activeTables = tables.filter(table => sessions.some(session => session.TabletId === table.Id));
  const inactiveTables = tables.filter(table => !sessions.some(session => session.TabletId === table.Id));

  const handleTableClick = (table: TabletViewModel) => {
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
