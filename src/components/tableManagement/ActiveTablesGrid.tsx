import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import TableCard from './TableCard';
import type { Table } from './types';

interface ActiveTablesGridProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
}

export default function ActiveTablesGrid({ tables, onTableClick }: ActiveTablesGridProps) {
  const { t } = useTranslation();

  if (tables.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, color: theme.colors.text }}>
        {t('tableManagement.activeTables')}
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
          <TableCard 
            key={table.id} 
            table={table} 
            onClick={onTableClick}
          />
        ))}
      </Box>
    </Box>
  );
}
