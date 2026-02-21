import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AvailableTableCard from './AvailableTableCard';
import type { Table } from './types';

interface AvailableTablesGridProps {
  tables: Table[];
}

export default function AvailableTablesGrid({ tables }: AvailableTablesGridProps) {
  const { t } = useTranslation();

  if (tables.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
        {t('tableManagement.availableTables')}
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
        {tables.map((table) => (
          <AvailableTableCard 
            key={table.id} 
            table={table}
          />
        ))}
      </Box>
    </Box>
  );
}
