import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import type { Table } from './types';

interface AvailableTableCardProps {
  table: Table;
}

export default function AvailableTableCard({ table }: AvailableTableCardProps) {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        color: 'text.secondary',
        borderRadius: theme.borderRadius.medium,
        border: `1px solid ${theme.colors.border}`,
        cursor: 'default',
        height: 175,
        alignContent: 'center',
      }}
    >
      {/* Table Number */}
      <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: theme.typography.fontWeights.medium }}>
        {t('common.table')} {table.number}
      </Typography>
    </Paper>
  );
}
